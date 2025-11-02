"use client"

import { useState, useEffect } from "react"
import { validatePassword, getPasswordStrengthText, getPasswordStrengthColor, getPasswordStrengthWidth, type PasswordStrength } from "@/lib/password-validation"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Info } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
  userInfo?: {
    email?: string
    name?: string
    company?: string
  }
  showRequirements?: boolean
  className?: string
}

export function PasswordStrengthIndicator({
  password,
  userInfo,
  showRequirements = true,
  className = ""
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  })

  useEffect(() => {
    if (password) {
      const result = validatePassword(password, undefined, userInfo)
      setStrength(result)
    } else {
      setStrength({ score: 0, feedback: [], isValid: false })
    }
  }, [password, userInfo])

  if (!password) return null

  const strengthText = getPasswordStrengthText(strength.score)
  const strengthColor = getPasswordStrengthColor(strength.score)
  const progressWidth = (strength.score / 4) * 100

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Password Strength:</span>
          <span className={`font-medium ${strengthColor}`}>{strengthText}</span>
        </div>
        <Progress 
          value={progressWidth} 
          className={`h-2 ${
            strength.score <= 1 ? 'bg-red-100' :
            strength.score === 2 ? 'bg-orange-100' :
            strength.score === 3 ? 'bg-yellow-100' :
            'bg-green-100'
          }`}
        />
      </div>

      {/* Requirements */}
      {showRequirements && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Password Requirements:
          </div>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <RequirementItem 
              met={password.length >= 8} 
              text="At least 8 characters" 
            />
            <RequirementItem 
              met={/[A-Z]/.test(password)} 
              text="One uppercase letter" 
            />
            <RequirementItem 
              met={/[a-z]/.test(password)} 
              text="One lowercase letter" 
            />
            <RequirementItem 
              met={/\d/.test(password)} 
              text="One number" 
            />
            <RequirementItem 
              met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)} 
              text="One special character" 
            />
          </div>
        </div>
      )}

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((feedback, index) => (
            <div key={index} className="flex items-start text-xs text-red-600">
              <XCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>{feedback}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {strength.isValid && (
        <div className="flex items-center text-xs text-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          <span>Password meets all requirements!</span>
        </div>
      )}
    </div>
  )
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center ${met ? 'text-green-600' : 'text-slate-400'}`}>
      {met ? (
        <CheckCircle className="h-3 w-3 mr-2" />
      ) : (
        <XCircle className="h-3 w-3 mr-2" />
      )}
      <span>{text}</span>
    </div>
  )
}