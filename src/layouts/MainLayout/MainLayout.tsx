import { NavLink } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useSiteSettings } from '@/api/hooks';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: settings = [] } = useSiteSettings();
  const heroTitle = settings.find(s => s.key === 'hero_title')?.value;
  const siteName = heroTitle || 'Danniel Canary';
  const contactEmail = settings.find(s => s.key === 'contact_email')?.value || 'your-email@example.com';

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <NavLink to="/" className={styles.logo}>
            {siteName}
          </NavLink>
          
          <nav className={styles.nav}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''} end>
              Home
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => isActive ? styles.active : ''}>
              Projects
            </NavLink>
            <NavLink to="/certificates" className={({ isActive }) => isActive ? styles.active : ''}>
              Certificates
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : ''}>
              Contact
            </NavLink>
          </nav>
          
          <div className={styles.headerActions}>
            <ThemeToggle size="sm" variant="ghost" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          
          <div className={styles.socialLinks}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${contactEmail}`} aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
