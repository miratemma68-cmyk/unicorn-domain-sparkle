-- Create contact inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a contact form (insert)
CREATE POLICY "Anyone can submit contact inquiry" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Only allow authenticated users to view inquiries (for future admin access)
CREATE POLICY "Authenticated users can view inquiries" 
ON public.contact_inquiries 
FOR SELECT 
USING (auth.uid() IS NOT NULL);