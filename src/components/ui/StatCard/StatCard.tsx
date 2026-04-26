import styles from './StatCard.module.css';
import { memo } from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard = memo(({ value, label }: StatCardProps) => {
  return (
    <div className={styles.statCard}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
});

StatCard.displayName = 'StatCard';
