"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw, 
  FileText,
  Calendar,
  User,
  Building,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Trash2,
  Shield,
  Settings,
  Ban,
  CheckCircle,
  Clock,
  Users,
  XCircle
} from "lucide-react"
import { UserRole } from "@/lib/roles"
import { useJobApplications, JobApplication } from "@/hooks/use-job-applications"
import { useJobOpenings } from "@/hooks/use-job-openings"
import { useAuth } from "@/hooks/use-auth"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800", 
  interviewed: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock },
  { value: "reviewing", label: "Reviewing", icon: Eye },
  { value: "interviewed", label: "Interviewed", icon: Users },
  { value: "accepted", label: "Accepted", icon: CheckCircle },
  { value: "rejected", label: "Rejected", icon: XCircle }
]

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [statusUpdate, setStatusUpdate] = useState("")
  const [notes, setNotes] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null)
  
  const { applications, isLoading, updateApplicationStatus, deleteApplication, refreshApplications } = useJobApplications()
  const { jobOpenings } = useJobOpenings()
  const { isAdmin, isStaff } = useAuth()

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_openings?.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || statusFilter === "all" || app.application_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async () => {
    if (!selectedApplication || !statusUpdate) return
    
    const success = await updateApplicationStatus(selectedApplication.id, statusUpdate, notes)
    if (success) {
      setSelectedApplication(null)
      setStatusUpdate("")
      setNotes("")
      await refreshApplications()
    }
  }

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application)
    setStatusUpdate(application.application_status)
    setNotes(application.notes || "")
  }

  const handleDeleteClick = (application: JobApplication) => {
    setApplicationToDelete(application)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return
    
    const success = await deleteApplication(applicationToDelete.id)
    if (success) {
      setDeleteDialogOpen(false)
      setApplicationToDelete(null)
      await refreshApplications()
    }
  }

  const downloadResume = (resumeUrl: string, filename: string) => {
    // Create a temporary link to download the resume
    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.application_status === 'pending').length,
    reviewing: applications.filter(app => app.application_status === 'reviewing').length,
    accepted: applications.filter(app => app.application_status === 'accepted').length
  }

  return (
    <RoleGuard requiredRole={UserRole.STAFF}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Job Applications</h1>
                <p className="text-muted-foreground mt-2">
                  Review and manage job applications from candidates
                </p>
              </div>
              {isAdmin() && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Admin Mode</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards - Improved Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Under Review</p>
                    <p className="text-2xl font-bold text-foreground">{stats.reviewing}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                    <p className="text-2xl font-bold text-foreground">{stats.accepted}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions - Better Organization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Filters Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, or job title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value} className="flex items-center">
                            <option.icon className="h-4 w-4 inline mr-2" />
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={refreshApplications} 
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Applications ({filteredApplications.length})</CardTitle>
                {isAdmin() && (
                  <div className="text-sm text-red-600 flex items-center gap-2">
                    <Ban className="h-4 w-4" />
                    Admins can delete applications
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">No applications found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{application.applicant_name}</p>
                              <p className="text-sm text-muted-foreground">{application.applicant_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{application.job_openings?.title}</p>
                              <p className="text-sm text-muted-foreground">{application.job_openings?.department}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[application.application_status]}>
                              {application.application_status.charAt(0).toUpperCase() + application.application_status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{formatDate(application.applied_at)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewApplication(application)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Application Details</DialogTitle>
                                    <DialogDescription>
                                      Review and update the application status
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedApplication && (
                                    <div className="space-y-6">
                                      {/* Application Info */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Applicant Name</Label>
                                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.applicant_name}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Email</Label>
                                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.applicant_email}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Phone</Label>
                                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.phone}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Position</Label>
                                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.job_openings?.title}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">University</Label>
                                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.university}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Degree</Label>
                                          <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedApplication.degree} ({selectedApplication.graduation_year})</span>
                                          </div>
                                        </div>
                                        
                                        {isAdmin() && (
                                          <div className="space-y-2 md:col-span-2">
                                            <Label className="text-sm font-medium">Admin Notes</Label>
                                            <div className="p-3 bg-red-50 rounded-md border border-red-100">
                                              <p className="text-sm text-red-800">
                                                This section is only visible to admins
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Cover Letter */}
                                      {selectedApplication.cover_letter && (
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Cover Letter</Label>
                                          <div className="p-4 bg-muted rounded-md border">
                                            <p className="text-sm whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Resume */}
                                      {selectedApplication.resume_url && (
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Resume</Label>
                                          <Button
                                            variant="outline"
                                            onClick={() => downloadResume(selectedApplication.resume_url!, selectedApplication.resume_filename || 'resume.pdf')}
                                            className="flex items-center gap-2"
                                          >
                                            <Download className="h-4 w-4" />
                                            Download Resume
                                          </Button>
                                        </div>
                                      )}
                                      
                                      {/* Status Update */}
                                      <div className="space-y-4 border-t pt-4">
                                        <Label className="text-sm font-medium">Update Status</Label>
                                        <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {statusOptions.map(option => (
                                              <SelectItem key={option.value} value={option.value} className="flex items-center">
                                                <option.icon className="h-4 w-4 inline mr-2" />
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="notes">Internal Notes</Label>
                                          <Textarea
                                            id="notes"
                                            placeholder="Add notes about this application..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                          />
                                        </div>
                                        
                                        <Button onClick={handleStatusUpdate} className="w-full">
                                          Update Application
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              {application.resume_url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadResume(application.resume_url!, application.resume_filename || 'resume.pdf')}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {/* Delete button - Admin only */}
                              {isAdmin() && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteClick(application)}
                                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
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
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the application from{" "}
                <strong>{applicationToDelete?.applicant_name}</strong>? This action cannot be undone.
                The applicant's resume file will also be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Application
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Footer />
      </div>
    </RoleGuard>
  )
}