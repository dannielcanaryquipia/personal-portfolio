# Advanced Customization & Extension Guide

## 🎨 Theming System

### Changing the Entire Color Scheme

Edit `src/styles/constants.ts`:

```typescript
export const COLORS = {
  // Primary - Change from Navy to any color
  primary: '#1a1a2e',      // Your primary background
  primaryLight: '#16213e', // Slightly lighter variant
  
  // Accent - Change from Orange to your brand color
  accent: '#00d4ff',       // Your accent (will update all CTAs)
  accentDark: '#00a3cc',   // Darker variant for hover
  accentLight: '#66e6ff',  // Lighter variant
  
  // Keep these or customize
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  
  // Neutrals - affects text/borders
  white: '#FFFFFF',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',      // Your light text color
  // ... rest of grays
}
```

### Create a Light Theme

```typescript
// Option 1: Create src/styles/constants-light.ts
// Copy constants.ts and invert colors

export const COLORS = {
  primary: '#FFFFFF',      // Light background
  primaryLight: '#F5F5F5', // Slightly darker
  accent: '#FF6B35',       // Keep your brand orange
  text: '#222222',         // Dark text on light bg
  textSecondary: '#666666',
  // ...
}

// Option 2: Add theme toggle in MainLayout
const [theme, setTheme] = useState('dark')
const CONSTANTS = theme === 'dark' ? darkConstants : lightConstants

// Then use in CSS:
const bgColor = theme === 'dark' ? COLORS.primary : COLORS_LIGHT.primary
```

### Use CSS Variables Instead of Constants

```css
/* src/styles/globals.css */
:root {
  --color-primary: #0A0E27;
  --color-accent: #FF6B35;
  --color-text: #EEEEEE;
  --color-text-secondary: #AAAAAA;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  /* ... */
}

/* src/components/Button/Button.module.css */
.button {
  background-color: var(--color-accent);
  padding: var(--spacing-md);
}

/* In MainLayout, toggle theme */
document.documentElement.style.setProperty('--color-primary', '#FFFFFF')
```

---

## 📦 Adding New Features

### Feature 1: Dark/Light Theme Toggle

```typescript
// src/hooks/useTheme.ts
import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return { theme, toggleTheme }
}

// Usage in MainLayout
const { theme, toggleTheme } = useTheme()

<button onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
```

### Feature 2: Blog/Articles Section

```typescript
// 1. Create Supabase table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

// 2. Create hook
// src/api/hooks.ts - add:
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published_at', 'NOT_NULL')
        .order('published_at', { ascending: false })
      return data as Post[]
    }
  })
}

// 3. Create page
// src/pages/Blog.tsx
export const Blog = () => {
  const { data: posts = [] } = usePosts()
  
  return (
    <div>
      <h1>Articles & Insights</h1>
      <div className={styles.grid}>
        {posts.map(post => (
          <a href={`/blog/${post.slug}`} key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

// 4. Add route in App.tsx
const blogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => (
    <MainLayout>
      <Blog />
    </MainLayout>
  ),
})
```

### Feature 3: Email Notifications for Contact Messages

Using [Resend.com](https://resend.com) (free tier available):

```typescript
// 1. Set up Supabase Edge Function
// supabase/functions/send-contact-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend@0.13.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  const { name, email, message } = await req.json()

  const data = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: 'dannielcanaryq@gmail.com',
    subject: `New contact from ${name}`,
    html: `
      <h2>New Message</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  })

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})

// 2. Call from Contact form
const { mutateAsync } = useCreateContactMessage()

