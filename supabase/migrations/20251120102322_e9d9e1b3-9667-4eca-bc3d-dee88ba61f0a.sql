-- Create domain_gallery table for storing domain gallery media
CREATE TABLE public.domain_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.domain_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for domain_gallery
CREATE POLICY "Anyone can view gallery media"
  ON public.domain_gallery
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage gallery media"
  ON public.domain_gallery
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for domain gallery media
INSERT INTO storage.buckets (id, name, public)
VALUES ('domain-gallery', 'domain-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for domain gallery
CREATE POLICY "Anyone can view domain gallery media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'domain-gallery');

CREATE POLICY "Admins can upload domain gallery media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'domain-gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update domain gallery media"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'domain-gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete domain gallery media"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'domain-gallery' AND has_role(auth.uid(), 'admin'::app_role));