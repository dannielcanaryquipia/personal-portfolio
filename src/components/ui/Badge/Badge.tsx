import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = ({ 
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
};
