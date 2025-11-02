"use client"

import { useRecaptcha } from "@/lib/recaptcha"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Loader2 } from "lucide-react"

interface RecaptchaProviderProps {
  children: React.ReactNode
  siteKey: string
  onReady?: () => void
  showStatus?: boolean
}

export function RecaptchaProvider({ 
  children, 
  siteKey, 
  onReady, 
  showStatus = false 
}: RecaptchaProviderProps) {
  const { isLoaded, error } = useRecaptcha(siteKey)

  // Notify parent when ready
  if (isLoaded && onReady) {
    onReady()
  }

  return (
    <>
      {showStatus && (
        <div className="mb-4">
          {!isLoaded && !error && (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">
                Loading security verification...
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Security system unavailable: {error}
              </AlertDescription>
            </Alert>
          )}
          
          {isLoaded && (
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Security verification ready
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {children}
    </>
  )
}

interface RecaptchaBadgeProps {
  visible?: boolean
}

export function RecaptchaBadge({ visible = true }: RecaptchaBadgeProps) {
  if (!visible) return null

  return (
    <div className="text-xs text-slate-500 mt-4 flex items-center justify-center">
      <Shield className="h-3 w-3 mr-1" />
      <span>
        This site is protected by reCAPTCHA and the Google{" "}
        <a 
          href="https://policies.google.com/privacy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a 
          href="https://policies.google.com/terms" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Terms of Service
        </a>{" "}
        apply.
      </span>
    </div>
  )
}