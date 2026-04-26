import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './ProtectedRoute.module.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  fallback,
  redirectTo = '/admin/login',
}: ProtectedRouteProps) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      fallback || (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading...</p>
        </div>
      )
    );
  }

  if (!session) {
    // Redirect to login, preserving the intended destination
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};
