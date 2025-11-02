-- 🧹 CLEANUP SCRIPT - Safe to run in SQL Editor
-- This only handles bucket setup and cleanup, no RLS policies

-- ========================================
-- STEP 1: Clean up bucket (you have permissions for this)
-- ========================================

-- Ensure bucket exists and is configured correctly
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
-- VERIFICATION
-- ========================================

-- Check if bucket is configured correctly
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

SELECT '✅ Bucket setup completed! Now create policies via Dashboard UI.' as next_step;