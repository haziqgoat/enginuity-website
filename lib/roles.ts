// Role definitions and management utilities

export enum UserRole {
  CLIENT = 'client',
  STAFF = 'staff', 
  ADMIN = 'admin'
}

export interface UserWithRole {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    role?: UserRole
    [key: string]: any
  }
  [key: string]: any
}

// Role hierarchy levels (higher number = more permissions)
export const ROLE_LEVELS = {
  [UserRole.CLIENT]: 1,
  [UserRole.STAFF]: 2,
  [UserRole.ADMIN]: 3
} as const

// Check if user has required role or higher
export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole]
}

// Check if user has permission to access certain features
export function hasPermission(userRole: UserRole | undefined, permission: string): boolean {
  if (!userRole) return false

  const permissions = {
    [UserRole.CLIENT]: [
      'view_own_profile',
      'edit_own_profile',
      'view_projects',
      'submit_project_requests'
    ],
    [UserRole.STAFF]: [
      'view_own_profile',
      'edit_own_profile', 
      'view_projects',
      'submit_project_requests',
      'manage_projects',
      'view_client_list',
      'contact_clients'
    ],
    [UserRole.ADMIN]: [
      'view_own_profile',
      'edit_own_profile',
      'view_projects', 
      'submit_project_requests',
      'manage_projects',
      'view_client_list',
      'contact_clients',
      'manage_users',
      'access_admin_dashboard',
      'manage_roles',
      'view_analytics',
      'system_settings'
    ]
  }

  return permissions[userRole]?.includes(permission) ?? false
}

// Get user role display name
export function getRoleDisplayName(role: UserRole): string {
  const names = {
    [UserRole.CLIENT]: 'Client',
    [UserRole.STAFF]: 'Staff Member', 
    [UserRole.ADMIN]: 'Administrator'
  }
  return names[role]
}

// Get role badge color
export function getRoleBadgeColor(role: UserRole): string {
  const colors = {
    [UserRole.CLIENT]: 'bg-blue-100 text-blue-800',
    [UserRole.STAFF]: 'bg-green-100 text-green-800',
    [UserRole.ADMIN]: 'bg-red-100 text-red-800'
  }
  return colors[role]
}

// Default role for new users
export const DEFAULT_ROLE = UserRole.CLIENT