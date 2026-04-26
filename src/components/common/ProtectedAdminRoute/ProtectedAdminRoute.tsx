import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './ProtectedAdminRoute.module.css';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedAdminRoute = ({
  children,
  fallback,
  redirectTo = '/unauthorized',
}: ProtectedAdminRouteProps) => {
  const { session, loading, isAdmin, roleLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth or role
  if (loading || roleLoading) {
    return (
      fallback || (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Verifying admin access...</p>
        </div>
      )
    );
  }

  // Not authenticated - redirect to login
  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Authenticated but not admin - redirect to unauthorized page
  if (!isAdmin) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  // User is authenticated and has admin role
  return <>{children}</>;
};
