import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.backdrop}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className={`${styles.modal} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Compound Components
Modal.Header = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${styles.header} ${className}`}>{children}</div>
);

Modal.Body = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${styles.body} ${className}`}>{children}</div>
);

Modal.Footer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${styles.footer} ${className}`}>{children}</div>
);

Modal.Title = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`${styles.title} ${className}`}>{children}</h2>
);

Modal.Description = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`${styles.description} ${className}`}>{children}</p>
);
