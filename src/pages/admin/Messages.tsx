import { Badge } from '@/components/ui/Badge/Badge';
import { DataTable } from '@/components/admin';
import { useContactMessages, useMarkMessageAsRead } from '@/api/hooks';
import styles from './Messages.module.css';
import { Mail, MailOpen, Reply, Inbox } from 'lucide-react';

export const Messages = () => {
  const { data: messages = [], isLoading } = useContactMessages();
  const markAsRead = useMarkMessageAsRead();

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead.mutateAsync(id);
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  const unreadCount = messages.filter(m => !m.is_read).length;

  const columns = [
    {
      key: 'name',
      header: 'Sender',
      render: (value: string, row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {row.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
          <span>{value}</span>
          {!row.is_read && <Badge variant="danger" size="sm">New</Badge>}
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'message',
      header: 'Message',
      render: (value: string) => (
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          maxWidth: '300px',
          display: 'block'
        }}>
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Mark as Read',
      icon: <MailOpen size={16} />,
      onClick: (row: any) => handleMarkAsRead(row.id),
      variant: 'ghost' as const,
    },
    {
      label: 'Reply',
      icon: <Reply size={16} />,
      onClick: (row: any) => handleReply(row.email),
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Messages</h1>
          <p className={styles.subtitle}>
            {unreadCount > 0 ? (
              <>{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</>
            ) : (
              'All caught up!'
            )}
          </p>
        </div>
      </header>

      <DataTable
        columns={columns}
        data={messages}
        actions={actions}
        emptyMessage="No messages yet"
        emptyIcon={<Inbox size={48} />}
        onRowClick={(row) => !row.is_read && handleMarkAsRead(row.id)}
      />
    </div>
  );
};

export default Messages;
