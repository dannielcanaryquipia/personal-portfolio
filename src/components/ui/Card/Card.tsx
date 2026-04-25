import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}: CardProps) => {
  const classes = [
    styles.card,
    hover && styles.hover,
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

// Card subcomponents for consistent structure
Card.Header = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${styles.header} ${className}`}>{children}</div>
);

Card.Body = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${styles.body} ${className}`}>{children}</div>
);

Card.Footer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${styles.footer} ${className}`}>{children}</div>
);
