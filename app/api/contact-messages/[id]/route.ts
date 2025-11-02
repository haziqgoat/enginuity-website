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

// PATCH /api/contact-messages/:id - Update contact message status/note (staff/admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Parse JSON body
    let body;
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const messageId = params.id

    // Validate message ID
    if (!messageId || isNaN(Number(messageId))) {
      return NextResponse.json(
        { success: false, error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (body.status) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.status === 'replied' && authResult.user) {
      updateData.replied_at = new Date().toISOString()
      updateData.replied_by = authResult.user.id
    }

    // Update contact message
    const { data: updatedMessage, error: updateError } = await supabaseAdmin
      .from('contact_messages')
      .update(updateData)
      .eq('id', Number(messageId))
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update contact message' },
        { status: 500 }
      )
    }

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedMessage,
      message: 'Message updated successfully'
    })

  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/contact-messages/:id - Delete contact message (admin only)
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

    // Verify user has admin role
    const authResult = await verifyUserRole(authToken, ['admin'])
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 403 }
      )
    }

    const messageId = params.id

    // Validate message ID
    if (!messageId || isNaN(Number(messageId))) {
      return NextResponse.json(
        { success: false, error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    // Delete contact message
    const { error: deleteError } = await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('id', Number(messageId))

    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete contact message' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })

  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/contact-messages/:id - Get specific contact message (staff/admin only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const messageId = params.id

    // Validate message ID
    if (!messageId || isNaN(Number(messageId))) {
      return NextResponse.json(
        { success: false, error: 'Invalid message ID' },
        { status: 400 }
      )
    }

    // Get contact message
    const { data: message, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .eq('id', Number(messageId))
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch contact message' },
        { status: 500 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: message
    })

  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}