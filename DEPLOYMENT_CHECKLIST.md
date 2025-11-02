# Deployment Checklist

## Pre-deployment

- [ ] Ensure all environment variables are set up in Vercel
- [ ] Verify Supabase database and storage are properly configured
- [ ] Test the application locally with `npm run build` and `npm run start`
- [ ] Ensure all API routes are working correctly
- [ ] Check that authentication flows work (sign up, login, password reset)
- [ ] Verify admin functionality if applicable

## Vercel Deployment

- [ ] Push latest code to GitHub
- [ ] Connect GitHub repository to Vercel
- [ ] Configure project settings (build command, output directory)
- [ ] Add all required environment variables
- [ ] Trigger deployment
- [ ] Monitor deployment logs for errors

## Post-deployment Testing

- [ ] Test all pages load correctly
- [ ] Verify authentication works on deployed site
- [ ] Test all forms (contact, appointment, etc.)
- [ ] Check admin panels if applicable
- [ ] Verify Supabase integration (database reads/writes)
- [ ] Test any third-party integrations (reCAPTCHA, etc.)

## Custom Domain (Optional)

- [ ] Purchase domain (if needed)
- [ ] Add domain to Vercel project
- [ ] Configure DNS records as instructed by Vercel
- [ ] Verify SSL certificate is issued
- [ ] Test custom domain access

## Monitoring and Maintenance

- [ ] Set up error monitoring (Vercel provides some built-in monitoring)
- [ ] Configure analytics if needed
- [ ] Set up backup strategy for Supabase data
- [ ] Plan for regular updates of dependencies

## Making Future Changes

1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Vercel will automatically deploy (if continuous deployment is enabled)
5. Or manually trigger a deployment from the Vercel dashboard