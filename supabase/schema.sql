-- Supabase Database Schema for Portfolio Website
-- Run this in Supabase SQL Editor to set up your database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table (Portfolio items)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tags TEXT[],
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates table (Your certifications)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL, -- 'Anthropic', 'Datacamp', 'Other'
  issue_date DATE,
  expiry_date DATE,
  file_url TEXT, -- Supabase Storage URL
  file_type TEXT, -- 'pdf', 'image'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages table (Visitor submissions)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Real-time Status table (Live status widget)
CREATE TABLE IF NOT EXISTS status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'Open to Work',
  emoji TEXT DEFAULT '🟢',
  color TEXT DEFAULT 'success', -- 'success', 'warning', 'danger', 'info'
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings table (Hero text, about me, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Features/Expertise table (Dynamic cards on Home page)
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Wrench', -- Lucide icon name: Wrench, Code2, Database, etc.
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Stats/Metrics table (Dynamic stats on Home page)
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default status
INSERT INTO status (label, emoji, color, is_active)
VALUES ('Open to Work', '🟢', 'success', true)
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_title', 'Danniel Canary'),
  ('hero_subtitle', 'Mechanical Engineer & Developer'),
  ('about_text', 'Passionate about precision engineering and modern web development.'),
  ('contact_email', 'your-email@example.com')
ON CONFLICT (key) DO NOTHING;

-- Insert default features
INSERT INTO features (title, description, icon, display_order) VALUES
  ('Mechanical Engineering', 'Sorsogon State University graduate with expertise in precision engineering and manufacturing processes.', 'Wrench', 1),
  ('Web Development', 'Full-stack development with React, TypeScript, and modern frameworks. Building responsive, performant applications.', 'Code2', 2),
  ('Data & AI', 'Certified in SQL, database design, and AI technologies including Claude API and Model Context Protocols.', 'Database', 3)
ON CONFLICT DO NOTHING;

-- Insert default stats
INSERT INTO stats (key, label, value, display_order) VALUES
  ('certifications_count', 'Certifications', '22+', 1),
  ('projects_count', 'Projects', '5+', 2),
  ('commitment', 'Commitment', '100%', 3)
ON CONFLICT (key) DO NOTHING;

-- Insert default features (if table was just created)
INSERT INTO features (title, description, icon, display_order, is_active) VALUES
  ('Mechanical Engineering', 'Sorsogon State University graduate with expertise in precision engineering and manufacturing processes.', 'Wrench', 1, true),
  ('Web Development', 'Full-stack development with React, TypeScript, and modern frameworks. Building responsive, performant applications.', 'Code2', 2, true),
  ('Data & AI', 'Certified in SQL, database design, and AI technologies including Claude API and Model Context Protocols.', 'Database', 3, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE status ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Projects: Public can read, authenticated can write
CREATE POLICY "Public read projects" 
  ON projects FOR SELECT TO anon 
  USING (true);

CREATE POLICY "Auth write projects" 
  ON projects FOR ALL TO authenticated 
  USING (true);

-- Certificates: Public can read, authenticated can write
CREATE POLICY "Public read certificates" 
  ON certificates FOR SELECT TO anon 
  USING (true);

CREATE POLICY "Auth write certificates" 
  ON certificates FOR ALL TO authenticated 
  USING (true);

-- Contact Messages: Public can insert, authenticated can read/update/delete
CREATE POLICY "Public insert messages"
  ON contact_messages FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Auth insert messages"
  ON contact_messages FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth read messages"
  ON contact_messages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Auth update messages"
  ON contact_messages FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Auth delete messages"
  ON contact_messages FOR DELETE TO authenticated
  USING (true);

-- Status: Public can read, authenticated can write
CREATE POLICY "Public read status" 
  ON status FOR SELECT TO anon 
  USING (true);

CREATE POLICY "Auth write status" 
  ON status FOR ALL TO authenticated 
  USING (true);

-- Site Settings: Public can read, authenticated can write
CREATE POLICY "Public read site_settings" 
  ON site_settings FOR SELECT TO anon 
  USING (true);

CREATE POLICY "Auth write site_settings" 
  ON site_settings FOR ALL TO authenticated 
  USING (true);

-- Features: Public can read, authenticated can write
CREATE POLICY "Public read features" 
  ON features FOR SELECT TO anon 
  USING (true);

CREATE POLICY "Auth write features" 
  ON features FOR ALL TO authenticated 
  USING (true);

-- Stats: Public can read, authenticated can write
CREATE POLICY "Public read stats" 
  ON stats FOR SELECT TO anon 
  USING (true);

CREATE POLICY "Auth write stats" 
  ON stats FOR ALL TO authenticated 
  USING (true);

-- ============================================
-- STORAGE BUCKETS (Run in Supabase Storage)
-- ============================================
-- Create these buckets manually in Supabase Dashboard:
-- 1. certificates - For PDF certificates
-- 2. projects - For project screenshots/images
-- 3. profile - For profile picture
-- 4. cv - For CV/Resume files
--
-- Bucket policies:
-- - Public read access
-- - Authenticated write access

 
-- Similar policies for other buckets (certificates, projects, profile):

-- certificates bucket policies
CREATE POLICY "Public read certificates" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'certificates');

CREATE POLICY "Auth upload certificates" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'certificates');

CREATE POLICY "Auth delete certificates" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'certificates');

-- projects bucket policies
CREATE POLICY "Public read projects" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'projects');

CREATE POLICY "Auth upload projects" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Auth delete projects" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'projects');

-- profile bucket policies
CREATE POLICY "Public read profile" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'profile');

CREATE POLICY "Auth upload profile" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'profile');

CREATE POLICY "Auth delete profile" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'profile');

-- cv bucket policies
CREATE POLICY "Public read cv" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'cv');

CREATE POLICY "Auth upload cv" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'cv');

CREATE POLICY "Auth delete cv" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'cv');

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================
-- Enable realtime for status table
BEGIN;
  -- Drop if exists to avoid errors
  DROP PUBLICATION IF EXISTS supabase_realtime;
  -- Create publication for all tables
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;


