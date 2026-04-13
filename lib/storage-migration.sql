-- Run in Supabase SQL Editor to create storage buckets for images

-- Create avatars bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create headers bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('headers', 'headers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload headers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'headers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update headers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'headers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view headers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'headers');
