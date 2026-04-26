import { useState } from 'react';
import styles from './AccordionGroup.module.css';
import { ChevronDown } from 'lucide-react';

interface AccordionGroupProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const AccordionGroup = ({ 
  title, 
  count, 
  defaultOpen = false, 
  children 
}: AccordionGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.accordion}>
      <button 
        className={`${styles.header} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.titleSection}>
          <ChevronDown 
            size={20} 
            className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`}
          />
          <span className={styles.title}>{title}</span>
          {count !== undefined && (
            <span className={styles.count}>{count} certificate{count !== 1 ? 's' : ''}</span>
          )}
        </div>
      </button>
      <div className={`${styles.content} ${isOpen ? styles.expanded : ''}`}>
        <div className={styles.inner}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionGroup;
