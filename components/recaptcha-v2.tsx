"use client"

import { useEffect, useRef, useState } from "react"
import { useRecaptcha } from "@/lib/recaptcha"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Loader2, AlertCircle } from "lucide-react"

interface RecaptchaV2Props {
  siteKey: string
  onVerify: (token: string) => void
  onExpired?: () => void
  onError?: (error: string) => void
  theme?: 'light' | 'dark'
  size?: 'compact' | 'normal'
  className?: string
}

export function RecaptchaV2({
  siteKey,
  onVerify,
  onExpired,
  onError,
  theme = 'light',
  size = 'normal',
  className = ""
}: RecaptchaV2Props) {
  const [widgetId, setWidgetId] = useState<number | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [hasError, setHasError] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const { isLoaded, error, renderV2, reset } = useRecaptcha(siteKey, 'v2')

  useEffect(() => {
    if (isLoaded && recaptchaRef.current && !widgetId) {
      try {
        const id = renderV2(
          recaptchaRef.current.id,
          { theme, size },
          (token: string) => {
            setIsVerified(true)
            setHasError(false)
            onVerify(token)
          },
          () => {
            setIsVerified(false)
            setHasError(false)
            onExpired?.()
          }
        )
        if (id !== null) {
          setWidgetId(id)
        }
      } catch (err) {
        const errorMessage = 'Failed to render reCAPTCHA widget'
        setHasError(true)
        onError?.(errorMessage)
      }
    }
  }, [isLoaded, widgetId, renderV2, theme, size, onVerify, onExpired, onError])

  const handleReset = () => {
    if (widgetId !== null) {
      reset(widgetId)
      setIsVerified(false)
      setHasError(false)
    }
  }

  // Generate unique ID for the widget
  const recaptchaId = `recaptcha-${Math.random().toString(36).substr(2, 9)}`

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          reCAPTCHA failed to load: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (!isLoaded) {
    return (
      <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertDescription className="text-blue-800">
          Loading security verification...
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Success indicator */}
      {isVerified && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Security verification completed successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error indicator */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            reCAPTCHA verification failed. Please try again.
            <button
              onClick={handleReset}
              className="ml-2 underline hover:no-underline"
            >
              Reset
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* reCAPTCHA widget container */}
      <div className="flex justify-center">
        <div
          ref={recaptchaRef}
          id={recaptchaId}
          className="transform-gpu"
        />
      </div>

      {/* Info text */}
      <div className="text-xs text-slate-500 text-center">
        <Shield className="h-3 w-3 inline mr-1" />
        Please complete the security verification above
      </div>
    </div>
  )
}

interface RecaptchaV2BadgeProps {
  visible?: boolean
  className?: string
}

export function RecaptchaV2Badge({ visible = true, className = "" }: RecaptchaV2BadgeProps) {
  if (!visible) return null

  return (
    <div className={`text-xs text-slate-500 mt-4 flex items-center justify-center ${className}`}>
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