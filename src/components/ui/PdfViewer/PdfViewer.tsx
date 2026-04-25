import styles from './PdfViewer.module.css';

interface PdfViewerProps {
  url: string;
  className?: string;
}

export const PdfViewer = ({ url, className = '' }: PdfViewerProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <iframe
        src={url}
        className={styles.pdfFrame}
        title="PDF Certificate"
        loading="lazy"
      />
    </div>
  );
};
