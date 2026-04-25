# System Architecture & Design Overview

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS (Visitors)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼──┐         ┌──▼────┐       ┌──▼────┐
    │ Home │         │Projects│      │Contact│
    └──────┘         └────────┘       └───────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
              ┌──────────▼──────────┐
              │  React + TypeScript  │
              │   (Frontend SPA)     │
              └──────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼──────┐    ┌───▼───┐     ┌─────▼──┐
    │TanStack  │    │Framer │     │CSS     │
    │Query     │    │Motion │     │Modules │
    │(Cache)   │    │(Anim) │     │(Style) │
    └───┬──────┘    └───────┘     └────────┘
        │
        │ HTTP/WebSocket
        │
    ┌───▼────────────────────────────────┐
    │      SUPABASE (Backend)             │
    ├────────────────────────────────────┤
    │ PostgreSQL Database                │
    │ ├─ projects table                  │
    │ ├─ certificates table              │
    │ ├─ status table (real-time)        │
    │ ├─ contacts table                  │
    │ └─ auth.users                      │
    │                                     │
    │ Real-time Subscriptions             │
    │ ├─ Status updates                  │
    │ ├─ Project changes                 │
    │ └─ New messages                    │
    │                                     │
    │ Auth (Email/Password)               │
    │ ├─ Admin login                     │
    │ └─ Session management              │
    │                                     │
    │ Row Level Security (RLS)            │
    │ ├─ Public read                     │
    │ ├─ Authenticated write             │
    │ └─ Data isolation                  │
    └────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

### Creating a Project (Admin)
```
Admin Form Input
    │
    ▼
ProjectForm Component
    │
    ├─ Validates input
    │ (title, description, tags, URLs)
    │
    ▼
useCreateProject Hook
    │
    ├─ TanStack Query mutation
    │
    ▼
Supabase Client
    │
    ├─ INSERT into projects table
    │ (with auth check)
    │
    ▼
PostgreSQL Database
    │
    ├─ RLS policy check
    │ (only authenticated user)
    │
    ├─ Insert row
    │
    ▼
Query Invalidation
    │
    ├─ Clear useProjects cache
    │
    ▼
Automatic Refetch
    │
    ├─ useProjects hook runs
    │
    ▼
UI Updates
    │
    └─ Projects list shows new item
      (no manual page refresh needed)
```

### Real-time Status Update
```
Admin Dashboard
    │
    ├─ Updates status via StatusManager
    │
    ▼
useUpdateStatus Mutation
    │
    ├─ Upserts status row
    │
    ▼
PostgreSQL Triggers Event
    │
    └─ "postgres_changes" event emitted
    
    ┌────────────────────────────────┐
    │ ALL CONNECTED CLIENTS           │
    ├────────────────────────────────┤
    │                                 │
    │ Home Page (Tab 1)              │
    │ ├─ Subscription listening      │
    │ ├─ Receives change event       │
    │ ├─ setStatus() called          │
    │ └─ StatusWidget re-renders     │
    │                                 │
    │ Projects Page (Tab 2)          │
    │ ├─ Also subscribed             │
    │ ├─ Receives change event       │
    │ ├─ setStatus() called          │
    │ └─ StatusWidget re-renders     │
    │                                 │
    │ Public Visitor (Browser)       │
    │ ├─ Also subscribed             │
    │ ├─ Receives change event       │
    │ └─ StatusWidget updates        │
    │    (NO refresh needed)          │
    │                                 │
    └────────────────────────────────┘
```

### Fetching Projects (Public)
```
User navigates to /projects
    │
    ▼
ProjectsGrid Component mounts
    │
    ├─ Calls useProjects() hook
    │
    ▼
TanStack Query checks cache
    │
    ├─ Is data cached? (< 5 mins old)
    │ ├─ YES → Return cached data
    │ │      (instant, no API call)
    │ │
    │ └─ NO → Fetch from Supabase
    │
    ▼
Supabase SELECT query
    │
    ├─ SELECT * FROM projects
    ├─ WHERE (RLS allows public read)
    ├─ ORDER BY created_at DESC
    │
    ▼
PostgreSQL executes
    │
    ├─ Applies RLS policy
    │ (public can read all)
    │
    ├─ Returns results
    │
    ▼
TanStack Query caches result
    │
    ├─ Stores in memory
    ├─ Sets 5 minute expiry
    ├─ Enables background refetch
    │
    ▼
Component receives data
    │
    ├─ Re-renders with projects
    ├─ Maps to ProjectCard components
    ├─ Applies CSS styles
    │
    ▼
Framer Motion animates entry
    │
    └─ Staggered fade-in effect
```

