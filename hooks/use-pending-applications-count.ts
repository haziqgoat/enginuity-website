import { useAuth } from './use-auth'
import { useState, useEffect } from 'react'

interface UsePendingApplicationsCountReturn {
  pendingCount: number
  isLoading: boolean
  error: string | null
  refreshCount: () => Promise<void>
}

export function usePendingApplicationsCount(): UsePendingApplicationsCountReturn {
  const [pendingCount, setPendingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Get authentication headers
  const getAuthHeaders = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabaseClient')).supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No valid session found')
      }
      
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }
    } catch (error) {
      console.error('Auth headers error:', error)
      throw error
    }
  }

  // Fetch pending applications count
  const fetchCount = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Only fetch if user is staff or admin
      const userRole = user?.user_metadata?.role
      if (!user || !userRole || !['staff', 'admin'].includes(userRole)) {
        setPendingCount(0)
        return
      }

      const headers = await getAuthHeaders()

      const response = await fetch('/api/job-applications/count', {
        method: 'GET',
        headers,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch pending applications count')
      }

      setPendingCount(result.count || 0)
    } catch (err: any) {
      console.error('Fetch count error:', err)
      setError(err.message)
      setPendingCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh count
  const refreshCount = async () => {
    await fetchCount()
  }

  // Load count on mount and when user changes
  useEffect(() => {
    fetchCount()
  }, [user])

  return {
    pendingCount,
    isLoading,
    error,
    refreshCount,
  }
}