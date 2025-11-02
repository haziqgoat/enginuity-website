"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, Lock, ArrowRight, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { validatePassword } from "@/lib/password-validation"
import { LoadingBoundary } from "@/components/loading-boundary"

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState("")
  const { updatePassword } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we have a valid reset token
  useEffect(() => {
    const verified = searchParams.get("verified")
    const emailParam = searchParams.get("email")
    
    if (verified === "true" && emailParam) {
      setIsVerified(true)
      setEmail(emailParam)
    } else {
      // Check if we're coming from Supabase's password reset flow
      // (when user clicks the link in the email)
      const hash = window.location.hash
      if (hash.includes('type=recovery') && hash.includes('token=')) {
        // This is a valid Supabase password reset link
        setIsVerified(true)
        // Email would be available in the session, but we'll use the one from params if available
        if (emailParam) {
          setEmail(emailParam)
        }
      } else {
        // Redirect to login if not verified properly
        router.push("/login")
      }
    }
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate password strength
    const passwordValidation = validatePassword(password)
    
    if (!passwordValidation.isValid) {
      setError("Password does not meet security requirements")
      setIsLoading(false)
      return
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const result = await updatePassword(password)

      if (result.success) {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(result.error || "Failed to reset password. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    }

    setIsLoading(false)
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-orange-50/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-slate-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-orange-50/40">
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <Card className="backdrop-blur-sm bg-white/90 border border-blue-200/50 shadow-2xl shadow-blue-500/5">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full transform hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-slate-600 bg-clip-text text-transparent mb-2">
                Reset Password
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Create a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="space-y-2">
                      <div className="font-medium">Password Reset Successfully!</div>
                      <div>
                        Your password has been updated successfully. You will be redirected to the login page to sign in with your new password.
                      </div>
                      <div className="flex items-center mt-2 text-sm">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Redirecting to login page...
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                      <AlertDescription>
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      New Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-12 h-12 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                      Confirm New Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-12 h-12 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center group"
                  >
                    <ArrowRight className="mr-1 h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <LoadingBoundary>
      <ResetPasswordContent />
    </LoadingBoundary>
  )
}