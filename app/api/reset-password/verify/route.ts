import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// POST /api/reset-password/verify - Verify OTP
export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    // Validate inputs
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      )
    }

    // Verify OTP
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    })

    if (verifyError) {
      console.error('Verify OTP error:', verifyError)
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify OTP API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}