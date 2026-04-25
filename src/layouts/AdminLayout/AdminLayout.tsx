import { NavLink, Navigate } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Award, 
  MessageSquare, 
  Activity,
  LogOut,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { session, signOut, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await signOut();
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>{sidebarCollapsed ? 'A' : 'Admin'}</h1>
          {!sidebarCollapsed && <p className={styles.userEmail}>{session.user?.email}</p>}
          <button 
            onClick={toggleSidebar} 
            className={styles.collapseBtn}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : ''} end title="Dashboard">
            <LayoutDashboard size={18} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink to="/admin/projects" className={({ isActive }) => isActive ? styles.active : ''} title="Projects">
            <FolderKanban size={18} />
            {!sidebarCollapsed && <span>Projects</span>}
          </NavLink>
          
          <NavLink to="/admin/certificates" className={({ isActive }) => isActive ? styles.active : ''} title="Certificates">
            <Award size={18} />
            {!sidebarCollapsed && <span>Certificates</span>}
          </NavLink>
          
          <NavLink to="/admin/status" className={({ isActive }) => isActive ? styles.active : ''} title="Status">
            <Activity size={18} />
            {!sidebarCollapsed && <span>Status</span>}
          </NavLink>
          
          <NavLink to="/admin/messages" className={({ isActive }) => isActive ? styles.active : ''} title="Messages">
            <MessageSquare size={18} />
            {!sidebarCollapsed && <span>Messages</span>}
          </NavLink>

          <NavLink to="/admin/features" className={({ isActive }) => isActive ? styles.active : ''} title="Features">
            <Sparkles size={18} />
            {!sidebarCollapsed && <span>Features</span>}
          </NavLink>

          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? styles.active : ''} title="Settings">
            <Settings size={18} />
            {!sidebarCollapsed && <span>Settings</span>}
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarActions}>
            <ThemeToggle size="sm" variant="ghost" />
            <Button variant="ghost" onClick={handleLogout} fullWidth={!sidebarCollapsed} className={styles.logoutBtn}>
              <LogOut size={18} />
              {!sidebarCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${styles.main} ${sidebarCollapsed ? styles.mainExpanded : ''}`}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};
