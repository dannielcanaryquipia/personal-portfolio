# Troubleshooting Guide & FAQ

## 🔧 Common Issues & Solutions

### 1. **"Module not found" errors**

**Problem:**
```
Error: Cannot find module '@/components/Button'
```

**Solution:**
Check that `vite.config.ts` has path alias configured:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

Restart dev server:
```bash
npm run dev
```

---

### 2. **Supabase Connection Fails**

**Problem:**
```
Error: Cannot GET https://xxx.supabase.co/rest/v1/projects
401 Unauthorized
```

**Causes & Solutions:**

```bash
# Check 1: .env.local file exists
ls -la .env.local
# Should show your file

# Check 2: Variables are loaded
cat .env.local
# Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set

# Check 3: Restart dev server (important!)
npm run dev
# Environment variables load on startup
```

**Also verify:**
- ✅ Supabase project is active (not paused)
- ✅ URL doesn't have trailing slash
- ✅ Anon key is correct (starts with `eyJ`)
- ✅ Project isn't in "Free" tier limits

**In Supabase:**
```
Settings → API → 
- Project URL: https://xxx.supabase.co
- Anon (public): eyJhbGc... (this one)
- Service Role: eyJhbGc... (not this)
```

---

### 3. **Admin Login Fails**

**Problem:**
```
Error: Invalid login credentials
```

**Solutions:**

Check 1: User exists in Supabase
```
Supabase Dashboard →
Authentication → Users →
[Should see your email]
```

Check 2: Password is correct
- Passwords are case-sensitive
- No spaces at beginning/end
- Try resetting password

Check 3: Auth is enabled
```
Authentication → Providers →
Email → Status: "Enabled"
```

Check 4: Clear browser cache
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

### 4. **Status Widget Not Updating in Real-time**

**Problem:**
```
Change status in /admin/status
But other tabs don't update automatically
```

**Solutions:**

Check 1: RLS policies allow reads
```sql
-- In Supabase SQL Editor
SELECT * FROM status;
-- Should return data (public can read)
```

Check 2: Subscription is connected
```typescript
// In browser DevTools → Network
// Should see WebSocket connection to wss://...supabase.co/realtime/v1
```

Check 3: Browser console errors
```javascript
// DevTools → Console tab
// Look for WebSocket errors
```

Check 4: Force reconnect
```javascript
// In browser console
location.reload()
```

**Full diagnostic:**
```typescript
// Add to StatusWidget temporarily
useEffect(() => {
  const channel = supabase.channel('status-updates')
    .on('postgres_changes', {...}, (payload) => {
      console.log('Change detected:', payload)  // ← Should log
    })
    .subscribe((status) => {
      console.log('Subscription status:', status)  // ← Should be SUBSCRIBED
    })
  
  return () => supabase.removeChannel(channel)
}, [])
```

---

### 5. **Project Form Submission Fails**

**Problem:**
```
Click "Create Project" → Nothing happens
Or: "Failed to save project"
```

**Solutions:**

Check 1: Are you logged in?
```typescript
// In browser console
const { data } = await supabase.auth.getSession()
console.log(data.session)  // Should show session data
```

Check 2: RLS policy allows writes
```sql
-- In Supabase SQL Editor
INSERT INTO projects (title, description, tags)
VALUES ('Test', 'Test', '{}');
-- Should work if authenticated
```

Check 3: Form validation
```typescript
// Check your Input fields have required=true
<Input label="Title" required />

// Form should not submit if empty
```

Check 4: Supabase logs
```
Supabase Dashboard →
Logs → Edge Functions / API
[Check for error details]
```

---

### 6. **CSS Not Applying to Components**

**Problem:**
```
Button styles missing
Colors look wrong
Layout broken
```

**Solutions:**

Check 1: CSS Module imported correctly
```typescript
// ❌ Wrong
import Button from './Button'

// ✅ Correct
import { Button } from './Button'
import styles from './Button.module.css'
```

