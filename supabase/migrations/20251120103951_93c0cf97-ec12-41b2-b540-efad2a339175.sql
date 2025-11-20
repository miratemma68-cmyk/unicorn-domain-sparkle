-- Create testimonials_media table for storing client testimonials media
CREATE TABLE public.testimonials_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials_media ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials_media
CREATE POLICY "Anyone can view testimonials media"
  ON public.testimonials_media
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage testimonials media"
  ON public.testimonials_media
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for testimonials media
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials-media', 'testimonials-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for testimonials media
CREATE POLICY "Anyone can view testimonials media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'testimonials-media');

CREATE POLICY "Admins can upload testimonials media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'testimonials-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonials media"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'testimonials-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials media"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'testimonials-media' AND has_role(auth.uid(), 'admin'::app_role));