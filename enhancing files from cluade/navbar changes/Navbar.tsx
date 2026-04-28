import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback, memo } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';

interface NavItem {
  path: string;
  label: string;
}

interface NavbarProps {
  siteName: string;
  navItems?: NavItem[];
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projects' },
  { path: '/certificates', label: 'Certificates' },
  { path: '/contact', label: 'Contact' },
];

const NavLinkItem = memo(({ path, label, onClick }: NavItem & { onClick?: () => void }) => (
  <NavLink
    to={path}
    className={({ isActive }) => (isActive ? styles.active : '')}
    onClick={onClick}
    end={path === '/'}
  >
    {label}
  </NavLink>
));
NavLinkItem.displayName = 'NavLinkItem';

export const Navbar = memo(({ siteName, navItems = DEFAULT_NAV_ITEMS }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
  const closeMobileMenu  = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <NavLink to="/" className={styles.logo}>{siteName}</NavLink>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navItems.map(item => <NavLinkItem key={item.path} {...item} />)}
        </nav>

        {/* Desktop Actions */}
        <div className={styles.desktopActions}>
          <ThemeToggle size="sm" variant="ghost" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer — slides in from the LEFT */}
      <div
        className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.open : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* NOTE: drawer header with siteName intentionally removed */}
        <nav className={styles.mobileNav}>
          {navItems.map(item => (
            <NavLinkItem key={item.path} {...item} onClick={closeMobileMenu} />
          ))}
        </nav>
        <div className={styles.mobileActionsBottom}>
          <ThemeToggle size="md" variant="ghost" showLabel />
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu} aria-hidden="true" />
      )}
    </header>
  );
});
Navbar.displayName = 'Navbar';
