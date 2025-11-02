-- 🔧 SAFE PROFILE PICTURE FIX (No Foreign Key Issues)
-- Run this script in your Supabase SQL Editor

-- ========================================
-- STEP 1: Clean up existing policies only
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
DROP POLICY IF EXISTS "profiles_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "profiles_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "profiles_public_select" ON storage.objects;
DROP POLICY IF EXISTS "profiles_authenticated_delete" ON storage.objects;

-- Drop any other variations
DROP POLICY IF EXISTS "Allow authenticated users to upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own profile pictures" ON storage.objects;

-- ========================================
-- STEP 2: Ensure bucket exists and is configured
-- ========================================

-- Update existing bucket or create if doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'profiles', 
    'profiles', 
    true,  -- PUBLIC bucket for profile pictures
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ========================================
-- STEP 3: Create the correct RLS policies
-- ========================================

-- Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to INSERT their own profile pictures
CREATE POLICY "profiles_auth_insert" ON storage.objects
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (storage.foldername(name))[1] = (auth.uid())::text
    );

-- Policy 2: Allow authenticated users to UPDATE their own profile pictures
CREATE POLICY "profiles_auth_update" ON storage.objects
    FOR UPDATE 
    TO authenticated
    USING (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (storage.foldername(name))[1] = (auth.uid())::text
    )
    WITH CHECK (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (storage.foldername(name))[1] = (auth.uid())::text
    );

-- Policy 3: Allow PUBLIC read access to all profile pictures
CREATE POLICY "profiles_public_read" ON storage.objects
    FOR SELECT 
    TO public
    USING (bucket_id = 'profiles');

-- Policy 4: Allow authenticated users to DELETE their own profile pictures
CREATE POLICY "profiles_auth_delete" ON storage.objects
    FOR DELETE 
    TO authenticated
    USING (
        bucket_id = 'profiles' AND
        auth.uid() IS NOT NULL AND
        (storage.foldername(name))[1] = (auth.uid())::text
    );

-- ========================================
-- STEP 4: Verification queries
-- ========================================

-- Check if bucket exists and is configured correctly
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types,
    CASE 
        WHEN public = true THEN '✅ Public (Correct)'
        ELSE '❌ Private (Should be Public)'
    END as public_status
FROM storage.buckets 
WHERE id = 'profiles';

-- Check if policies are created correctly
SELECT 
    policyname as policy_name,
    cmd as operation,
    roles as target_roles,
    CASE 
        WHEN policyname LIKE '%profiles%' THEN '✅ Profile Policy'
        ELSE '❓ Other Policy'
    END as policy_type
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%profiles%'
ORDER BY policyname;

-- Count how many profile policies exist (should be 4)
SELECT 
    COUNT(*) as profile_policies_count,
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ All 4 policies created'
        WHEN COUNT(*) > 4 THEN '⚠️ Too many policies (duplicates?)'
        ELSE '❌ Missing policies'
    END as status
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%profiles%';

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

SELECT '🎉 Profile picture storage fix completed successfully!' as final_status;