import { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { CertificatePreview } from '@/components/ui/CertificatePreview';
import { useCertificates } from '@/api/hooks';
import styles from './Certificates.module.css';
import { Award, ExternalLink, FileText, Eye } from 'lucide-react';

const issuerColors: Record<string, 'default' | 'success' | 'info' | 'warning'> = {
  'Anthropic': 'success',
  'Datacamp': 'info',
  'Other': 'default',
};

export const Certificates = () => {
  const { data: certificates = [], isLoading } = useCertificates();
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);

  

  // Group certificates by issuer
  const grouped = certificates.reduce((acc, cert) => {
    const issuer = cert.issuer || 'Other';
    if (!acc[issuer]) acc[issuer] = [];
    acc[issuer].push(cert);
    return acc;
  }, {} as Record<string, typeof certificates>);

  const handlePreview = (cert: typeof certificates[0]) => {
    // Always show preview card, even without files
    setSelectedCertificate(cert);
  };

  const handleClosePreview = () => {
    setSelectedCertificate(null);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Certifications</h1>
        <p className={styles.subtitle}>
          Professional certifications in AI, data engineering, and software development
        </p>
      </header>

      {Object.entries(grouped).map(([issuer, certs]) => (
        <section key={issuer} className={styles.section}>
          <div className={styles.sectionHeader}>
            <Badge variant={issuerColors[issuer] || 'default'} size="md">{issuer}</Badge>
            <span className={styles.count}>{certs.length} certificates</span>
          </div>
          
          <div className={styles.grid}>
            {certs.map((cert) => (
              <Card 
                key={cert.id} 
                hover 
                className={`${styles.certCard} ${styles.clickable}`}
                onClick={() => handlePreview(cert)}
              >
                <div className={styles.certIcon}>
                  {cert.file_type === 'pdf' ? <FileText size={24} /> : <Award size={24} />}
                </div>
                <div className={styles.certContent}>
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  {cert.issue_date && (
                    <span className={styles.date}>
                      Issued: {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
                  )}
                  {cert.description && (
                    <p className={styles.description}>{cert.description}</p>
                  )}
                  {cert.file_url && cert.file_url.trim() !== '' ? (
                    <div className={styles.certActions}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(cert);
                        }}
                        className={styles.previewButton}
                      >
                        <Eye size={14} />
                        Preview
                      </button>
                      <a 
                        href={cert.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        <ExternalLink size={14} />
                        Open
                      </a>
                    </div>
                  ) : (
                    <div className={styles.noFileIndicator}>
                      <span>No file attached</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {certificates.length === 0 && (
        <div className={styles.empty}>
          <Award size={48} />
          <p>No certificates yet. Add some via the admin dashboard!</p>
        </div>
      )}

      {selectedCertificate && (
        <CertificatePreview
          certificate={{
            id: selectedCertificate.id,
            title: selectedCertificate.title,
            file_url: selectedCertificate.file_url!,
            file_type: selectedCertificate.file_type as 'pdf' | 'image',
            issue_date: selectedCertificate.issue_date,
            description: selectedCertificate.description,
          }}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};
