### Part 1: UI/UX Audit & Improvement Plan

Your portfolio has a strong technical foundation (TypeScript, Supabase, CSS Modules) but its visual presentation and content delivery lag. I've identified three areas where targeted improvements can make the biggest impact.

#### A. Home Page: Clarity & Visual Storytelling

The current homepage is purely text-based and fails to make a strong first impression[](https://personal-portfolio-ecru-nine-54.vercel.app/).

* **Craft a Hero Section** : Replace the dense text with a compelling hero section that includes a professional headline, a concise value proposition, and a clear call-to-action (CTA), such as “View My Work”.
* **Visual Balance** : Implement a layout that balances text with a professional photo or a dynamic, animated graphic to create visual interest.
* **Prominent CTAs** : Guide visitors toward key actions: viewing your projects, reading about your journey, or getting in touch.

Here's a wireframe concept for the new Hero Section:

**text**

```
+---------------------------------------------------+
|  Danniel Canary                                   |
|  Mechanical Engineer & Full-Stack Developer      |
|                                                   |
|  [Professional Photo or Animated Graphic]        |
|                                                   |
|  Building robust, scalable solutions at the      |
|  intersection of precision engineering and       |
|  modern software.                                |
|                                                   |
|  [ View My Work ]  [ Contact Me ]                 |
+---------------------------------------------------+
```

#### B. Projects & Certificates: From Placeholders to Portfolios

The projects and certificates pages are currently placeholders, which can significantly undermine your credibility.

* **Develop Project Case Studies** : Transform the `/projects` page into a compelling grid or list of case studies[](https://personal-portfolio-ecru-nine-54.vercel.app/projects). For each project, include a detailed view with a problem statement, your solution (using text, images, and videos), key features, the tech stack, and a link to the live demo or GitHub repo[](https://personal-portfolio-ecru-nine-54.vercel.app/).
* **Organize Certifications** : Create a visual, filterable grid for your certificates, using tags like "Data & AI," "Development," or "Hard Skills" to help visitors quickly find relevant credentials[](https://personal-portfolio-ecru-nine-54.vercel.app/certificates). Make each certificate downloadable or viewable in a modal.

#### C. Contact Page: Minimizing Friction

The contact page is functional but has some friction points that can discourage messages[](https://personal-portfolio-ecru-nine-54.vercel.app/contact).

* **Enhance the Form** : Add client-side validation with clear, real-time error messages and implement a success message upon submission. Consider disabling the button after a click to prevent duplicate submissions.
* **Offer Alternative Contact Methods** : Include clickable links to your professional social profiles (GitHub, LinkedIn) and, optionally, a tool like [Cal.com](https://cal.com/) for scheduling brief chats.
* **Improve Accessibility** : For better usability, use semantic HTML and associate labels with their form inputs using `for="id"` attributes.

---

### 🏗️ Part 2: Layout Architecture & Navigation Optimization

Your current layout is functional but can be made more efficient and robust.

#### A. The Root Layout (`RootLayout.tsx`)

This component currently renders the persistent UI (header, footer) and the outlet for page content. It's in a good place, but we can enhance the folder structure for better scalability.

#### B. Component Architecture & Code Organization

| Current                        | Proposed                                                        |
| ------------------------------ | --------------------------------------------------------------- |
| `src/layouts/RootLayout.tsx` | `src/layouts/RootLayout.tsx` (unchanged, no migration needed) |
| `src/components/ui/Navbar/`  | `src/components/common/Navbar/`                               |

#### C. File Structure for Scalability

A more organized folder structure makes a project easier to navigate and maintain as it grows. Here's a proposed structure based on React ecosystem best practices:

**text**

```
src/
├── assets/               # Static assets (images, fonts, etc.)
├── components/
│   ├── common/           # Highly reusable components (Button, Card, Modal)
│   └── layout/           # Layout-specific components (Header, Footer)
├── contexts/             # React context providers (ThemeContext)
├── hooks/                # Custom React hooks
├── layouts/              # Layout wrapper components (RootLayout)
├── lib/                  # Third-party library configurations (supabaseClient)
├── pages/                # Page-level components
│   ├── admin/            # All admin-related pages
│   ├── Home.tsx
│   ├── Projects.tsx
│   └── ...
├── services/             # API service layers (projectsAPI, certificatesAPI)
├── styles/               # Global styles, CSS variables, design tokens
├── types/                # Global TypeScript type definitions
└── utils/                # Utility functions (date formatters, text helpers)
```

---

### 🧩 Part 3: Reusable Components Strategy

Building a library of reusable components is key to speeding up development and keeping your UI consistent.

#### A. Creating Your Foundation: The `common` Folder

Move your UI elements into `src/components/common/`. A solid set of common components is the backbone of any scalable UI. Here's a checklist to help you build this out:

* **Button** : The workhorse of your app. It should support variants (primary, secondary, ghost), sizes (sm, md, lg), and states (loading, disabled).
* **Input** : A styled wrapper for text, email, and password inputs. It should have built-in support for labels, helper text, and error states.
* **Textarea** : A styled wrapper for multi-line text input.
* **Card** : A flexible container with slots for a header, media (images), content, and actions.
* **Modal** : A dialog component for confirmations or forms. It’s even more powerful when built as a compound component (e.g., `Modal.Header`, `Modal.Body`).
* **Select** : Use a reusable `Select` component to ensure all dropdown menus share the same look and feel.
* **Skeleton** : A placeholder for content that's still loading, which greatly improves the perceived performance of your site.

#### B. Refining the Navbar

Your `Navbar` component is already in a good place. The next step is to consolidate duplicate logic.

* **DRY Up the Menu** : The navigation links are defined twice (once for desktop in `_desktopNav` and once for mobile in `_mobileNav`)[](https://personal-portfolio-ecru-nine-54.vercel.app/).
* **Implement a Single Source of Truth** : Create a `navItems` array (`{ path: '/', label: 'Home' }`) in a config file. Then, map over this array wherever your navigation menu is rendered to eliminate redundancy.

#### C. Building a Comprehensive Design System

Documenting your design tokens in a single source of truth is a game-changer for consistency and maintenance. It's the blueprint for your entire UI:

* **Colors** : `const colors = { primary: '#FF6B35', secondary: '#0A0E27', ... }`
* **Typography** : `const typography = { fontFamily: { ... }, fontSize: { ... }, fontWeight: { ... } }`
* **Spacing** : `const spacing = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' }`
* **Breakpoints** : `const breakpoints = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' }`
* **Shadows** : `const shadows = { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', ... }`

---

### 🚀 Part 4: Performance & Accessibility (The "Invisible" Polish)

Your site's foundation is solid (React 19, TypeScript, Vite), but we can fine-tune it for a world-class user experience.

| Initiative                            | Implementation Plan                                                                                                                                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Image Optimization**          | Serve modern formats (WebP/AVIF) and implement lazy loading for off-screen images.`` **Action** : Configure Vite build process to auto-generate WebP versions; set `loading="lazy"` on all `<img>` elements. |
| **Code Splitting**              | Use `React.lazy()` with Suspense to split your bundle, ensuring visitors only download the code needed for the page they're on.                                                                                             |
| **Semantic HTML**               | Use landmark elements (`<main>`, `<section>`, `<nav>`) and proper heading hierarchy (`<h1>` to `<h6>`) to improve navigation for screen reader users.                                                               |
| **Color Contrast**              | Verify all text/background combos meet WCAG 2.1 AA standards (minimum contrast ratio of 4.5:1 for normal text).                                                                                                               |
| **Meta Tags & Structured Data** | Implement unique title and meta description tags per page. Add structured data (JSON-LD) for "Person" and "Project" schemas to enhance search engine results.                                                                 |
| **Keyboard Navigation**         | Ensure all interactive elements are focusable and operable via the keyboard. Add a visible focus indicator to help users who navigate by keyboard.                                                                            |

---

### 🎯 Summary & Next Steps

Your portfolio is built on an excellent tech stack. By shifting focus from the technical backend to the frontend polish, you'll create a site that truly reflects your skills. Here’s a prioritized action plan to get you started:

 **Short-Term (Next 1-2 days)** :

* Rewrite the homepage content to feature a clear headline, professional photo, and CTAs.
* Refactor the navbar to use a single source of truth for navigation links.

 **Medium-Term (Next week)** :

* Build your core library of reusable `common/` components (Button, Input, Card, etc.).
* Populate the projects page with at least one detailed case study.
* Convert all images to WebP and implement lazy loading.

 **Long-Term (Ongoing)** :

* Define and implement a full design system based on your CSS custom properties.
* Add structured data for improved SEO.
* Continuously add new projects and certifications as you earn them.
