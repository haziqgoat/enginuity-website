import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabaseClient'

export interface TeamMember {
  id?: number
  name: string
  position: string
  company: string
  bio: string
  image_url?: string
  linkedin_url?: string
  email?: string
  created_at?: string
  updated_at?: string
}

export function useTeamMembers() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is admin or staff
  const canEdit = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'staff'

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/team-members')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch team members')
      }
      
      setTeamMembers(data.teamMembers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Error fetching team members:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get auth token
  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  // Create a new team member
  const createTeamMember = async (teamMember: Omit<TeamMember, 'id'>) => {
    if (!canEdit) {
      throw new Error('Unauthorized: Admin or Staff access required')
    }

    try {
      const token = await getAuthToken()
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamMember)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team member')
      }

      // Refresh the team members list
      await fetchTeamMembers()
      
      return data
    } catch (err) {
      console.error('Error creating team member:', err)
      throw err
    }
  }

  // Update a team member
  const updateTeamMember = async (id: number, teamMember: Partial<TeamMember>) => {
    if (!canEdit) {
      throw new Error('Unauthorized: Admin or Staff access required')
    }

    try {
      const token = await getAuthToken()
      const response = await fetch('/api/team-members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, ...teamMember })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update team member')
      }

      // Refresh the team members list
      await fetchTeamMembers()
      
      return data
    } catch (err) {
      console.error('Error updating team member:', err)
      throw err
    }
  }

  // Delete a team member
  const deleteTeamMember = async (id: number) => {
    if (!canEdit) {
      throw new Error('Unauthorized: Admin or Staff access required')
    }

    try {
      const token = await getAuthToken()
      const response = await fetch('/api/team-members', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete team member')
      }

      // Refresh the team members list
      await fetchTeamMembers()
      
      return data
    } catch (err) {
      console.error('Error deleting team member:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  return {
    teamMembers,
    loading,
    error,
    canEdit,
    fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
  }
}