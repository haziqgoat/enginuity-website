import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface Event {
  id: number
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  attendees?: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateEventData {
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  attendees?: string[]
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch events')
      }

      setEvents(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new event
  const createEvent = async (eventData: CreateEventData): Promise<Event> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(eventData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create event')
      }

      // Refresh events list
      await fetchEvents()
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Update existing event
  const updateEvent = async (eventData: UpdateEventData): Promise<Event> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const { id, ...updateData } = eventData

      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update event')
      }

      // Refresh events list
      await fetchEvents()
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Delete event
  const deleteEvent = async (eventId: number): Promise<void> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete event')
      }

      // Refresh events list
      await fetchEvents()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Get single event
  const getEvent = async (eventId: number): Promise<Event | null> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch event')
      }

      return result.data
    } catch (err) {
      console.error('Error fetching event:', err)
      return null
    }
  }

  // Load events on mount
  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    refetch: fetchEvents
  }
}