## 🏛️ Component Hierarchy

```
App (Router Setup)
│
├─ MainLayout (Public Site)
│  │
│  ├─ Header
│  │  ├─ Branding
│  │  ├─ Navigation
│  │  └─ Links
│  │
│  ├─ Main Content
│  │  ├─ StatusWidget (Real-time)
│  │  │  ├─ Supabase subscription
│  │  │  ├─ Pulse animation
│  │  │  └─ Live status text
│  │  │
│  │  └─ Page Component
│  │     ├─ Home
│  │     │  ├─ Hero section
│  │     │  ├─ Features grid
│  │     │  └─ Stats cards
│  │     │
│  │     ├─ Projects
│  │     │  └─ ProjectsGrid
│  │     │     ├─ useProjects hook
│  │     │     ├─ TanStack Query
│  │     │     └─ ProjectCard components
│  │     │
│  │     ├─ Certificates
│  │     │  └─ CertificatesGrid
│  │     │     ├─ useCertificates hook
│  │     │     └─ CertificateItem components
│  │     │
│  │     └─ Contact
│  │        ├─ ContactForm
│  │        ├─ Input + Textarea components
│  │        ├─ useCreateContactMessage hook
│  │        └─ Success/error states
│  │
│  └─ Footer
│     ├─ Copyright
│     └─ Social links
│
└─ AdminLayout (Protected Dashboard)
   │
   ├─ Sidebar Navigation
   │  ├─ Dashboard link
   │  ├─ Projects link
   │  ├─ Certificates link
   │  ├─ Status link
   │  ├─ Messages link
   │  └─ Logout button
   │
   ├─ Topbar
   │  ├─ Menu toggle (mobile)
   │  └─ User email display
   │
   └─ Main Content
      ├─ Dashboard
      │  ├─ Stats cards
      │  ├─ Quick actions
      │  └─ Recent messages preview
      │
      ├─ Projects Manager
      │  ├─ ProjectForm component
      │  │  ├─ Input fields
      │  │  ├─ useCreateProject hook
      │  │  └─ useUpdateProject hook
      │  │
      │  └─ ProjectList
      │     ├─ Map over projects
      │     ├─ Show edit/delete buttons
      │     └─ useDeleteProject hook
      │
      ├─ Certificates Manager
      │  ├─ Certificate form
      │  ├─ useCertificates hook
      │  └─ useCreateCertificate hook
      │
      ├─ Status Manager
      │  ├─ StatusManager component
      │  ├─ Quick presets
      │  ├─ useStatus hook
      │  └─ useUpdateStatus hook (real-time)
      │
      └─ Messages
         ├─ Message list
         ├─ useContactMessages hook
         ├─ useMarkMessageAsRead hook
         └─ Email reply links
```

## 🔐 Authentication & Authorization Flow

```
User visits /admin/login
    │
    ▼
AdminLogin page renders
    │
    ├─ Form with email + password
    │
    ▼
User submits credentials
    │
    ▼
supabase.auth.signInWithPassword()
    │
    ├─ Sends to Supabase Auth API
    │
    ▼
Supabase Auth verifies
    │
    ├─ Checks auth.users table
    ├─ Bcrypt password verification
    ├─ Creates session token (JWT)
    │
    ▼
Session stored in browser
    │
    ├─ localStorage (Supabase default)
    ├─ Sent in API headers
    │
    ▼
Navigation to /admin
    │
    ▼
AdminLayout checks session
    │
    ├─ useAuth() hook
    ├─ supabase.auth.getSession()
    │
    ├─ Session exists?
    │ ├─ YES → Render admin content
    │ └─ NO → Redirect to /admin/login
    │
    ▼
All API calls include session
    │
    ├─ Supabase RLS policies check
    ├─ "auth.role() = 'authenticated'"
    │
    ├─ Can INSERT/UPDATE/DELETE?
    │ ├─ YES → Allow operation
    │ └─ NO → Deny access
    │
    ▼
Logout
    │
    ├─ supabase.auth.signOut()
    ├─ Session cleared
    ├─ Redirect to /admin/login
```

