import styles from './Button.module.css';
import { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = memo(({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      <span className={loading ? styles.loadingText : ''}>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';
