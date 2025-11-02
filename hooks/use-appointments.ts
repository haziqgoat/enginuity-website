import { useAuth } from './use-auth'
import { useToast } from './use-toast'
import { useState, useEffect } from 'react'

export interface Appointment {
  id: number
  name: string
  email: string
  phone?: string
  appointment_date: string
  appointment_time: string
  service_type: string
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  confirmed_at?: string
  confirmed_by?: string
  created_at: string
  updated_at: string
}

export interface AppointmentInput {
  name: string
  email: string
  phone?: string
  appointmentDate: string
  appointmentTime: string
  serviceType: string
  notes?: string
}

interface UseAppointmentsReturn {
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  submitAppointment: (appointment: AppointmentInput) => Promise<boolean>
  updateAppointmentStatus: (id: number, status: string, notes?: string) => Promise<boolean>
  deleteAppointment: (id: number) => Promise<boolean>
  refreshAppointments: () => Promise<void>
  getAppointmentById: (id: number) => Promise<Appointment | null>
}

export function useAppointments(): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([])
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

  // Fetch all appointments (staff/admin only)
  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Only fetch if user is staff or admin
      const userRole = user?.user_metadata?.role
      if (!user || !userRole || !['staff', 'admin'].includes(userRole)) {
        setAppointments([])
        return
      }

      const headers = await getAuthHeaders()

      const response = await fetch('/api/appointments', {
        method: 'GET',
        headers,
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch appointments')
      }

      setAppointments(result.data || [])
    } catch (err: any) {
      console.error('Fetch appointments error:', err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Submit new appointment (public access)
  const submitAppointment = async (appointment: AppointmentInput): Promise<boolean> => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: appointment.name,
          email: appointment.email,
          phone: appointment.phone || '',
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          serviceType: appointment.serviceType,
          notes: appointment.notes || '',
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit appointment')
      }

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been booked successfully!",
      })

      return true
    } catch (err: any) {
      console.error('Submit appointment error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to submit appointment",
        variant: "destructive",
      })
      return false
    }
  }

  // Update appointment status (staff/admin only)
  const updateAppointmentStatus = async (id: number, status: string, notes?: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          status: status,
          notes: notes || undefined
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update appointment')
      }

      // Update local state
      setAppointments(prev => 
        prev.map(appt => 
          appt.id === id 
            ? { ...appt, status: status as any, notes: notes || appt.notes }
            : appt
        )
      )

      toast({
        title: "Appointment Updated",
        description: `Appointment status changed to ${status}`,
      })

      return true
    } catch (err: any) {
      console.error('Update appointment error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to update appointment",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete appointment (admin only)
  const deleteAppointment = async (id: number): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers,
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete appointment')
      }

      // Remove from local state
      setAppointments(prev => prev.filter(appt => appt.id !== id))

      toast({
        title: "Appointment Deleted",
        description: result.message || "Appointment deleted successfully",
        variant: "destructive",
      })

      return true
    } catch (err: any) {
      console.error('Delete appointment error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete appointment",
        variant: "destructive",
      })
      return false
    }
  }

  // Get specific appointment by ID
  const getAppointmentById = async (id: number): Promise<Appointment | null> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'GET',
        headers,
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch appointment')
      }

      return result.data
    } catch (err: any) {
      console.error('Get appointment error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to fetch appointment",
        variant: "destructive",
      })
      return null
    }
  }

  // Refresh appointments
  const refreshAppointments = async () => {
    await fetchAppointments()
  }

  // Load appointments on mount
  useEffect(() => {
    fetchAppointments()
  }, [user])

  return {
    appointments,
    isLoading,
    error,
    submitAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    refreshAppointments,
    getAppointmentById,
  }
}