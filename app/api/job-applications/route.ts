import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Regular Supabase client for user authentication
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface JobApplication {
  id?: number
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
  application_status?: string
}

// Verify user authentication and role
async function verifyUserRole(authToken: string, requiredRoles: string[] = ['staff', 'admin']) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(authToken)
    
    if (error || !user) {
      return { success: false, error: 'Invalid authentication token' }
    }

    const userRole = user.user_metadata?.role
    if (!userRole || !requiredRoles.includes(userRole)) {
      return { success: false, error: 'Insufficient permissions' }
    }

    return { success: true, user, role: userRole }
  } catch (error) {
    return { success: false, error: 'Authentication verification failed' }
  }
}

// Upload resume file to Supabase Storage
async function uploadResume(file: File, applicationId: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${applicationId}-${Date.now()}.${fileExt}`
    const filePath = `applications/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { success: false, error: error.message }
    }

    // Get the signed URL that expires in 1 year (for internal use)
    const { data: urlData } = await supabaseAdmin.storage
      .from('resumes')
      .createSignedUrl(filePath, 31536000) // 1 year

    return { 
      success: true, 
      url: urlData?.signedUrl || data.path 
    }
  } catch (error: any) {
    console.error('Resume upload error:', error)
    return { success: false, error: error.message }
  }
}

// GET /api/job-applications - Fetch job applications (staff/admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const authToken = authHeader?.replace('Bearer ', '')

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user has required role
    const authResult = await verifyUserRole(authToken)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('job_id')
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('job_applications')
      .select(`
        *,
        job_openings:job_opening_id (
          id,
          title,
          department
        )
      `)
      .order('applied_at', { ascending: false })

    if (jobId) {
      query = query.eq('job_opening_id', jobId)
    }

    if (status) {
      query = query.eq('application_status', status)
    }

    const { data: applications, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch job applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: applications
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/job-applications - Submit new job application (public access)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const applicationData: Omit<JobApplication, 'id'> = {
      job_opening_id: parseInt(formData.get('job_opening_id') as string),
      applicant_name: formData.get('applicant_name') as string,
      applicant_email: formData.get('applicant_email') as string,
      phone: formData.get('phone') as string,
      university: formData.get('university') as string,
      degree: formData.get('degree') as string,
      graduation_year: formData.get('graduation_year') as string,
      experience_level: formData.get('experience_level') as string,
      cover_letter: formData.get('cover_letter') as string || '',
    }

    const resumeFile = formData.get('resume') as File

    // Validate required fields
    const requiredFields = ['job_opening_id', 'applicant_name', 'applicant_email', 'phone', 'university', 'degree', 'graduation_year', 'experience_level']
    for (const field of requiredFields) {
      if (!applicationData[field as keyof typeof applicationData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Resume file is required' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { success: false, error: 'Only PDF, DOC, and DOCX files are allowed' },
        { status: 400 }
      )
    }

    if (resumeFile.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json(
        { success: false, error: 'Resume file must be smaller than 5MB' },
        { status: 400 }
      )
    }

    // Check if job opening exists
    const { data: jobOpening, error: jobError } = await supabaseAdmin
      .from('job_openings')
      .select('id, title')
      .eq('id', applicationData.job_opening_id)
      .single()

    if (jobError || !jobOpening) {
      return NextResponse.json(
        { success: false, error: 'Job opening not found' },
        { status: 404 }
      )
    }

    // Insert application first to get ID
    const { data: newApplication, error: insertError } = await supabaseAdmin
      .from('job_applications')
      .insert([{
        ...applicationData,
        resume_filename: resumeFile.name,
        application_status: 'pending'
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create job application' },
        { status: 500 }
      )
    }

    // Upload resume file
    const uploadResult = await uploadResume(resumeFile, newApplication.id.toString())
    
    if (!uploadResult.success) {
      // Delete the application if file upload fails
      await supabaseAdmin
        .from('job_applications')
        .delete()
        .eq('id', newApplication.id)
      
      return NextResponse.json(
        { success: false, error: `Resume upload failed: ${uploadResult.error}` },
        { status: 500 }
      )
    }

    // Update application with resume URL
    const { error: updateError } = await supabaseAdmin
      .from('job_applications')
      .update({ resume_url: uploadResult.url })
      .eq('id', newApplication.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update application with resume URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { ...newApplication, resume_url: uploadResult.url },
      message: 'Application submitted successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}