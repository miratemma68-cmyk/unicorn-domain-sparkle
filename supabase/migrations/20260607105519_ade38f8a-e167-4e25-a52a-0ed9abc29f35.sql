
-- 1. Drop unused SECURITY DEFINER view
DROP VIEW IF EXISTS public.public_kittens_view;

-- 2. Restrict sensitive columns on breeding_cats from anonymous users
REVOKE SELECT (microchip_number, registration_number) ON public.breeding_cats FROM anon;

-- 3. Restrict uploaded_by on kitten_media from anonymous users
REVOKE SELECT (uploaded_by) ON public.kitten_media FROM anon;

-- 4. Replace overly-permissive public SELECT on kitten_media
DROP POLICY IF EXISTS "Anyone can view kitten media" ON public.kitten_media;

CREATE POLICY "Public can view media for unassigned kittens"
ON public.kitten_media
FOR SELECT
USING (
  NOT EXISTS (
    SELECT 1 FROM public.client_kittens
    WHERE client_kittens.kitten_id = kitten_media.kitten_id
  )
);
