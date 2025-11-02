import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// POST /api/generate-otp - Generate and send OTP via email
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

    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      // For security, we don't reveal if the email exists or not
      // But we still return success to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    // Send OTP via email using Supabase's signInWithOtp function
    // This will send a 6-digit code to the user's email
    const { error: emailError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/verify-otp?email=${encodeURIComponent(email)}`,
      }
    })

    if (emailError) {
      console.error('Error sending OTP email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Generate OTP API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}