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

interface ContactMessage {
  id?: number
  name: string
  email: string
  company?: string
  phone?: string
  inquiry_type: string
  message: string
  newsletter: boolean
  status?: string
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

// GET /api/contact-messages - Fetch contact messages (staff/admin only)
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
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: messages, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch contact messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: messages
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/contact-messages - Submit new contact message (public access)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract form fields
    const messageData: Omit<ContactMessage, 'id'> = {
      name: body.name,
      email: body.email,
      company: body.company || '',
      phone: body.phone || '',
      inquiry_type: body.inquiryType,
      message: body.message,
      newsletter: body.newsletter || false,
      status: 'unread'
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'inquiry_type', 'message']
    for (const field of requiredFields) {
      if (!messageData[field as keyof typeof messageData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(messageData.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Insert contact message
    const { data: newMessage, error: insertError } = await supabaseAdmin
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to submit contact message' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: 'Message submitted successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
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

    const body = await request.json()
    const messageId = params.id

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
      .eq('id', messageId)
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

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
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

    // Delete contact message
    const { error: deleteError } = await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('id', messageId)

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

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}