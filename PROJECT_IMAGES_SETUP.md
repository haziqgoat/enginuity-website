# Project Images Storage Setup Guide

## 📁 Storage Bucket Setup

### Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Create the Project Images Bucket**
   - Navigate to **Storage** in the sidebar
   - Click **"New bucket"**
   - Set bucket name: `project-images`
   - Make it **Public** (for displaying project images)
   - Click **"Create bucket"**

### Step 2: Set Up Bucket Policies

You can create these policies either through the **Storage** > **Policies** section in the Supabase Dashboard, or by running the SQL commands below in the **SQL Editor**:

#### Option A: SQL Commands (Recommended - Faster)

Run these SQL commands in your Supabase **SQL Editor**:

```sql
-- First, ensure the bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow staff and admin to upload project images
CREATE POLICY "Staff and admin can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.raw_user_meta_data->>'role' = 'staff' OR 
        auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Policy 2: Allow public read access to project images
CREATE POLICY "Anyone can view project images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

-- Policy 3: Allow staff and admin to update project images
CREATE POLICY "Staff and admin can update project images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-images' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.raw_user_meta_data->>'role' = 'staff' OR 
        auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Policy 4: Allow admin to delete project images
CREATE POLICY "Admin can delete project images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

#### Option B: Manual UI Setup

Alternatively, you can create these policies in the **Storage** > **Policies** section:

#### Policy 1: Allow staff and admin to upload project images
```sql
-- Policy Name: "Staff and admin can upload project images"
-- Allowed operation: INSERT
-- Target roles: authenticated

EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (
        auth.users.raw_user_meta_data->>'role' = 'staff' OR 
        auth.users.raw_user_meta_data->>'role' = 'admin'
    )
)
```

#### Policy 2: Allow public read access to project images
```sql
-- Policy Name: "Anyone can view project images"
-- Allowed operation: SELECT
-- Target roles: public

true
```

#### Policy 3: Allow staff and admin to update project images
```sql
-- Policy Name: "Staff and admin can update project images"
-- Allowed operation: UPDATE
-- Target roles: authenticated

EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (
        auth.users.raw_user_meta_data->>'role' = 'staff' OR 
        auth.users.raw_user_meta_data->>'role' = 'admin'
    )
)
```

#### Policy 4: Allow admin to delete project images
```sql
-- Policy Name: "Admin can delete project images"
-- Allowed operation: DELETE
-- Target roles: authenticated

EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
)
```

## 📂 File Structure

Project images are stored in this structure:
```
project-images/
└── projects/
    ├── {timestamp}-{random}.{extension}
    ├── {timestamp}-{random}.{extension}
    └── ...
```

## 🚀 Testing

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test project image upload** (requires staff/admin role):
   - Go to the projects page
   - Click "Add Project" 
   - Switch to the "Upload Image" tab
   - Upload an image file
   - Verify the image appears in the project

## 🔧 Features

### Dual Image Input Options
- **URL Input**: Users can provide a direct image URL
- **File Upload**: Users can upload image files directly
- **File Validation**: Supports common image formats, max 10MB
- **Visual Feedback**: Shows upload progress and file information
- **Error Handling**: Provides clear feedback for invalid files or upload failures

### Security
- Only staff and admin users can upload images
- File type validation (images only)
- File size validation (max 10MB)
- Public read access for displaying images

## 🔍 Troubleshooting

### Common Issues:

1. **Upload Permission Denied**: Ensure the user has staff or admin role
2. **File Too Large**: Maximum file size is 10MB
3. **Invalid File Type**: Only image files are allowed
4. **Bucket Not Found**: Ensure the `project-images` bucket exists and is public

### Environment Variables

Make sure you have the required environment variables in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```