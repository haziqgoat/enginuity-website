"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface AuthRequiredProps {
  children: React.ReactNode
}

export function AuthRequired({ children }: AuthRequiredProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is authenticated, show the content
  if (isAuthenticated) {
    return <>{children}</>
  }

  // If user is not authenticated, show the login prompt
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            🔒 You need to log in to access the Careers and Cost Planner pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Go to Login
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}