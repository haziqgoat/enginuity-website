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
import { Loader2, Building2, User, Mail, Building, Lock, ArrowRight, Shield, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"
import { validatePassword } from "@/lib/password-validation"
import { signupRateLimit, getClientIP } from "@/lib/rate-limiting"
import { RecaptchaV2, RecaptchaV2Badge } from "@/components/recaptcha-v2"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rateLimitInfo, setRateLimitInfo] = useState<{ limited: boolean; resetTime?: number; attemptsLeft?: number } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState<{
    show: boolean
    needsEmailConfirmation: boolean
    email: string
    isAutoLoggedIn: boolean
  }>({ show: false, needsEmailConfirmation: false, email: '', isAutoLoggedIn: false })
  const { signup } = useAuth()
  const router = useRouter()
  
  // reCAPTCHA configuration - removed test key fallback
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

  // Check if reCAPTCHA is properly configured
  if (!RECAPTCHA_SITE_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardHeader>
            <CardTitle>Configuration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">reCAPTCHA is not properly configured. Please contact the site administrator.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
    setRecaptchaError(null)
  }

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null)
    setRecaptchaError("reCAPTCHA expired. Please verify again.")
  }

  const handleRecaptchaError = (error: string) => {
    setRecaptchaToken(null)
    setRecaptchaError(error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Step 1: Check if reCAPTCHA is completed
      if (!recaptchaToken) {
        setError("Please complete the security verification")
        setIsLoading(false)
        return
      }

      // Step 2: Verify reCAPTCHA token
      try {
        const recaptchaResponse = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: recaptchaToken,
            version: 'v2'
          })
        })

        const recaptchaResult = await recaptchaResponse.json()
        
        if (!recaptchaResult.success) {
          console.error('reCAPTCHA verification failed:', recaptchaResult)
          setError("Security verification failed. Please try again.")
          setRecaptchaToken(null) // Reset CAPTCHA
          setIsLoading(false)
          return
        }

        console.log('reCAPTCHA verified successfully')
      } catch (verifyError) {
        console.error('reCAPTCHA verification error:', verifyError)
        setError("Security verification unavailable. Please try again.")
        setIsLoading(false)
        return
      }

      // Step 3: Check rate limiting
      const clientIdentifier = formData.email || 'unknown'
      const rateLimitCheck = signupRateLimit.isRateLimited(clientIdentifier)
      
      if (rateLimitCheck.limited) {
        setError(`Too many signup attempts. Try again later.`)
        setRateLimitInfo(rateLimitCheck)
        setIsLoading(false)
        return
      }

      // Step 4: Validate password strength
      const passwordValidation = validatePassword(formData.password, undefined, {
        email: formData.email,
        name: formData.name,
        company: formData.company
      })

      if (!passwordValidation.isValid) {
        setError("Password does not meet security requirements")
        setIsLoading(false)
        return
      }

      // Step 5: Check password confirmation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      // Step 6: Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        setIsLoading(false)
        return
      }

      // Step 7: Validate name
      const nameRegex = /^[a-zA-Z\s\-']+$/
      if (!nameRegex.test(formData.name)) {
        setError("Name should only contain letters, spaces, hyphens, and apostrophes")
        setIsLoading(false)
        return
      }

      // Step 8: Attempt signup
      const result = await signup(formData.email, formData.password, formData.name, formData.company)

      if (result.success) {
        // Record successful attempt
        signupRateLimit.recordSuccessfulAttempt(clientIdentifier)
        
        // Show success message based on signup result
        if (result.needsEmailConfirmation) {
          // Email confirmation required
          setSignupSuccess({
            show: true,
            needsEmailConfirmation: true,
            email: formData.email,
            isAutoLoggedIn: false
          })
        } else {
          // User is automatically logged in
          setSignupSuccess({
            show: true,
            needsEmailConfirmation: false,
            email: formData.email,
            isAutoLoggedIn: true
          })
          
          // Redirect after showing success message
          setTimeout(() => {
            router.push("/")
          }, 3000) // 3 second delay to show success message
        }
      } else {
        // Record failed attempt
        const rateLimitResult = signupRateLimit.recordFailedAttempt(clientIdentifier)
        if (rateLimitResult.blocked) {
          setError("Too many failed attempts. Account temporarily locked.")
          setRateLimitInfo({ limited: true, resetTime: rateLimitResult.resetTime })
        } else {
          setError(result.error || "Signup failed")
          setRateLimitInfo({ limited: false, attemptsLeft: signupRateLimit.getRemainingAttempts(clientIdentifier) })
        }
        // Reset CAPTCHA on failure
        setRecaptchaToken(null)
      }
    } catch (err) {
      console.error('Signup error:', err)
      // Record failed attempt for any other errors
      const clientIdentifier = formData.email || 'unknown'
      signupRateLimit.recordFailedAttempt(clientIdentifier)
      setError("An unexpected error occurred. Please try again.")
      setRecaptchaToken(null) // Reset CAPTCHA
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40">
      <div className="flex items-center justify-center p-4 pt-20 pb-20">
        <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <Card className="backdrop-blur-sm bg-white/90 border border-orange-200/50 shadow-2xl shadow-orange-500/5">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full transform hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-orange-700 to-slate-600 bg-clip-text text-transparent mb-2">
                Join Us
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Create your account to start managing construction projects efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Success Message */}
              {signupSuccess.show && (
                <div className="mb-6">
                  {signupSuccess.needsEmailConfirmation ? (
                    <Alert className="border-blue-200 bg-blue-50">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <div className="space-y-2">
                          <div className="font-medium">Account Created Successfully!</div>
                          <div>
                            We've sent a verification email to <strong>{signupSuccess.email}</strong>.
                            Please check your email and click the verification link to activate your account.
                          </div>
                          <div className="text-sm text-blue-700 mt-2">
                            Don't see the email? Check your spam folder or{" "}
                            <button 
                              onClick={() => {
                                // Reset form for resend
                                setSignupSuccess({ show: false, needsEmailConfirmation: false, email: '', isAutoLoggedIn: false })
                                setRecaptchaToken(null)
                              }}
                              className="underline hover:no-underline font-medium"
                            >
                              try signing up again
                            </button>.
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <div className="space-y-2">
                          <div className="font-medium">Welcome to HNZ Consult!</div>
                          <div>
                            Your account has been created successfully and you're now logged in.
                            Redirecting you to the dashboard...
                          </div>
                          <div className="flex items-center mt-2 text-sm">
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Taking you to the homepage in a few seconds
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5" style={{ display: signupSuccess.show ? 'none' : 'block' }}>
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertDescription>
                      {error}
                      {rateLimitInfo?.attemptsLeft !== undefined && (
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
                    Your account security is important to us. Please complete the verification below and use a strong, unique password.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Full Name *
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pl-10 h-11 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address *
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pl-10 h-11 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                    Company Name
                  </Label>
                  <div className="relative group">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Enter your company name (optional)"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-10 h-11 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password *
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="pl-10 pr-12 h-11 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 hover:border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <PasswordStrengthIndicator 
                    password={formData.password}
                    userInfo={{
                      email: formData.email,
                      name: formData.name,
                      company: formData.company
                    }}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password *
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className={`pl-10 h-11 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 hover:border-slate-300 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-300 focus:border-red-400'
                          : ''
                      }`}
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span>Passwords do not match</span>
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <span>Passwords match ✓</span>
                    </p>
                  )}
                </div>

                {/* reCAPTCHA v2 Widget */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Security Verification *
                  </Label>
                  <RecaptchaV2
                    siteKey={RECAPTCHA_SITE_KEY}
                    onVerify={handleRecaptchaVerify}
                    onExpired={handleRecaptchaExpired}
                    onError={handleRecaptchaError}
                    theme="light"
                    size="normal"
                  />
                  {recaptchaError && (
                    <p className="text-sm text-red-600 mt-1">
                      {recaptchaError}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={isLoading || !recaptchaToken || signupSuccess.show}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* reCAPTCHA Badge */}
              <RecaptchaV2Badge />

              {/* Footer Links - Hidden when success is shown */}
              <div className="mt-8 pt-6 border-t border-slate-200" style={{ display: signupSuccess.show ? 'none' : 'block' }}>
                <div className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
                  >
                    Sign in here
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
              
              {/* Success Action Buttons */}
              {signupSuccess.show && signupSuccess.needsEmailConfirmation && (
                <div className="mt-6 pt-6 border-t border-slate-200 text-center space-y-3">
                  <Button
                    onClick={() => router.push('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Login Page
                  </Button>
                  <div className="text-sm text-slate-500">
                    After verifying your email, you can log in with your credentials.
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