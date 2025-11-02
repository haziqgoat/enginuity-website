# 📋 Job Applications System Setup Guide

## Overview
This guide will help you set up the complete job applications management system that allows clients to submit applications with resume uploads, and enables admins/staff to review, manage, and track all applications.

## 🔧 Prerequisites
- Job Openings system already set up (follow `JOB_OPENINGS_SETUP.md`)
- Supabase project configured with service role key
- Admin/Staff users created

## 📊 Step 1: Create Database Tables

1. **Open your Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to **SQL Editor** in the sidebar

2. **Run the Database Script**
   - Copy the entire content from `database/job_applications.sql`
   - Paste it into the SQL Editor
   - Click **"Run"** to execute the script

3. **Verify Table Creation**
   - Go to **Database** > **Tables** in the sidebar
   - You should see a new table called `job_applications`

## 💾 Step 2: Set Up File Storage

1. **Create Storage Bucket**
   - Go to **Storage** in the Supabase sidebar
   - Click **"New bucket"**
   - Bucket name: `resumes`
   - Make it **Private** (not public)
   - Click **"Create bucket"**

2. **Set Up Storage Policies**
   - Go to **Storage** > **Policies**
   - Create the following policies for the `resumes` bucket:

   **Policy 1: Allow resume uploads**
   ```sql
   -- Name: "Allow resume uploads"
   -- Operation: INSERT
   -- Target: authenticated, anon
   -- Policy: true
   ```

   **Policy 2: Staff and admin can download resumes**
   ```sql
   -- Name: "Staff and admin can download resumes"
   -- Operation: SELECT
   -- Target: authenticated
   -- Policy: 
   EXISTS (
       SELECT 1 FROM auth.users 
       WHERE auth.users.id = auth.uid() 
       AND (
           auth.users.raw_user_meta_data->>'role' = 'staff' OR 
           auth.users.raw_user_meta_data->>'role' = 'admin'
       )
   )
   ```

   **Policy 3: Applicants can download their own resumes**
   ```sql
   -- Name: "Applicants can download their own resumes"
   -- Operation: SELECT
   -- Target: authenticated
   -- Policy: 
   auth.jwt() ->> 'email' IN (
       SELECT applicant_email FROM job_applications 
       WHERE resume_url LIKE '%' || name || '%'
   )
   ```

## 🚀 Step 3: Test the System

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test Application Submission (Public)**:
   - Go to `/careers`
   - Click "Apply Now" on any job opening
   - Fill out the application form with resume upload
   - Submit the application
   - Check for success message

3. **Test Application Management (Staff/Admin)**:
   - Login as a staff or admin user
   - Navigate to **Job Applications** from the profile dropdown
   - You should see submitted applications
   - Test viewing application details
   - Test updating application status
   - Test downloading resumes

## 🎯 System Features

### 📝 **For Job Applicants:**
- **Application Form**: Comprehensive form with all required fields
- **Resume Upload**: PDF, DOC, DOCX support (max 5MB)
- **Cover Letter**: Optional cover letter field
- **Validation**: Client-side and server-side validation
- **Success Feedback**: Clear confirmation when application is submitted

### 🔍 **For Staff and Admin:**
- **Application Dashboard**: Complete overview with statistics
- **Advanced Filtering**: Filter by status, job opening, or search terms
- **Application Details**: View complete application information
- **Resume Download**: Direct download of applicant resumes
- **Status Management**: Update application status with notes
- **Real-time Updates**: Changes reflect immediately

### 📊 **Application Statuses:**
- **Pending**: Initial status when submitted
- **Reviewing**: Currently under review
- **Interviewed**: Applicant has been interviewed
- **Accepted**: Application accepted
- **Rejected**: Application rejected

## 🔐 Security Features

### 🛡️ **Database Security:**
- **Row Level Security (RLS)**: Enabled on all tables
- **Role-based Access**: Different permissions for different user roles
- **Audit Trail**: Tracks who reviewed applications and when

### 📁 **File Security:**
- **Private Storage**: Resume files are stored privately
- **Access Control**: Only authorized users can download resumes
- **File Validation**: Type and size validation on upload

### 🔒 **API Security:**
- **JWT Authentication**: All admin/staff endpoints require authentication
- **Role Verification**: Server-side role checking on every request
- **Input Validation**: Comprehensive validation on all inputs

## 📁 Files Created/Modified

### New Files:
- `database/job_applications.sql` - Database schema for applications
- `app/api/job-applications/route.ts` - GET and POST endpoints
- `app/api/job-applications/[id]/route.ts` - Individual application management
- `hooks/use-job-applications.ts` - Frontend hook for application management
- `app/applications/page.tsx` - Staff/admin application management interface

### Modified Files:
- `components/application-form.tsx` - Updated to use database backend
- `app/careers/page.tsx` - Updated to pass job ID to application form
- `components/navigation.tsx` - Added applications link for staff/admin

## 🔍 Troubleshooting

### Common Issues:

1. **File Upload Errors**:
   - Check that the `resumes` bucket exists and is private
   - Verify storage policies are set correctly
   - Ensure file is under 5MB and correct format

2. **Permission Errors**:
   - Verify user has staff or admin role
   - Check RLS policies are created correctly
   - Ensure service role key is configured

3. **Application Not Appearing**:
   - Check database table was created successfully
   - Verify foreign key relationship to job_openings table
   - Check browser console for API errors

### Database Verification:

1. **Check Applications Table**:
   ```sql
   SELECT * FROM job_applications ORDER BY applied_at DESC LIMIT 5;
   ```

2. **Check Storage Bucket**:
   - Go to Storage > resumes bucket
   - Should see uploaded resume files in `applications/` folder

## 🎉 Success Criteria

After setup, you should be able to:
- ✅ Submit job applications with resume uploads
- ✅ View all applications in the admin interface
- ✅ Filter and search applications
- ✅ Update application statuses
- ✅ Download applicant resumes
- ✅ Add internal notes to applications
- ✅ See real-time statistics

## 🔮 Future Enhancements

Consider adding:
- Email notifications to applicants when status changes
- Bulk status updates for multiple applications
- Interview scheduling system
- Application export functionality
- Integration with HR systems

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify Supabase storage and database setup
3. Ensure all environment variables are configured
4. Check user roles and permissions in Supabase Dashboard