const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Save to database
  await mutateAsync({ name, email, message })
  
  // Send email notification (optional)
  try {
    await fetch(
      'https://your-project.supabase.co/functions/v1/send-contact-email',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${supabase.auth.session()?.access_token}` },
        body: JSON.stringify({ name, email, message })
      }
    )
  } catch (err) {
    console.error('Email failed, but message saved:', err)
  }
  
  setSubmitted(true)
}
```

### Feature 4: Project Search & Filtering

```typescript
// src/pages/Projects.tsx
import { useState, useMemo } from 'react'

export const Projects = () => {
  const { data: allProjects = [] } = useProjects()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        project.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      
      const matchesTag = !selectedTag || project.tags.includes(selectedTag)
      
      return matchesSearch && matchesTag
    })
  }, [allProjects, searchTerm, selectedTag])

  // Get all unique tags
  const allTags = Array.from(
    new Set(allProjects.flatMap(p => p.tags))
  )

  return (
    <section>
      <h1>Projects</h1>
      
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.tagFilter}>
        <button
          onClick={() => setSelectedTag(null)}
          className={selectedTag === null ? styles.active : ''}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={selectedTag === tag ? styles.active : ''}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={styles.count}>
        Showing {filteredProjects.length} of {allProjects.length}
      </div>

      <ProjectsGrid projects={filteredProjects} />
    </section>
  )
}
```

### Feature 5: Dark Mode with System Preference

```typescript
// src/hooks/useTheme.ts
import { useEffect, useState } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    // Check localStorage
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (saved) {
      setTheme(saved)
      return
    }

    // Check system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = (newTheme?: 'dark' | 'light') => {
    const t = newTheme || (theme === 'dark' ? 'light' : 'dark')
    setTheme(t)
    localStorage.setItem('theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  return { theme, toggleTheme }
}
```

---

## 🔧 Database Customization

### Add User Roles

```sql
-- Add roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

INSERT INTO roles (name) VALUES
  ('admin'),
  ('contributor'),
  ('viewer');

-- Add user_roles join table
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role_id INTEGER REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Check role in RLS policy
CREATE POLICY "Only admins can edit"
  ON projects
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles
      WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );
```

### Add Project Categories

```sql
-- Add categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT -- for styling
);

-- Add category_id to projects
ALTER TABLE projects ADD COLUMN category_id INTEGER REFERENCES categories(id);

-- Query with category
SELECT p.*, c.name, c.color
FROM projects p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.created_at DESC;
```

---

## 🚀 Performance Optimizations

### Image Optimization

```typescript
// Create image component
// src/components/ui/Image/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
}

export const OptimizedImage = ({ src, alt, width, height }: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
      }}
    />
  )
}
```

### Lazy Loading Routes

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'

const AdminDashboard = lazy(() => 
  import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard }))
)

const LoadingFallback = () => <div className={styles.loading}>Loading...</div>

const adminRoute = new Route({
  path: '/admin',
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </Suspense>
  ),
})
```

### Debounced Search

```typescript
// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react'

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Usage
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

const { data: results } = useQuery({
  queryKey: ['search', debouncedSearch],
  queryFn: () => searchProjects(debouncedSearch),
  enabled: debouncedSearch.length > 0,
})
```

---

## 🔐 Security Enhancements

### Add CSRF Protection

```typescript
// Supabase automatically handles CSRF for authenticated requests
// Just ensure you use the authenticated client for mutations

// ✅ Good - Supabase auto-includes CSRF
const { error } = await supabase
  .from('projects')
  .insert([newProject])
```

### Input Validation

```typescript
// src/utils/validation.ts
import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 chars').max(100),
  description: z.string().max(500, 'Description too long'),
  tags: z.array(z.string()).max(10, 'Max 10 tags'),
  github_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  demo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})

// Usage
const validateProject = (data: any) => {
  try {
    return projectSchema.parse(data)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.errors[0].message }
    }
  }
}
```

---

## 📊 Analytics Integration

### Add Vercel Analytics

```typescript
// src/App.tsx
import { Analytics } from '@vercel/analytics/react'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Analytics />
    </QueryClientProvider>
  )
}
```

### Add Google Analytics

```typescript
// src/main.tsx
import ReactGA from 'react-ga4'

ReactGA.initialize('G-XXXXXXXXXX')

// Track page views
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export const usePageTracking = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname })
  }, [location.pathname])
}
```

---

## 🧪 Testing Setup

### Unit Tests

```typescript
// src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

### E2E Tests with Playwright

```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test'

test('contact form submission', async ({ page }) => {
  await page.goto('/contact')
  
  await page.fill('input[placeholder="Your Name"]', 'John')
  await page.fill('input[type="email"]', 'john@example.com')
  await page.fill('textarea', 'Test message')
  await page.click('button[type="submit"]')
  
  await expect(page.locator('text=Message sent')).toBeVisible()
})
```

---

## 🎯 Best Practices

### Component Organization
```
src/components/
├── ui/
│   ├── Button/
│   │   ├── Button.tsx (component)
│   │   ├── Button.module.css (styles)
│   │   └── index.ts (export)
│   └── Input/
│       ├── Input.tsx
│       ├── Input.module.css
│       └── index.ts
│
├── portfolio/
│   └── ProjectCard/
│       ├── ProjectCard.tsx
│       ├── ProjectCard.module.css
│       └── index.ts
│
└── admin/
    └── ProjectForm/
        ├── ProjectForm.tsx
        ├── ProjectForm.module.css
        └── index.ts
```

### Naming Conventions
- Components: PascalCase (`ProjectCard.tsx`)
- Functions: camelCase (`useProjects()`)
- Constants: UPPER_SNAKE_CASE (`COLORS`, `SPACING`)
- CSS Classes: camelCase (`.buttonPrimary`)
- Files: Match component name (`Button.tsx`, `Button.module.css`)

### Import Organization
```typescript
// 1. React/external libraries
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal imports (absolute)
import { Button } from '@/components/ui/Button'
import { COLORS } from '@/styles/constants'

// 3. Relative imports (if needed)
import styles from './Button.module.css'
```

This guide should help you extend and customize the portfolio to your needs!
