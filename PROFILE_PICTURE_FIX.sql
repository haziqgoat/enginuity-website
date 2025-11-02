-- 🚨 COMPLETE PROFILE PICTURE UPLOAD FIX
-- Run this entire script in your Supabase SQL Editor

-- ========================================
-- STEP 1: Clean up existing policies
-- ========================================

-- Drop ALL existing storage policies that might conflict
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "profiles_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "profiles_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "profiles_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "profiles_delete_policy" ON storage.objects;

-- Drop any other variations
DROP POLICY IF EXISTS "Allow authenticated users to upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own profile pictures" ON storage.objects;

-- ========================================
-- STEP 2: Ensure bucket exists properly
-- ========================================

-- Clean up existing files in the profiles bucket (if any)
DELETE FROM storage.objects WHERE bucket_id = 'profiles';

-- Update bucket settings instead of deleting (to avoid foreign key constraint)
UPDATE storage.buckets 
SET 
    public = true,
    file_size_limit = 5242880,  -- 5MB limit
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
WHERE id = 'profiles';

-- If bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
SELECT 'profiles', 'profiles', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profiles');

-- ========================================
-- STEP 3: Create the correct RLS policies
-- ========================================

-- Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to INSERT their own profile pictures
CREATE POLICY "profiles_authenticated_insert" ON storage.objects
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (auth.uid())::text = (storage.foldername(name))[1]
    );

-- Policy 2: Allow authenticated users to UPDATE their own profile pictures
CREATE POLICY "profiles_authenticated_update" ON storage.objects
    FOR UPDATE 
    TO authenticated
    USING (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (auth.uid())::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (auth.uid())::text = (storage.foldername(name))[1]
    );

-- Policy 3: Allow PUBLIC read access to all profile pictures
CREATE POLICY "profiles_public_select" ON storage.objects
    FOR SELECT 
    TO public
    USING (bucket_id = 'profiles');

-- Policy 4: Allow authenticated users to DELETE their own profile pictures
CREATE POLICY "profiles_authenticated_delete" ON storage.objects
    FOR DELETE 
    TO authenticated
    USING (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (auth.uid())::text = (storage.foldername(name))[1]
    );

-- ========================================
-- STEP 4: Verification queries
-- ========================================

-- Check if bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'profiles';

-- Check if policies are created
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%profiles%'
ORDER BY policyname;

-- ========================================
-- DIAGNOSTIC QUERIES (for troubleshooting)
-- ========================================

-- These queries help diagnose authentication issues
-- Note: These will only work when run from your application context, not SQL editor

-- Check current authentication (will be NULL in SQL editor)
-- SELECT 
--     auth.uid() as current_user_id,
--     auth.jwt() ->> 'email' as current_email,
--     auth.role() as current_role;

-- Test folder name extraction
-- SELECT storage.foldername('test-user-id/profile.jpg') as folder_parts;

-- ========================================
-- FINAL MESSAGE
-- ========================================

SELECT 'Profile picture storage setup completed!' as status;