-- Create a public view of kittens that excludes sensitive identification fields
CREATE OR REPLACE VIEW public.public_kittens_view AS
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

-- Grant SELECT on the view to anonymous users
GRANT SELECT ON public.public_kittens_view TO anon;
GRANT SELECT ON public.public_kittens_view TO authenticated;

-- Drop the public access policy from the kittens table
DROP POLICY IF EXISTS "Anyone can view kittens" ON public.kittens;