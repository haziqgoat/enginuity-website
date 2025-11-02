import { useAuth } from './use-auth'
import { useToast } from './use-toast'
import { usePendingApplicationsCount } from './use-pending-applications-count'
import { useState, useEffect } from 'react'

export interface JobApplication {
  id: number
  job_opening_id: number
  applicant_name: string
  applicant_email: string
  phone: string
  university: string
  degree: string
  graduation_year: string
  experience_level: string
  cover_letter?: string
  resume_url?: string
  resume_filename?: string
  application_status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected'
  applied_at: string
  reviewed_at?: string
  reviewed_by?: string
  notes?: string
  created_at: string
  updated_at: string
  job_openings?: {
    id: number
    title: string
    department: string
    location?: string
    type?: string
  }
}

export interface JobApplicationInput {
  job_opening_id: number
  applicant_name: string
  applicant_email: string
  phone: string
  university: string
  degree: string
  graduation_year: string
  experience_level: string
  cover_letter?: string
  resume: File
}

interface UseJobApplicationsReturn {
  applications: JobApplication[]
  isLoading: boolean
  error: string | null
  submitApplication: (application: JobApplicationInput) => Promise<boolean>
  updateApplicationStatus: (id: number, status: string, notes?: string) => Promise<boolean>
  deleteApplication: (id: number) => Promise<boolean>
  refreshApplications: () => Promise<void>
  getApplicationById: (id: number) => Promise<JobApplication | null>
}

export function useJobApplications(jobId?: number): UseJobApplicationsReturn {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const { refreshCount } = usePendingApplicationsCount()

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

  // Fetch all job applications (staff/admin only)
  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Only fetch if user is staff or admin
      const userRole = user?.user_metadata?.role
      if (!user || !userRole || !['staff', 'admin'].includes(userRole)) {
        setApplications([])
        return
      }

      const headers = await getAuthHeaders()
      const queryParams = new URLSearchParams()
      
      if (jobId) {
        queryParams.append('job_id', jobId.toString())
      }

      const response = await fetch(`/api/job-applications?${queryParams}`, {
        method: 'GET',
        headers,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch job applications')
      }

      setApplications(result.data || [])
    } catch (err: any) {
      console.error('Fetch applications error:', err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load job applications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Submit new job application (public access)
  const submitApplication = async (application: JobApplicationInput): Promise<boolean> => {
    try {
      const formData = new FormData()
      
      // Add all form fields
      formData.append('job_opening_id', application.job_opening_id.toString())
      formData.append('applicant_name', application.applicant_name)
      formData.append('applicant_email', application.applicant_email)
      formData.append('phone', application.phone)
      formData.append('university', application.university)
      formData.append('degree', application.degree)
      formData.append('graduation_year', application.graduation_year)
      formData.append('experience_level', application.experience_level)
      
      if (application.cover_letter) {
        formData.append('cover_letter', application.cover_letter)
      }
      
      // Add resume file
      formData.append('resume', application.resume)

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application')
      }

      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!",
      })

      return true
    } catch (err: any) {
      console.error('Submit application error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to submit application",
        variant: "destructive",
      })
      return false
    }
  }

  // Update application status (staff/admin only)
  const updateApplicationStatus = async (id: number, status: string, notes?: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          application_status: status,
          notes: notes || undefined
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update application')
      }

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === id 
            ? { ...app, application_status: status as any, notes: notes || app.notes }
            : app
        )
      )

      // Refresh the pending applications count
      await refreshCount()

      toast({
        title: "Application Updated",
        description: `Application status changed to ${status}`,
      })

      return true
    } catch (err: any) {
      console.error('Update application error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to update application",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete application (admin only)
  const deleteApplication = async (id: number): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'DELETE',
        headers,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete application')
      }

      // Remove from local state
      setApplications(prev => prev.filter(app => app.id !== id))

      // Refresh the pending applications count
      await refreshCount()

      toast({
        title: "Application Deleted",
        description: result.message || "Application deleted successfully",
        variant: "destructive",
      })

      return true
    } catch (err: any) {
      console.error('Delete application error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete application",
        variant: "destructive",
      })
      return false
    }
  }

  // Get specific application by ID
  const getApplicationById = async (id: number): Promise<JobApplication | null> => {
    try {
      const headers = await getAuthHeaders()
      
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'GET',
        headers,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch application')
      }

      return result.data
    } catch (err: any) {
      console.error('Get application error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to fetch application",
        variant: "destructive",
      })
      return null
    }
  }

  // Refresh applications
  const refreshApplications = async () => {
    await fetchApplications()
    // Also refresh the pending applications count
    await refreshCount()
  }

  // Load applications on mount and when jobId changes
  useEffect(() => {
    fetchApplications()
  }, [user, jobId])

  return {
    applications,
    isLoading,
    error,
    submitApplication,
    updateApplicationStatus,
    deleteApplication,
    refreshApplications,
    getApplicationById,
  }
}