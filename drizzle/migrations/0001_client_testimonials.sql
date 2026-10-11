CREATE TABLE public.client_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 80),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  photo_url text,
  photo_path text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.client_testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_testimonials TO authenticated;
GRANT ALL ON public.client_testimonials TO service_role;
ALTER TABLE public.client_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sees approved testimonials" ON public.client_testimonials FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Clients see own testimonials" ON public.client_testimonials FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Clients submit pending testimonials" ON public.client_testimonials FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id AND status = 'pending');
CREATE POLICY "Admins manage testimonials" ON public.client_testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Clients upload own testimonial photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'testimonials-media' AND (storage.foldername(name))[1] = 'clients' AND (storage.foldername(name))[2] = auth.uid()::text);