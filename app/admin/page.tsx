"use client"

import { useState, useEffect } from "react"
import { AdminOnly } from "@/components/role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Search,
  AlertCircle,
  Mail
} from "lucide-react"
import { UserRole, getRoleDisplayName, getRoleBadgeColor } from "@/lib/roles"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"

import { User as SupabaseUser } from "@supabase/supabase-js"

interface User extends Partial<SupabaseUser> {
  id: string
  email?: string
  created_at: string
  last_sign_in_at?: string
  user_metadata: {
    full_name?: string
    role?: UserRole
    company?: string
    [key: string]: any
  }
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [stats, setStats] = useState({
    totalUsers: 0,
    clients: 0,
    staff: 0,
    admins: 0,
    newThisMonth: 0
  })

  const { user: currentUser } = useAuth()

  // Fetch users from Supabase via API route
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Get current user's session for authentication
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No valid session found. Please log in again.")
      }

      // Call the API route with authentication
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const usersWithDefaults: User[] = data.users

      setUsers(usersWithDefaults)
      setFilteredUsers(usersWithDefaults)
      
      // Calculate stats
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const totalUsers = usersWithDefaults.length
      const clients = usersWithDefaults.filter(u => u.user_metadata.role === UserRole.CLIENT).length
      const staff = usersWithDefaults.filter(u => u.user_metadata.role === UserRole.STAFF).length
      const admins = usersWithDefaults.filter(u => u.user_metadata.role === UserRole.ADMIN).length
      const newThisMonth = usersWithDefaults.filter(u => 
        new Date(u.created_at) >= thisMonth
      ).length

      setStats({ totalUsers, clients, staff, admins, newThisMonth })

    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Update user role via API route
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setError("")
      
      // Get current user's session for authentication
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No valid session found. Please log in again.")
      }

      // Call the API route to update user role
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        const updatedUsers = users.map(u => 
          u.id === userId 
            ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } }
            : u
        )
        setUsers(updatedUsers)
        applyFilters(updatedUsers, searchTerm, roleFilter)
        
        // Update stats
        const clients = updatedUsers.filter(u => u.user_metadata.role === UserRole.CLIENT).length
        const staff = updatedUsers.filter(u => u.user_metadata.role === UserRole.STAFF).length
        const admins = updatedUsers.filter(u => u.user_metadata.role === UserRole.ADMIN).length
        setStats(prev => ({ ...prev, clients, staff, admins }))
        
        // Show success message briefly
        const successMessage = `Successfully updated user role to ${newRole}`
        setError("")
        // You could add a success state here if needed
      }
      
    } catch (err: any) {
      console.error('Error updating user role:', err)
      setError(`Failed to update user role: ${err.message}`)
    }
  }

  // Apply search and role filters
  const applyFilters = (userList: User[], search: string, role: string) => {
    let filtered = userList

    if (search) {
      filtered = filtered.filter(user => 
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.user_metadata.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.user_metadata.company?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (role !== "all") {
      filtered = filtered.filter(user => user.user_metadata.role === role)
    }

    setFilteredUsers(filtered)
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters(users, value, roleFilter)
  }

  // Handle role filter
  const handleRoleFilter = (value: string) => {
    setRoleFilter(value)
    applyFilters(users, searchTerm, value)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminOnly>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, roles, and system settings</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Setup Notice */}
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>First Time Setup:</strong> If you need to make yourself an admin, visit{" "}
              <a href="/setup-admin" className="underline font-medium">/setup-admin</a>{" "}
              to upgrade your account. Delete that page after setup for security.
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.clients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.staff}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Settings className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.admins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newThisMonth}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <Mail className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <a href="/contact-messages" className="hover:underline">View</a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and roles across the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or company..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="role-filter">Filter by Role</Label>
                  <Select value={roleFilter} onValueChange={handleRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value={UserRole.CLIENT}>Clients</SelectItem>
                      <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Users Table */}
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {user.user_metadata.full_name || "No name"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.user_metadata.role || UserRole.CLIENT)}>
                              {getRoleDisplayName(user.user_metadata.role || UserRole.CLIENT)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.user_metadata.company || "N/A"}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString()
                              : "Never"
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={user.user_metadata.role || UserRole.CLIENT}
                                onValueChange={(newRole: UserRole) => updateUserRole(user.id, newRole)}
                                disabled={user.id === currentUser?.id} // Can't change own role
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                                  <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminOnly>
    </div>
  )
}