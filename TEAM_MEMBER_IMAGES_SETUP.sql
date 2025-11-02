-- Create storage bucket for team member images
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-member-images', 'team-member-images', true);

-- Set up storage policies for team member images
CREATE POLICY "Team member images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'team-member-images');

CREATE POLICY "Authenticated users can upload team member images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-member-images' AND (storage.foldername(name))[1] = 'team-members');

CREATE POLICY "Users can update their own team member images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'team-member-images' AND (storage.foldername(name))[1] = 'team-members')
WITH CHECK (bucket_id = 'team-member-images' AND (storage.foldername(name))[1] = 'team-members');

CREATE POLICY "Users can delete their own team member images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'team-member-images' AND (storage.foldername(name))[1] = 'team-members');