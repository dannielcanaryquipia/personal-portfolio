import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { PdfViewer } from '@/components/ui/PdfViewer';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import styles from './CertificatePreview.module.css';

interface CertificatePreviewProps {
  certificate: {
    id: string;
    title: string;
    file_url: string;
    file_type: 'pdf' | 'image';
    issue_date?: string;
    description?: string;
  };
  onClose: () => void;
}

export const CertificatePreview = ({ certificate, onClose }: CertificatePreviewProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificate.file_url;
    link.download = `${certificate.title}.${certificate.file_type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(certificate.file_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{certificate.title}</h2>
            {certificate.issue_date && (
              <span className={styles.date}>
                Issued: {new Date(certificate.issue_date).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className={styles.headerActions}>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download size={16} />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={handleOpenInNewTab}>
              <ExternalLink size={16} />
              Open
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </div>

        <div className={styles.modalContent}>
          {certificate.file_type === 'pdf' ? (
            certificate.file_url && certificate.file_url.trim() !== '' ? (
              <div className={styles.pdfViewerContainer}>
                <PdfViewer url={certificate.file_url} />
              </div>
            ) : (
              <div className={styles.pdfPreviewCard}>
                <div className={styles.pdfIcon}>
                  <FileText size={64} />
                </div>
                <h3 className={styles.pdfTitle}>{certificate.title}</h3>
                <p className={styles.pdfDescription}>
                  This certificate information is available but no file has been uploaded yet.
                </p>
                <div className={styles.noFileMessage}>
                  <p>No file uploaded yet</p>
                  <span className={styles.noFileSubtext}>
                    Upload a file in the admin panel to enable viewing and downloading
                  </span>
                </div>
              </div>
            )
          ) : (
            certificate.file_url && certificate.file_url.trim() !== '' ? (
              <img
                src={certificate.file_url}
                alt={`Certificate: ${certificate.title}`}
                className={styles.imageViewer}
                loading="lazy"
              />
            ) : (
              <div className={styles.pdfPreviewCard}>
                <div className={styles.pdfIcon} style={{ background: 'var(--color-secondary)' }}>
                  <FileText size={64} />
                </div>
                <h3 className={styles.pdfTitle}>{certificate.title}</h3>
                <p className={styles.pdfDescription}>
                  This certificate information is available but no image file has been uploaded yet.
                </p>
                <div className={styles.noFileMessage}>
                  <p>No file uploaded yet</p>
                  <span className={styles.noFileSubtext}>
                    Upload an image file in the admin panel to enable preview
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {certificate.description && (
          <div className={styles.modalFooter}>
            <p className={styles.description}>{certificate.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
