import styles from './ProfileImage.module.css';
import { memo, useState, useCallback } from 'react';
import { Skeleton } from '@/components/common/Skeleton';
import { User } from 'lucide-react';

interface ProfileImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
}

const SIZE_MAP = {
  sm: 40,
  md: 80,
  lg: 150,
  xl: 300,
};

export const ProfileImage = memo(({
  src,
  alt,
  size = 'lg',
  className = '',
  fallbackClassName = '',
}: ProfileImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const pixelSize = SIZE_MAP[size];

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const containerClasses = [
    styles.container,
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  // Show skeleton while loading
  if (isLoading && src) {
    return (
      <div className={containerClasses}>
        <Skeleton
          variant="rounded"
          width={pixelSize}
          height={pixelSize}
          animation="pulse"
        />
        {/* Hidden image for loading */}
        <img
          src={src}
          alt={alt}
          className={styles.hiddenImage}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }

  // Show fallback if no src or error
  if (!src || hasError) {
    return (
      <div className={`${containerClasses} ${styles.fallback} ${fallbackClassName}`}>
        <User size={pixelSize * 0.5} className={styles.fallbackIcon} />
      </div>
    );
  }

  // Show loaded image
  return (
    <div className={containerClasses}>
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
});

ProfileImage.displayName = 'ProfileImage';
