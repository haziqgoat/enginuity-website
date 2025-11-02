import { UserRole, hasRole, hasPermission } from './roles'
import { supabase } from './supabaseClient'

// Get user with role information
export async function getUserWithRole() {
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user
  
  if (!user) return null
  
  return {
    ...user,
    role: user.user_metadata?.role as UserRole || UserRole.CLIENT
  }
}

// Role-based access control functions
export async function requireRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getUserWithRole()
  if (!user) return false
  
  return hasRole(user.role, requiredRole)
}

export async function requirePermission(permission: string): Promise<boolean> {
  const user = await getUserWithRole()
  if (!user) return false
  
  return hasPermission(user.role, permission)
}

// Update user role (admin only)
export async function updateUserRole(userId: string, newRole: UserRole) {
  const currentUser = await getUserWithRole()
  
  // Only admins can update roles
  if (!currentUser || !hasRole(currentUser.role, UserRole.ADMIN)) {
    throw new Error('Insufficient permissions to update user roles')
  }

  // Get user to update
  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
  if (userError || !userData.user) {
    throw new Error('User not found')
  }

  // Update user metadata with new role
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...userData.user.user_metadata,
      role: newRole
    }
  })

  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`)
  }

  return data
}

// Get all users (admin only)
export async function getAllUsers() {
  const currentUser = await getUserWithRole()
  
  if (!currentUser || !hasPermission(currentUser.role, 'manage_users')) {
    throw new Error('Insufficient permissions to view users')
  }

  // Note: This requires service role key for admin operations
  // In production, this should be done via a server API route
  const { data, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }

  return data.users.map(user => ({
    ...user,
    role: user.user_metadata?.role as UserRole || UserRole.CLIENT
  }))
}