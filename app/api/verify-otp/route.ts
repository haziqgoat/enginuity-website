import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// POST /api/verify-otp - Verify OTP code
export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    // Validate inputs
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and OTP code are required' },
        { status: 400 }
      )
    }

    // Verify OTP using Supabase's verifyOtp function
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email' // For email OTP verification
    })

    if (verifyError) {
      console.error('Verify OTP error:', verifyError)
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // OTP verified successfully
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify OTP API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}