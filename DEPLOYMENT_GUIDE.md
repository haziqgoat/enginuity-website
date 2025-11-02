# Deployment Guide

This guide will help you deploy your Next.js website to Vercel.

## Prerequisites

1. Create a [Vercel account](https://vercel.com/)
2. Create a [Supabase account](https://supabase.com/) and project
3. Ensure all database tables and storage buckets are set up (see SUPABASE_SETUP.md)

## Environment Variables

Before deploying, you'll need to set up the following environment variables in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key (if using)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key (if using)
```

## Deploying to Vercel

1. Push your code to a GitHub repository
2. Log in to Vercel and click "New Project"
3. Import your GitHub repository
4. In the configuration:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: `.next`
5. Add your environment variables in the "Environment Variables" section
6. Click "Deploy"

## Custom Domain (Optional)

You can use a custom domain with Vercel:
1. In your Vercel project dashboard, go to Settings > Domains
2. Add your domain
3. Follow the instructions to configure your DNS records with your domain registrar

## Post-Deployment Steps

1. Test all functionality including:
   - Authentication (sign up, login, password reset)
   - Contact forms
   - Appointment booking
   - Admin panels
2. Verify Supabase integration is working
3. Check that all API routes are functioning

## Updating Your Deployment

To update your deployed website:
1. Push changes to your GitHub repository
2. If you've set up continuous deployment, Vercel will automatically deploy the changes
3. If not, you can trigger a new deployment manually from your Vercel dashboard

## Using Render for Backend Services

If you want to use Render for backend services:
1. You can deploy specific API routes or services to Render
2. Update your frontend to point to your Render endpoints
3. Make sure to configure CORS appropriately