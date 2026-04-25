import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { useProjects, useCertificates, useContactMessages } from '@/api/hooks';
import { NavLink } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { FolderKanban, Award, MessageSquare, Plus, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const { data: projects = [] } = useProjects();
  const { data: certificates = [] } = useCertificates();
  const { data: messages = [] } = useContactMessages();

  const unreadMessages = messages.filter(m => !m.is_read).length;

  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderKanban, href: '/admin/projects' },
    { label: 'Certificates', value: certificates.length, icon: Award, href: '/admin/certificates' },
    { label: 'Messages', value: unreadMessages, icon: MessageSquare, href: '/admin/messages', badge: unreadMessages > 0 },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Overview of your portfolio</p>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <NavLink key={stat.label} to={stat.href} className={styles.statCard}>
            <div className={styles.statIcon}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
              {stat.badge && <Badge variant="danger" size="sm">New</Badge>}
            </div>
          </NavLink>
        ))}
      </div>

      {/* Quick Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <NavLink to="/admin/projects" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <Plus size={20} />
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionTitle}>Add Project</span>
              <ArrowRight size={16} />
            </div>
          </NavLink>

          <NavLink to="/admin/certificates" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <Plus size={20} />
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionTitle}>Add Certificate</span>
              <ArrowRight size={16} />
            </div>
          </NavLink>

          <NavLink to="/admin/status" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <Award size={20} />
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionTitle}>Update Status</span>
              <ArrowRight size={16} />
            </div>
          </NavLink>
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Messages</h2>
        <Card className={styles.messagesCard}>
          {messages.slice(0, 5).map((message) => (
            <div key={message.id} className={`${styles.messageItem} ${!message.is_read ? styles.unread : ''}`}>
              <div className={styles.messageHeader}>
                <span className={styles.messageName}>{message.name}</span>
                <span className={styles.messageDate}>
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.messagePreview}>{message.message.slice(0, 100)}...</p>
            </div>
          ))}
          {messages.length === 0 && (
            <p className={styles.empty}>No messages yet</p>
          )}
        </Card>
      </section>
    </div>
  );
};
