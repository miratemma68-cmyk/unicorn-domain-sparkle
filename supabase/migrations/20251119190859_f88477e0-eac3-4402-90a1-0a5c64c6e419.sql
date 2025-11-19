-- Add media_type column to breeding_cat_gallery
ALTER TABLE public.breeding_cat_gallery 
ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image' 
CHECK (media_type IN ('image', 'video'));

-- Add comment for clarity
COMMENT ON COLUMN public.breeding_cat_gallery.media_type IS 'Type de média: image ou video';

-- Create storage bucket for breeding cat media (photos and videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'breeding-cat-media',
  'breeding-cat-media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for breeding cat media
-- Allow public to view all media
CREATE POLICY "Anyone can view breeding cat media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'breeding-cat-media');

-- Allow admins to upload media
CREATE POLICY "Admins can upload breeding cat media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'breeding-cat-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update media
CREATE POLICY "Admins can update breeding cat media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'breeding-cat-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete media
CREATE POLICY "Admins can delete breeding cat media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'breeding-cat-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);