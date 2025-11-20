-- Add caption translation columns to breeding_cat_gallery
ALTER TABLE public.breeding_cat_gallery 
ADD COLUMN caption_en TEXT,
ADD COLUMN caption_es TEXT;

-- Add caption translation columns to domain_gallery
ALTER TABLE public.domain_gallery 
ADD COLUMN caption_en TEXT,
ADD COLUMN caption_es TEXT;

-- Add caption translation columns to education_media
ALTER TABLE public.education_media 
ADD COLUMN caption_en TEXT,
ADD COLUMN caption_es TEXT;

-- Add caption translation columns to testimonials_media
ALTER TABLE public.testimonials_media 
ADD COLUMN caption_en TEXT,
ADD COLUMN caption_es TEXT;

-- Add caption translation columns to kitten_media
ALTER TABLE public.kitten_media 
ADD COLUMN caption_en TEXT,
ADD COLUMN caption_es TEXT;