Check 2: Filename is exactly right
```
Button.tsx → Button.module.css
NOT Button.css or Button.style.css
```

Check 3: className matches
```typescript
// In Button.module.css
.primary { ... }

// In Button.tsx
className={styles.primary}  // ✅ Correct
className="primary"         // ❌ Won't work
```

Check 4: Clear cache & rebuild
```bash
rm -rf node_modules/.vite
npm run dev
```

Check 5: CSS variables defined
```typescript
// constants.ts must export COLORS
export const COLORS = {
  primary: '#0A0E27',
  // ...
}
```

---

### 7. **TypeScript Errors: "Cannot find type"**

**Problem:**
```
Error: Cannot find type 'Project'
TS2304: Cannot find name 'StatusRecord'
```

**Solutions:**

Check 1: Types exported from supabase.ts
```typescript
// src/api/supabase.ts
export interface Project {
  id: string
  title: string
  // ...
}

// Then import
import { Project } from '@/api/supabase'
```

Check 2: tsconfig.json paths correct
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Check 3: Restart TypeScript server
- VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
- Or just reload the editor

---

### 8. **Mobile Design Looks Wrong**

**Problem:**
```
Site looks bad on phone
Elements overlapping
Text too small/big
```

**Solutions:**

Check 1: Viewport meta tag in index.html
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Check 2: Media queries applied
```css
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```

Check 3: Use browser DevTools
```
Chrome: Right-click → Inspect
Toggle device toolbar (Ctrl+Shift+M)
Test at actual phone width
```

Check 4: Test on real device
```bash
# On Mac:
ifconfig | grep inet
# Note your IP, like 192.168.1.5

npm run dev

# On phone (same WiFi):
# Visit http://192.168.1.5:3000
```

---

### 9. **Deploy to Vercel But Site Shows 404**

**Problem:**
```
Vercel deployment successful
But visiting domain shows 404
```

**Solutions:**

Check 1: Build output directory
```
Vercel Settings →
Build & Development Settings →
Output Directory: dist
```

Check 2: Build command
```
Build Command: npm run build
```

Check 3: Environment variables added
```
Settings → Environment Variables →
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
[Must redeploy after adding]
```

Check 4: Vercel build logs
```
Deployments → [Latest] → Logs
[Check for build errors]
```

Check 5: Force redeploy
```
Deployments → [Latest] → ... → Redeploy
```

---

### 10. **"Cannot read property 'data' of undefined"**

**Problem:**
```
Error in useProjects() hook
Component crashes
```

**Solutions:**

Check 1: Initialize data properly
```typescript
// ❌ Wrong
const { data } = useProjects()
const projects = data.map(...)  // Crashes if data is undefined

// ✅ Correct
const { data: projects = [] } = useProjects()
const items = projects.map(...)  // Safe, defaults to []
```

Check 2: Check loading state
```typescript
const { data: projects = [], isLoading } = useProjects()

if (isLoading) return <div>Loading...</div>

// Now projects is definitely an array
return projects.map(...)
```

Check 3: Handle errors
```typescript
const { data: projects = [], isError, error } = useProjects()

if (isError) {
  return <div>Error: {error?.message}</div>
}
```

---

## ❓ FAQ

### Q: Can I change the theme colors?

**A:** Yes! Edit `src/styles/constants.ts`:
```typescript
export const COLORS = {
  primary: '#YOUR_COLOR',
  accent: '#YOUR_ACCENT',
}
```

All components use these constants, so changes apply everywhere.

---

### Q: How do I add more pages?

**A:** 
1. Create `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav link in `src/layouts/MainLayout/MainLayout.tsx`

```typescript
// App.tsx
const yourRoute = new Route({
  path: '/your-page',
  component: () => (
    <MainLayout>
      <YourPage />
    </MainLayout>
  ),
})

