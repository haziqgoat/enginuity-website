import { useAuth } from './use-auth'
import { useState, useEffect } from 'react'
import { useContactMessagesCount } from './use-contact-messages-count'
import { useAppointmentCount } from './use-appointment-count'

interface UseCombinedNotificationCountReturn {
  totalCount: number
  isLoading: boolean
  error: string | null
  refreshCount: () => Promise<void>
}

export function useCombinedNotificationCount(): UseCombinedNotificationCountReturn {
  const { user } = useAuth()
  const { unreadCount: contactMessagesCount, isLoading: contactLoading, error: contactError, refreshCount: refreshContactCount } = useContactMessagesCount()
  const { count: pendingAppointmentsCount, isLoading: appointmentLoading, error: appointmentError, refreshCount: refreshAppointmentCount } = useAppointmentCount('pending')
  
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate total count whenever either count changes
  useEffect(() => {
    // Only calculate if user is staff or admin
    const userRole = user?.user_metadata?.role
    if (!user || !userRole || !['staff', 'admin'].includes(userRole)) {
      setTotalCount(0)
      setIsLoading(false)
      return
    }

    console.log('Calculating combined count:', { contactMessagesCount, pendingAppointmentsCount })

    // Set loading state based on child hooks
    setIsLoading(contactLoading || appointmentLoading)
    
    // Set error if either hook has an error
    if (contactError || appointmentError) {
      const errorMessage = contactError || appointmentError
      console.error('Combined notification error:', errorMessage)
      setError(errorMessage)
    } else {
      setError(null)
    }
    
    // Calculate total count
    const total = contactMessagesCount + pendingAppointmentsCount
    console.log('Total count calculated:', total)
    setTotalCount(total)
  }, [contactMessagesCount, pendingAppointmentsCount, contactLoading, appointmentLoading, contactError, appointmentError, user])

  // Refresh both counts
  const refreshCount = async () => {
    await Promise.all([
      refreshContactCount(),
      refreshAppointmentCount()
    ])
  }

  return {
    totalCount,
    isLoading,
    error,
    refreshCount,
  }
}