"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export function LoadingBoundary({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simple timeout to ensure any client-side logic runs
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-orange-50/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}