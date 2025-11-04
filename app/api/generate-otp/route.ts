import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// POST /api/generate-otp - Generate and send OTP via email for password reset
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

    // Send OTP via email using Supabase's resetPasswordForEmail function
    // This will send a 6-digit OTP code to the user's email for password reset
    const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'https://enginuity-website.vercel.app'}/verify-otp?email=${encodeURIComponent(email)}`,
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