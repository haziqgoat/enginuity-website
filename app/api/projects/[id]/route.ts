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

// GET /api/projects/[id] - Fetch single project (public access)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = parseInt(params.id)
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project (staff/admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const projectId = parseInt(params.id)
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const projectData: Partial<Project> = await request.json()

    // Validate features array if provided
    if (projectData.features && !Array.isArray(projectData.features)) {
      return NextResponse.json(
        { success: false, error: 'Features must be an array' },
        { status: 400 }
      )
    }

    // Update project in database
    const { data: updatedProject, error } = await supabaseAdmin
      .from('projects')
      .update({
        ...projectData,
        updated_by: authResult.user!.id
      })
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project (staff/admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const projectId = parseInt(params.id)
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Delete project from database
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}