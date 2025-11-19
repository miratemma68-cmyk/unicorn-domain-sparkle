-- Create table for breeding cats (reproducteurs)
CREATE TABLE public.breeding_cats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL,
  color TEXT,
  pedigree TEXT,
  personality TEXT,
  registration_number TEXT,
  microchip_number TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.breeding_cats ENABLE ROW LEVEL SECURITY;

-- Anyone can view breeding cats
CREATE POLICY "Anyone can view breeding cats"
  ON public.breeding_cats
  FOR SELECT
  USING (true);

-- Only admins can manage breeding cats
CREATE POLICY "Admins can manage breeding cats"
  ON public.breeding_cats
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_breeding_cats_updated_at
  BEFORE UPDATE ON public.breeding_cats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for breeding cat gallery images
CREATE TABLE public.breeding_cat_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cat_id UUID NOT NULL REFERENCES public.breeding_cats(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.breeding_cat_gallery ENABLE ROW LEVEL SECURITY;

-- Anyone can view gallery images
CREATE POLICY "Anyone can view gallery images"
  ON public.breeding_cat_gallery
  FOR SELECT
  USING (true);

-- Only admins can manage gallery images
CREATE POLICY "Admins can manage gallery images"
  ON public.breeding_cat_gallery
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));