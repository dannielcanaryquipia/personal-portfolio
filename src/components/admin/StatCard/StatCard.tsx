import { Card } from '@/components/ui/Card/Card';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  /**
   * Animation delay index for staggered reveals
   * 1-5 for sequential staggering
   */
  staggerIndex?: 1 | 2 | 3 | 4 | 5;
}

/**
 * StatCard - Distinctive Frontend Design Component
 * 
 * Uses extreme typography (200 vs 900 weight contrast)
 * Nordic-inspired color accents on dark industrial base
 * Staggered entrance animations with atmospheric depth
 */
export const StatCard = ({ 
  label, 
  value, 
  icon, 
  trend,
  className = '',
  staggerIndex = 1
}: StatCardProps) => {
  const staggerClass = styles[`stagger${staggerIndex}`];
  
  return (
    <Card className={`${styles.statCard} ${staggerClass} ${className}`} hover>
      {/* Atmospheric gradient overlay for depth */}
      <div className={styles.gradientOverlay} />
      
      <Card.Body className={styles.cardBody}>
        <div className={styles.statLayout}>
          {/* Icon with extreme weight styling */}
          <div className={styles.iconContainer}>
            <div className={styles.statIcon}>{icon}</div>
          </div>
          
          <div className={styles.statContent}>
            {/* Value: EXTREME weight (900) for bold impact */}
            <div className={styles.statValue}>{value}</div>
            
            {/* Label: EXTREME weight (200) for elegant contrast */}
            <div className={styles.statLabel}>{label}</div>
            
            {/* Trend indicator with accent color */}
            {trend && (
              <div 
                className={`${styles.statTrend} ${
                  trend.isPositive ? styles.positive : styles.negative
                }`}
              >
                <span className={styles.trendArrow}>
                  {trend.isPositive ? '↑' : '↓'}
                </span>
                <span className={styles.trendValue}>
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Compound component subcomponents for flexible composition
StatCard.Header = Card.Header;
StatCard.Body = Card.Body;
StatCard.Footer = Card.Footer;

// Pre-configured stat card variants following distinctive design
export const StatCardGrid = ({ 
  children,
  className = ''
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`${styles.statGrid} ${className}`}>
    {children}
  </div>
);
