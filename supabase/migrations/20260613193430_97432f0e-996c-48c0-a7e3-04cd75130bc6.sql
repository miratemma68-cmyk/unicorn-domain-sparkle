
-- Align storage policy with public RLS: kitten-media bucket is intentionally public for the cattery showcase
DROP POLICY IF EXISTS "Authenticated users can view kitten media" ON storage.objects;
CREATE POLICY "Public can view kitten media"
ON storage.objects FOR SELECT
USING (bucket_id = 'kitten-media');

-- Add ip_address column to contact_inquiries for proper rate limiting
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS ip_address text;
CREATE INDEX IF NOT EXISTS contact_inquiries_ip_created_idx
  ON public.contact_inquiries (ip_address, created_at DESC);
