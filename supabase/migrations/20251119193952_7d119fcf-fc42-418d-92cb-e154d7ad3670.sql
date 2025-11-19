-- Make birth_date nullable in kittens table
ALTER TABLE public.kittens 
ALTER COLUMN birth_date DROP NOT NULL;