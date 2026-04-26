import { NavLink } from 'react-router-dom';
import styles from './QuickActionButton.module.css';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  description?: string;
}

export const QuickActionButton = ({ icon, label, to, description }: QuickActionButtonProps) => {
  return (
    <NavLink to={to} className={styles.quickAction}>
      <div className={styles.actionIcon}>{icon}</div>
      <div className={styles.actionContent}>
        <div className={styles.actionLabel}>{label}</div>
        {description && <div className={styles.actionDescription}>{description}</div>}
      </div>
    </NavLink>
  );
};
