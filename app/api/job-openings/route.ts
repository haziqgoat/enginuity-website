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

interface JobOpening {
  id?: number
  title: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string[]
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

// GET /api/job-openings - Fetch all job openings (public access)
export async function GET() {
  try {
    const { data: jobOpenings, error } = await supabaseAdmin
      .from('job_openings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch job openings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: jobOpenings
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/job-openings - Create new job opening (staff/admin only)
export async function POST(request: NextRequest) {
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

    const jobData: Omit<JobOpening, 'id'> = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'department', 'experience', 'description']
    for (const field of requiredFields) {
      if (!jobData[field as keyof typeof jobData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate requirements array
    if (!Array.isArray(jobData.requirements) || jobData.requirements.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one requirement is needed' },
        { status: 400 }
      )
    }

    // Insert into database
    const { data: newJob, error } = await supabaseAdmin
      .from('job_openings')
      .insert([{
        ...jobData,
        created_by: authResult.user!.id,
        updated_by: authResult.user!.id
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create job opening' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newJob,
      message: 'Job opening created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}