# Danniel Canary's Portfolio Website

A **production-grade, full-stack portfolio** built with React 19, TypeScript, Supabase, and CSS Modules. Features a dark industrial theme with real-time updates, admin dashboard, and dynamic content management.

---

## Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Dependencies](#-dependencies)
4. [Architecture](#-architecture)
5. [Design System](#-design-system)
6. [Project Structure](#-project-structure)
7. [Database Schema](#-database-schema)
8. [Hooks & APIs](#-hooks--apis)
9. [Components](#-components)
10. [Getting Started (Clone Setup)](#-getting-started-clone-setup)
11. [Pages & Routes](#-pages--routes)
12. [Implementation Details](#-implementation-details)
13. [Security](#-security)
14. [Deployment](#-deployment)
15. [Design Enhancements](#-design-enhancements)
16. [Documentation](#-documentation)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Real-time Status Updates** | Status widget updates instantly across all visitors via WebSocket |
| **Admin Dashboard** | Manage projects, certificates, features, stats, and messages without coding |
| **Contact Form** | Visitors can send messages directly from the site (stored in database) |
| **File Upload** | Upload project images and certificate files to Supabase Storage |
| **Dynamic Content** | Features, stats, and site settings loaded from database |
| **Theme Toggle** | Dark/light mode with system preference detection |
| **Responsive Design** | Mobile-first, works on all devices (320px - 1280px+) |
| **Dark/Industrial Theme** | Professional aesthetic with navy (#0A0E27) and orange (#FF6B35) |
| **Type-Safe** | 100% TypeScript with strict typing |
| **SEO Optimized** | Meta tags, semantic HTML, accessible components |

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19.2.4 | UI library with concurrent features |
| **Language** | TypeScript 6.0.2 | Type-safe development |
| **Build Tool** | Vite 8.0.4 | Fast development and optimized builds |
| **Styling** | CSS Modules | Scoped styles, no conflicts |
| **Design Tokens** | constants.ts | Centralized colors, spacing, typography |
| **Routing** | React Router DOM 7.14.1 | Client-side navigation |
| **Data Fetching** | TanStack Query 5.99.1 | Caching, background refetch, mutations |
| **Backend** | Supabase | PostgreSQL, Auth, Storage, Real-time |
| **Animations** | Framer Motion 12.38.0 | Smooth page transitions |
| **Icons** | Lucide React 0.460.0 | Consistent icon system |

---

## 📦 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.4 | Core React library |
| `react-dom` | ^19.2.4 | React DOM renderer |
| `react-router-dom` | ^7.14.1 | Client-side routing |
| `@supabase/supabase-js` | ^2.103.3 | Supabase client for database, auth, storage |
| `@tanstack/react-query` | ^5.99.1 | Data fetching, caching, state management |
| `@tanstack/react-router` | ^1.168.23 | Type-safe routing (future use) |
| `framer-motion` | ^12.38.0 | Animations and transitions |
| `lucide-react` | ^0.460.0 | Icon library |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ~6.0.2 | TypeScript compiler |
| `vite` | ^8.0.4 | Build tool and dev server |
| `@vitejs/plugin-react` | ^6.0.1 | Vite React plugin |
| `eslint` | ^9.39.4 | Linting |
| `@eslint/js` | ^9.39.4 | ESLint JavaScript plugin |
| `typescript-eslint` | ^8.58.0 | ESLint TypeScript plugin |
| `eslint-plugin-react-hooks` | ^7.0.1 | ESLint React Hooks rules |
| `eslint-plugin-react-refresh` | ^0.5.2 | ESLint React Refresh rules |
| `@babel/core` | ^7.29.0 | Babel compiler core |
| `@rolldown/plugin-babel` | ^0.2.2 | Babel plugin for Rolldown |
| `babel-plugin-react-compiler` | ^1.0.0 | React compiler Babel plugin |
| `@types/node` | ^24.12.2 | Node.js type definitions |
| `@types/react` | ^19.2.14 | React type definitions |
| `@types/react-dom` | ^19.2.3 | React DOM type definitions |
| `@types/babel__core` | ^7.20.5 | Babel core type definitions |
| `globals` | ^17.4.0 | Global variable definitions |

---

## 🏛️ Architecture

### High-Level Architecture

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
    │ ├─ features table                  │
    │ ├─ stats table                     │
    │ ├─ status table (real-time)        │
    │ ├─ contact_messages table          │
    │ ├─ site_settings table             │
    │ └─ auth.users                      │
    │                                     │
    │ Real-time Subscriptions             │
    │ ├─ Status updates                  │
    │ ├─ Project changes                 │
    │ └─ New messages                    │
    │                                     │
    │ Supabase Storage                    │
    │ ├─ project-images bucket           │
    │ └─ certificates bucket             │
    └────────────────────────────────────┘
```

---

## 🎨 Design System

### Colors (`src/styles/constants.ts`)

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#0A0E27` | Deep navy - main background |
| `primaryLight` | `#141B3D` | Lighter navy - cards, elevated surfaces |
| `primaryDark` | `#050814` | Darker navy - shadows, depth |
| `accent` | `#FF6B35` | Precision orange - CTAs, highlights |
| `accentHover` | `#E85A2A` | Darker orange - hover states |
| `success` | `#2ECC71` | Green - success messages |
| `warning` | `#F39C12` | Yellow - warnings |
| `danger` | `#E74C3C` | Red - errors, destructive actions |
| `info` | `#3498DB` | Blue - informational |
| `text` | `#EEEEEE` | Light gray - primary text |
| `textSecondary` | `#AAAAAA` | Medium gray - secondary text |
| `textMuted` | `#666666` | Dark gray - muted text |
| `textInverse` | `#0A0E27` | Navy - text on light backgrounds |

### CSS Variables (`src/index.css`)

```css
/* Light mode (default) */
--text: #6b6375;
--text-h: #08060d;
--bg: #fff;
--border: #e5e4e7;
--code-bg: #f4f3ec;
--accent: #aa3bff;
--accent-bg: rgba(170, 59, 255, 0.1);
--accent-border: rgba(170, 59, 255, 0.5);

/* Dark mode */
--text: #9ca3af;
--text-h: #f3f4f6;
--bg: #16171d;
--border: #2e303a;
--code-bg: #1f2028;
--accent: #c084fc;
```

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `fontFamily` | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Body text |
| `mono` | `'Courier New', Courier, monospace` | Code, technical text |
| `sizes.xs` | `0.75rem` (12px) | Captions, labels |
| `sizes.sm` | `0.875rem` (14px) | Small text |
| `sizes.base` | `1rem` (16px) | Body text |
| `sizes.lg` | `1.125rem` (18px) | Lead paragraphs |
| `sizes.xl` | `1.25rem` (20px) | Subheadings |
| `sizes.2xl` | `1.5rem` (24px) | H3 headings |
| `sizes.3xl` | `2rem` (32px) | H2 headings |
| `sizes.4xl` | `2.5rem` (40px) | H1 headings |
| `weights.normal` | `400` | Body text |
| `weights.medium` | `500` | Emphasis |
| `weights.semibold` | `600` | Subheadings |
| `weights.bold` | `700` | Headings |

### Spacing Scale

| Token | Value | Pixels |
|-------|-------|--------|
| `xs` | `4px` | 4px |
| `sm` | `8px` | 8px |
| `md` | `16px` | 16px |
| `lg` | `24px` | 24px |
| `xl` | `32px` | 32px |
| `2xl` | `48px` | 48px |
| `3xl` | `64px` | 64px |

### Shadows

| Token | Value |
|-------|-------|
| `sm` | `0 2px 4px rgba(0,0,0,0.1)` |
| `md` | `0 4px 8px rgba(0,0,0,0.15)` |
| `lg` | `0 8px 16px rgba(0,0,0,0.2)` |
| `xl` | `0 12px 24px rgba(0,0,0,0.25)` |
| `glow` | `0 0 20px rgba(255,107,53,0.3)` (orange glow) |

### Border Radius

| Token | Value |
|-------|-------|
| `sm` | `2px` |
| `md` | `4px` |
| `lg` | `8px` |
| `xl` | `16px` |
| `full` | `9999px` (pills) |

### Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | 320px - 480px | Single column, stacked layout |
| Tablet | 481px - 768px | 2 columns, adjusted padding |
| Desktop | 769px - 1024px | Full layout, multi-column |
| Large | 1025px+ | Wide layouts, 3+ columns |

---

## 📦 Project Structure

```
portfolio/
├── MD/                              # Documentation folder
│   ├── INDEX.md                     # Master documentation index
│   ├── ARCHITECTURE.md              # System architecture deep dive
│   ├── ADVANCED-CUSTOMIZATION.md    # Extension guide
│   ├── TROUBLESHOOTING.md           # Common issues & solutions
│   ├── VISUAL-QUICK-REFERENCE.md    # Visual reference guide
│   ├── PROJECT-SUMMARY.md           # Project overview
│   └── DELIVERY-SUMMARY.md          # Delivery summary
│
├── src/
│   ├── api/
│   │   ├── supabase.ts              # Supabase client & types
│   │   └── hooks.ts                 # TanStack Query hooks
│   │
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Badge/               # Status badges
│   │   │   ├── Button/              # Action buttons
│   │   │   ├── Card/                # Content cards
│   │   │   ├── Input/               # Form inputs
│   │   │   ├── Navbar/              # Responsive navigation with mobile drawer
│   │   │   ├── StatCard/            # Statistics display
│   │   │   ├── ThemeToggle/         # Dark/light mode toggle
│   │   │   ├── CertificatePreview/  # PDF/Image preview
│   │   │   └── PdfViewer/           # PDF viewer component
│   │   │
│   │   ├── portfolio/               # Public-facing components
│   │   └── admin/                   # Admin dashboard components
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx         # Theme management
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication hook
│   │   └── useRealtime.ts           # Real-time subscriptions
│   │
│   ├── layouts/
│   │   ├── MainLayout/              # Public site layout
│   │   │   ├── MainLayout.tsx
│   │   │   └── MainLayout.module.css
│   │   └── AdminLayout/             # Admin dashboard layout
│   │       ├── AdminLayout.tsx
│   │       └── AdminLayout.module.css
│   │
│   ├── pages/
│   │   ├── Home.tsx                  # Landing page with hero, features, stats
│   │   ├── Home.module.css
│   │   ├── Projects.tsx              # Projects gallery
│   │   ├── Projects.module.css
│   │   ├── Certificates.tsx          # Certificates display
│   │   ├── Certificates.module.css
│   │   ├── Contact.tsx               # Contact form
│   │   ├── Contact.module.css
│   │   └── admin/                    # Admin pages
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Projects.tsx
│   │       ├── Certificates.tsx
│   │       ├── Status.tsx
│   │       ├── Messages.tsx
│   │       ├── Settings.tsx
│   │       └── Features.tsx
│   │
│   ├── styles/
│   │   ├── constants.ts              # Design tokens
│   │   └── globals.css               # Global styles
│   │
│   ├── App.tsx                       # Router setup
│   ├── App.css
│   ├── index.css                     # CSS variables & reset
│   └── main.tsx                      # Entry point
│
├── public/
│   ├── certificates/                 # Certificate files
│   ├── profile-pic/
│   │   └── profile.jpg
│   ├── favicon.svg
│   └── icons.svg
│
├── supabase/
│   ├── schema.sql                    # Database schema
│   ├── storage-setup.sql             # Storage bucket setup
│   └── storage-troubleshoot.sql      # Storage troubleshooting
│
├── .env.example                      # Environment template
├── .env.local                        # Local environment (git-ignored)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md                         # This file
```

---

## 🗄️ Database Schema

### Tables

#### `projects`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `title` | TEXT | Project name |
| `description` | TEXT | Project description |
| `image_url` | TEXT | Project image URL |
| `tags` | TEXT[] | Array of technology tags |
| `github_url` | TEXT | GitHub repository link |
| `live_url` | TEXT | Live demo link |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `certificates`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `title` | TEXT | Certificate name |
| `issuer` | TEXT | Issuing organization |
| `issue_date` | DATE | Date issued |
| `expiry_date` | DATE | Expiration date |
| `file_url` | TEXT | Certificate file URL |
| `file_type` | TEXT | File type (pdf, jpg, etc.) |
| `description` | TEXT | Certificate description |
| `created_at` | TIMESTAMP | Creation timestamp |

#### `features`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `title` | TEXT | Feature title |
| `description` | TEXT | Feature description |
| `icon` | TEXT | Lucide icon name (Wrench, Code2, Database, etc.) |
| `display_order` | INTEGER | Sort order |
| `is_active` | BOOLEAN | Visible on site |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `stats`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `key` | TEXT (unique) | Stat identifier |
| `label` | TEXT | Display label |
| `value` | TEXT | Stat value |
| `display_order` | INTEGER | Sort order |
| `is_active` | BOOLEAN | Visible on site |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `status`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `label` | TEXT | Status text (e.g., "Available for work") |
| `emoji` | TEXT | Status emoji |
| `color` | TEXT | Badge color (success, warning, danger, info, default) |
| `is_active` | BOOLEAN | Currently displayed |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `contact_messages`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `name` | TEXT | Sender name |
| `email` | TEXT | Sender email |
| `message` | TEXT | Message content |
| `is_read` | BOOLEAN | Read status |
| `created_at` | TIMESTAMP | Creation timestamp |

#### `site_settings`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique identifier |
| `key` | TEXT (unique) | Setting key |
| `value` | TEXT | Setting value |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Storage Buckets

| Bucket | Purpose | Public Access |
|--------|---------|---------------|
| `project-images` | Project screenshots/thumbnails | Yes |
| `certificates` | Certificate files (PDF, JPG) | Yes |
| `profile-pictures` | Profile images | Yes |

### Row Level Security (RLS)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `projects` | Public | Authenticated | Authenticated | Authenticated |
| `certificates` | Public | Authenticated | Authenticated | Authenticated |
| `features` | Public | Authenticated | Authenticated | Authenticated |
| `stats` | Public | Authenticated | Authenticated | Authenticated |
| `status` | Public | Authenticated | Authenticated | Authenticated |
| `contact_messages` | Authenticated | Public | Authenticated | Authenticated |
| `site_settings` | Public | Authenticated | Authenticated | Authenticated |

---

## 🎣 Hooks & APIs

### Custom Hooks

#### `useAuth()` (`src/hooks/useAuth.ts`)
Manages authentication state and operations.

```typescript
interface UseAuthReturn {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
```

#### `useRealtimeStatus()` (`src/hooks/useRealtime.ts`)
Subscribes to real-time status updates.

#### `useRealtimeProjects()`
Subscribes to project changes.

#### `useRealtimeCertificates()`
Subscribes to certificate changes.

### TanStack Query Hooks (`src/api/hooks.ts`)

#### Projects
| Hook | Purpose |
|------|---------|
| `useProjects()` | Fetch all projects |
| `useCreateProject()` | Create new project |
| `useUpdateProject()` | Update existing project |
| `useDeleteProject()` | Delete project |

#### Certificates
| Hook | Purpose |
|------|---------|
| `useCertificates()` | Fetch all certificates |
| `useCreateCertificate()` | Add new certificate |
| `useUpdateCertificate()` | Update certificate |
| `useDeleteCertificate()` | Remove certificate |

#### Features
| Hook | Purpose |
|------|---------|
| `useFeatures()` | Fetch active features (public) |
| `useAllFeatures()` | Fetch all features (admin) |
| `useCreateFeature()` | Create feature |
| `useUpdateFeature()` | Update feature |
| `useDeleteFeature()` | Delete feature |

#### Stats
| Hook | Purpose |
|------|---------|
| `useStats()` | Fetch active stats |
| `useAllStats()` | Fetch all stats (admin) |
| `useUpdateStat()` | Update stat value |
| `useDeleteStat()` | Remove stat |

#### Status
| Hook | Purpose |
|------|---------|
| `useStatus()` | Get current status |
| `useUpdateStatus()` | Update status (with upsert) |

#### Contact Messages
| Hook | Purpose |
|------|---------|
| `useContactMessages()` | Fetch all messages (admin) |
| `useCreateContactMessage()` | Submit contact form (public) |
| `useMarkMessageAsRead()` | Mark message as read |

#### Site Settings
| Hook | Purpose |
|------|---------|
| `useSiteSettings()` | Get all settings |
| `useUpdateSiteSetting()` | Update setting (upsert) |

#### File Upload
| Hook | Purpose |
|------|---------|
| `useUploadFile()` | Upload to Supabase Storage |
| `useDeleteFile()` | Remove file from storage |

---

## 🧩 Components

### UI Components (`src/components/ui/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Badge` | `variant`, `children` | Status indicator with color variants |
| `Button` | `variant`, `size`, `onClick` | Action button with variants |
| `Card` | `hover`, `children` | Content container with hover effect |
| `Input` | `label`, `error`, `helperText` | Form text input |
| `Navbar` | `siteName`, `navItems?` | Responsive navigation with mobile drawer |
| `StatCard` | `value`, `label` | Statistics display card |
| `ThemeToggle` | `size`, `variant` | Dark/light mode switcher |
| `CertificatePreview` | `url`, `type` | PDF/image preview modal |
| `PdfViewer` | `url` | PDF rendering component |

### Navbar Component (`src/components/ui/Navbar/`)

A reusable, responsive navigation component with mobile hamburger menu.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `siteName` | `string` | Yes | Brand/logo text |
| `navItems` | `NavItem[]` | No | Custom nav items (defaults to Home, Projects, Certificates, Contact) |

**Features:**
- Desktop: Horizontal navigation with animated underline indicators
- Mobile/Tablet (≤768px): Hamburger menu with slide-in drawer from right
- Auto-closes on route change, window resize, or overlay click
- Prevents body scroll when mobile menu is open
- Accessible with ARIA attributes (`aria-label`, `aria-expanded`, `aria-hidden`)
- Performance optimized with `React.memo` to prevent unnecessary re-renders

**Usage:**
```tsx
import { Navbar } from '@/components/ui/Navbar/Navbar';

// Default navigation
<Navbar siteName="My Portfolio" />

// Custom navigation items
<Navbar 
  siteName="My Portfolio"
  navItems={[
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]}
/>
```

### Available Icons (Lucide)

Mapped in `Home.tsx` for features:
- `Wrench` - Mechanical/Engineering
- `Code2` - Development/Coding
- `Database` - Data/Storage
- `Sparkles` - AI/Magic
- `Globe` - Web/Global
- `Zap` - Speed/Performance

---

## 🚀 Getting Started (Clone Setup)

Follow these steps to set up the project after cloning from GitHub.

### Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |
| Git | Any recent | `git --version` |

### Step 1: Clone the Repository

```bash
# Clone using HTTPS
git clone https://github.com/YOUR_USERNAME/portfolio.git

# Or clone using SSH
git clone git@github.com:YOUR_USERNAME/portfolio.git

# Navigate into the project directory
cd portfolio
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (production + dev)
npm install

# This installs:
# - React 19, React DOM, React Router
# - Supabase client
# - TanStack Query
# - Framer Motion
# - Lucide React icons
# - TypeScript, Vite, ESLint (dev dependencies)
```

**Expected output:**
```
added 245 packages, and audited 246 packages in 15s
```

### Step 3: Set Up Supabase (Required for Full Functionality)

#### 3.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub or email
3. Create a new organization (if needed)

#### 3.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. Enter project name: `portfolio`
4. Set database password (save this!)
5. Choose region closest to you
6. Click "Create New Project"

Wait ~2 minutes for the project to initialize.

#### 3.3 Get API Credentials
1. In your project dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...` (starts with `eyJ`)

⚠️ **Important**: Use the `anon public` key, NOT the `service_role` key.

#### 3.4 Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run**

This creates tables: `projects`, `certificates`, `features`, `stats`, `status`, `contact_messages`, `site_settings`

#### 3.5 Create Storage Buckets

1. Go to **Storage** in the sidebar
2. Click **New Bucket**
3. Create these buckets (make them public):
   - `project-images` - For project screenshots
   - `certificates` - For certificate files
   - `profile-pictures` - For profile images

Or run the SQL from `supabase/storage-setup.sql` in the SQL Editor.

#### 3.6 Set Up Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Go to **Users**
4. Click **Add User** → **Create New User**
5. Enter your email and password (this will be your admin login)

### Step 4: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Open in your editor
# On Windows:
notepad .env.local

# On Mac/Linux:
nano .env.local
# or
code .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
# Get these from: Project Settings → API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8...
```

**⚠️ Security Note:** 
- `.env.local` is git-ignored and will NOT be committed
- Never share these credentials or commit them to GitHub
- The `.env.example` file shows the format without real values

### Step 5: Start Development Server

```bash
# Start the Vite development server
npm run dev
```

**Expected output:**
```
  VITE v8.0.4  ready in 312 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open your browser and visit: `http://localhost:5173`

### Step 6: Verify Setup

#### Check Public Pages
- [ ] Home page loads: `/`
- [ ] Projects page: `/projects`
- [ ] Certificates page: `/certificates`
- [ ] Contact form: `/contact`

#### Test Admin Access
1. Go to `/admin/login`
2. Sign in with the email/password you created in Supabase Auth
3. You should see the Admin Dashboard

#### Test Real-time Features (Optional)
1. Open the site in two browser tabs
2. In one tab, go to `/admin/status`
3. Update the status
4. Check the other tab - the status should update instantly!

### Step 7: Add Your Content

1. **Add Projects**: Go to `/admin/projects` → Click "New Project"
2. **Add Certificates**: Go to `/admin/certificates` → Click "New Certificate"
3. **Customize Features**: Go to `/admin/features` → Edit or create features
4. **Update Status**: Go to `/admin/status` → Set your current status
5. **Site Settings**: Go to `/admin/settings` → Update hero text, about section

### Troubleshooting Setup

| Issue | Solution |
|-------|----------|
| `npm install` fails | Delete `node_modules` folder and run `npm install` again |
| Port 5173 is busy | Run `npm run dev -- --port 3000` to use different port |
| Supabase connection error | Check `.env.local` credentials, ensure no trailing spaces |
| "Cannot find module" | Restart dev server: stop with `Ctrl+C`, then `npm run dev` |
| Admin login fails | Verify user exists in Supabase Auth → Users |
| Database errors | Run SQL in `supabase/schema.sql` again |

### Development Commands Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Install a new dependency
npm install package-name

# Install dev dependency
npm install -D package-name
```

### Next Steps

1. **Customize the design**: Edit `src/styles/constants.ts`
2. **Add your projects**: Use the admin panel at `/admin/projects`
3. **Update content**: Modify site settings in `/admin/settings`
4. **Deploy**: See [Deployment](#-deployment) section below

---

## 📖 Pages & Routes

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page with hero, features, stats |
| `/projects` | `Projects` | Projects gallery from database |
| `/certificates` | `Certificates` | Certificates display with preview |
| `/contact` | `Contact` | Contact form |

### Admin Routes (Protected)

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/login` | `Login` | Authentication page |
| `/admin` | `Dashboard` | Overview with stats |
| `/admin/projects` | `AdminProjects` | CRUD for projects |
| `/admin/certificates` | `AdminCertificates` | CRUD for certificates |
| `/admin/status` | `Status` | Update real-time status |
| `/admin/messages` | `Messages` | View contact submissions |
| `/admin/settings` | `Settings` | Site settings management |
| `/admin/features` | `AdminFeatures` | Manage expertise features |

---

## 🛠️ Implementation Details

### File Upload System

**Location**: `src/api/hooks.ts` (`useUploadFile`, `useDeleteFile`)

**Upload Flow**:
1. User selects file via `<input type="file">`
2. File validated (type, size)
3. Unique filename generated: `{timestamp}-{original-name}`
4. File uploaded to Supabase Storage via `supabase.storage.from(bucket).upload()`
5. Public URL retrieved via `getPublicUrl()`
6. URL saved to database record

**Supported Buckets**:
- `certificates` - PDF, JPG, PNG files
- `project-images` - JPG, PNG, WEBP images
- `profile` - Profile pictures
- `cv` - Resume/CV files (PDF, DOC, DOCX)

**File Types Allowed**:
- Images: `.jpg`, `.jpeg`, `.png`, `.webp`
- Documents: `.pdf`, `.doc`, `.docx`

**Security**:
- Requires authentication
- 10MB file size limit
- File type validation before upload
- Old files auto-deleted on replacement

**Usage Example**:
```typescript
const uploadFile = useUploadFile();
const { publicUrl } = await uploadFile.mutateAsync({
  bucket: 'certificates',
  file: selectedFile,
});
```

---

### Real-time Subscriptions

**Location**: `src/hooks/useRealtime.ts`

**How It Works**:
1. Component mounts and calls `useRealtimeStatus()`
2. Hook creates Supabase channel: `supabase.channel('status-changes')`
3. Subscribes to `postgres_changes` events on table
4. On any INSERT/UPDATE/DELETE, callback invalidates TanStack Query cache
5. UI automatically re-renders with fresh data

**Implemented Subscriptions**:
- `useRealtimeStatus()` - Status widget updates
- `useRealtimeProjects()` - Project list updates
- `useRealtimeCertificates()` - Certificate updates

**Code Example**:
```typescript
export const useRealtimeStatus = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel('status-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'status' },
        () => queryClient.invalidateQueries({ queryKey: ['status'] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);
};
```

---

### Authentication System

**Location**: `src/hooks/useAuth.ts`

**Features**:
- Email/password authentication
- OAuth (Google, GitHub) support
- Session persistence
- Automatic token refresh
- Protected routes via `AdminLayout`

**Hook Interface**:
```typescript
interface UseAuthReturn {
  session: Session | null;      // Current user session
  loading: boolean;              // Auth state loading
  signIn: (email, password) => Promise<void>;
  signInWithOAuth: (provider) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
```

**Protected Routes**:
```typescript
// In AdminLayout.tsx
if (!session) {
  return <Navigate to="/admin/login" replace />;
}
```

**OAuth Providers Configured**:
- Google
- GitHub

---

### Theme System

**Location**: `src/contexts/ThemeContext.tsx`, `src/components/ui/ThemeToggle/ThemeToggle.tsx`

**Features**:
- Light/Dark mode toggle
- System preference detection (`prefers-color-scheme`)
- LocalStorage persistence
- CSS custom properties (variables)
- Smooth transitions

**How It Works**:
1. On load, checks `localStorage` for saved theme
2. If none, checks `window.matchMedia('(prefers-color-scheme: dark)')`
3. Sets `data-theme` attribute on `<html>` element
4. CSS variables update automatically
5. Toggle button calls `toggleTheme()` from context

**CSS Variables** (in `index.css`):
```css
:root {
  --text: #6b6375;
  --bg: #fff;
  --accent: #aa3bff;
}

[data-theme="dark"] {
  --text: #9ca3af;
  --bg: #16171d;
  --accent: #c084fc;
}
```

---

### Database Operations

**Location**: `src/api/hooks.ts` (all TanStack Query hooks)

**Query Pattern**:
```typescript
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};
```

**Mutation Pattern**:
```typescript
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
```

**Caching Strategy**:
- Default stale time: 5 minutes
- Automatic background refetching
- Optimistic updates on mutations
- Cache invalidation on create/update/delete

---

### Form Handling

**Location**: All `src/pages/admin/*.tsx` files

**Pattern Used**:
1. Local state with `useState` for form data
2. Controlled inputs with `onChange` handlers
3. Validation before submission
4. Loading states during async operations
5. Success/error feedback via alerts

**Example from Certificates.tsx**:
```typescript
const [formData, setFormData] = useState({
  title: '',
  issuer: '',
  issue_date: '',
  file_url: '',
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editing && !selectedFile) {
    alert('Please select a file');
    return;
  }
  await createCertificate.mutateAsync(formData);
};
```

**File Input Handling**:
- Hidden file input with `useRef`
- Triggered via button click
- File stored in state before upload
- Upload happens on form submission

---

### Error Handling

**Patterns Used**:
1. **Try-catch blocks** for all async operations
2. **Error boundaries** via React Router
3. **User-friendly messages** instead of raw errors
4. **Console logging** for debugging

**Example**:
```typescript
try {
  await uploadFile.mutateAsync({ bucket, file });
} catch (error) {
  console.error('Upload failed:', error);
  let message = 'Upload failed';
  if (error.message.includes('bucket')) {
    message = 'Storage bucket not found. Create it in Supabase.';
  } else if (error.message.includes('permission')) {
    message = 'Permission denied. Check storage policies.';
  }
  alert(message);
}
```

---

### CSS Modules

**Location**: All `*.module.css` files alongside components

**Benefits**:
- Scoped styles (no conflicts)
- Type safety with TypeScript
- Dead code elimination
- Explicit dependencies

**Usage**:
```typescript
import styles from './Component.module.css';

<div className={styles.container}>
  <button className={styles.button}>Click</button>
</div>
```

**Naming Convention**:
- `ComponentName.module.css`
- camelCase class names
- BEM-like structure for complex components

---

### Path Aliases

**Configuration**: `vite.config.ts`, `tsconfig.app.json`

**Alias**: `@` → `./src`

**Usage**:
```typescript
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { supabase } from '@/api/supabase';
```

**Benefits**:
- Clean imports
- Easy refactoring
- No relative path hell (`../../../`)

---

## 🔐 Security

### Authentication
- Supabase Auth with email/password
- JWT tokens stored securely
- OAuth support (Google, GitHub)

### Row Level Security (RLS)
All tables have RLS policies:
- Public can read projects, certificates, features, stats, status
- Only authenticated users can write/modify
- Contact messages: public can submit, only admin can read

### Environment Variables
- `.env.local` is git-ignored
- Never commit Supabase credentials
- Use `.env.example` as template

### File Upload Security
- Authentication required for uploads
- File size limits enforced
- File type validation
- Unique filenames prevent collisions

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect Vercel to repository
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automatically on push

### Netlify

1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to any static host
```

---

## 📚 Documentation

Additional documentation in `MD/` folder:

| Document | Purpose |
|----------|---------|
| `INDEX.md` | Master documentation navigation |
| `ARCHITECTURE.md` | System design & data flow diagrams |
| `ADVANCED-CUSTOMIZATION.md` | Theming, features, extensions |
| `TROUBLESHOOTING.md` | Common issues & solutions |
| `VISUAL-QUICK-REFERENCE.md` | Quick visual reference |
| `PROJECT-SUMMARY.md` | Project overview |
| `DELIVERY-SUMMARY.md` | What was delivered |

---

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check TypeScript errors |

---

## 📝 Key Implementation Details

### Real-time Updates
Status widget uses Supabase real-time subscriptions:
```typescript
supabase.channel('status-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'status' }, callback)
  .subscribe()
```

### Dynamic Content Loading
Home page loads multiple data sources:
- `useStatus()` - Real-time status badge
- `useSiteSettings()` - Hero title, subtitle, about text
- `useFeatures()` - Expertise cards
- `useStats()` - Custom statistics
- `useProjects()` - Live project count
- `useCertificates()` - Live certificate count

### Fallback Content
If no features exist in database, Home.tsx shows static fallback:
- Mechanical Engineering
- Web Development
- Data & AI

### Theme System
CSS variables in `:root` with dark mode support via `prefers-color-scheme` and manual toggle using `ThemeContext`.

---

## 🎨 Design Enhancements

> **CSS-only visual upgrade** — All enhancements were applied exclusively through CSS changes. Zero `.tsx` component files, API hooks, or business logic were modified.

### Overview

A comprehensive design enhancement package was integrated to elevate the portfolio's visual polish, adding professional-grade animations, improved interactions, and refined visual hierarchy across all pages.

> **⚠️ Integration Note:** The enhancement source files used different CSS variable names (`--text`, `--accent`, `--font-4xl`) than the project's existing design system (`--color-text`, `--color-accent`, `--font-size-4xl`). All enhancements were manually adapted to use the correct naming convention to ensure zero breakage.

### Files Modified

| File | Changes |
|------|---------|
| `src/styles/globals.css` | 13 animation keyframes, utility classes, enhanced design tokens |
| `src/pages/Home.module.css` | Hero animations, floating orbs, button effects, staggered cards |
| `src/pages/Projects.module.css` | Card entrance animations, image zoom, action reveal |
| `src/pages/Contact.module.css` | Form styling, social buttons, success animation |
| `src/pages/Certificates.module.css` | Staggered entrances, icon hover effects |
| `src/layouts/MainLayout/MainLayout.module.css` | Glassmorphism header, nav animations, footer polish |

### What Was Added

#### 1. Global Design System (`globals.css`)
- **13 animation keyframes**: `fadeIn`, `slideUp`, `slideDown`, `slideInLeft`, `slideInRight`, `scaleIn`, `pulse`, `glow`, `shimmer`, `float`, `spin`, `wiggle`, `bounce`
- **Animation utility classes**: `.animate-fade-in`, `.animate-slide-up`, `.animate-glow`, `.animate-float`, `.animate-bounce`, etc.
- **Staggered animation support**: `.animate-stagger` for lists/grids with automatic delay per child
- **Enhanced shadows**: `--shadow-2xl`, `--shadow-glow-accent`
- **Advanced transitions**: `--transition-slower` (500ms), `--transition-smooth` (cubic-bezier), `--transition-bounce`
- **Z-index scale**: Systematic layering from `--z-base` to `--z-tooltip`
- **Gradient utilities**: `.gradient-accent`, `.gradient-text`, `.backdrop-blur`
- **Reduced motion**: Full `prefers-reduced-motion` accessibility support

#### 2. Home Page (`Home.module.css`)
- Hero gradient background with subtle accent color wash
- Floating orb effect behind profile image
- Profile image shimmer animation and hover zoom
- Staggered entrance animations on feature cards (100ms delay per card)
- Button shine sweep effect on hover
- Section title underline decoration with gradient
- Enhanced responsive breakpoints (768px + 480px)

#### 3. Projects Page (`Projects.module.css`)
- Staggered card entrance animations (50ms delay per card)
- Image zoom on card hover (1.08x scale)
- Action buttons fade-in reveal on hover
- Styled empty state with dashed border and emoji icon
- Loading pulse animation

#### 4. Contact Page (`Contact.module.css`)
- Info card gradient background with decorative orb
- Social links as circular orange buttons with lift effect
- Enhanced focus rings on form inputs (3px accent glow)
- Success state bounce animation
- Slide-in animations for info and form sections

#### 5. Certificates Page (`Certificates.module.css`)
- Staggered entrance animations on cert cards
- Icon rotate/scale on card hover
- Gradient icon backgrounds instead of flat color
- Floating empty state animation

#### 6. Layout (`MainLayout.module.css`)
- Glassmorphism header (20px blur + 85% transparency)
- Accent-colored borders on header and footer
- Smooth nav underline animation (center origin scaleX)
- Social link hover with circular background + lift
- Page content fadeIn transition

### What Was NOT Changed
- ✅ All `.tsx` component files — zero changes
- ✅ All API hooks (`src/api/hooks.ts`) — untouched
- ✅ Theme system (`ThemeContext.tsx`) — `[data-theme]` approach preserved
- ✅ Admin dashboard pages — untouched
- ✅ Supabase integration — untouched
- ✅ All CSS class names — preserved, matching existing JSX references

### Performance Considerations
- All animations use GPU-accelerated properties (`transform`, `opacity`) for 60fps performance
- `will-change` properties are avoided to prevent memory overhead
- Floating orb on hero section is hidden on mobile (768px) for performance
- Full `prefers-reduced-motion` support disables animations for users who need it

---

## � Changelog

### April 2026 - Mobile Responsiveness & Bug Fixes

#### Admin Panel Responsive Layout
**Files:** `src/layouts/AdminLayout/AdminLayout.tsx`, `src/layouts/AdminLayout/AdminLayout.module.css`

- **Fixed React Hooks Order Bug**: Moved `useEffect` hook before early return statements to comply with React Rules of Hooks
- **Mobile Sidebar Navigation**: Added hamburger menu button for mobile/tablet (≤768px)
- **Slide-in Drawer**: Sidebar transforms from off-screen with smooth slide animation
- **Dark Overlay**: Click overlay to close sidebar on mobile
- **Auto-close**: Sidebar closes on route change, window resize to desktop, or overlay click
- **Tablet Optimization**: Sidebar narrows to 240px on tablets (≤1024px)

#### New Reusable Navbar Component
**Files:** `src/components/ui/Navbar/Navbar.tsx`, `src/components/ui/Navbar/Navbar.module.css`

- **Created responsive Navbar component** with mobile hamburger menu
- **Desktop**: Horizontal navigation with animated underline indicators
- **Mobile/Tablet**: Slide-in drawer from right with nav links and theme toggle
- **Performance optimized**: Uses `React.memo` for component and nav items
- **Accessibility**: ARIA attributes (`aria-label`, `aria-expanded`, `aria-hidden`)
- **Body scroll lock**: Prevents scrolling when mobile menu is open
- **Integrated into MainLayout**: Replaced inline header with reusable Navbar component

#### Updated Project Structure
```
src/components/ui/
└── Navbar/                    # NEW - Reusable responsive navbar
    ├── Navbar.tsx
    └── Navbar.module.css
```

#### Modified Files Summary
| File | Changes |
|------|---------|
| `src/layouts/AdminLayout/AdminLayout.tsx` | Fixed hooks order, added mobile sidebar state |
| `src/layouts/AdminLayout/AdminLayout.module.css` | Added mobile header, overlay styles, responsive breakpoints |
| `src/layouts/MainLayout/MainLayout.tsx` | Replaced inline header with Navbar component |
| `src/layouts/MainLayout/MainLayout.module.css` | Removed header styles (now in Navbar) |
| `src/components/ui/Navbar/*` | **NEW** - Reusable navbar component |

---

## 🎨 Admin Panel Design Enhancement

### April 2026 - Admin UI Refinement

**Design Document:** `enhance files from deepseek/docs/admin-panel-design-refinement.md`

**Goal:** Align the admin UI with the portfolio's polished, industrial-theme aesthetic and introduce reusable, well-structured components.

#### New Admin Components (`src/components/admin/`)

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `AccordionGroup` | Certificate grouping by issuer | Collapsible sections, count badge, chevron animation, smooth transitions |
| `EmptyState` | Consistent empty state design | Icon, title, description, optional action button |
| `FormSection` | Sectioned form organization | Header with icon, title, description, consistent card styling |

#### Enhanced Admin Pages

**Login Page (`src/pages/admin/Login.tsx`)**
- Glassmorphism card effect (backdrop blur, semi-transparent background)
- Gradient background (`#0A0E27 → #0B0F1E`)
- Brand title `<Kaye/>` with code-style syntax
- Orange accent border for visual hierarchy

**Certificates Page (`src/pages/admin/Certificates.tsx`)**
- Integrated `AccordionGroup` for grouping certificates by issuer
- Search functionality to filter by title or issuer
- `EmptyState` component for "no certificates" and "no search results" states

**Settings Page (`src/pages/admin/Settings.tsx`)**
- Restructured into `FormSection` components:
  - Site Content (Hero Title, Profile Picture, Hero Subtitle, About Text, Contact Email)
  - CV / Resume section
  - Stats & Metrics section

**Messages Page (`src/pages/admin/Messages.tsx`)**
- Integrated `EmptyState` component with Inbox icon
- Improved empty state messaging

#### Design Tokens Used
- **Colors:** Navy (`#0A0E27`), Orange (`#FF6B35`), Dark backgrounds
- **Typography:** System fonts with consistent sizing
- **CSS Variables:** All components use existing CSS custom properties

### April 2026 - Admin Panel Component System & Design Alignment

**Goal:** Create a comprehensive reusable component system for the admin panel and align the design with the main portfolio's dark industrial theme.

#### Design Tokens (`src/styles/constants.ts`)

Added admin-specific design tokens to ensure consistency with the main layout:

| Token | Value | Usage |
|-------|-------|-------|
| `ADMIN_COLORS.background` | `#0B0F1E` | Admin panel background |
| `ADMIN_COLORS.sidebarBg` | `#070A18` | Sidebar background |
| `ADMIN_COLORS.surface` | `#111633` | Card/surface backgrounds |
| `ADMIN_COLORS.border` | `#1E2348` | Border colors |
| `ADMIN_COLORS.textPrimary` | `#E4E6F0` | Primary text |
| `ADMIN_COLORS.textSecondary` | `#8892B0` | Secondary text |
| `ADMIN_COLORS.accent` | `#FF6B35` | Accent color (CTAs, highlights) |
| `ADMIN_COLORS.success` | `#34D399` | Success states |
| `ADMIN_COLORS.warning` | `#FBBF24` | Warning states |
| `ADMIN_COLORS.error` | `#F87171` | Error states |
| `ADMIN_COLORS.info` | `#60A5FA` | Informational states |

#### New Reusable Components (`src/components/admin/`)

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `StatCard` | Dashboard KPI cards | Icon, value, label, optional trend indicator (positive/negative), hover effects |
| `QuickActionButton` | Navigation action cards | Icon, label, description, NavLink integration, hover lift effect |
| `DataTable` | Generic data table | Configurable columns, custom render functions, action buttons, empty state, row click handling |
| `FormField` | Consistent form inputs | Label with required indicator, error display, helper text, children wrapper |
| `ImageUpload` | File upload component | Preview (image/file), replace/remove actions, file type support, size validation |

#### Page Enhancements

**Dashboard (`src/pages/admin/Dashboard.tsx`)**
- Replaced custom stat cards with `StatCard` component
- Replaced action cards with `QuickActionButton` component
- Removed redundant CSS styles (now handled by components)
- Cleaner, more maintainable code structure

**Settings (`src/pages/admin/Settings.tsx`)**
- Integrated `FormField` component for all form inputs
- Integrated `ImageUpload` component for profile picture and CV uploads
- Cleaner form structure with consistent labeling
- Removed manual file input handling (now handled by ImageUpload)
- Removed unused state variables and refs

**Messages (`src/pages/admin/Messages.tsx`)**
- Replaced card-based message list with `DataTable` component
- Configured columns: Sender (with icon and badge), Email, Date, Message
- Action buttons: Mark as Read, Reply
- Row click to mark unread messages as read
- Empty state handled by DataTable

**AdminLayout (`src/layouts/AdminLayout/AdminLayout.module.css`)**
- Updated all styling to use admin design tokens
- Replaced CSS variables with direct hex values for consistency
- Unified color palette across sidebar, header, and main content
- Consistent transitions (150ms, 250ms ease-out)
- Professional hover states with accent color (#FF6B35)

#### Design Alignment

The admin panel now matches the main portfolio's dark industrial theme:

- **Consistent color palette:** #0B0F1E background, #FF6B35 accent
- **Unified typography:** System fonts with consistent sizing (0.75rem - 1.25rem)
- **Professional, cohesive UI:** All pages use the same component library
- **Smooth transitions:** 150ms for hover states, 250ms for layout changes
- **Responsive design:** Mobile-first approach maintained

#### Modified Files Summary

| File | Changes |
|------|---------|
| `src/styles/constants.ts` | Added ADMIN_COLORS and ADMIN_TYPOGRAPHY tokens |
| `src/components/admin/StatCard/*` | **NEW** - StatCard component with styling |
| `src/components/admin/QuickActionButton/*` | **NEW** - QuickActionButton component with styling |
| `src/components/admin/DataTable/*` | **NEW** - DataTable component with styling |
| `src/components/admin/FormField/*` | **NEW** - FormField component with styling |
| `src/components/admin/ImageUpload/*` | **NEW** - ImageUpload component with styling |
| `src/components/admin/index.ts` | Exported all new components |
| `src/pages/admin/Dashboard.tsx` | Integrated StatCard and QuickActionButton |
| `src/pages/admin/Dashboard.module.css` | Removed redundant styles |
| `src/pages/admin/Settings.tsx` | Integrated FormField and ImageUpload |
| `src/pages/admin/Messages.tsx` | Integrated DataTable |
| `src/layouts/AdminLayout/AdminLayout.module.css` | Updated to use admin design tokens |

---

## 🎨 Admin Panel Theme System Refinement

### April 2026 - Theme-Aware Admin Panel & Login Enhancement

**Goal:** Fix hardcoded dark theme in admin panel and enhance login page with proper brand icons.

#### Theme System Fix

**Problem:** Admin panel had hardcoded hex colors (`#0B0F1E`, `#070A18`, etc.) that ignored the global theme system.

**Solution:** Converted all admin styling to use CSS variables for full dark/light theme support.

**Files Modified:**
- `src/styles/globals.css` - Added admin-specific CSS variables for both dark and light themes
- `src/layouts/AdminLayout/AdminLayout.module.css` - Replaced hardcoded colors with `var(--admin-bg)`, `var(--admin-sidebar-bg)`, etc.

**CSS Variables Added:**

| Variable | Dark Value | Light Value |
|----------|------------|-------------|
| `--admin-bg` | `#0B0F1E` | `#F8F9FC` |
| `--admin-sidebar-bg` | `#070A18` | `#FFFFFF` |
| `--admin-sidebar-border` | `#1E2348` | `#E2E8F0` |
| `--admin-nav-text` | `#8892B0` | `#64748B` |
| `--admin-nav-hover-bg` | `#111633` | `#F1F5F9` |
| `--admin-nav-hover-text` | `#E4E6F0` | `#1E293B` |
| `--admin-nav-active-bg` | `#FF6B35` | `#FF6B35` |
| `--admin-nav-active-text` | `#0A0E27` | `#FFFFFF` |
| `--admin-card-bg` | `#141B3D` | `#FFFFFF` |
| `--admin-header-bg` | `#070A18` | `#FFFFFF` |

#### Login Page Enhancement

**Files Modified:**
- `src/pages/admin/Login.tsx` - Replaced generic Lucide icons with official brand SVG icons
- `src/pages/admin/Login.module.css` - Added `.brandIcon` styling and enhanced button hover effects

**Changes:**
- **Google OAuth Button:** Added full-color 4-path Google logo SVG with official brand colors
- **GitHub OAuth Button:** Added monochrome GitHub logo SVG using `currentColor` for theme adaptation
- **Button Styling:** Enhanced hover states with accent border glow and smooth transitions
- **Theme Support:** Login card now adapts to light/dark theme with proper contrast

#### Benefits

- Admin panel now respects theme toggle preference (light/dark mode)
- Login page displays authentic brand icons for better user trust
- Consistent visual experience across all admin pages
- Better accessibility with proper color contrast in both themes

---

## 📄 License

Created for portfolio demonstration.

---

**Questions?** See `MD/TROUBLESHOOTING.md` or check the documentation folder.

**Ready to deploy?** Follow the Getting Started section above.
