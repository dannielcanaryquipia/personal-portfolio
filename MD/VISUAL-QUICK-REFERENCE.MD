# Visual Quick Reference Guide

## 📍 Where To Find Things

### Configuration
```
portfolio-project/
├─ .env.local ................... Your Supabase credentials
├─ vite.config.ts ............... Build configuration
├─ tsconfig.json ................ TypeScript settings
└─ package.json ................. Dependencies & scripts
```

### Design System
```
src/styles/
├─ constants.ts ................. Colors, spacing, typography
└─ globals.css .................. Global styles & reset
```

### Source Code Structure
```
src/
├─ api/
│  ├─ supabase.ts .............. Client & types
│  └─ hooks.ts ................. TanStack Query hooks
│
├─ components/
│  ├─ ui/ ...................... Reusable components
│  │  ├─ Button/
│  │  └─ Input/
│  ├─ portfolio/ ............... Public components
│  │  ├─ StatusWidget/ ......... Real-time status
│  │  ├─ ProjectsGrid/ ........ Project gallery
│  │  └─ CertificatesGrid/ .... Certificate grid
│  └─ admin/ ................... Admin components
│     ├─ StatusManager/ ........ Status updater
│     └─ ProjectForm/ .......... Project editor
│
├─ hooks/
│  └─ useAuth.ts ............... Authentication & real-time
│
├─ layouts/
│  ├─ MainLayout/ .............. Public site wrapper
│  └─ AdminLayout/ ............. Dashboard wrapper
│
├─ pages/
│  ├─ Home.tsx ................. Landing page
│  ├─ Projects.tsx ............. Projects page
│  ├─ Certificates.tsx ......... Certificates page
│  ├─ Contact.tsx .............. Contact form
│  └─ admin/
│     ├─ Login.tsx ............. Admin login
│     ├─ Dashboard.tsx ......... Admin overview
│     ├─ Projects.tsx .......... Project manager
│     ├─ Certificates.tsx ...... Certificate manager
│     ├─ Status.tsx ............ Status manager
│     └─ Messages.tsx .......... Message inbox
│
├─ App.tsx ..................... Router & routes
└─ main.tsx .................... Entry point
```

---

## 🎨 Color Palette

```
Primary (Navy)
████████████████████████████████████████
#0A0E27

Accent (Orange)
████████████████████████████████████████
#FF6B35

Success (Green)
████████████████████████████████████████
#2ECC71

Warning (Yellow)
████████████████████████████████████████
#F39C12

Danger (Red)
████████████████████████████████████████
#E74C3C

Text (Light)
████████████████████████████████████████
#EEEEEE

Text Secondary
████████████████████████████████████████
#AAAAAA

Muted
████████████████████████████████████████
#666666
```

---

## 📐 Spacing Scale

```
xs  4px    ▪
sm  8px    ▪▪
md  16px   ▪▪▪▪
lg  24px   ▪▪▪▪▪▪
xl  32px   ▪▪▪▪▪▪▪▪

Usage:
padding: var(--spacing-md)    // 16px
gap: var(--spacing-lg)        // 24px
margin: var(--spacing-sm)     // 8px
```

---

## 📱 Breakpoints

```
Mobile    320px - 480px   📱
         ├─ Stack vertically
         ├─ Large touch targets
         └─ Single column

Tablet    481px - 768px   📱
         ├─ 2 column layouts
         ├─ Adjusted padding
         └─ Sidebar optional

Desktop   769px - 1024px  💻
         ├─ Full layout
         ├─ Multi-column
         └─ Sidebar visible

Large     1025px+         🖥️
         ├─ Wide layouts
         ├─ 3+ columns
         └─ Full features
```

---

## 🔄 Data Flow Diagram

```
Public Visitor
     ↓
[Home Page]
     ↓
    ├─→ [StatusWidget] ←→ Supabase Real-time
    ├─→ [ProjectsGrid] ←→ useProjects()
    └─→ [ContactForm] →→ useCreateContactMessage()
     
Admin
     ↓
[Admin Login] ←→ supabase.auth.signInWithPassword()
     ↓
[Dashboard]
     ├─→ [ProjectForm] → useCreateProject()
     ├─→ [StatusManager] ↔ Real-time subscription
     └─→ [Messages] ← useContactMessages()
```

---

## 🔐 Authentication States

```
Not Logged In
└─ Can: View projects, see status, send messages
└─ Cannot: Access /admin, manage content

Logged In (Admin)
└─ Can: Access /admin, create/edit/delete projects
└─ Can: Update status (real-time)
└─ Can: View all messages, mark as read

Session Stored
└─ Browser localStorage (auto-managed)
└─ Sent with every API request
└─ Expires after 24 hours (default)
```

---

## 🚀 Deployment Flow

```
Local Development
   ↓
npm run dev
   ↓
http://localhost:3000
   ↓
[Test everything]
   ↓
Git Push to GitHub
   ↓
Vercel/Netlify Auto-Deploy
   ↓
Build: npm run build
   ↓
Compress & Minify
   ↓
Upload to CDN
   ↓
HTTPS Enabled
   ↓
Your Domain
   ↓
Live! 🎉
```

---

## 📊 File Organization

```
Each Component Pattern:

Component/
├─ Component.tsx ............ React component
├─ Component.module.css ..... Styles (scoped)
└─ index.ts ................. Exports (optional)

Usage:
import { Component } from '@/components/path'
import styles from './Component.module.css'

<div className={styles.container}>
  <h1 className={styles.heading}>Title</h1>
</div>
```

---

## 🔧 Common Tasks

### Change Colors
```
1. Open: src/styles/constants.ts
2. Edit: COLORS object
3. Save
4. npm run dev (reload browser)
```

