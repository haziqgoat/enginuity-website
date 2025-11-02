import { useAuth } from './use-auth'
import { useToast } from './use-toast'
import { useState, useEffect } from 'react'

export interface JobOpening {
  id: number
  title: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string[]
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface JobOpeningInput extends Omit<JobOpening, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'> {}

interface UseJobOpeningsReturn {
  jobOpenings: JobOpening[]
  isLoading: boolean
  error: string | null
  addJob: (job: JobOpeningInput) => Promise<boolean>
  deleteJob: (jobId: number) => Promise<boolean>
  refreshJobs: () => Promise<void>
}

export function useJobOpenings(): UseJobOpeningsReturn {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
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

  // Fetch all job openings
  const fetchJobOpenings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/job-openings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch job openings')
      }

      setJobOpenings(result.data || [])
    } catch (err: any) {
      console.error('Fetch job openings error:', err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load job openings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add new job opening
  const addJob = async (job: JobOpeningInput): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch('/api/job-openings', {
        method: 'POST',
        headers,
        body: JSON.stringify(job),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create job opening')
      }

      // Add the new job to local state
      setJobOpenings(prev => [result.data, ...prev])
      
      toast({
        title: "Job Added Successfully",
        description: `"${job.title}" has been added to the job openings.`,
      })

      return true
    } catch (err: any) {
      console.error('Add job error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to add job opening",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete job opening
  const deleteJob = async (jobId: number): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/job-openings/${jobId}`, {
        method: 'DELETE',
        headers,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete job opening')
      }

      // Remove job from local state
      const deletedJob = jobOpenings.find(job => job.id === jobId)
      setJobOpenings(prev => prev.filter(job => job.id !== jobId))
      
      toast({
        title: "Job Deleted",
        description: result.message || `Job opening deleted successfully`,
        variant: "destructive",
      })

      return true
    } catch (err: any) {
      console.error('Delete job error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete job opening",
        variant: "destructive",
      })
      return false
    }
  }

  // Refresh job openings
  const refreshJobs = async () => {
    await fetchJobOpenings()
  }

  // Load job openings on mount
  useEffect(() => {
    fetchJobOpenings()
  }, [])

  return {
    jobOpenings,
    isLoading,
    error,
    addJob,
    deleteJob,
    refreshJobs,
  }
}