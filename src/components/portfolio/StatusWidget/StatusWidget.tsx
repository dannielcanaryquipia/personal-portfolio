import { useStatus } from '@/api/hooks';
import { useRealtimeStatus } from '@/hooks/useRealtime';
import styles from './StatusWidget.module.css';

export const StatusWidget = () => {
  const { data: status } = useStatus();
  useRealtimeStatus();

  if (!status) return null;

  return (
    <div className={styles.widget}>
      <span className={styles.pulse} />
      <span className={styles.emoji}>{status.emoji}</span>
      <span className={styles.label}>{status.label}</span>
    </div>
  );
};