## 🗄️ Database Schema & Relationships

```
┌──────────────────────────────┐
│      projects                 │
├──────────────────────────────┤
│ id (UUID, PK)                │
│ title (TEXT, NOT NULL)       │
│ description (TEXT)           │
│ tags (TEXT[])                │
│ github_url (TEXT)            │
│ demo_url (TEXT)              │
│ image_url (TEXT)             │
│ created_at (TIMESTAMP)       │
│ updated_at (TIMESTAMP)       │
└──────────────────────────────┘

┌──────────────────────────────┐
│   certificates                │
├──────────────────────────────┤
│ id (UUID, PK)                │
│ name (TEXT, NOT NULL)        │
│ issuer (TEXT, NOT NULL)      │
│ image_url (TEXT)             │
│ issued_date (DATE)           │
│ credential_url (TEXT)        │
│ created_at (TIMESTAMP)       │
└──────────────────────────────┘

┌──────────────────────────────┐
│      status                   │
├──────────────────────────────┤
│ id (INTEGER, PK, =1)         │
│ current_status (TEXT)        │
│ updated_at (TIMESTAMP)       │
└──────────────────────────────┘
│ (Only 1 row - singleton table)

┌──────────────────────────────┐
│     contacts                  │
├──────────────────────────────┤
│ id (UUID, PK)                │
│ name (TEXT, NOT NULL)        │
│ email (TEXT, NOT NULL)       │
│ message (TEXT, NOT NULL)     │
│ status ('unread'|'read')     │
│ created_at (TIMESTAMP)       │
└──────────────────────────────┘

┌──────────────────────────────┐
│   auth.users (Supabase)       │
├──────────────────────────────┤
│ id (UUID, PK)                │
│ email (TEXT, UNIQUE)         │
│ encrypted_password (TEXT)    │
│ created_at (TIMESTAMP)       │
│ last_sign_in_at (TIMESTAMP) │
└──────────────────────────────┘
```

## 🔒 Row Level Security (RLS) Policies

```
Projects Table:
├─ SELECT (Public Read)
│  └─ true (everyone can read)
│
└─ INSERT/UPDATE/DELETE (Authenticated Write)
   └─ auth.role() = 'authenticated'
      (only logged-in admins)

Certificates Table:
├─ SELECT (Public Read)
│  └─ true (everyone can read)
│
└─ INSERT/UPDATE/DELETE (Authenticated Write)
   └─ auth.role() = 'authenticated'

Status Table:
├─ SELECT (Public Read)
│  └─ true (everyone can read)
│     (status widget on public site)
│
└─ INSERT/UPDATE/DELETE (Authenticated Write)
   └─ auth.role() = 'authenticated'
      (only admin can update)

Contacts Table:
├─ INSERT (Public Submit)
│  └─ true (visitors can submit forms)
│
├─ SELECT (Authenticated Read)
│  └─ auth.role() = 'authenticated'
│     (only admin sees messages)
│
└─ UPDATE (Authenticated Update)
   └─ auth.role() = 'authenticated'
      (admin marks as read)
```

## 📡 Real-time Subscription Flow

