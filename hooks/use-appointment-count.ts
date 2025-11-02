import { useAuth } from './use-auth'
import { useToast } from './use-toast'
import { useState, useEffect } from 'react'

interface UseAppointmentCountReturn {
  count: number
  isLoading: boolean
  error: string | null
  refreshCount: () => Promise<void>
}

export function useAppointmentCount(status?: string): UseAppointmentCountReturn {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

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

  // Fetch appointment count (staff/admin only)
  const fetchCount = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Only fetch if user is staff or admin
      const userRole = user?.user_metadata?.role
      if (!user || !userRole || !['staff', 'admin'].includes(userRole)) {
        setCount(0)
        setIsLoading(false)
        return
      }

      const headers = await getAuthHeaders()

      const url = status ? `/api/appointments/count?status=${status}` : '/api/appointments/count'
      console.log('Fetching appointment count from:', url)
      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', [...response.headers.entries()])

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()
      console.log('API response:', result)

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch appointment count')
      }

      setCount(result.count || 0)
    } catch (err: any) {
      console.error('Fetch appointment count error:', err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load appointment count: " + err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh count
  const refreshCount = async () => {
    await fetchCount()
  }

  // Load count on mount and when user/status changes
  useEffect(() => {
    fetchCount()
  }, [user, status])

  return {
    count,
    isLoading,
    error,
    refreshCount,
  }
}