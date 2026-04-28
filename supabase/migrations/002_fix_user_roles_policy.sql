-- ============================================
-- FIX: Ensure user_roles RLS policy works correctly
-- ============================================

-- Drop and recreate the "Users can read own role" policy to ensure it's clean
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

-- Recreate with explicit auth.uid() cast
CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id::text = auth.uid()::text);

-- Also ensure anon can never read user_roles (security)
-- (authenticated users should use the policy above)

-- ============================================
-- VERIFICATION QUERY - Run this to test
-- ============================================
/*
-- As an authenticated user (via Supabase client), this should work:
SELECT * FROM public.user_roles WHERE user_id = '8bf60599-8138-4e6e-86c9-7e72bfa9c0a2';

-- This should return:
-- id: b8f13ad1-4c98-4d51-b12c-0136eb7ad6eb
-- user_id: 8bf60599-8138-4e6e-86c9-7e72bfa9c0a2  
-- role: admin
-- created_at: 2026-04-26 11:44:50.629378+00
*/
