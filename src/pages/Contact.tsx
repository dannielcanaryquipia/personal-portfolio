import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/common/Textarea';
import { useCreateContactMessage, useSiteSettings } from '@/api/hooks';
import { useSEO } from '@/utils/seo';
import styles from './Contact.module.css';
import { Mail, MapPin, Send, Github, Linkedin, Calendar } from 'lucide-react';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface FormTouched {
  name?: boolean;
  email?: boolean;
  message?: boolean;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (formData: { name: string; email: string; message: string }): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
};

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [submitted, setSubmitted] = useState(false);
  const createMessage = useCreateContactMessage();
  const { data: settings = [] } = useSiteSettings();
  const contactEmail = settings.find(s => s.key === 'contact_email')?.value || 'your-email@example.com';
  const githubUrl = settings.find(s => s.key === 'github_url')?.value || 'https://github.com';
  const linkedinUrl = settings.find(s => s.key === 'linkedin_url')?.value || 'https://linkedin.com';
  const calendlyUrl = settings.find(s => s.key === 'calendly_url')?.value;
  const siteUrl = settings.find(s => s.key === 'site_url')?.value || window.location.origin;
  const siteName = settings.find(s => s.key === 'hero_title')?.value || 'Danniel Canary';

  // SEO for Contact page
  useSEO({
    title: 'Contact',
    description: `Get in touch with ${siteName}. Have a project in mind or want to collaborate? Send a message or schedule a call.`,
    keywords: ['Contact', 'Hire', 'Collaboration', 'Freelance', 'Web Development', 'Engineering'],
    ogUrl: `${siteUrl}/contact`,
    canonicalUrl: `${siteUrl}/contact`,
  });

  // Real-time validation
  const validateField = useCallback((name: keyof typeof formData, value: string) => {
    const fieldErrors = validateForm({ ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
  }, [formData]);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate if field was already touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof typeof formData) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, message: true });
    
    // Validate all fields
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      await createMessage.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', message: '' });
    setTouched({});
    setErrors({});
  };

  const isFormValid = Object.keys(validateForm(formData)).length === 0;

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
                <a href={`mailto:${contactEmail}`} className={styles.contactLink}>
                  {contactEmail}
                </a>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={20} />
                <span>Sorsogon, Philippines</span>
              </div>
              {calendlyUrl && (
                <div className={styles.infoItem}>
                  <Calendar size={20} />
                  <a 
                    href={calendlyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    Schedule a call
                  </a>
                </div>
              )}
            </div>
            
            <div className={styles.social}>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <Github size={24} />
              </a>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
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
              <Button variant="secondary" onClick={handleSendAnother}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <Input
                label="Name"
                id="contact-name"
                value={formData.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name ? errors.name : undefined}
                required
                autoComplete="name"
                disabled={createMessage.isPending}
              />
              <Input
                label="Email"
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                required
                autoComplete="email"
                disabled={createMessage.isPending}
              />
              <Textarea
                label="Message"
                id="contact-message"
                value={formData.message}
                onChange={handleChange('message')}
                onBlur={handleBlur('message')}
                error={touched.message ? errors.message : undefined}
                helperText="Minimum 10 characters"
                rows={5}
                required
                disabled={createMessage.isPending}
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                fullWidth
                loading={createMessage.isPending}
                disabled={!isFormValid && Object.keys(touched).length > 0}
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
