# Role-Based Access Control (RBAC) Setup Guide

This document explains the RBAC implementation for your portfolio admin panel.

## Overview

The RBAC system ensures that **only users with the `admin` role** can access the admin panel and modify data. This protects your portfolio from unauthorized changes.

## Architecture

### Two-Layer Security

| Layer | Location | Purpose |
|-------|----------|---------|
| 1 | Frontend (React) | Guards admin routes, shows/hides UI based on role |
| 2 | Backend (Supabase RLS) | Enforces role checks at the database level |

## Files Changed/Created

### Frontend Changes

1. **`src/hooks/useAuth.ts`** - Added `isAdmin` and `roleLoading` states that check the `user_roles` table
2. **`src/api/supabase.ts`** - Added `UserRole` interface and `user_roles` table type
3. **`src/components/common/ProtectedAdminRoute/`** - New component that checks for admin role before allowing access
4. **`src/layouts/AdminLayout/AdminLayout.tsx`** - Shows admin badge for admin users
5. **`src/pages/admin/Unauthorized.tsx`** - New page shown to non-admin users
6. **`src/App.tsx`** - Updated to use `ProtectedAdminRoute` for all admin routes

### Database Migration

**`supabase/migrations/001_add_rbac.sql`** - SQL migration that:
- Creates `user_roles` table
- Updates all RLS policies to check for admin role
- Updates storage bucket policies to require admin role
- Includes setup instructions as SQL comments

## Setup Instructions

### Step 1: Run the Database Migration

1. Go to [Supabase Studio](https://app.supabase.com) → Your Project → SQL Editor
2. Open `supabase/migrations/001_add_rbac.sql` from this project
3. Copy and paste the entire SQL contents
4. Click **Run**

### Step 2: Add Yourself as Admin

After running the migration, you need to manually add your user as an admin:

1. Go to Supabase Studio → **Authentication** → **Users**
2. Find your account (Google/GitHub/email)
3. Copy your **User ID** (UUID format like `12345678-1234-1234-1234-123456789abc`)
4. Go to **SQL Editor** and run:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

### Step 3: Disable Public Sign-ups (Recommended)

To prevent random users from creating accounts:

1. Go to Supabase Studio → **Authentication** → **Settings**
2. Find **Enable email provider** → Toggle OFF
3. Find **Enable Google provider** → Toggle OFF (if you don't need new OAuth users)
4. Find **Enable GitHub provider** → Toggle OFF (if you don't need new OAuth users)

**Note:** Disabling sign-ups won't affect your existing account. You'll still be able to log in.

## How It Works

### Login Flow

1. User logs in via email/password or OAuth
2. `useAuth` hook checks if user has a session
3. `useAuth` queries `user_roles` table to check if `role = 'admin'`
4. If not admin → redirected to `/unauthorized`
5. If admin → granted access to admin panel

### Database Protection

All tables now have RLS policies that require the admin role:

```sql
-- Example: Projects table
CREATE POLICY "Admins can insert projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

Even if someone bypasses the frontend, the database will reject non-admin write operations.

## Security Checklist

- [ ] Ran `001_add_rbac.sql` migration
- [ ] Added yourself to `user_roles` table with `admin` role
- [ ] Disabled public sign-ups in Supabase Auth settings
- [ ] Tested that non-admin users are redirected to `/unauthorized`
- [ ] Tested that admin users can still access all features

## Troubleshooting

### "Access Denied" but I should be admin

1. Check that your user is in the `user_roles` table:
   ```sql
   SELECT * FROM public.user_roles;
   ```
2. Verify your `role` column is set to `'admin'` (not `'user'`)
3. Hard refresh the browser (Ctrl+Shift+R)

### Can't access admin panel after migration

1. Make sure you ran the `INSERT` statement to add yourself as admin
2. Check browser console for errors
3. Verify the `user_roles` table exists in Supabase

### Database operations failing

1. Check RLS policies are correctly applied:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'projects';
   ```
2. Verify you're querying from `public.user_roles` (not just `user_roles`)

## Adding More Admins

To add another admin user:

1. Have them log in once (so they appear in `auth.users`)
2. Find their user ID in Supabase Studio → Authentication → Users
3. Run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('their-user-id', 'admin');
   ```

## Future Enhancements

Potential improvements you could add:

- **Invite system**: Generate invite codes for new admins
- **Role hierarchy**: Add `editor` role with limited permissions
- **Audit log**: Track who made what changes
- **Admin management UI**: Allow admins to add/remove other admins from the dashboard
