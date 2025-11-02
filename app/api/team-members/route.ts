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

interface TeamMember {
  id?: number
  name: string
  position: string
  company: string
  bio: string
  image_url?: string
  linkedin_url?: string
  email?: string
}

// GET /api/team-members - List all team members
export async function GET() {
  try {
    const { data: teamMembers, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching team members:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ teamMembers })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/team-members - Create a new team member
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

    const teamMemberData: Omit<TeamMember, 'id'> = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'position', 'company', 'bio']
    for (const field of requiredFields) {
      if (!teamMemberData[field as keyof typeof teamMemberData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Insert into database
    const { data: newTeamMember, error } = await supabaseAdmin
      .from('team_members')
      .insert([{
        ...teamMemberData,
        created_by: authResult.user!.id,
        updated_by: authResult.user!.id
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create team member' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newTeamMember,
      message: 'Team member created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/team-members/[id] - Update a team member
export async function PUT(request: NextRequest) {
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

    const { id, ...teamMemberData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
        { status: 400 }
      )
    }

    // Update team member
    const { data: updatedTeamMember, error } = await supabaseAdmin
      .from('team_members')
      .update({
        ...teamMemberData,
        updated_by: authResult.user!.id,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update team member' },
        { status: 500 }
      )
    }

    if (!updatedTeamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedTeamMember,
      message: 'Team member updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/team-members/[id] - Delete a team member
export async function DELETE(request: NextRequest) {
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

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
        { status: 400 }
      )
    }

    // Delete team member
    const { error } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete team member' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}