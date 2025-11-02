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

interface Appointment {
  id?: number
  name: string
  email: string
  phone?: string
  appointment_date: string
  appointment_time: string
  service_type: string
  notes?: string
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

// GET /api/appointments - Fetch appointments (staff/admin only)
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
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: appointments, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch appointments' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointments
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Submit new appointment (public access)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract form fields
    const appointmentData: Omit<Appointment, 'id'> = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      appointment_date: body.appointmentDate,
      appointment_time: body.appointmentTime,
      service_type: body.serviceType,
      notes: body.notes || '',
      status: 'pending'
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'appointment_date', 'appointment_time', 'service_type']
    for (const field of requiredFields) {
      if (!appointmentData[field as keyof typeof appointmentData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(appointmentData.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(appointmentData.appointment_date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(appointmentData.appointment_time)) {
      return NextResponse.json(
        { success: false, error: 'Invalid time format' },
        { status: 400 }
      )
    }

    // Check if appointment date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const appointmentDate = new Date(appointmentData.appointment_date)
    if (appointmentDate < today) {
      return NextResponse.json(
        { success: false, error: 'Appointment date cannot be in the past' },
        { status: 400 }
      )
    }

    // Insert appointment
    const { data: newAppointment, error: insertError } = await supabaseAdmin
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to submit appointment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: 'Appointment submitted successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/appointments/:id - Update appointment status/note (staff/admin only)
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
    const appointmentId = params.id

    // Prepare update data
    const updateData: any = {}
    if (body.status) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.status === 'confirmed' && authResult.user) {
      updateData.confirmed_at = new Date().toISOString()
      updateData.confirmed_by = authResult.user.id
    }

    // Update appointment
    const { data: updatedAppointment, error: updateError } = await supabaseAdmin
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update appointment' },
        { status: 500 }
      )
    }

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/appointments/:id - Delete appointment (admin only)
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

    const appointmentId = params.id

    // Delete appointment
    const { error: deleteError } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', appointmentId)

    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete appointment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}