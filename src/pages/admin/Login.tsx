import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './Login.module.css';
import { Lock, Chrome, Github } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithOAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError('');
    setLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth sign in failed');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <Lock size={32} />
          </div>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <div className={styles.oauthButtons}>
          <Button 
            type="button"
            variant="secondary" 
            size="lg" 
            fullWidth
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className={styles.oauthButton}
          >
            <Chrome size={20} />
            Google
          </Button>
          <Button 
            type="button"
            variant="secondary" 
            size="lg" 
            fullWidth
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className={styles.oauthButton}
          >
            <Github size={20} />
            GitHub
          </Button>
        </div>

        <div className={styles.footer}>
          <a href="/" className={styles.backLink}>
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
};