```
Component mounts (e.g., StatusWidget)
    │
    ▼
useRealtimeStatus() hook
    │
    ├─ useEffect runs
    │
    ▼
supabase.channel('status-updates')
    │
    ├─ Creates WebSocket channel
    │
    ▼
.on('postgres_changes', {...})
    │
    ├─ Subscribes to:
    │ ├─ schema: 'public'
    │ ├─ table: 'status'
    │ └─ event: '*' (ALL events)
    │
    ▼
.subscribe()
    │
    ├─ Establishes connection
    ├─ Waits for changes
    │
    ▼
[Admin updates status in /admin/status]
    │
    ├─ Calls useUpdateStatus()
    ├─ Supabase INSERT/UPDATE to status table
    │
    ▼
PostgreSQL emits change event
    │
    ├─ Event type: INSERT/UPDATE
    ├─ Contains new row data
    │
    ▼
Realtime Server broadcasts
    │
    ├─ To ALL subscribed clients
    ├─ Over WebSocket
    │
    ▼
[ALL TABS/BROWSERS receive event]
    │
    ├─ .on() callback fires
    ├─ Payload: { new: {...}, old: {...} }
    │
    ▼
setStatus(payload.new)
    │
    ├─ React state updates
    │
    ▼
Component re-renders
    │
    ├─ StatusWidget updates instantly
    ├─ Animation plays
    ├─ No page refresh
    │
    ▼
User sees live change
    │
    └─ Across all their devices
```

## 🚀 Deployment Architecture

```
Local Development
├─ npm run dev
├─ Vite dev server (hot reload)
├─ Localhost:3000
└─ Connected to Supabase

Production Build
├─ npm run build
├─ Creates optimized dist/
├─ Tree-shaken, minified, chunked
└─ Ready for any host

Vercel Deployment
├─ Git push to GitHub
├─ Vercel auto-detects build
├─ npm run build → dist/
├─ Uploads to Vercel CDN
├─ Automatic HTTPS
├─ Serverless functions (if needed)
└─ Custom domain ready

Environment Separation
├─ Development
│  ├─ .env.local (git ignored)
│  └─ Local Supabase project
│
└─ Production
   ├─ .env (Vercel dashboard)
   ├─ Production Supabase project
   └─ Different API keys
```

## 🔄 Request/Response Cycle

### Fetching Projects (Public)
```
Browser Request
    │
    ├─ GET /projects
    │
    ▼
Vite Server / Vercel
    │
    ├─ Serves dist/index.html
    ├─ Script loads React app
    ├─ Router matches /projects
    │
    ▼
ProjectsGrid Component
    │
    ├─ useProjects() hook called
    │
    ▼
TanStack Query
    │
    ├─ Check cache (projects key)
    │ ├─ Found & fresh?
    │ │  └─ Return cached data (instant)
    │ │
    │ └─ Not found or stale?
    │    └─ Make API request
    │
    ▼
Supabase HTTP Request
    │
    ├─ POST https://xxx.supabase.co/rest/v1/projects
    ├─ Headers: apikey=anon-key
    ├─ Query: select=*
    │
    ▼
PostgreSQL
    │
    ├─ Apply RLS: public can read
    ├─ Execute query
    ├─ Return rows
    │
    ▼
Supabase HTTP Response
    │
    ├─ Status: 200
    ├─ Body: JSON array of projects
    │
    ▼
TanStack Query
    │
    ├─ Parse JSON
    ├─ Cache response
    ├─ Set stale timer (5 mins)
    │
    ▼
Component State Update
    │
    ├─ setData(projectsArray)
    │
    ▼
React Re-render
    │
    ├─ ProjectCard components map
    ├─ CSS Modules applied
    ├─ Framer Motion animations trigger
    │
    ▼
Browser Displays
    │
    └─ User sees projects
```

## 🎯 State Management Strategy

```
Global State (Minimal)
├─ TanStack Query cache
│  ├─ Projects list
│  ├─ Certificates list
│  ├─ Status
│  ├─ Messages
│  └─ Auto-manages fetching
│
└─ Supabase Auth session
   ├─ User object
   ├─ Session token
   └─ Auto-managed

Component State (Local)
├─ Form inputs (email, message, etc)
├─ UI state (modal open/close)
├─ Loading states
└─ Error messages

Benefits:
✅ Minimal prop drilling
✅ Automatic cache invalidation
✅ Background refetch
✅ Optimistic updates
✅ Real-time subscriptions
✅ No Redux/Context boilerplate
```

This architecture ensures:
- **Type Safety**: TypeScript everywhere
- **Performance**: Caching, lazy loading, code splitting
- **Real-time**: Supabase subscriptions
- **Security**: RLS policies, no exposing secrets
- **Scalability**: Separation of concerns, modular design
- **Developer Experience**: TanStack Query, simple hooks API