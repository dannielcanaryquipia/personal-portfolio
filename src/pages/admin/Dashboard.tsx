import { Card } from '@/components/ui/Card/Card';
import { StatCard, QuickActionButton } from '@/components/admin';
import { useProjects, useCertificates, useContactMessages } from '@/api/hooks';
import styles from './Dashboard.module.css';
import { FolderKanban, Award, MessageSquare, Plus } from 'lucide-react';

export const Dashboard = () => {
  const { data: projects = [] } = useProjects();
  const { data: certificates = [] } = useCertificates();
  const { data: messages = [] } = useContactMessages();

  const unreadMessages = messages.filter(m => !m.is_read).length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Overview of your portfolio</p>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Projects"
          value={projects.length}
          icon={<FolderKanban size={24} />}
        />
        <StatCard
          label="Certificates"
          value={certificates.length}
          icon={<Award size={24} />}
        />
        <StatCard
          label="Unread Messages"
          value={unreadMessages}
          icon={<MessageSquare size={24} />}
        />
      </div>

      {/* Quick Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <QuickActionButton
            icon={<Plus size={20} />}
            label="Add Project"
            to="/admin/projects"
            description="Create a new project"
          />
          <QuickActionButton
            icon={<Plus size={20} />}
            label="Add Certificate"
            to="/admin/certificates"
            description="Upload a new certificate"
          />
          <QuickActionButton
            icon={<Award size={20} />}
            label="Update Status"
            to="/admin/status"
            description="Change your current status"
          />
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

export default Dashboard;
