-- ============================================
-- SUPABASE STORAGE SETUP FOR CERTIFICATES
-- ============================================
-- Run this in Supabase SQL Editor AFTER creating buckets manually

-- Step 1: Create certificates bucket (run this in Supabase Dashboard Storage section)
-- Go to Storage -> Create bucket -> Name: "certificates" -> Public

-- Step 2: Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Create storage policies for certificates bucket
-- Allow public read access to certificate files
CREATE POLICY "Public read certificates" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'certificates');

-- Allow authenticated users to upload certificate files
CREATE POLICY "Auth upload certificates" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'certificates');

-- Allow authenticated users to update certificate files
CREATE POLICY "Auth update certificates" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'certificates');

-- Allow authenticated users to delete certificate files
CREATE POLICY "Auth delete certificates" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'certificates');

-- Step 4: Test the setup
-- You can test by running:
-- SELECT * FROM storage.objects WHERE bucket_id = 'certificates';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if bucket exists (should return rows if bucket exists)
SELECT * FROM storage.buckets WHERE name = 'certificates';

-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schema = 'storage';

-- Check existing certificate files
SELECT * FROM storage.objects WHERE bucket_id = 'certificates' ORDER BY created_at DESC;
