import styles from './Badge.module.css';
import { memo } from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = memo(({
  children,
  variant = 'default',
  size = 'sm'
}: BadgeProps) => {
  const classes = [
    styles.badge,
    styles[variant],
    styles[size]
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
