import styles from './MainLayout.module.css';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useSiteSettings } from '@/api/hooks';
import { Navbar } from '@/components/ui/Navbar/Navbar';
import { Container } from '@/components/common/Container/Container';

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
      <Navbar siteName={siteName} />

      {/* Main Content */}
      <main className={styles.main}>
        <Container>{children}</Container>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <Container>
          <div className={styles.footerContent}>
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
        </Container>
      </footer>
    </div>
  );
};
