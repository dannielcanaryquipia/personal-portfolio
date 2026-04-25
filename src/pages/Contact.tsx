import { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useCreateContactMessage, useSiteSettings } from '@/api/hooks';
import styles from './Contact.module.css';
import { Mail, MapPin, Send, Github, Linkedin } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const createMessage = useCreateContactMessage();
  const { data: settings = [] } = useSiteSettings();
  const contactEmail = settings.find(s => s.key === 'contact_email')?.value || 'your-email@example.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMessage.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>
          Have a project in mind or want to collaborate? Let's talk!
        </p>
      </header>

      <div className={styles.grid}>
        {/* Contact Info */}
        <div className={styles.info}>
          <Card className={styles.infoCard}>
            <h3>Contact Information</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Mail size={20} />
                <span>{contactEmail}</span>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={20} />
                <span>Sorsogon, Philippines</span>
              </div>
            </div>
            
            <div className={styles.social}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin size={24} />
              </a>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className={styles.formCard}>
          {submitted ? (
            <div className={styles.success}>
              <Send size={48} />
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Message</label>
                <textarea
                  className={styles.textarea}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                fullWidth
                loading={createMessage.isPending}
              >
                <Send size={18} />
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
