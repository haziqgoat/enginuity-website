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

interface Project {
  id?: number
  title: string
  description: string
  location: string
  category: string
  image_url?: string
  features: string[]
  client_name?: string
  // Removed duration, budget, team_size, status, start_date, end_date
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

// GET /api/projects - Fetch all projects (public access)
export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project (staff/admin only)
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

    const projectData: Omit<Project, 'id'> = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'category']
    for (const field of requiredFields) {
      if (!projectData[field as keyof typeof projectData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate features array
    if (!Array.isArray(projectData.features)) {
      projectData.features = []
    }

    // Insert into database
    const { data: newProject, error } = await supabaseAdmin
      .from('projects')
      .insert([{
        ...projectData,
        created_by: authResult.user!.id,
        updated_by: authResult.user!.id
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Project created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}