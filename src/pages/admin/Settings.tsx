import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { FormSection, FormField, ImageUpload } from '@/components/admin';
import { useSiteSettings, useUpdateSiteSetting, useUploadFile, useDeleteFile, useAllStats, useUpdateStat, useDeleteStat, useProjects, useCertificates, useContactMessages } from '@/api/hooks';
import styles from './Settings.module.css';
import { Settings2, Save, BarChart3, Trash2, FileText } from 'lucide-react';

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
  const { data: stats = [] } = useAllStats();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  const { data: projects = [] } = useProjects();
  const { data: certificates = [] } = useCertificates();
  const { data: messages = [] } = useContactMessages();

  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [statsData, setStatsData] = useState<Record<string, { label: string; value: string }>>({});

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

      {/* Site Content Section */}
      <FormSection
        title="Site Content"
        icon={<Settings2 size={20} />}
        description="Manage your portfolio's main content including hero section and about text."
      >
        <FormField label="Hero Title">
          <div className={styles.formGroup}>
            <Input
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
        </FormField>

        <FormField label="Profile Picture" helperText="Upload a professional profile picture (JPG, PNG, WebP)">
          <ImageUpload
            currentUrl={formData.profile_image_url}
            onUpload={async (file) => {
              const oldFileName = formData.profile_image_url?.split('/').pop();
              const { publicUrl } = await uploadFile.mutateAsync({
                bucket: 'profile',
                file,
              });
              if (oldFileName) {
                await deleteFile.mutateAsync({ bucket: 'profile', filePath: oldFileName });
              }
              await updateSetting.mutateAsync({ key: 'profile_image_url', value: publicUrl });
              setFormData({ ...formData, profile_image_url: publicUrl });
            }}
            onRemove={async () => {
              const fileName = formData.profile_image_url.split('/').pop();
              if (fileName) {
                await deleteFile.mutateAsync({ bucket: 'profile', filePath: fileName });
              }
              await updateSetting.mutateAsync({ key: 'profile_image_url', value: '' });
              setFormData({ ...formData, profile_image_url: '' });
            }}
            accept=".jpg,.jpeg,.png,.webp"
            label="Select Image"
            fileType="image"
          />
        </FormField>

        <FormField label="Hero Subtitle">
          <div className={styles.formGroup}>
            <Input
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
        </FormField>

        <FormField label="About Text" helperText="Use line breaks to separate paragraphs for better readability">
          <div className={styles.formGroupFull}>
            <textarea
              className={styles.textarea}
              value={formData.about_text}
              onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
              rows={10}
              placeholder="Enter your bio here. Use line breaks to create paragraphs..."
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSave('about_text')}
              loading={updateSetting.isPending}
              className={styles.saveBtn}
              style={{ alignSelf: 'flex-end' }}
            >
              <Save size={16} />
              Save
            </Button>
          </div>
        </FormField>

        <FormField label="Contact Email">
          <div className={styles.formGroup}>
            <Input
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
        </FormField>
      </FormSection>

      {/* CV / Resume Section */}
      <FormSection
        title="CV / Resume"
        icon={<FileText size={20} />}
        description="Upload your CV or resume file for visitors to download."
      >
        <FormField label="Resume File" helperText="Upload your CV in PDF, DOC, or DOCX format">
          <ImageUpload
            currentUrl={formData.cv_url}
            onUpload={async (file) => {
              const oldFileName = formData.cv_url?.split('/').pop();
              const { publicUrl } = await uploadFile.mutateAsync({
                bucket: 'cv',
                file,
              });
              if (oldFileName) {
                await deleteFile.mutateAsync({ bucket: 'cv', filePath: oldFileName });
              }
              await updateSetting.mutateAsync({ key: 'cv_url', value: publicUrl });
              setFormData({ ...formData, cv_url: publicUrl });
            }}
            onRemove={async () => {
              const fileName = formData.cv_url.split('/').pop();
              if (fileName) {
                await deleteFile.mutateAsync({ bucket: 'cv', filePath: fileName });
              }
              await updateSetting.mutateAsync({ key: 'cv_url', value: '' });
              setFormData({ ...formData, cv_url: '' });
            }}
            accept=".pdf,.doc,.docx"
            label="Upload CV"
            fileType="file"
          />
        </FormField>
      </FormSection>

      {/* Stats & Metrics Section */}
      <FormSection
        title="Stats & Metrics"
        icon={<BarChart3 size={20} />}
        description="View live database statistics and manage custom stats displayed on your website."
      >
        <div className={styles.formGroupFull}>
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

        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={handleSaveAll}
            loading={updateSetting.isPending}
          >
            Save All Changes
          </Button>
        </div>
      </FormSection>
    </div>
  );
};

export default Settings;
