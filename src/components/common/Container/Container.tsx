import styles from './Container.module.css';
import { memo } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  full: '100%',
};

export const Container = memo(({
  children,
  className = '',
  size = 'xl',
  padding = 'lg',
}: ContainerProps) => {
  const classes = [
    styles.container,
    styles[`padding-${padding}`],
    className,
  ].filter(Boolean).join(' ');

  const style = {
    '--container-max-width': SIZE_MAP[size],
  } as React.CSSProperties;

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';
