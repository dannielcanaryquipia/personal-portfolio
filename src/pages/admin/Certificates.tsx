import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { useCertificates, useCreateCertificate, useUpdateCertificate, useDeleteCertificate, useUploadFile, useDeleteFile } from '@/api/hooks';
import { supabase } from '@/api/supabase';
import styles from './Certificates.module.css';
import { Plus, Edit2, Trash2, X, Save, FileText, Upload } from 'lucide-react';

export const AdminCertificates = () => {
  const { data: certificates = [], isLoading } = useCertificates();
  const createCertificate = useCreateCertificate();
  const updateCertificate = useUpdateCertificate();
  const deleteCertificate = useDeleteCertificate();

  const [editing, setEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    file_url: '',
    file_type: 'pdf',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Debug: Track selectedFile changes
  useEffect(() => {
    console.log('selectedFile state changed:', selectedFile);
  }, [selectedFile]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      file_url: '',
      file_type: 'pdf',
      description: '',
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsCreating(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('handleSubmit called with formData:', formData);
    console.log('selectedFile:', selectedFile);
    console.log('editing:', editing);

    // Validation: Check if user tried to upload but didn't select a file
    if (!editing && !selectedFile && !formData.file_url) {
      alert('⚠️ Please select a certificate file to upload before saving.');
      return;
    }

    let fileUrl = formData.file_url;
    let uploadSuccess = false;

    // If there's a selected file, upload it first
    if (selectedFile) {
      setIsUploading(true);
      try {
        const oldFileName = formData.file_url?.split('/').pop();

        console.log('Starting file upload:', selectedFile.name);
        const { publicUrl, filePath } = await uploadFile.mutateAsync({
          bucket: 'certificates',
          file: selectedFile,
        });

        console.log('File uploaded successfully:', { publicUrl, filePath });

        // Verification: Try to fetch the file to ensure it actually exists
        try {
          const response = await fetch(publicUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log('File verified via HEAD request');
            uploadSuccess = true;
          } else {
            console.error('File HEAD request failed:', response.status, response.statusText);
            throw new Error(`File verification failed: ${response.status} ${response.statusText}`);
          }
        } catch (verifyError) {
          console.error('Verification fetch failed:', verifyError);
          throw new Error('File uploaded but cannot be accessed. Please check storage policies.');
        }

        if (oldFileName) {
          await deleteFile.mutateAsync({ bucket: 'certificates', filePath: oldFileName });
        }

        fileUrl = publicUrl;
        console.log('Set fileUrl to:', fileUrl);
      } catch (error) {
        console.error('Upload failed:', error);
        let errorMessage = 'Upload failed';

        if (error instanceof Error) {
          if (error.message.includes('bucket') || error.message.includes('Bucket')) {
            errorMessage = 'Storage bucket not found. Please create the "certificates" bucket in Supabase Dashboard first.';
          } else if (error.message.includes('permission') || error.message.includes('policy')) {
            errorMessage = 'Permission denied. Please check storage policies in Supabase.';
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            errorMessage = 'Upload failed: ' + error.message;
          }
        }

        alert(errorMessage);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const data = {
      ...formData,
      file_url: fileUrl,
      issue_date: formData.issue_date || null,
      expiry_date: formData.expiry_date || null,
    };

    console.log('Final certificate data to save:', data);

    try {
      // Only save to database if file upload was successful (or no file selected)
      if (selectedFile && !uploadSuccess) {
        console.error('❌ File upload failed, not saving certificate');
        alert('❌ File upload failed. Certificate not saved. Please try again.');
        return;
      }

      let savedCertificate;
      if (editing) {
        savedCertificate = await updateCertificate.mutateAsync({ id: editing, ...data });
      } else {
        savedCertificate = await createCertificate.mutateAsync(data);
      }

      console.log('✅ Certificate saved to database:', savedCertificate);

      // Final verification: Check if file_url was actually saved (only if file was uploaded)
      if (selectedFile && uploadSuccess) {
        // Give the database a moment to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify the saved certificate has the file_url
        const { data: verifyCert } = await supabase
          .from('certificates')
          .select('file_url')
          .eq('id', savedCertificate.id)
          .single();
        
        if (verifyCert?.file_url) {
          console.log('✅ file_url successfully saved to database');
          alert(`✅ Certificate saved successfully!\n\nFile "${selectedFile.name}" uploaded to Supabase storage and saved to database.`);
        } else {
          console.error('❌ file_url not saved to database');
          alert('⚠️ Certificate saved but file URL was not stored. Please try uploading the file again.');
        }
      } else if (selectedFile && !uploadSuccess) {
        alert('❌ File upload failed. Certificate not saved. Please try again.');
        return;
      } else if (!selectedFile && formData.file_url) {
        alert('✅ Certificate updated successfully! (No new file uploaded)');
      } else {
        alert('✅ Certificate saved successfully! (No file attached)');
      }

      resetForm();
    } catch (error) {
      console.error('Failed to save certificate:', error);
      alert('Failed to save certificate: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEdit = (cert: typeof certificates[0]) => {
    setEditing(cert.id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer || '',
      issue_date: cert.issue_date || '',
      expiry_date: cert.expiry_date || '',
      file_url: cert.file_url || '',
      file_type: cert.file_type || 'pdf',
      description: cert.description || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      await deleteCertificate.mutateAsync(id);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  // Group by issuer
  const grouped = certificates.reduce((acc, cert) => {
    if (!acc[cert.issuer]) acc[cert.issuer] = [];
    acc[cert.issuer].push(cert);
    return acc;
  }, {} as Record<string, typeof certificates>);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Certificates</h1>
        <Button 
          variant="primary" 
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Plus size={18} />
          Add Certificate
        </Button>
      </header>

      {/* Create/Edit Form */}
      {(isCreating || editing) && (
        <Card className={styles.formCard}>
          {isUploading && (
            <div className={styles.uploadOverlay}>
              <div className={styles.uploadSpinner} />
              <p>Uploading file to Supabase storage...</p>
              <p className={styles.uploadSubText}>Please wait, this may take a moment</p>
            </div>
          )}
          <div className={styles.formHeader}>
            <h3>{editing ? 'Edit Certificate' : 'New Certificate'}</h3>
            <button onClick={resetForm} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Issuer"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g., Anthropic, Datacamp, Google, etc."
              required
            />
            <Input
              label="Issue Date (Optional)"
              type="date"
              value={formData.issue_date}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            />
            <div className={styles.fileUploadSection}>
              <label className={styles.label}>Certificate File</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  console.log('File input onChange triggered:', file);
                  console.log('e.target.files:', e.target.files);
                  setSelectedFile(file);
                }}
                style={{ 
                  opacity: 0,
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  padding: 0,
                  margin: 0,
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap'
                }}
              />
              
              <div className={styles.filePreviewArea}>
                {formData.file_url ? (
                  <div className={styles.currentFile}>
                    <FileText size={32} />
                    <span className={styles.fileName}>
                      {formData.file_url.split('/').pop() || 'Current File'}
                    </span>
                    <a 
                      href={formData.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.fileViewLink}
                    >
                      View
                    </a>
                  </div>
                ) : (
                  <div className={styles.noFile}>
                    <FileText size={32} />
                    <span>No file uploaded</span>
                  </div>
                )}
              </div>
              
              <div className={styles.fileActions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  {formData.file_url ? 'Replace File' : 'Select File'}
                </Button>

                {formData.file_url && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      if (confirm('Remove this file?')) {
                        const fileName = formData.file_url.split('/').pop();
                        if (fileName) {
                          await deleteFile.mutateAsync({ bucket: 'certificates', filePath: fileName });
                        }
                        setFormData({ ...formData, file_url: '' });
                        setSelectedFile(null);
                      }
                    }}
                    loading={deleteFile.isPending}
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                )}
              </div>

              {selectedFile && (
                <div className={styles.selectedFile}>
                  <FileText size={16} />
                  <span>Selected: {selectedFile.name}</span>
                  <span className={styles.uploadNote}>File will upload when you save</span>
                </div>
              )}
            </div>
            <div className={styles.selectWrapper}>
              <label className={styles.label}>File Type</label>
              <select
                className={styles.select}
                value={formData.file_type}
                onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
              >
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
              </select>
            </div>
            <div className={styles.textareaWrapper}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className={styles.formActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isUploading || uploadFile.isPending || createCertificate.isPending || updateCertificate.isPending}
                disabled={isUploading}
              >
                <Save size={18} />
                {isUploading ? 'Uploading...' : (editing ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Certificates List */}
      {Object.entries(grouped).map(([issuer, certs]) => (
        <section key={issuer} className={styles.section}>
          <div className={styles.sectionHeader}>
            <Badge variant="default" size="md">{issuer}</Badge>
            <span className={styles.count}>{certs.length} certificates</span>
          </div>
          <div className={styles.list}>
            {certs.map((cert) => (
              <Card key={cert.id} className={styles.certCard}>
                <div className={styles.certIcon}>
                  <FileText size={20} />
                </div>
                <div className={styles.certInfo}>
                  <h4 className={styles.certTitle}>{cert.title}</h4>
                  {cert.issue_date && (
                    <span className={styles.certDate}>
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
                  )}
                  {cert.file_url ? (
                    <div className={styles.certFile}>
                      <FileText size={14} />
                      <a 
                        href={cert.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.certFileLink}
                      >
                        View {cert.file_type || 'File'}
                      </a>
                    </div>
                  ) : (
                    <div className={styles.certFile}>
                      <span className={styles.noFile}>No file uploaded</span>
                    </div>
                  )}
                </div>
                <div className={styles.certActions}>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(cert)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(cert.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {certificates.length === 0 && (
        <div className={styles.empty}>
          <p>No certificates yet. Click "Add Certificate" to add one.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
