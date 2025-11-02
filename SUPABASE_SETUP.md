# 🔧 Supabase Setup for Enginuity Website

## 🎯 Role-Based Access Control System

### Overview
The website implements a 3-level role system:
- **Level 1: Client** - Basic users who can view projects and manage their profile
- **Level 2: Staff** - Staff members who can manage projects and access client information
- **Level 3: Admin** - Administrators who have full system access and user management

### Default Behavior
- New users are automatically assigned the "Client" role upon registration
- Role assignments are stored in the user's metadata
- Each role has specific permissions and access levels

### Creating an Admin User
To create your first admin user:

1. **Sign up normally through the website**
2. **Visit the admin setup page**: Go to `/setup-admin` in your browser
3. **Follow the setup instructions**:
   - Make sure you're logged in
   - Enter your email address (the one you're currently logged in with)
   - Click "Make Me Admin"
   - Refresh the page to see admin features
4. **Delete the setup page for security**: After setup, delete the `/app/setup-admin/` folder

### Alternative Method (Advanced Users)
If you have access to your Supabase Dashboard and can edit user metadata:

1. **Go to your Supabase Dashboard**
   - Navigate to Authentication > Users
   - Find your user account
   - Click "Edit user"
   - In the "Raw user meta data" section, add:
   ```json
   {
     "full_name": "Your Name",
     "role": "admin"
   }
   ```
   - Save the changes

### Admin Panel Features
- User management and role assignment
- System statistics and analytics
- Role-based access control
- User activity monitoring

### Staff Panel Features
- Project management
- Client directory access
- Calendar and scheduling
- Client communication tools

---

## 🔑 Environment Variables Setup

### Required Environment Variables

For the admin dashboard to work with real user data, you need to add your Supabase service role key to your environment variables.

1. **Create or update `.env.local` file** in your project root:

```env
# Public variables (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side only (DO NOT expose to client)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

2. **Get your Service Role Key**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **Settings** > **API**
   - Copy the **service_role** key (NOT the anon key)
   - Add it to your `.env.local` file

3. **Security Important**:
   - **NEVER** commit the service role key to version control
   - Add `.env.local` to your `.gitignore` file
   - The service role key bypasses RLS and has admin privileges
   - Only use it on the server-side (API routes)

4. **Restart your development server** after adding the environment variable:
   ```bash
   npm run dev
   ```

### Verifying Setup

After adding the service role key:
1. Make yourself an admin using `/setup-admin`
2. Go to the admin dashboard at `/admin`
3. You should see real user data instead of mock data
4. You should be able to change user roles

---

## 🖼️ Profile Picture Storage Setup

### Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Create the Profiles Bucket**
   - Navigate to **Storage** in the sidebar
   - Click **"New bucket"**
   - Set bucket name: `profiles`
   - Make it **Public** (for profile pictures)
   - Click **"Create bucket"**

## Step 2: Set Up Bucket Policies

In the **Storage** > **Policies** section, create these policies for the `profiles` bucket:

### Policy 1: Allow authenticated users to upload their own profile pictures
```sql
-- Policy Name: "Users can upload their own profile pictures"
-- Allowed operation: INSERT
-- Target roles: authenticated

(auth.uid())::text = (storage.foldername(name))[1]
```

### Policy 2: Allow authenticated users to update their own profile pictures
```sql
-- Policy Name: "Users can update their own profile pictures"  
-- Allowed operation: UPDATE
-- Target roles: authenticated

(auth.uid())::text = (storage.foldername(name))[1]
```

### Policy 3: Allow public read access to profile pictures
```sql
-- Policy Name: "Anyone can view profile pictures"
-- Allowed operation: SELECT
-- Target roles: public

true
```

### Policy 4: Allow users to delete their own profile pictures
```sql
-- Policy Name: "Users can delete their own profile pictures"
-- Allowed operation: DELETE
-- Target roles: authenticated

(auth.uid())::text = (storage.foldername(name))[1]
```

### Step 3: Environment Variables (Profile Pictures)

Make sure you have the basic environment variables set up:

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Service role key (for admin features) - see Environment Variables Setup section above
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Step 4: Test the Setup

After setting up:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test profile picture upload**:
   - Go to `/profile` page
   - Click the camera icon
   - Upload an image
   - Check if it appears and persists after refresh

## 🔍 Troubleshooting

### Common Issues:

1. **"Storage bucket not found"**
   - Make sure the bucket name is exactly `profiles`
   - Ensure the bucket is created and public

2. **"Unauthorized" errors**
   - Check that your RLS policies are correctly set up
   - Verify the user is authenticated

3. **Images not loading**
   - Verify the bucket is public
   - Check the public read policy is enabled

4. **Environment variables not working**
   - Restart your dev server after adding `.env.local`
   - Make sure variables start with `NEXT_PUBLIC_`

## 📁 File Structure

Profile pictures are stored in this structure:
```
profiles/
└── {user_id}/
    └── profile.{extension}
```

Each user can only access their own folder due to RLS policies.