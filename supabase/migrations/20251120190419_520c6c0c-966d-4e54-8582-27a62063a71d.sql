-- Drop and recreate the view without SECURITY DEFINER (which was implicit in CREATE OR REPLACE)
DROP VIEW IF EXISTS public.public_kittens_view;

-- Create the view as SECURITY INVOKER (default and safer)
CREATE VIEW public.public_kittens_view 
WITH (security_invoker=true) AS
SELECT 
  id,
  name,
  birth_date,
  gender,
  color,
  current_weight,
  breed_info,
  created_at,
  updated_at
FROM public.kittens;

-- Grant SELECT on the view to anonymous and authenticated users
GRANT SELECT ON public.public_kittens_view TO anon;
GRANT SELECT ON public.public_kittens_view TO authenticated;