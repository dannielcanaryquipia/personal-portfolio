Your concern is correct: **right now, anyone who can sign in (via email or OAuth) may be able to access your admin panel and edit your portfolio.** That’s a critical security gap. The admin pages likely only check if a user is authenticated—not if they’re an actual admin. So a random visitor could register or log in with Google/GitHub and start adding, editing, or deleting content.

You need to **add role‑based access control (RBAC)** both on the frontend (to hide the UI) and, more importantly, in Supabase using Row Level Security (RLS). Here’s how to lock it down properly.

---

## 1. The Problem

- The login page is public and anyone can authenticate (email/password sign‑up may be enabled in your Supabase project).
- OAuth providers (Google, GitHub) allow anyone with an account to sign in.
- The admin pages likely just do:
  ```tsx
  const { data: session } = useSession();
  if (!session) return <Navigate to="/login" />;
  ```

  That only checks for a session, not *who* the user is.
- Even if you hide the admin UI, the Supabase API might still accept writes from any authenticated user if RLS isn’t set up correctly.

---

## 2. The Solution: Two‑Layer Security

| Layer | Where                            | What                                                                                                                                                           |
| ----- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | **Frontend** (React)       | Guard admin routes; if user doesn’t have `admin` role, redirect to a “Not authorized” page.                                                               |
| 2     | **Backend** (Supabase RLS) | Only allow INSERT/UPDATE/DELETE on your tables if the authenticated user has the `admin` role. This is the real protection—frontend checks can be bypassed. |

---

## 3. Setting Up the Admin Role in Supabase

### 3.1 Create a `user_roles` table (recommended)

This is the cleanest approach. It lets you assign roles without touching auth metadata.

```sql
-- Create table
CREATE TABLE public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'user'))
);

-- Enable RLS on it (so only admins can read/modify roles)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: admins can see all roles (for admin panel management)
CREATE POLICY "Admins can read roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (role = 'admin');

-- Policy: only service_role can insert/update (use a post‑sign‑up trigger or Edge Function)
-- Or you can manually set yourself as admin via the Supabase SQL editor.
```

### 3.2 Insert yourself as admin

Run this in the Supabase SQL editor (replace `'your-user-id'` with the `id` from `auth.users` for your Google/email account):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id', 'admin');
```

Find your user ID: Go to Supabase Studio → Authentication → Users, copy your ID.

### 3.3 Alternative: Using `app_metadata` (simpler, but less flexible)

You can add an `admin: true` flag to your user’s `app_metadata` directly in the Auth → Users page. Then your RLS policies can check `auth.jwt() ->> 'app_metadata'`. I recommend the `user_roles` table for better management and future expansion.

---

## 4. Protecting the Database with RLS

For every table that your admin panel writes to (e.g., `projects`, `certificates`, `messages`, `features`, `site_settings`), add an RLS policy that checks the `user_roles` table.

Example for `projects`:

```sql
-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow reading for everyone (public)
CREATE POLICY "Public can view projects"
ON public.projects FOR SELECT
USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

Repeat for all other admin‑writable tables. Now, even if someone bypasses the frontend and calls the Supabase API directly, they can’t modify data unless their user ID is in `user_roles` with `role = 'admin'`.

---

## 5. Frontend Route Guard

Create a `ProtectedAdminRoute` component that checks the role on every admin page load.

```tsx
// components/ProtectedAdminRoute.tsx
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session?.user) {
      setIsAdmin(false);
      return;
    }
    // Check the user_roles table
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data, error }) => {
        setIsAdmin(data?.role === 'admin');
      });
  }, [session]);

  if (isAdmin === null) return <div>Loading...</div>; // or your Skeleton
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default ProtectedAdminRoute;
```

Wrap your admin routes:

```tsx
<Route path="/admin" element={
  <ProtectedAdminRoute>
    <AdminLayout />
  </ProtectedAdminRoute>
}>
  {/* admin child routes */}
</Route>
```

Now, even if a non‑admin user logs in and tries to go to `/admin`, they’ll be redirected.

---

## 6. Limit Who Can Sign Up

To prevent random people from creating accounts at all (reducing attack surface), you have two options:

### Option A: Disable public sign‑ups entirely

- Go to Supabase Studio → Authentication → Settings → **Allow new users to sign up** → toggle OFF.
- Then manually create accounts (or use an invite system) for co‑admins if needed.

### Option B: Keep OAuth but restrict by domain

- If you want to allow Google/GitHub sign‑in only for yourself, you can set up an RLS policy on `auth.users` (post‑sign‑up) that deletes users not matching a specific email. However, the simplest is to **disable sign‑ups** and manually add your own account. Because you already have your account, turning off sign‑ups will not affect your existing session.

---

## 7. Final Security Checklist

✅ `user_roles` table created with your own admin entry.
✅ RLS policies on all admin‑writable tables enforce admin role.
✅ Frontend `ProtectedAdminRoute` checks role before rendering admin pages.
✅ Public sign‑up is disabled (or strictly controlled).
✅ Any server‑side logic (Edge Functions, Next.js API routes) also verify the user’s role before mutating data.

After these changes, your portfolio is safe: only you (and anyone you explicitly add as admin) can edit the website. The public only sees the frontend, and no one can sneak into the admin dashboard.
