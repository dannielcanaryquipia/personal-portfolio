import styles from './EmptyState.module.css';
import { memo } from 'react';
import { Button } from '@/components/ui/Button/Button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
}

export const EmptyState = memo(({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => {
  const classes = [styles.emptyState, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon size={48} className={styles.icon} />
        </div>
      )}
      
      <h3 className={styles.title}>{title}</h3>
      
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          className={styles.actionButton}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
