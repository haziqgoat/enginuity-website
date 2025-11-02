import { NextRequest, NextResponse } from 'next/server'

interface RecaptchaVerifyRequest {
  token: string
  action?: string // Optional for v2, required for v3
  version?: 'v2' | 'v3' // Specify which version
}

interface RecaptchaApiResponse {
  success: boolean
  score?: number // v3 only
  action?: string // v3 only
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { token, action, version = 'v2' }: RecaptchaVerifyRequest = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA token is required' },
        { status: 400 }
      )
    }

    // Get the appropriate secret key
    let secretKey: string | undefined
    if (version === 'v3') {
      secretKey = process.env.RECAPTCHA_V3_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY
    } else {
      secretKey = process.env.RECAPTCHA_V2_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY
    }

    if (!secretKey) {
      console.error(`RECAPTCHA_${version.toUpperCase()}_SECRET_KEY not configured`)
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA not configured' },
        { status: 500 }
      )
    }

    // Get client IP for additional verification
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown'

    // Verify with Google reCAPTCHA API
    const verifyParams = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: clientIP,
    })

    const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyParams,
    })

    const verifyData: RecaptchaApiResponse = await verifyResponse.json()

    // Check if verification was successful
    if (!verifyData.success) {
      const errorCodes = verifyData['error-codes'] || []
      console.error('reCAPTCHA verification failed:', errorCodes)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'reCAPTCHA verification failed',
          details: errorCodes 
        },
        { status: 400 }
      )
    }

    // For v3, check action and score
    if (version === 'v3') {
      // Check action matches (optional but recommended)
      if (action && verifyData.action !== action) {
        console.warn('reCAPTCHA action mismatch:', {
          expected: action,
          received: verifyData.action
        })
      }

      // Check score threshold
      const scoreThreshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5')
      const score = verifyData.score || 0
      
      if (score < scoreThreshold) {
        console.warn('reCAPTCHA score too low:', {
          score,
          threshold: scoreThreshold,
          ip: clientIP
        })
        
        return NextResponse.json(
          { 
            success: false, 
            error: 'Security verification failed',
            score: score 
          },
          { status: 400 }
        )
      }
    }

    // Log successful verification (for monitoring)
    console.log(`reCAPTCHA ${version} verification successful:`, {
      score: verifyData.score,
      action: verifyData.action,
      ip: clientIP,
      timestamp: verifyData.challenge_ts
    })

    return NextResponse.json({
      success: true,
      score: verifyData.score,
      action: verifyData.action,
      version,
      message: 'Security verification passed'
    })

  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}