-- Add explicit DENY policy for anonymous users on contact_inquiries
-- This makes it crystal clear that anonymous users cannot read contact data
CREATE POLICY "Block anonymous users from viewing inquiries"
ON public.contact_inquiries
FOR SELECT
TO anon
USING (false);

-- Verify RLS is enabled (should already be, but being explicit)
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Add a comment to document the security intent
COMMENT ON TABLE public.contact_inquiries IS 'Contains sensitive customer contact data. RLS policies ensure only admins can view, anyone can insert, and anonymous users are explicitly blocked from SELECT.';