### Add New Page
```
1. Create: src/pages/NewPage.tsx
2. Export component
3. Add route in: src/App.tsx
4. Add link in: src/layouts/MainLayout/MainLayout.tsx
```

### Edit Home Page
```
1. Open: src/pages/Home.tsx
2. Modify text/content
3. Save
4. Browser auto-reloads
```

### Add Project via Admin
```
1. Login at: /admin/login
2. Go to: /admin/projects
3. Click: "New Project"
4. Fill form
5. Click: "Create Project"
6. View at: /projects
```

### Update Status
```
1. Login at: /admin/login
2. Go to: /admin/status
3. Choose preset or type custom
4. Click: "Update Status"
5. All visitors see it instantly! ⚡
```

---

## 🐛 Error Checklist

```
❌ "Cannot find module"
  → npm run dev (restart, not just F5)
  → Check import path
  → Verify file exists

❌ "Supabase connection failed"
  → Check .env.local exists
  → Verify VITE_SUPABASE_URL is correct
  → Verify VITE_SUPABASE_ANON_KEY is correct
  → Restart: npm run dev

❌ "Login not working"
  → Create user in Supabase Auth
  → Check email/password correct
  → Verify email is enabled in Auth

❌ "Status not updating real-time"
  → Check browser DevTools → Console
  → Verify RLS policies (see SETUP.md)
  → Test with admin account

❌ "Styles not applying"
  → Verify CSS Module filename: .module.css
  → Check className match: styles.name
  → Import styles: import styles from './File.module.css'

✅ Still stuck?
  → Check TROUBLESHOOTING.md
  → Check browser console (F12)
  → Check Supabase logs
```

---

## 🎯 Component Map

```
User Interface Layer
├─ Button [Reusable]
│  ├─ variant: primary, secondary, outline, ghost
│  └─ size: sm, md, lg
│
├─ Input [Reusable]
│  ├─ label
│  ├─ error
│  └─ helperText
│
└─ Textarea [Reusable]
   ├─ label
   ├─ error
   └─ helperText

Feature Components
├─ StatusWidget [Real-time updates]
│  ├─ Supabase subscription
│  ├─ Animated pulse
│  └─ Live status display
│
├─ ProjectsGrid [Gallery]
│  ├─ useProjects() hook
│  ├─ Card components
│  └─ Filter/sort ready
│
└─ CertificatesGrid [Masonry]
   ├─ useCertificates() hook
   ├─ Certificate items
   └─ Responsive layout

Admin Components
├─ ProjectForm [Add/Edit]
│  ├─ Form validation
│  ├─ File upload ready
│  └─ Submit handling
│
└─ StatusManager [Quick updates]
   ├─ Preset buttons
   ├─ Custom input
   └─ Real-time feedback
```

---

## 📋 Quick Checklist

```
Before Launch
- [ ] Supabase project created
- [ ] Database tables created (SQL from SETUP.md)
- [ ] .env.local configured
- [ ] Admin user created
- [ ] npm run dev works
- [ ] Can login at /admin/login
- [ ] Can create a project
- [ ] Status updates in real-time
- [ ] Contact form works
- [ ] Mobile design looks good
- [ ] Ready to deploy!

Deployment
- [ ] npm run build succeeds
- [ ] Connected to Vercel/Netlify
- [ ] Environment variables added
- [ ] Site deployed
- [ ] Custom domain (optional)
- [ ] HTTPS working
- [ ] All links work on live site
```

---

## 🎓 Learning Path

```
Day 1: Setup & Deploy
├─ Follow 🚀_START_HERE.md
├─ Get site running locally
└─ Deploy to Vercel

Day 2-3: Understand Code
├─ Read ARCHITECTURE.md
├─ Explore src/ folder
├─ Review component patterns
└─ Check CSS Modules usage

Day 4-5: Add Content
├─ Add projects via admin
├─ Add certificates
├─ Test real-time status
└─ Customize colors

Day 6+: Extend & Deploy
├─ Add more features (see ADVANCED_CUSTOMIZATION.md)
├─ Optimize for SEO
├─ Set up analytics
└─ Share your portfolio!
```

---

## 🎨 Design Tokens Reference

```
Typography
├─ Display Font: system-ui (bold)
├─ Body Font: system-ui (regular)
├─ Mono Font: 'Courier New' (code)
│
├─ Heading Sizes
│  ├─ h1: 3rem (48px)
│  ├─ h2: 2.25rem (36px)
│  ├─ h3: 1.875rem (30px)
│  └─ h4-h6: smaller
│
└─ Text Sizes
   ├─ Large: 1.25rem
   ├─ Base: 1rem
   ├─ Small: 0.875rem
   └─ Tiny: 0.75rem

Shadows
├─ sm: 0 2px 4px rgba(0,0,0,0.1)
├─ md: 0 4px 8px rgba(0,0,0,0.15)
├─ lg: 0 8px 16px rgba(0,0,0,0.2)
└─ xl: 0 12px 24px rgba(0,0,0,0.25)

Border Radius
├─ sm: 2px (subtle)
├─ md: 4px (standard)
├─ lg: 8px (prominent)
└─ full: 9999px (pill-shaped)

Transitions
├─ fast: 150ms ease-out
├─ base: 250ms ease-out
├─ slow: 350ms ease-out
└─ slowest: 500ms ease-out
```

---

## ✨ You're Ready!

This visual guide should help you navigate the project quickly.

**Bookmark these files:**
1. 🚀_START_HERE.md - Your entry point
2. TROUBLESHOOTING.md - When stuck
3. PROJECT_SUMMARY.md - Quick overview

**Happy building!** 🚀
