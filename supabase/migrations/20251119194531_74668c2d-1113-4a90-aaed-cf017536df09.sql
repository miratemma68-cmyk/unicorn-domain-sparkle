-- Make kitten-media bucket public so images can be displayed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'kitten-media';