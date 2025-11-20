-- Create education_media table for storing educational method videos
CREATE TABLE public.education_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.education_media ENABLE ROW LEVEL SECURITY;

-- Create policies for education_media
CREATE POLICY "Anyone can view education media"
  ON public.education_media
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage education media"
  ON public.education_media
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for education media
INSERT INTO storage.buckets (id, name, public)
VALUES ('education-media', 'education-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for education media
CREATE POLICY "Anyone can view education media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'education-media');

CREATE POLICY "Admins can upload education media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'education-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update education media"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'education-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete education media"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'education-media' AND has_role(auth.uid(), 'admin'::app_role));