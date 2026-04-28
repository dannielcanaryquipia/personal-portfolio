-- ============================================
-- ROLE-BASED ACCESS CONTROL (RBAC) MIGRATION
-- Run this in Supabase SQL Editor to secure your admin panel
-- ============================================

-- 1. Create user_roles table to store admin assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own role
CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Only admins can read all roles (for admin panel management)
CREATE POLICY "Admins can read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 2. UPDATE EXISTING RLS POLICIES TO CHECK ADMIN ROLE
-- ============================================

-- Drop old permissive policies (that allowed any authenticated user)
DROP POLICY IF EXISTS "Auth write projects" ON projects;
DROP POLICY IF EXISTS "Auth write certificates" ON certificates;
DROP POLICY IF EXISTS "Auth insert messages" ON contact_messages;
DROP POLICY IF EXISTS "Auth read messages" ON contact_messages;
DROP POLICY IF EXISTS "Auth update messages" ON contact_messages;
DROP POLICY IF EXISTS "Auth delete messages" ON contact_messages;
DROP POLICY IF EXISTS "Auth write status" ON status;
DROP POLICY IF EXISTS "Auth write site_settings" ON site_settings;
DROP POLICY IF EXISTS "Auth write features" ON features;
DROP POLICY IF EXISTS "Auth write stats" ON stats;

-- Projects: Only admins can write
CREATE POLICY "Admins can insert projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update projects"
ON projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete projects"
ON projects FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Certificates: Only admins can write
CREATE POLICY "Admins can insert certificates"
ON certificates FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update certificates"
ON certificates FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete certificates"
ON certificates FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Contact Messages: Only admins can read/update/delete
-- (Public can still insert via the contact form)
CREATE POLICY "Admins can read messages"
ON contact_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update messages"
ON contact_messages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete messages"
ON contact_messages FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Status: Only admins can write
CREATE POLICY "Admins can insert status"
ON status FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update status"
ON status FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete status"
ON status FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Site Settings: Only admins can write
CREATE POLICY "Admins can insert site_settings"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update site_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete site_settings"
ON site_settings FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Features: Only admins can write
CREATE POLICY "Admins can insert features"
ON features FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update features"
ON features FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete features"
ON features FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Stats: Only admins can write
CREATE POLICY "Admins can insert stats"
ON stats FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update stats"
ON stats FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete stats"
ON stats FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 3. UPDATE STORAGE BUCKET POLICIES
-- ============================================

-- Drop old permissive storage policies
DROP POLICY IF EXISTS "Auth upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete certificates" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload projects" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete projects" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload profile" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete profile" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload cv" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete cv" ON storage.objects;

-- Create admin-only storage policies
CREATE POLICY "Admins can upload to certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete from certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can upload to projects"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'projects' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete from projects"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'projects' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can upload to profile"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete from profile"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can upload to cv"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete from cv"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 4. INSTRUCTIONS FOR SETTING UP YOUR ADMIN ACCOUNT
-- ============================================

/*
After running this migration, you need to manually add yourself as an admin.

Step 1: Find your user ID
- Go to Supabase Studio → Authentication → Users
- Copy your user ID (UUID)

Step 2: Insert yourself as admin
Run this SQL (replace with your actual user ID):

INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');

Step 3: Disable public sign-ups (recommended)
- Go to Supabase Studio → Authentication → Settings
- Toggle OFF "Allow new users to sign up"
- This prevents random users from creating accounts

Your existing account will continue to work.
*/
