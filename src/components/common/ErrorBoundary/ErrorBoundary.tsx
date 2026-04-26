import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
import { Button } from '@/components/ui/Button/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    // Custom fallback UI
    if (fallback) {
      return fallback;
    }

    // Default error UI
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>
            <AlertTriangle size={64} />
          </div>
          
          <h1 className={styles.errorTitle}>Something went wrong</h1>
          
          <p className={styles.errorMessage}>
            We&apos;re sorry, but an unexpected error occurred. 
            Please try refreshing the page or go back to the home page.
          </p>

          {error && import.meta.env.DEV && (
            <details className={styles.errorDetails}>
              <summary>Error details</summary>
              <pre className={styles.errorStack}>
                {error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className={styles.errorActions}>
            <Button
              variant="primary"
              onClick={this.resetError}
              className={styles.actionButton}
            >
              <RefreshCw size={18} />
              Try Again
            </Button>
            
            <Button
              variant="secondary"
              onClick={this.handleGoHome}
              className={styles.actionButton}
            >
              <Home size={18} />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
