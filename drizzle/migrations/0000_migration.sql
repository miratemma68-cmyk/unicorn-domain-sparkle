DROP POLICY IF EXISTS "Anyone can submit contact inquiry" ON public.contact_inquiries;
GRANT ALL ON public.contact_inquiries TO service_role;
DROP POLICY IF EXISTS "Anyone can view FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Anyone can view domain gallery media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view testimonials media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view kitten media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view education media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view breeding cat media" ON storage.objects;