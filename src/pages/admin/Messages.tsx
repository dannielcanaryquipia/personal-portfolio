import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { EmptyState } from '@/components/admin';
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

      <div className={styles.list}>
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`${styles.messageCard} ${!message.is_read ? styles.unread : ''}`}
          >
            <div className={styles.messageHeader}>
              <div className={styles.messageIcon}>
                {message.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
              </div>
              <div className={styles.messageInfo}>
                <h3 className={styles.messageName}>{message.name}</h3>
                <span className={styles.messageEmail}>{message.email}</span>
              </div>
              <div className={styles.messageMeta}>
                {!message.is_read && <Badge variant="danger" size="sm">New</Badge>}
                <span className={styles.messageDate}>
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className={styles.messageBody}>
              <p className={styles.messageText}>{message.message}</p>
            </div>

            <div className={styles.messageActions}>
              {!message.is_read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleMarkAsRead(message.id)}
                >
                  <MailOpen size={16} />
                  Mark as Read
                </Button>
              )}
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => handleReply(message.email)}
              >
                <Reply size={16} />
                Reply
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <EmptyState
          icon={<Inbox size={48} />}
          title="No messages yet"
          description="When visitors send you a message through the contact form, it will appear here."
        />
      )}
    </div>
  );
};

export default Messages;
