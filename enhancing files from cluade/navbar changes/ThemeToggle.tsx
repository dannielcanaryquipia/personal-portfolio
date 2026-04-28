import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'primary';
  /** When true, renders "Light" or "Dark" text next to the icon */
  showLabel?: boolean;
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
      {isDark
        ? <Sun  size={iconSize} />
        : <Moon size={iconSize} />
      }
      {showLabel && <span className={styles.label}>{label}</span>}
    </button>
  );
}
