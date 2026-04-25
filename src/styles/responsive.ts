// Responsive utilities and media queries

// Breakpoints
export const BREAKPOINTS = {
  mobile: '320px',
  mobileLarge: '480px',
  tablet: '768px',
  desktop: '1024px',
  desktopLarge: '1280px',
} as const;

// Media query helpers
export const media = {
  mobile: `@media (min-width: ${BREAKPOINTS.mobile})`,
  mobileLarge: `@media (min-width: ${BREAKPOINTS.mobileLarge})`,
  tablet: `@media (min-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop})`,
  desktopLarge: `@media (min-width: ${BREAKPOINTS.desktopLarge})`,
  
  // Max-width (mobile-first approach)
  untilTablet: `@media (max-width: ${BREAKPOINTS.tablet})`,
  untilDesktop: `@media (max-width: ${BREAKPOINTS.desktop})`,
} as const;

// Platform detection for conditional logic
export const PLATFORM = {
  isMobile: () => typeof window !== 'undefined' && window.innerWidth <= 768,
  isTablet: () => typeof window !== 'undefined' && window.innerWidth > 768 && window.innerWidth <= 1024,
  isDesktop: () => typeof window !== 'undefined' && window.innerWidth > 1024,
} as const;

// CSS container queries helper
export const container = {
  sm: '@container (min-width: 300px)',
  md: '@container (min-width: 500px)',
  lg: '@container (min-width: 700px)',
} as const;

// Responsive value helper
export function responsive<T>(values: { mobile: T; tablet?: T; desktop?: T }): T {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  if (width >= 1024 && values.desktop !== undefined) return values.desktop;
  if (width >= 768 && values.tablet !== undefined) return values.tablet;
  return values.mobile;
}
