# 📋 Job Openings Database Setup Guide

## Overview
This guide will help you set up the database-backed job openings system for your careers page. The system allows admins and staff to add, view, and delete job openings that persist across page refreshes and are shared with all users.

## 🔧 Prerequisites
- Supabase project set up (follow `SUPABASE_SETUP.md` if not done)
- Environment variables configured with service role key
- Admin user created

## 📊 Step 1: Create Database Table

1. **Open your Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to **SQL Editor** in the sidebar

2. **Run the Database Script**
   - Copy the entire content from `database/job_openings.sql`
   - Paste it into the SQL Editor
   - Click **"Run"** to execute the script

3. **Verify Table Creation**
   - Go to **Database** > **Tables** in the sidebar
   - You should see a new table called `job_openings`
   - The table should have the following columns:
     - `id` (Primary Key)
     - `title`, `department`, `location`, `type`, `experience`
     - `description` (Text)
     - `requirements` (Text Array)
     - `created_at`, `updated_at` (Timestamps)
     - `created_by`, `updated_by` (User References)

## 🔒 Step 2: Verify Row Level Security (RLS)

The SQL script automatically sets up RLS policies:

- **Public Read Access**: Anyone can view job openings (for public careers page)
- **Staff/Admin Write Access**: Only staff and admin users can create, update, or delete job openings
- **Automatic Timestamps**: Created/updated timestamps are managed automatically

## 🚀 Step 3: Test the System

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test as Admin/Staff**:
   - Login with an admin or staff account
   - Go to `/careers`
   - You should see an "Add Job" button
   - Try adding a new job opening
   - Try deleting an existing job opening
   - Refresh the page - changes should persist

3. **Test as Client/Public**:
   - Login as a client or view as unauthenticated user
   - Go to `/careers`
   - You should see job openings but no management controls
   - Changes made by admins should be visible to all users

## 🔍 Troubleshooting

### Common Issues:

1. **"Authentication required" error**:
   - Check that `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
   - Restart the development server after adding environment variables

2. **"Insufficient permissions" error**:
   - Ensure you're logged in as a staff or admin user
   - Check user role in Supabase Dashboard > Authentication > Users

3. **Database connection errors**:
   - Verify Supabase URL and keys are correct
   - Check if the `job_openings` table exists in your database

4. **RLS policy errors**:
   - Re-run the SQL script to ensure all policies are created
   - Check that user roles are stored correctly in user metadata

### Verifying Setup:

1. **Check API Endpoints**:
   - GET `/api/job-openings` - Should return job listings
   - POST `/api/job-openings` - Should work for staff/admin (requires auth)
   - DELETE `/api/job-openings/[id]` - Should work for staff/admin (requires auth)

2. **Check Database Data**:
   - Go to Supabase Dashboard > Table Editor
   - Select `job_openings` table
   - You should see initial job data inserted

## 🎯 Features

### For All Users:
- View job openings on careers page
- Apply for jobs through application form
- Real-time updates when new jobs are added

### For Staff and Admin:
- Add new job openings with comprehensive form
- Delete existing job openings with confirmation
- Refresh job listings manually
- All changes persist and are shared with all users

## 📁 Files Created/Modified

### New Files:
- `database/job_openings.sql` - Database schema and initial data
- `app/api/job-openings/route.ts` - GET and POST endpoints
- `app/api/job-openings/[id]/route.ts` - DELETE endpoint
- `hooks/use-job-openings.ts` - Frontend hook for job management

### Modified Files:
- `app/careers/page.tsx` - Updated to use database-backed system
- `components/add-job-form.tsx` - Updated types and interfaces
- `app/layout.tsx` - Added toast notifications

## 🔮 Next Steps

After setup, you can:
- Add more job management features (edit existing jobs)
- Implement job application tracking
- Add email notifications for new applications
- Export job application data for HR processing

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase setup and environment variables
3. Ensure your user has the correct role permissions
4. Check the database table structure and policies