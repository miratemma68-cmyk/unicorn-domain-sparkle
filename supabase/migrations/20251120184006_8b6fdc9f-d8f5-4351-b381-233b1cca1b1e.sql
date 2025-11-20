-- Allow public read access to kitten photos for homepage listing
CREATE POLICY "Anyone can view kitten media"
ON public.kitten_media
FOR SELECT
USING (true);