// MainLayout.tsx
<a href="/your-page">Your Page</a>
```

---

### Q: How do I update a project?

**A:**
```
1. Go to /admin/projects
2. Click "Edit" on a project
3. Update the form
4. Click "Update Project"
```

---

### Q: Can I restrict admin access to one email?

**A:** Check RLS policies in Supabase:
```sql
-- Only allow specific email
CREATE POLICY "Only admin"
  ON projects
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'your@email.com');
```

---

### Q: How do I backup my data?

**A:** Supabase has backups (Pro plan). Or:
```sql
-- Export all data
SELECT * FROM projects;
SELECT * FROM certificates;
SELECT * FROM status;
SELECT * FROM contacts;

-- Then save to CSV in Supabase dashboard
```

---

### Q: Can I self-host instead of Supabase?

**A:** Yes, but you'd need to:
1. Set up PostgreSQL database
2. Implement authentication
3. Build real-time subscriptions
4. Handle backups & security

Supabase handles all this for you (free tier available).

---

### Q: How do I add more fields to projects?

**A:**
1. In Supabase, edit `projects` table → Add column
2. Update `Project` interface in `src/api/supabase.ts`
3. Update form in `src/components/admin/ProjectForm/ProjectForm.tsx`
4. Update display in `src/components/portfolio/ProjectsGrid/ProjectsGrid.tsx`

Example:
```typescript
// 1. Database
ALTER TABLE projects ADD COLUMN tech_stack TEXT[];

// 2. Type
interface Project {
  // ... existing fields
  tech_stack?: string[]
}

// 3. Form
<Input
  label="Tech Stack"
  value={techStack.join(', ')}
  onChange={(e) => setTechStack(e.target.value.split(','))}
/>

// 4. Display
<div className={styles.tech}>
  {project.tech_stack?.map(tech => (
    <span key={tech}>{tech}</span>
  ))}
</div>
```

---

### Q: How do I add authentication for multiple users?

**A:** Current setup is single-admin. To allow multiple:

```sql
-- Create user_roles table
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role TEXT,  -- 'admin', 'contributor'
  PRIMARY KEY (user_id)
);

-- Update RLS policies
CREATE POLICY "Role-based access"
  ON projects
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles
      WHERE role IN ('admin', 'contributor')
    )
  );
```

---

### Q: Why is the site slow?

**A:** Check:
1. Image sizes (optimize before upload)
2. Network throttling (Chrome DevTools)
3. Database query performance
4. Caching headers (Vercel does this for you)

```typescript
// Verify TanStack Query caching works
const { data, isLoading, isFetching } = useProjects()
// isLoading = first load
// isFetching = background refetch
```

---

### Q: Can I use a different database?

**A:** Not easily. The code is built for Supabase's:
- PostgreSQL with RLS
- Real-time subscriptions
- Built-in Auth

You'd need to replace all `supabase` calls. Firebase is the closest alternative.

---

### Q: How do I monitor errors in production?

**A:** Add error tracking:

```typescript
// With Sentry
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "https://your-sentry-dsn",
})

// Or simple logging
const logError = async (error: Error) => {
  await supabase
    .from('error_logs')
    .insert([{
      message: error.message,
      stack: error.stack,
      url: window.location.href,
    }])
}
```

---

## 🆘 Still Stuck?

1. **Check browser console** (F12 → Console tab)
2. **Check Supabase logs** (Dashboard → Logs)
3. **Check network tab** (F12 → Network tab)
4. **Search error message** on Google/GitHub
5. **Ask on forums** (Stack Overflow, Supabase Discord)

---

**Most issues are:**
- Missing .env variables ✅ Solution: Restart `npm run dev`
- RLS policy issues ✅ Solution: Check SQL in Supabase
- CSS Module naming ✅ Solution: Must be `Component.module.css`
- Type errors ✅ Solution: Restart TypeScript server

**You've got this!** 🚀
