import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'primary';
}

export function ThemeToggle({ size = 'md', variant = 'default' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClass = styles[size];
  const variantClass = styles[variant];

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.toggle} ${sizeClass} ${variantClass}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      ) : (
        <Sun size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      )}
    </button>
  );
}
