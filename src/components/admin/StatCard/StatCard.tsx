import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = ({ label, value, icon, trend }: StatCardProps) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        {trend && (
          <div className={`${styles.statTrend} ${trend.isPositive ? styles.positive : styles.negative}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
};
