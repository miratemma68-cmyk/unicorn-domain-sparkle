-- Allow anyone to view kittens (for public display on the website)
CREATE POLICY "Anyone can view kittens"
ON public.kittens
FOR SELECT
USING (true);