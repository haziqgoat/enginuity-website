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
import { Loader2, Building2, Mail, ArrowRight, CheckCircle, Shield, RotateCw } from "lucide-react"

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(60) // 1 minute countdown
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we have an email from query params
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // If no email parameter, redirect to login
      router.push("/login")
    }
  }, [router, searchParams])

  // Handle resend timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [resendTimer])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      setIsLoading(false)
      return
    }

    try {
      // Verify the OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token: otp }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        // Redirect to reset password page
        router.push(`/reset-password?email=${encodeURIComponent(email)}&verified=true`)
      } else {
        setError(result.error || "Invalid or expired code. Please try again.")
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.")
    }

    setIsLoading(false)
  }

  const handleResendCode = async () => {
    if (!canResend) return
    
    setIsLoading(true)
    setError("")

    try {
      // Call the API to generate and send a new OTP
      const response = await fetch('/api/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        // Reset timer
        setResendTimer(60)
        setCanResend(false)
        setError("") // Clear any previous errors
      } else {
        setError(result.error || "Failed to resend verification code. Please try again.")
      }
    } catch (err) {
      setError("Failed to resend verification code. Please try again.")
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
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Enter the 6-digit code sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled
                      className="pl-10 h-12 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="otp" className="text-sm font-medium text-slate-700">
                    Verification Code
                  </Label>
                  <div className="relative group">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      disabled={isLoading}
                      maxLength={6}
                      className="pl-10 h-12 bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-slate-300 text-center text-lg tracking-widest"
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isLoading || !canResend}
                    className="w-full h-12 border-slate-300 text-slate-700 font-medium transition-all duration-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : canResend ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Resend Code
                      </>
                    ) : (
                      <>
                        Resend Code in {resendTimer}s
                      </>
                    )}
                  </Button>
                </div>
              </form>

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