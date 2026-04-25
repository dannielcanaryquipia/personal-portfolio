-- ============================================
-- STORAGE POLICY TROUBLESHOOTING SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to diagnose and fix storage issues

-- Step 1: Check if the certificates bucket exists
SELECT '=== Checking bucket existence ===' as step;
SELECT * FROM storage.buckets WHERE name = 'certificates';

-- Step 2: Check if RLS is enabled on storage.objects
SELECT '=== Checking RLS status ===' as step;
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Step 3: List all existing storage policies
SELECT '=== Existing storage policies ===' as step;
SELECT 
  policyname,
  tablename,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- Step 4: Drop existing certificates policies (if they exist)
-- Uncomment these lines if you need to recreate policies
-- DROP POLICY IF EXISTS "Public read certificates" ON storage.objects;
-- DROP POLICY IF EXISTS "Auth upload certificates" ON storage.objects;
-- DROP POLICY IF EXISTS "Auth update certificates" ON storage.objects;
-- DROP POLICY IF EXISTS "Auth delete certificates" ON storage.objects;

-- Step 5: Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 6: Create/Recreate storage policies for certificates bucket
-- Allow public read access to certificate files
CREATE POLICY IF NOT EXISTS "Public read certificates" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'certificates');

-- Allow authenticated users to upload certificate files
CREATE POLICY IF NOT EXISTS "Auth upload certificates" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'certificates');

-- Allow authenticated users to update certificate files
CREATE POLICY IF NOT EXISTS "Auth update certificates" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'certificates')
WITH CHECK (bucket_id = 'certificates');

-- Allow authenticated users to delete certificate files
CREATE POLICY IF NOT EXISTS "Auth delete certificates" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'certificates');

-- Step 7: Verify policies were created
SELECT '=== Verifying policies ===' as step;
SELECT 
  policyname,
  tablename,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%certificates%'
ORDER BY policyname;

-- Step 8: Check current files in certificates bucket
SELECT '=== Current files in certificates bucket ===' as step;
SELECT * FROM storage.objects WHERE bucket_id = 'certificates' ORDER BY created_at DESC;

-- ============================================
-- MANUAL BUCKET CREATION INSTRUCTIONS
-- ============================================
-- If the bucket doesn't exist, you need to create it manually:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to Storage
-- 3. Click "Create a new bucket"
-- 4. Name it: certificates
-- 5. Make it: Public
-- 6. Click "Create bucket"
-- 7. Then run this script again to set up policies
