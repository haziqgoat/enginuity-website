# 🚀 Complete Setup Guide for Admin Dashboard

## Prerequisites
- Your Enginuity website is already running
- You have access to your Supabase Dashboard
- You can create/edit environment variables

## Step-by-Step Setup

### 1. 📝 Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Supabase keys**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **Settings** > **API**
   - Copy these keys:
     - `URL` (for NEXT_PUBLIC_SUPABASE_URL)
     - `anon public` (for NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - ⚠️ **service_role** (for SUPABASE_SERVICE_ROLE_KEY)

3. **Update your `.env.local` file**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Restart your development server**:
   ```bash
   npm run dev
   ```

### 2. 👤 Create Your First Admin Account

1. **Sign up normally** (if you haven't already):
   - Go to `/signup`
   - Create your account (you'll be a "Client" by default)

2. **Upgrade to Admin**:
   - Go to `/setup-admin`
   - Enter your email address
   - Click "Make Me Admin"
   - Refresh the page

3. **Verify Admin Access**:
   - Check the navigation - you should see "Admin Dashboard"
   - Your profile should show "Administrator" badge

### 3. 🗑️ Clean Up (Security)

1. **Delete the setup page**:
   ```bash
   rm -rf app/setup-admin/
   ```
   Or manually delete the `/app/setup-admin/` folder

### 4. 🎯 Test the Admin Dashboard

1. **Access the dashboard**:
   - Go to `/admin`
   - You should see real user data (not mock data)

2. **Test user management**:
   - Create a test account (sign up with different email)
   - Go back to admin dashboard
   - Try changing the test user's role
   - Verify the role change works

## 🔧 Verification Checklist

- ✅ Environment variables are set correctly
- ✅ Service role key is configured
- ✅ Development server restarted
- ✅ You can access `/admin` as an admin
- ✅ Real user data appears in admin dashboard
- ✅ Role changes work properly
- ✅ Setup admin page is deleted

## 🚨 Troubleshooting

### "No valid session found"
- Make sure you're logged in
- Clear browser cookies and log in again

### "Unauthorized: Admin access required"
- Verify your role was set correctly via `/setup-admin`
- Check that your service role key is correct

### "Internal server error"
- Check your service role key in `.env.local`
- Verify the key is the "service_role" key, not "anon"
- Restart your development server

### Users not loading
- Check browser console for errors
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Make sure the service role key has admin privileges

## 🎉 Success!

Once everything is working:
- Your admin dashboard will show all real users
- You can assign roles (Client, Staff, Admin) to any user
- Role changes take effect immediately
- Navigation shows role-appropriate menu items

## 🔐 Security Notes

- Service role key bypasses all RLS policies
- Never expose service role key to client-side code
- Only use it in server-side API routes
- Add `.env.local` to `.gitignore`
- Delete `/setup-admin` after first setup