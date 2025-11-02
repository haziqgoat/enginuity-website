-- CREATE PROJECT IMAGES BUCKET (NO POLICIES)
-- Run this SQL in your Supabase SQL Editor to create the project-images storage bucket

-- Create the project-images bucket (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true);