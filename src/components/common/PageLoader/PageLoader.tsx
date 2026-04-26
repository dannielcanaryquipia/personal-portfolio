import styles from './PageLoader.module.css';
import { Skeleton } from '@/components/common/Skeleton';

interface PageLoaderProps {
  className?: string;
}

export const PageLoader = ({ className = '' }: PageLoaderProps) => {
  return (
    <div className={`${styles.pageLoader} ${className}`}>
      <div className={styles.content}>
        <Skeleton variant="circular" width={60} height={60} animation="pulse" className={styles.spinner} />
        <Skeleton variant="text" width={200} animation="pulse" />
        <Skeleton.Text lines={2} animation="pulse" />
      </div>
    </div>
  );
};
