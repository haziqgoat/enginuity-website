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

interface Event {
  id?: number
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  attendees?: string[]
  created_by?: string
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

// GET /api/events/[id] - Fetch single event
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

    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this event (admins can only view their own)
    if (event.created_by !== authResult.user!.id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: event
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Update event
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

    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    // First, fetch the existing event to check permissions
    const { data: existingEvent, error: fetchError } = await supabaseAdmin
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single()

    if (fetchError) {
      console.error('Database error:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to update this event (admins can only update their own)
    if (existingEvent.created_by !== authResult.user!.id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const eventData: Partial<Event> = await request.json()

    // Validate times if provided
    if (eventData.start_time && eventData.end_time) {
      if (new Date(eventData.end_time) <= new Date(eventData.start_time)) {
        return NextResponse.json(
          { success: false, error: 'End time must be after start time' },
          { status: 400 }
        )
      }
    } else if (eventData.start_time || eventData.end_time) {
      // If only one time is provided, we need to get the other from existing event
      const { data: currentEvent } = await supabaseAdmin
        .from('events')
        .select('start_time, end_time')
        .eq('id', eventId)
        .single()

      const startTime = eventData.start_time || currentEvent?.start_time
      const endTime = eventData.end_time || currentEvent?.end_time

      if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
        return NextResponse.json(
          { success: false, error: 'End time must be after start time' },
          { status: 400 }
        )
      }
    }

    // Validate attendees array if provided
    if (eventData.attendees && !Array.isArray(eventData.attendees)) {
      return NextResponse.json(
        { success: false, error: 'Attendees must be an array' },
        { status: 400 }
      )
    }

    // Update event in database
    const { data: updatedEvent, error } = await supabaseAdmin
      .from('events')
      .update({
        ...eventData,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Delete event
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

    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    // First, fetch the existing event to check permissions
    const { data: existingEvent, error: fetchError } = await supabaseAdmin
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single()

    if (fetchError) {
      console.error('Database error:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete this event (admins can only delete their own)
    if (existingEvent.created_by !== authResult.user!.id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Delete event from database
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}