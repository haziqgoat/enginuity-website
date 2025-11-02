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

// GET /api/job-applications/[id] - Get specific application (staff/admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const applicationId = parseInt(params.id)
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      )
    }

    const { data: application, error } = await supabaseAdmin
      .from('job_applications')
      .select(`
        *,
        job_openings:job_opening_id (
          id,
          title,
          department,
          location,
          type
        )
      `)
      .eq('id', applicationId)
      .single()

    if (error || !application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: application
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/job-applications/[id] - Update application status (staff/admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const applicationId = parseInt(params.id)
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    const allowedFields = ['application_status', 'notes']
    const filteredData: any = {}

    // Only allow specific fields to be updated
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Add review metadata
    filteredData.reviewed_at = new Date().toISOString()
    filteredData.reviewed_by = authResult.user!.id

    // Validate status if provided
    if (filteredData.application_status) {
      const validStatuses = ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected']
      if (!validStatuses.includes(filteredData.application_status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid application status' },
          { status: 400 }
        )
      }
    }

    const { data: updatedApplication, error } = await supabaseAdmin
      .from('job_applications')
      .update(filteredData)
      .eq('id', applicationId)
      .select(`
        *,
        job_openings:job_opening_id (
          id,
          title,
          department
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update application' },
        { status: 500 }
      )
    }

    if (!updatedApplication) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: 'Application updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/job-applications/[id] - Delete application (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const authToken = authHeader?.replace('Bearer ', '')

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user has admin role
    const authResult = await verifyUserRole(authToken, ['admin'])
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 403 }
      )
    }

    const applicationId = parseInt(params.id)
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID' },
        { status: 400 }
      )
    }

    // Get application details before deletion (for cleanup)
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('job_applications')
      .select('id, applicant_name, resume_url')
      .eq('id', applicationId)
      .single()

    if (fetchError || !application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    // Delete the application
    const { error: deleteError } = await supabaseAdmin
      .from('job_applications')
      .delete()
      .eq('id', applicationId)

    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete application' },
        { status: 500 }
      )
    }

    // Optionally delete the resume file from storage
    if (application.resume_url) {
      try {
        const urlParts = application.resume_url.split('/')
        const fileName = urlParts[urlParts.length - 1].split('?')[0] // Remove query params
        await supabaseAdmin.storage
          .from('resumes')
          .remove([`applications/${fileName}`])
      } catch (storageError) {
        console.error('Resume file cleanup error:', storageError)
        // Don't fail the request if file cleanup fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application from ${application.applicant_name} deleted successfully`
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}