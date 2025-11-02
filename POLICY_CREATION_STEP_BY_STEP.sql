-- 🛠️ POLICY CREATION SCRIPT (Individual Commands)
-- Run these one by one in your SQL Editor

-- First, clean up any existing conflicting policies
DROP POLICY IF EXISTS "profiles_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "profiles_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "profiles_public_read" ON storage.objects;
DROP POLICY IF EXISTS "profiles_auth_delete" ON storage.objects;

-- Policy 1: Allow authenticated users to INSERT their own profile pictures
CREATE POLICY "profiles_auth_insert" ON storage.objects
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        bucket_id = 'profiles' AND 
        (storage.foldername(name))[1] = (auth.uid())::text
    );

-- Policy 2: Allow authenticated users to UPDATE their own profile pictures
CREATE POLICY "profiles_auth_update" ON storage.objects
    FOR UPDATE 
    TO authenticated
    USING (
        bucket_id = 'profiles' AND 
        (storage.foldername(name))[1] = (auth.uid())::text
    )
    WITH CHECK (
        bucket_id = 'profiles' AND 
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
        (storage.foldername(name))[1] = (auth.uid())::text
    );

-- Verification query
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%profiles%'
ORDER BY policyname;

SELECT '✅ Policies created successfully!' as result;