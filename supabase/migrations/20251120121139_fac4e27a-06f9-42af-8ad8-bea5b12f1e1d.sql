-- Add translation columns for breeding cats personality and pedigree
ALTER TABLE breeding_cats 
ADD COLUMN IF NOT EXISTS personality_en TEXT,
ADD COLUMN IF NOT EXISTS personality_es TEXT,
ADD COLUMN IF NOT EXISTS pedigree_en TEXT,
ADD COLUMN IF NOT EXISTS pedigree_es TEXT;