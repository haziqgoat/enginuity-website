-- Project Images Storage Setup
-- Run this SQL in your Supabase SQL Editor to set up the project-images bucket and policies

-- First, ensure the bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Staff and admin can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Staff and admin can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete project images" ON storage.objects;

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