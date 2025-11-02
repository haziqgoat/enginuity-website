import { useAuth } from './use-auth'
import { useToast } from './use-toast'
import { useState, useEffect } from 'react'

export interface ContactMessage {
  id: number
  name: string
  email: string
  company?: string
  phone?: string
  inquiry_type: string
  message: string
  newsletter: boolean
  status: 'unread' | 'read' | 'replied'
  replied_at?: string
  replied_by?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ContactMessageInput {
  name: string
  email: string
  company?: string
  phone?: string
  inquiryType: string
  message: string
  newsletter: boolean
}

interface UseContactMessagesReturn {
  messages: ContactMessage[]
  isLoading: boolean
  error: string | null
  submitMessage: (message: ContactMessageInput) => Promise<boolean>
  updateMessageStatus: (id: number, status: string, notes?: string) => Promise<boolean>
  deleteMessage: (id: number) => Promise<boolean>
  refreshMessages: () => Promise<void>
  getMessageById: (id: number) => Promise<ContactMessage | null>
}

export function useContactMessages(): UseContactMessagesReturn {
  const [messages, setMessages] = useState<ContactMessage[]>([])
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

  // Fetch all contact messages (staff/admin only)
  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Only fetch if user is staff or admin
      const userRole = user?.user_metadata?.role
      if (!user || !userRole || !['staff', 'admin'].includes(userRole)) {
        setMessages([])
        return
      }

      const headers = await getAuthHeaders()

      const response = await fetch('/api/contact-messages', {
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
        throw new Error(result.error || 'Failed to fetch contact messages')
      }

      setMessages(result.data || [])
    } catch (err: any) {
      console.error('Fetch messages error:', err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Submit new contact message (public access)
  const submitMessage = async (message: ContactMessageInput): Promise<boolean> => {
    try {
      const response = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: message.name,
          email: message.email,
          company: message.company || '',
          phone: message.phone || '',
          inquiryType: message.inquiryType,
          message: message.message,
          newsletter: message.newsletter || false,
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
        throw new Error(result.error || 'Failed to submit message')
      }

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully!",
      })

      return true
    } catch (err: any) {
      console.error('Submit message error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to submit message",
        variant: "destructive",
      })
      return false
    }
  }

  // Update message status (staff/admin only)
  const updateMessageStatus = async (id: number, status: string, notes?: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/contact-messages/${id}`, {
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
        throw new Error(result.error || 'Failed to update message')
      }

      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id 
            ? { ...msg, status: status as any, notes: notes || msg.notes }
            : msg
        )
      )

      toast({
        title: "Message Updated",
        description: `Message status changed to ${status}`,
      })

      return true
    } catch (err: any) {
      console.error('Update message error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to update message",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete message (admin only)
  const deleteMessage = async (id: number): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/contact-messages/${id}`, {
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
        throw new Error(result.error || 'Failed to delete message')
      }

      // Remove from local state
      setMessages(prev => prev.filter(msg => msg.id !== id))

      toast({
        title: "Message Deleted",
        description: result.message || "Message deleted successfully",
        variant: "destructive",
      })

      return true
    } catch (err: any) {
      console.error('Delete message error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete message",
        variant: "destructive",
      })
      return false
    }
  }

  // Get specific message by ID
  const getMessageById = async (id: number): Promise<ContactMessage | null> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/contact-messages/${id}`, {
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
        throw new Error(result.error || 'Failed to fetch message')
      }

      return result.data
    } catch (err: any) {
      console.error('Get message error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to fetch message",
        variant: "destructive",
      })
      return null
    }
  }

  // Refresh messages
  const refreshMessages = async () => {
    await fetchMessages()
  }

  // Load messages on mount
  useEffect(() => {
    fetchMessages()
  }, [user])

  return {
    messages,
    isLoading,
    error,
    submitMessage,
    updateMessageStatus,
    deleteMessage,
    refreshMessages,
    getMessageById,
  }
}