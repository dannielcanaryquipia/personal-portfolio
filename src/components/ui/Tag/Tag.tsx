import styles from './Tag.module.css';
import { memo } from 'react';
import { X } from 'lucide-react';

export interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  onDelete?: () => void;
  className?: string;
}

export const Tag = memo(({
  children,
  variant = 'default',
  size = 'sm',
  onDelete,
  className = '',
}: TagProps) => {
  const classes = [
    styles.tag,
    styles[variant],
    styles[size],
    onDelete && styles.deletable,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={onDelete}
          aria-label={`Remove ${children}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
});

Tag.displayName = 'Tag';
