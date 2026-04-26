import { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  fileType?: 'image' | 'file';
}

export const ImageUpload = ({
  currentUrl,
  onUpload,
  onRemove,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload',
  fileType = 'image',
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setError('Upload failed. Please try again.');
    }
  };

  const handleRemove = async () => {
    try {
      await onRemove();
    } catch (err) {
      setError('Remove failed. Please try again.');
    }
  };

  const getFileName = () => {
    if (currentUrl) {
      return currentUrl.split('/').pop() || 'Current file';
    }
    return selectedFile?.name || '';
  };

  return (
    <div className={styles.imageUpload}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className={styles.previewArea}>
        {currentUrl ? (
          <div className={styles.currentFile}>
            {fileType === 'image' ? (
              <img src={currentUrl} alt="Preview" className={styles.previewImage} />
            ) : (
              <div className={styles.fileIcon}>
                <FileText size={32} />
              </div>
            )}
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{getFileName()}</span>
              <button
                onClick={handleRemove}
                className={styles.removeButton}
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : selectedFile ? (
          <div className={styles.selectedFile}>
            <div className={styles.fileIcon}>
              <FileText size={32} />
            </div>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className={styles.removeButton}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.noFile}>
            <Upload size={32} />
            <span>No file selected</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={styles.selectButton}
        >
          <Upload size={16} />
          {currentUrl ? 'Replace' : label}
        </button>

        {selectedFile && (
          <button onClick={handleUpload} className={styles.uploadButton}>
            Save
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
