import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { CertificatePreview } from '@/components/ui/CertificatePreview';
import { Skeleton } from '@/components/common/Skeleton';
import { Select } from '@/components/common/Select';
import { useCertificates, useSiteSettings } from '@/api/hooks';
import { useSEO } from '@/utils/seo';
import styles from './Certificates.module.css';
import { Award, ExternalLink, FileText, Eye, Search, Filter } from 'lucide-react';

const issuerColors: Record<string, 'default' | 'success' | 'info' | 'warning'> = {
  'Anthropic': 'success',
  'Datacamp': 'info',
  'Other': 'default',
};

export const Certificates = () => {
  const { data: certificates = [], isLoading } = useCertificates();
  const { data: settings = [] } = useSiteSettings();
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);
  const [selectedIssuer, setSelectedIssuer] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate issuer options dynamically from certificates data
  const issuerOptions = useMemo(() => {
    const issuers = new Set(certificates.map(c => c.issuer || 'Other'));
    return [
      { value: 'all', label: 'All Issuers' },
      ...Array.from(issuers).sort().map(issuer => ({
        value: issuer,
        label: issuer,
      })),
    ];
  }, [certificates]);

  const siteUrl = settings.find(s => s.key === 'site_url')?.value || window.location.origin;
  const siteName = settings.find(s => s.key === 'hero_title')?.value || 'Danniel Canary';

  // SEO for Certificates page
  useSEO({
    title: 'Certificates',
    description: `View ${certificates.length} professional certifications earned by ${siteName} in AI, data engineering, software development, and more.`,
    keywords: ['Certificates', 'Certifications', 'AI', 'Data Engineering', 'Professional Development', 'Credentials'],
    ogUrl: `${siteUrl}/certificates`,
    canonicalUrl: `${siteUrl}/certificates`,
  });

  // Filter certificates based on issuer and search
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      // Issuer filter (exact match)
      const matchesIssuer = 
        selectedIssuer === 'all' || 
        (cert.issuer || 'Other') === selectedIssuer;
      
      // Search filter
      const matchesSearch = 
        searchQuery === '' ||
        cert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesIssuer && matchesSearch;
    });
  }, [certificates, selectedIssuer, searchQuery]);

  // Group filtered certificates by issuer
  const grouped = useMemo(() => {
    return filteredCertificates.reduce((acc, cert) => {
      const issuer = cert.issuer || 'Other';
      if (!acc[issuer]) acc[issuer] = [];
      acc[issuer].push(cert);
      return acc;
    }, {} as Record<string, typeof certificates>);
  }, [filteredCertificates]);

  const handlePreview = (cert: typeof certificates[0]) => {
    setSelectedCertificate(cert);
  };

  const handleClosePreview = () => {
    setSelectedCertificate(null);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Certifications</h1>
          <p className={styles.subtitle}>
            Professional certifications in AI, data engineering, and software development
          </p>
        </header>
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonIcon}>
                <Skeleton variant="circular" width={48} height={48} animation="wave" />
              </div>
              <div className={styles.skeletonContent}>
                <Skeleton variant="text" width="70%" animation="wave" />
                <Skeleton.Text lines={2} animation="wave" />
              </div>
            </div>
          ))}
        </div>
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

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search certificates"
          />
        </div>
        <div className={styles.filterWrapper}>
          <Filter size={18} className={styles.filterIcon} />
          <Select
            options={issuerOptions}
            value={selectedIssuer}
            onChange={setSelectedIssuer}
            placeholder="Filter by issuer"
            className={styles.categorySelect}
          />
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''} found
        </span>
        {(selectedIssuer !== 'all' || searchQuery) && (
          <button 
            className={styles.clearFilters}
            onClick={() => {
              setSelectedIssuer('all');
              setSearchQuery('');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Certificate Groups */}
      {Object.entries(grouped).map(([issuer, certs]) => (
        <section key={issuer} className={styles.section}>
          <div className={styles.sectionHeader}>
            <Badge variant={issuerColors[issuer] || 'default'} size="md">{issuer}</Badge>
            <span className={styles.count}>{certs.length} certificate{certs.length !== 1 ? 's' : ''}</span>
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

      {/* Empty States */}
      {certificates.length === 0 && (
        <div className={styles.empty}>
          <Award size={48} />
          <p>No certificates yet. Add some via the admin dashboard!</p>
        </div>
      )}

      {certificates.length > 0 && filteredCertificates.length === 0 && (
        <div className={styles.empty}>
          <Search size={48} />
          <p>No certificates match your filters.</p>
          <button 
            className={styles.clearFilters}
            onClick={() => {
              setSelectedIssuer('all');
              setSearchQuery('');
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {selectedCertificate && (
        <CertificatePreview
          certificate={{
            id: selectedCertificate.id,
            title: selectedCertificate.title,
            file_url: selectedCertificate.file_url!,
            file_type: selectedCertificate.file_type as 'pdf' | 'image',
            issue_date: selectedCertificate.issue_date || undefined,
            description: selectedCertificate.description || undefined,
          }}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default Certificates;
