import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { useStatus, useUpdateStatus } from '@/api/hooks';
import styles from './Status.module.css';
import { Activity } from 'lucide-react';

const PRESETS = [
  { label: 'Open to Work', emoji: '🟢', color: 'success' },
  { label: 'In a Project', emoji: '🟡', color: 'warning' },
  { label: 'Not Available', emoji: '🔴', color: 'danger' },
  { label: 'Part-time Only', emoji: '🔵', color: 'info' },
];

export const Status = () => {
  const { data: currentStatus } = useStatus();
  const updateStatus = useUpdateStatus();

  const [customLabel, setCustomLabel] = useState('');
  const [customEmoji, setCustomEmoji] = useState('✨');
  const [customColor, setCustomColor] = useState('success');

  useEffect(() => {
    if (currentStatus) {
      setCustomLabel(currentStatus.label);
      setCustomEmoji(currentStatus.emoji || '✨');
      setCustomColor(currentStatus.color || 'success');
    }
  }, [currentStatus]);

  const handlePresetClick = async (preset: typeof PRESETS[0]) => {
    await updateStatus.mutateAsync({
      label: preset.label,
      emoji: preset.emoji,
      color: preset.color,
      is_active: true,
    });
  };

  const handleCustomUpdate = async () => {
    await updateStatus.mutateAsync({
      label: customLabel,
      emoji: customEmoji,
      color: customColor,
      is_active: true,
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Status Manager</h1>
        <p className={styles.subtitle}>Update your real-time status across the website</p>
      </header>

      {/* Current Status */}
      <Card className={styles.currentCard}>
        <div className={styles.currentHeader}>
          <Activity size={24} />
          <h3>Current Status</h3>
        </div>
        <div className={styles.currentStatus}>
          {currentStatus ? (
            <>
              <span className={styles.statusEmoji}>{currentStatus.emoji}</span>
              <Badge variant={currentStatus.color as 'success' | 'warning' | 'danger' | 'info'} size="md">
                {currentStatus.label}
              </Badge>
              <span className={styles.updateTime}>
                Updated: {new Date(currentStatus.updated_at).toLocaleString()}
              </span>
            </>
          ) : (
            <p className={styles.noStatus}>No active status set</p>
          )}
        </div>
      </Card>

      {/* Presets */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Presets</h3>
        <div className={styles.presetsGrid}>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              className={styles.presetCard}
              onClick={() => handlePresetClick(preset)}
            >
              <span className={styles.presetEmoji}>{preset.emoji}</span>
              <span className={styles.presetLabel}>{preset.label}</span>
              <Badge variant={preset.color as 'success' | 'warning' | 'danger' | 'info'} size="sm">
                {preset.color}
              </Badge>
            </button>
          ))}
        </div>
      </section>

      {/* Custom Status */}
      <Card className={styles.customCard}>
        <h3 className={styles.customTitle}>Custom Status</h3>
        <div className={styles.customForm}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Status Label</label>
              <Input
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g., Available for Consulting"
              />
            </div>
            <div className={styles.formFieldSmall}>
              <label className={styles.label}>Emoji</label>
              <Input
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                placeholder="🟢"
              />
            </div>
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Color</label>
            <div className={styles.colorOptions}>
              {['success', 'warning', 'danger', 'info', 'default'].map((color) => (
                <button
                  key={color}
                  className={`${styles.colorOption} ${customColor === color ? styles.selected : ''}`}
                  onClick={() => setCustomColor(color)}
                >
                  <Badge variant={color as 'success' | 'warning' | 'danger' | 'info' | 'default'} size="sm">
                    {color}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <Button 
            variant="primary" 
            onClick={handleCustomUpdate}
            loading={updateStatus.isPending}
            disabled={!customLabel}
          >
            Update Custom Status
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Status;
