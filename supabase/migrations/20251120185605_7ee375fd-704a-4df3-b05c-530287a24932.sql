-- Drop the existing policy that allows any authenticated user to view inquiries
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON public.contact_inquiries;

-- Create a new policy that only allows admins to view inquiries
CREATE POLICY "Only admins can view inquiries"
ON public.contact_inquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));