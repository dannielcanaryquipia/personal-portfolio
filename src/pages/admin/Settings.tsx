import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import { useSiteSettings, useUpdateSiteSetting, useUploadFile, useDeleteFile, useAllStats, useUpdateStat, useDeleteStat, useProjects, useCertificates, useContactMessages } from '@/api/hooks';
import styles from './Settings.module.css';
import { Settings2, Save, Upload, Trash2, FileText, BarChart3 } from 'lucide-react';

const DEFAULT_SETTINGS = {
  hero_title: 'Danniel Canary',
  hero_subtitle: 'Mechanical Engineer & Developer',
  about_text: 'Passionate about precision engineering and modern web development.',
  contact_email: 'your-email@example.com',
  cv_url: '',
  profile_image_url: '',
};

export const Settings = () => {
  const { data: settings = [] } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: stats = [] } = useAllStats();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  const { data: projects = [] } = useProjects();
  const { data: certificates = [] } = useCertificates();
  const { data: messages = [] } = useContactMessages();

  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [statsData, setStatsData] = useState<Record<string, { label: string; value: string }>>({});
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const settingsMap = settings.reduce((acc, s) => {
      acc[s.key] = s.value || '';
      return acc;
    }, {} as Record<string, string>);

    setFormData({ ...DEFAULT_SETTINGS, ...settingsMap });
  }, [settings]);

  useEffect(() => {
    if (stats.length === 0) return;

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat.key] = { label: stat.label, value: stat.value };
      return acc;
    }, {} as Record<string, { label: string; value: string }>);

    // Only initialize statsData if it's empty, not on every stats refetch
    setStatsData(prev => {
      if (Object.keys(prev).length === 0) {
        return statsMap;
      }
      return prev;
    });
  }, [stats]);

  const handleSave = async (key: keyof typeof DEFAULT_SETTINGS) => {
    await updateSetting.mutateAsync({ key, value: formData[key] });
  };

  const handleSaveAll = async () => {
    for (const [key, value] of Object.entries(formData)) {
      await updateSetting.mutateAsync({ key, value });
    }
  };

  const handleStatUpdate = async (key: string, field: 'label' | 'value', value: string) => {
    setStatsData(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
    await updateStat.mutateAsync({ key, [field]: value });
  };

  const handleDeleteStat = async (key: string) => {
    if (confirm('Are you sure you want to delete this stat?')) {
      await deleteStat.mutateAsync(key);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your website content</p>
      </header>

      <Card className={styles.settingsCard}>
        <div className={styles.settingsHeader}>
          <Settings2 size={24} />
          <h3>Site Content</h3>
        </div>

        <div className={styles.form}>
          <div className={styles.formGroup}>
            <Input
              label="Hero Title"
              value={formData.hero_title}
              onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
            />
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleSave('hero_title')}
              loading={updateSetting.isPending}
            >
              <Save size={16} />
              Save
            </Button>
          </div>

          {/* Profile Picture Upload */}
          <div className={styles.formGroupFull}>
            <label className={styles.label}>Profile Picture</label>
            <input
              type="file"
              ref={profileInputRef}
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => setSelectedProfileFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            
            <div className={styles.fileUploadSection}>
              <div className={styles.filePreviewArea}>
                {formData.profile_image_url ? (
                  <div className={styles.currentFile}>
                    <img 
                      src={formData.profile_image_url} 
                      alt="Profile" 
                      className={styles.profilePreview}
                      style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span className={styles.fileName}>Current Profile Picture</span>
                  </div>
                ) : (
                  <div className={styles.noFile}>
                    <span>No profile picture</span>
                  </div>
                )}
              </div>
              
              <div className={styles.fileActions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => profileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  {formData.profile_image_url ? 'Replace' : 'Select Image'}
                </Button>

                {formData.profile_image_url && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      if (confirm('Remove profile picture?')) {
                        const fileName = formData.profile_image_url.split('/').pop();
                        if (fileName) {
                          await deleteFile.mutateAsync({ bucket: 'profile', filePath: fileName });
                        }
                        await updateSetting.mutateAsync({ key: 'profile_image_url', value: '' });
                        setFormData({ ...formData, profile_image_url: '' });
                      }
                    }}
                    loading={deleteFile.isPending}
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                )}
              </div>

              {selectedProfileFile && (
                <div className={styles.selectedFile}>
                  <span>Selected: {selectedProfileFile.name}</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      if (!selectedProfileFile) return;
                      
                      try {
                        const oldFileName = formData.profile_image_url?.split('/').pop();
                        
                        console.log('Uploading profile image:', selectedProfileFile.name);
                        const { publicUrl } = await uploadFile.mutateAsync({
                          bucket: 'profile',
                          file: selectedProfileFile,
                        });
                        
                        if (oldFileName) {
                          await deleteFile.mutateAsync({ bucket: 'profile', filePath: oldFileName });
                        }
                        
                        await updateSetting.mutateAsync({ key: 'profile_image_url', value: publicUrl });
                        setFormData({ ...formData, profile_image_url: publicUrl });
                        setSelectedProfileFile(null);
                        alert('Profile picture uploaded successfully!');
                      } catch (error) {
                        console.error('Upload failed:', error);
                        alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
                      }
                    }}
                    loading={uploadFile.isPending}
                  >
                    <Save size={16} />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Hero Subtitle"
              value={formData.hero_subtitle}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
            />
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleSave('hero_subtitle')}
              loading={updateSetting.isPending}
            >
              <Save size={16} />
              Save
            </Button>
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>About Text</label>
            <textarea
              className={styles.textarea}
              value={formData.about_text}
              onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
              rows={4}
            />
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleSave('about_text')}
              loading={updateSetting.isPending}
              className={styles.saveBtn}
            >
              <Save size={16} />
              Save
            </Button>
          </div>

          <div className={styles.formGroup}>
            <Input
              label="Contact Email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleSave('contact_email')}
              loading={updateSetting.isPending}
            >
              <Save size={16} />
              Save
            </Button>
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>CV / Resume File</label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            
            <div className={styles.cvSection}>
              {formData.cv_url ? (
                <div className={styles.cvInfo}>
                  <FileText size={20} />
                  <span className={styles.cvFileName}>
                    {formData.cv_url.split('/').pop() || 'Current CV'}
                  </span>
                  <a 
                    href={formData.cv_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.cvViewLink}
                  >
                    View
                  </a>
                </div>
              ) : (
                <span className={styles.cvNoFile}>No CV uploaded yet</span>
              )}
              
              <div className={styles.cvActions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  {formData.cv_url ? 'Replace' : 'Upload'}
                </Button>
                
                {formData.cv_url && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete the CV?')) {
                        const fileName = formData.cv_url.split('/').pop();
                        if (fileName) {
                          await deleteFile.mutateAsync({ bucket: 'cv', filePath: fileName });
                        }
                        await updateSetting.mutateAsync({ key: 'cv_url', value: '' });
                        setFormData({ ...formData, cv_url: '' });
                      }
                    }}
                    loading={deleteFile.isPending}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
              </div>
              
              {selectedFile && (
                <div className={styles.selectedFile}>
                  <span>Selected: {selectedFile.name}</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      if (!selectedFile) return;
                      
                      try {
                        const oldFileName = formData.cv_url?.split('/').pop();
                        
                        console.log('Uploading file to cv bucket:', selectedFile.name);
                        const { publicUrl } = await uploadFile.mutateAsync({
                          bucket: 'cv',
                          file: selectedFile,
                        });
                        console.log('Upload successful, publicUrl:', publicUrl);
                        
                        if (oldFileName) {
                          console.log('Deleting old file:', oldFileName);
                          await deleteFile.mutateAsync({ bucket: 'cv', filePath: oldFileName });
                        }
                        
                        await updateSetting.mutateAsync({ key: 'cv_url', value: publicUrl });
                        setFormData({ ...formData, cv_url: publicUrl });
                        setSelectedFile(null);
                        alert('CV uploaded successfully!');
                      } catch (error) {
                        console.error('Upload failed:', error);
                        alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
                      }
                    }}
                    loading={uploadFile.isPending}
                  >
                    <Save size={16} />
                    Save CV
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroupFull}>
            <div className={styles.settingsHeader}>
              <BarChart3 size={20} />
              <h3>Stats & Metrics</h3>
            </div>

            {/* Live Database Stats - Read Only */}
            <div className={styles.liveStatsSection}>
              <h4>Live Database Stats</h4>
              <div className={styles.liveStatsGrid}>
                <div className={styles.liveStatItem}>
                  <span className={styles.liveStatValue}>{projects.length}</span>
                  <span className={styles.liveStatLabel}>Projects</span>
                </div>
                <div className={styles.liveStatItem}>
                  <span className={styles.liveStatValue}>{certificates.length}</span>
                  <span className={styles.liveStatLabel}>Certificates</span>
                </div>
                <div className={styles.liveStatItem}>
                  <span className={styles.liveStatValue}>{messages.length}</span>
                  <span className={styles.liveStatLabel}>Messages</span>
                </div>
              </div>
              <p className={styles.liveStatsNote}>These values are automatically calculated from your database and displayed on the website.</p>
            </div>

            {/* Custom Stats */}
            <div className={styles.statsSection}>
              <h4>Current Stats</h4>
              {stats.map((stat) => (
                <div key={stat.key} className={styles.statItem}>
                  <div className={styles.statInputs}>
                    <Input
                      label="Label"
                      value={statsData[stat.key]?.label ?? stat.label}
                      onChange={(e) => handleStatUpdate(stat.key, 'label', e.target.value)}
                    />
                    <Input
                      label="Value"
                      value={statsData[stat.key]?.value ?? stat.value}
                      onChange={(e) => handleStatUpdate(stat.key, 'value', e.target.value)}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteStat(stat.key)}
                      loading={deleteStat.isPending}
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button 
            variant="primary" 
            onClick={handleSaveAll}
            loading={updateSetting.isPending}
          >
            Save All Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
