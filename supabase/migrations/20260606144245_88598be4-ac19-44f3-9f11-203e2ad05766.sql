DROP VIEW IF EXISTS public_kittens_view;
ALTER TABLE kittens ALTER COLUMN current_weight TYPE numeric(10,2);
CREATE VIEW public_kittens_view AS 
SELECT id, name, birth_date, gender, color, current_weight, breed_info, created_at, updated_at 
FROM kittens;
GRANT SELECT ON public_kittens_view TO anon, authenticated, service_role;