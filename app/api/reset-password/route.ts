import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Regular Supabase client for user authentication
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side Supabase client with service role key for admin operations
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null

// POST /api/reset-password - Send password reset email
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase is not configured properly' },
        { status: 500 }
      )
    }

    // Send password reset email with the standard Supabase flow
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/reset-password?verified=true&email=${encodeURIComponent(email)}`,
    })

    if (error) {
      console.error('Reset password error:', error)
      return NextResponse.json(
        { error: 'Failed to send reset password email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/reset-password - Update password using server-side service role
export async function PUT(request: Request) {
  try {
    const { email, newPassword } = await request.json()

    // Validate inputs
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    // Validate password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if Supabase admin client is configured
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not configured properly. Missing environment variables:', {
        supabaseUrl: !!supabaseUrl,
        supabaseServiceRoleKey: !!supabaseServiceRoleKey
      })
      return NextResponse.json(
        { error: 'Supabase admin client is not configured properly. Please check your environment variables.' },
        { status: 500 }
      )
    }

    // First, get the user by email using the admin client
    // We need to fetch all users and filter by email since there's no direct method
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // Find the user with the matching email
    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update the password using the admin client and user ID
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    )

    if (updateError) {
      console.error('Update password error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}