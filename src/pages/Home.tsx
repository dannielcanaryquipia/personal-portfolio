import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { ProfileImage } from '@/components/ui/ProfileImage/ProfileImage';
import { useStatus, useSiteSettings, useFeatures, useStats, useProjects, useCertificates } from '@/api/hooks';
import { useSEO, personStructuredData, websiteStructuredData } from '@/utils/seo';
import styles from './Home.module.css';
import { Code2, Wrench, Database, Download, Sparkles, Globe, Zap, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Code2,
  Database,
  Sparkles,
  Globe,
  Zap,
};

export const Home = () => {
  const { data: status } = useStatus();
  const { data: settings = [] } = useSiteSettings();
  const { data: features = [] } = useFeatures();
  const { data: stats = [] } = useStats();
  const { data: projects = [] } = useProjects();
  const { data: certificates = [] } = useCertificates();

  const cvUrl = settings.find(s => s.key === 'cv_url')?.value;
  const heroTitle = settings.find(s => s.key === 'hero_title')?.value;
  const heroSubtitle = settings.find(s => s.key === 'hero_subtitle')?.value;
  const aboutText = settings.find(s => s.key === 'about_text')?.value;
  const profileImageUrl = settings.find(s => s.key === 'profile_image_url')?.value;
  const siteUrl = settings.find(s => s.key === 'site_url')?.value || window.location.origin;

  // SEO structured data
  useSEO({
    title: 'Home',
    description: aboutText?.slice(0, 160) || 'Mechanical Engineer & Full-Stack Developer. Building robust, scalable solutions at the intersection of precision engineering and modern software.',
    keywords: ['Danniel Canary', 'Mechanical Engineer', 'Full-Stack Developer', 'React', 'TypeScript', 'Web Development', 'Portfolio'],
    ogImage: profileImageUrl || '/profile-pic/profile.jpg',
    ogUrl: siteUrl,
    canonicalUrl: siteUrl,
    structuredData: [
      personStructuredData({
        name: heroTitle || 'Danniel Canary',
        jobTitle: heroSubtitle || 'Mechanical Engineer & Full-Stack Developer',
        description: aboutText || 'Sorsogon State University graduate passionate about precision engineering and modern web development.',
        image: profileImageUrl || `${siteUrl}/profile-pic/profile.jpg`,
        url: siteUrl,
        email: settings.find(s => s.key === 'contact_email')?.value || undefined,
        sameAs: [
          settings.find(s => s.key === 'github_url')?.value,
          settings.find(s => s.key === 'linkedin_url')?.value,
        ].filter(Boolean) as string[],
        knowsAbout: ['Mechanical Engineering', 'Web Development', 'React', 'TypeScript', 'AI', 'Data Engineering'],
      }),
      websiteStructuredData({
        name: heroTitle || 'Danniel Canary',
        url: siteUrl,
        description: aboutText || 'Portfolio of Danniel Canary - Mechanical Engineer & Full-Stack Developer',
      }),
    ],
  });

  const getIconComponent = (iconName: string): LucideIcon => {
    return ICON_MAP[iconName] || Wrench;
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.statusBadge}>
            {status && (
              <Badge variant={status.color as 'success' | 'warning' | 'danger' | 'info' | 'default'}>
                {status.emoji} {status.label}
              </Badge>
            )}
          </div>
          <h1 className={styles.title}>{heroTitle || 'Danniel Canary'}</h1>
          <p className={styles.subtitle}>{heroSubtitle || 'Mechanical Engineer & Full-Stack Developer'}</p>
          <div className={styles.description}>
            {(aboutText || 'Sorsogon State University graduate passionate about precision engineering and modern web development. Combining mechanical expertise with software engineering to build robust, scalable solutions.')
              .split('\n')
              .filter(paragraph => paragraph.trim() !== '')
              .map((paragraph, index) => (
                <p key={index} className={styles.aboutParagraph}>{paragraph.trim()}</p>
              ))}
          </div>
          <div className={styles.cta}>
            <a href="/projects" className={styles.primaryButton}>View Projects</a>
            <a href="/contact" className={styles.secondaryButton}>Get in Touch</a>
            {cvUrl && (
              <a href={cvUrl} download className={styles.downloadButton}>
                <Download size={18} />
                Download CV
              </a>
            )}
          </div>
        </div>
        <div className={styles.heroImage}>
          <ProfileImage
            src={profileImageUrl || '/profile-pic/profile.jpg'}
            alt={heroTitle || 'Danniel Canary'}
            size="xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Expertise</h2>
        <div className={styles.grid}>
          {features.length > 0 ? (
            features.map((feature) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <Card key={feature.id} hover className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <IconComponent size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              );
            })
          ) : (
            // Fallback static content if no features in database
            <>
              <Card hover className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Wrench size={32} />
                </div>
                <h3>Mechanical Engineering</h3>
                <p>Sorsogon State University graduate with expertise in precision engineering and manufacturing processes.</p>
              </Card>
              
              <Card hover className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Code2 size={32} />
                </div>
                <h3>Web Development</h3>
                <p>Full-stack development with React, TypeScript, and modern frameworks. Building responsive, performant applications.</p>
              </Card>
              
              <Card hover className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Database size={32} />
                </div>
                <h3>Data & AI</h3>
                <p>Certified in SQL, database design, and AI technologies including Claude API and Model Context Protocols.</p>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Stats Section - Live Database Stats */}
      <section className={styles.stats}>
        {/* Live Projects Count */}
        <StatCard value={String(projects.length)} label="Projects" />
        {/* Live Certificates Count */}
        <StatCard value={String(certificates.length)} label="Certifications" />
        {/* Custom Stats from Database */}
        {stats.map((stat) => (
          <StatCard key={stat.key} value={stat.value} label={stat.label} />
        ))}
      </section>
    </div>
  );
};

export default Home;
