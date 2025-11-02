"use client"

import { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { UserRole } from "@/lib/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock } from "lucide-react"

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: UserRole
  requiredPermission?: string
  fallback?: ReactNode
  showUnauthorized?: boolean
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallback,
  showUnauthorized = true 
}: RoleGuardProps) {
  const { isAuthenticated, isLoading, checkRole, checkPermission, getUserRole } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>
    
    if (showUnauthorized) {
      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be signed in to access this content.
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }
    
    return null
  }

  // Check role requirement
  if (requiredRole && !checkRole(requiredRole)) {
    if (fallback) return <>{fallback}</>
    
    if (showUnauthorized) {
      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Your current role ({getUserRole()}) does not have permission to access this content.
              Required role: {requiredRole}
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }
    
    return null
  }

  // Check permission requirement
  if (requiredPermission && !checkPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>
    
    if (showUnauthorized) {
      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Insufficient Permissions</CardTitle>
            <CardDescription>
              You don't have the required permission ({requiredPermission}) to access this content.
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }
    
    return null
  }

  // All checks passed
  return <>{children}</>
}

// Convenience components for specific roles
export function AdminOnly({ children, fallback, showUnauthorized = true }: Omit<RoleGuardProps, 'requiredRole'>) {
  return (
    <RoleGuard 
      requiredRole={UserRole.ADMIN} 
      fallback={fallback} 
      showUnauthorized={showUnauthorized}
    >
      {children}
    </RoleGuard>
  )
}

export function StaffOnly({ children, fallback, showUnauthorized = true }: Omit<RoleGuardProps, 'requiredRole'>) {
  return (
    <RoleGuard 
      requiredRole={UserRole.STAFF} 
      fallback={fallback} 
      showUnauthorized={showUnauthorized}
    >
      {children}
    </RoleGuard>
  )
}

export function AuthenticatedOnly({ children, fallback, showUnauthorized = true }: Omit<RoleGuardProps, 'requiredRole' | 'requiredPermission'>) {
  return (
    <RoleGuard 
      fallback={fallback} 
      showUnauthorized={showUnauthorized}
    >
      {children}
    </RoleGuard>
  )
}