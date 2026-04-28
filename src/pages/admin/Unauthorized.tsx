import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import styles from './Unauthorized.module.css';

export const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <ShieldAlert size={64} />
        </div>
        
        <h1 className={styles.title}>Access Denied</h1>
        
        <p className={styles.message}>
          You don't have permission to access the admin panel.
          Only authorized administrators can view this page.
        </p>
        
        <div className={styles.actions}>
          <Link to="/" className={styles.link}>
            <Button variant="secondary" size="lg">
              <Home size={18} />
              Go Home
            </Button>
          </Link>
          
          <Link to="/admin/login" className={styles.link}>
            <Button variant="primary" size="lg">
              <ArrowLeft size={18} />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
