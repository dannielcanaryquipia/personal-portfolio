// Design Tokens - Dark Industrial Theme
// Change values here to update entire site

// Colors - Dark industrial theme
export const COLORS = {
  // Primary
  primary: '#0A0E27',      // Deep navy
  primaryLight: '#141B3D', // Lighter navy
  primaryDark: '#050814',  // Darker navy
  
  // Accent
  accent: '#FF6B35',       // Precision orange
  accentHover: '#E85A2A',  // Darker orange
  
  // Feedback
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  
  // Text
  text: '#EEEEEE',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  textInverse: '#0A0E27',
} as const;

// Spacing scale
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: "'Courier New', Courier, monospace",
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Shadows
export const SHADOWS = {
  sm: '0 2px 4px rgba(0,0,0,0.1)',
  md: '0 4px 8px rgba(0,0,0,0.15)',
  lg: '0 8px 16px rgba(0,0,0,0.2)',
  xl: '0 12px 24px rgba(0,0,0,0.25)',
  glow: '0 0 20px rgba(255,107,53,0.3)', // Orange glow
} as const;

// Border radius
export const RADIUS = {
  sm: '2px',
  md: '4px',
  lg: '8px',
  xl: '16px',
  full: '9999px',
} as const;

// Transitions
export const TRANSITIONS = {
  fast: '150ms ease-out',
  base: '250ms ease-out',
  slow: '350ms ease-out',
  slowest: '500ms ease-out',
} as const;

// Z-index scale
export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
} as const;
