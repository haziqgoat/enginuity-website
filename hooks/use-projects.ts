import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface Project {
  id: number
  title: string
  description: string
  location: string
  category: string
  image_url?: string
  features: string[]
  client_name?: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

export interface CreateProjectData {
  title: string
  description: string
  location: string
  category: string
  image_url?: string
  features: string[]
  client_name?: string
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: number
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/projects')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch projects')
      }

      setProjects(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new project
  const createProject = async (projectData: CreateProjectData): Promise<Project> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(projectData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create project')
      }

      // Refresh projects list
      await fetchProjects()
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Update existing project
  const updateProject = async (projectData: UpdateProjectData): Promise<Project> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const { id, ...updateData } = projectData

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update project')
      }

      // Refresh projects list
      await fetchProjects()
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Delete project
  const deleteProject = async (projectId: number): Promise<void> => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError || !session?.access_token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete project')
      }

      // Refresh projects list
      await fetchProjects()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Get single project
  const getProject = async (projectId: number): Promise<Project | null> => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch project')
      }

      return result.data
    } catch (err) {
      console.error('Error fetching project:', err)
      return null
    }
  }

  // Load projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    refetch: fetchProjects
  }
}