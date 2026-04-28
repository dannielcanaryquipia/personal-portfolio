# Navbar Changes — AI Instructions

Apply the three changes below to the personal portfolio codebase.
All changes are isolated to 4 files. Do not modify anything else.

---

## Change 1 — Mobile drawer slides from LEFT (not right)

**File:** `src/components/ui/Navbar/Navbar.module.css`

Find the `.mobileDrawer` rule and make these exact replacements:

| Property | Old value | New value |
|---|---|---|
| `right` | `0` | *(remove this line)* |
| `left` | *(missing)* | `0` |
| `transform` | `translateX(100%)` | `translateX(-100%)` |
| `border-left` | `1px solid rgba(...)` | `border-right: 1px solid rgba(var(--color-accent-rgb), 0.15)` |
| `box-shadow` | `-4px 0 20px rgba(0,0,0,0.3)` | `4px 0 20px rgba(0, 0, 0, 0.3)` |

Also update `.mobileActionsBottom`:
- Change `justify-content: center` → `justify-content: flex-start`

The resulting `.mobileDrawer` rule must be:
```css
.mobileDrawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  background: var(--color-primary-dark);
  z-index: 201;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  border-right: 1px solid rgba(var(--color-accent-rgb), 0.15);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
  visibility: hidden;
}
.mobileDrawer.open {
  transform: translateX(0);
  visibility: visible;
}
```

---

## Change 2 — Remove the drawer header (site name inside the drawer)

**File:** `src/components/ui/Navbar/Navbar.tsx`

Delete this entire JSX block from the `mobileDrawer` div (it is the first child inside the drawer):

```tsx
<div className={styles.mobileDrawerHeader}>
  <NavLink to="/" className={styles.mobileDrawerLogo} onClick={closeMobileMenu}>
    {siteName}
  </NavLink>
</div>
```

After deletion the `mobileDrawer` div's first child must be `<nav className={styles.mobileNav}>`.

Also remove these now-unused CSS rules from `Navbar.module.css`:
- `.mobileDrawerHeader` (the entire rule)
- `.mobileDrawerLogo` (the entire rule)

---

## Change 3 — ThemeToggle: add "Light" / "Dark" text label

### 3a. Update `src/components/ui/ThemeToggle/ThemeToggle.tsx`

Add a `showLabel` prop to the interface and component:

```tsx
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'primary';
  showLabel?: boolean;   // ← add this
}

export function ThemeToggle({ size = 'md', variant = 'default', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark   = theme === 'dark';
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const label    = isDark ? 'Light' : 'Dark';

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.toggle} ${styles[size]} ${styles[variant]} ${showLabel ? styles.withLabel : ''}`}
      aria-label={`Switch to ${label.toLowerCase()} mode`}
      title={`Switch to ${label.toLowerCase()} mode`}
    >
      {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
      {showLabel && <span className={styles.label}>{label}</span>}
    </button>
  );
}
```

### 3b. Update `src/components/ui/ThemeToggle/ThemeToggle.module.css`

Add these two new rules and update the size rules:

```css
/* Label text */
.label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  line-height: 1;
}

/* When label is shown, override fixed square dimensions so button auto-sizes */
.withLabel.sm,
.withLabel.md,
.withLabel.lg {
  width: auto;
  height: auto;
  padding: var(--spacing-sm) var(--spacing-md);
}
```

Also ensure `.toggle` has `gap: var(--spacing-xs)` so the icon and text have space between them:
```css
.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);   /* ← add this if missing */
  ...
}
```

### 3c. Update `src/components/ui/Navbar/Navbar.tsx`

In the mobile drawer section, pass `showLabel` to the ThemeToggle:

```tsx
{/* Change this line inside mobileActionsBottom: */}
<ThemeToggle size="md" variant="ghost" showLabel />
```

The desktop ThemeToggle does NOT get `showLabel` (stays icon-only):
```tsx
<ThemeToggle size="sm" variant="ghost" />
```

---

## Verification checklist

After applying all changes, confirm:

- [ ] On mobile (≤ 768px), opening the menu slides the drawer in from the **left**
- [ ] The overlay darkens the **right** side of the screen
- [ ] The drawer does **not** show `< Kaye/ >` or any site name at the top
- [ ] The drawer's theme toggle shows the icon **plus** the word "Light" or "Dark"
- [ ] Desktop theme toggle remains icon-only (no label)
- [ ] `npx tsc --noEmit` reports **zero errors**
- [ ] All nav links still work and close the drawer on click

---

## Files changed (summary)

```
src/components/ui/Navbar/Navbar.tsx          — removed mobileDrawerHeader block, added showLabel to mobile ThemeToggle
src/components/ui/Navbar/Navbar.module.css   — left-side drawer transform/position, removed header styles
src/components/ui/ThemeToggle/ThemeToggle.tsx — added showLabel prop + label span
src/components/ui/ThemeToggle/ThemeToggle.module.css — added .label and .withLabel overrides
```
