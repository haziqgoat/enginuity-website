# OTP Email Template Configuration Guide

This guide explains how to configure Supabase to send a custom OTP code in the password reset email.

## Steps to Configure Custom OTP Email Template

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Email Templates"
3. Select the "Reset Password" template
4. Replace the template content with the following:

```html
<h2>Password Reset</h2>

<p>Hello,</p>

<p>We received a request to reset your password. Here is your one-time verification code:</p>

<h3 style="text-align: center; font-size: 24px; letter-spacing: 8px;">{{ .Token }}</h3>

<p>Enter this code on the password reset page to create a new password.</p>

<p>If you didn't request a password reset, you can safely ignore this email.</p>

<p>Thanks,<br/>The Team</p>
```

5. Save the template

## How It Works

- When a user requests a password reset, Supabase will send an email with a 6-digit OTP code
- The {{ .Token }} variable will be automatically replaced with the generated OTP code
- The user enters this code on the verification page
- After verifying the code, the user can set a new password

## Testing

1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for the OTP code
5. Enter the code on the verification page
6. Set a new password

## Security Notes

- OTP codes expire after a short period (typically 10-15 minutes)
- Each OTP can only be used once
- If a user requests multiple codes, only the most recent one will work