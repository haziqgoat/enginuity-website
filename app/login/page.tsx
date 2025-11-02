"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, Mail, Lock, ArrowRight, Shield, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { loginRateLimit, formatTimeRemaining } from "@/lib/rate-limiting"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState<{ limited: boolean; resetTime?: number; attemptsLeft?: number } | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  const { login, resetPassword } = useAuth() // Add resetPassword back
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check rate limiting
    const clientIdentifier = email || 'unknown'
    const rateLimitCheck = loginRateLimit.isRateLimited(clientIdentifier)
    
    if (rateLimitCheck.limited) {
      const timeRemaining = rateLimitCheck.resetTime ? formatTimeRemaining(rateLimitCheck.resetTime) : 'some time'
      setError(`Too many login attempts. Try again in ${timeRemaining}.`)
      setRateLimitInfo(rateLimitCheck)
      setIsLoading(false)
      return
    }

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const result = await login(email, password)

      if (result.success) {
        // Record successful attempt
        loginRateLimit.recordSuccessfulAttempt(clientIdentifier)
        router.push("/")
      } else {
        // Record failed attempt
        const rateLimitResult = loginRateLimit.recordFailedAttempt(clientIdentifier)
        if (rateLimitResult.blocked) {
          const timeRemaining = rateLimitResult.resetTime ? formatTimeRemaining(rateLimitResult.resetTime) : 'some time'
          setError(`Too many failed attempts. Account temporarily locked for ${timeRemaining}.`)
          setRateLimitInfo({ limited: true, resetTime: rateLimitResult.resetTime })
        } else {
          setError(result.error || "Invalid email or password")
          setRateLimitInfo({ limited: false, attemptsLeft: loginRateLimit.getRemainingAttempts(clientIdentifier) })
        }
      }
    } catch (err) {
      // Record failed attempt for any other errors
      loginRateLimit.recordFailedAttempt(clientIdentifier)
      setError("An unexpected error occurred. Please try again.")
    }

    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordEmail)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      // Call the API to generate and send OTP
      const response = await fetch('/api/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        // Redirect to OTP verification page
        router.push(`/verify-otp?email=${encodeURIComponent(forgotPasswordEmail)}`)
      } else {
        setError(result.error || "Failed to send verification code. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    }

    setIsLoading(false)
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
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Sign in to your account to manage your construction projects
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Forgot Password Form */}
              {showForgotPassword ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Reset Your Password</h2>
                    <p className="text-slate-600 text-sm">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  {forgotPasswordSuccess ? (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">
                        <div className="space-y-2">
                          <div className="font-medium">Password Reset Email Sent!</div>
                          <div>
                            We've sent a password reset link to <strong>{forgotPasswordEmail}</strong>.
                            Please check your email and follow the instructions to reset your password.
                          </div>
                          <div className="text-sm text-green-700 mt-2">
                            Didn't receive the email? Check your spam folder.
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      {error && (
                        <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                          <AlertDescription>
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-3">
                        <Label htmlFor="forgot-email" className="text-sm font-medium text-slate-700">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="pl-10 h-12 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
                          />
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
                            Sending Reset Link...
                          </>
                        ) : (
                          <>
                            Send Reset Link
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      className="w-full text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setError("")
                        setForgotPasswordSuccess(false)
                        setForgotPasswordEmail("")
                      }}
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              ) : (
                // Regular Login Form
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                      <AlertDescription>
                        {error}
                        {rateLimitInfo?.attemptsLeft !== undefined && rateLimitInfo.attemptsLeft > 0 && (
                          <div className="mt-1 text-sm">
                            {rateLimitInfo.attemptsLeft} attempt{rateLimitInfo.attemptsLeft !== 1 ? 's' : ''} remaining
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Security Notice */}
                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Your login attempts are monitored for security. Use your registered email and password.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 h-12 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={isLoading || rateLimitInfo?.limited}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {!showForgotPassword && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link 
                      href="/signup" 
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                    >
                      Sign up here
                    </Link>
                  </div>

                  <div className="mt-4 text-center">
                    <Link 
                      href="/" 
                      className="text-sm text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center group"
                    >
                      <ArrowRight className="mr-1 h-3 w-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                      Back to Home
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}