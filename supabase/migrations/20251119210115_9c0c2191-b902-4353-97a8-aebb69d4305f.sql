-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all kittens" ON public.kittens;
DROP POLICY IF EXISTS "Clients can view their assigned kittens" ON public.kittens;
DROP POLICY IF EXISTS "Anyone can view kittens" ON public.kittens;

-- Recreate admin policy (default is PERMISSIVE)
CREATE POLICY "Admins can manage all kittens"
ON public.kittens
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Recreate client view policy 
CREATE POLICY "Clients can view their assigned kittens"
ON public.kittens
FOR SELECT
USING ((EXISTS (
  SELECT 1
  FROM client_kittens
  WHERE client_kittens.kitten_id = kittens.id
    AND client_kittens.client_id = auth.uid()
)) OR has_role(auth.uid(), 'admin'));

-- Public access policy
CREATE POLICY "Anyone can view kittens"
ON public.kittens
FOR SELECT
USING (true);