-- RESET PROJECT IMAGES STORAGE
-- Run this SQL in your Supabase SQL Editor to completely reset the project-images storage

-- WARNING: This will delete all project images in the bucket!
-- Make sure to backup any important images before running this script.

-- First, delete all objects in the project-images bucket
DELETE FROM storage.objects WHERE bucket_id = 'project-images';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Staff and admin can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Staff and admin can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete project images" ON storage.objects;

-- Delete the bucket
DELETE FROM storage.buckets WHERE id = 'project-images';

-- Recreate the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true);

-- Recreate policies

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

-- Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;