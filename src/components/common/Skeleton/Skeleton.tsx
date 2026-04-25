import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton = ({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  className = '',
}: SkeletonProps) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const classes = [
    styles.skeleton,
    styles[variant],
    styles[animation],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={style}
      aria-hidden="true"
    />
  );
};

// Pre-built skeleton patterns
Skeleton.Text = ({ lines = 3, ...props }: { lines?: number } & Omit<SkeletonProps, 'variant'>) => (
  <div className={styles.textGroup}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '80%' : '100%'}
        {...props}
      />
    ))}
  </div>
);

Skeleton.Card = ({ ...props }: Omit<SkeletonProps, 'variant'>) => (
  <div className={styles.cardSkeleton}>
    <Skeleton variant="rounded" height={200} {...props} />
    <div className={styles.cardContent}>
      <Skeleton variant="text" width="70%" {...props} />
      <Skeleton.Text lines={2} {...props} />
    </div>
  </div>
);

Skeleton.Avatar = ({ size = 40, ...props }: { size?: number } & Omit<SkeletonProps, 'variant' | 'width' | 'height'>) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    {...props}
  />
);

Skeleton.Button = ({ width = 120, ...props }: { width?: number | string } & Omit<SkeletonProps, 'variant' | 'width'>) => (
  <Skeleton
    variant="rounded"
    width={width}
    height={40}
    {...props}
  />
);
