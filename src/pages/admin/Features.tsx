import { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { useAllFeatures, useCreateFeature, useUpdateFeature, useDeleteFeature } from '@/api/hooks';
import styles from './Features.module.css';
import { Plus, Edit2, Trash2, X, Save, GripVertical, Wrench, Code2, Database, Sparkles, Globe, Zap } from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Wrench', component: Wrench },
  { name: 'Code2', component: Code2 },
  { name: 'Database', component: Database },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Globe', component: Globe },
  { name: 'Zap', component: Zap },
] as const;

export const AdminFeatures = () => {
  const { data: features = [], isLoading } = useAllFeatures();
  const createFeature = useCreateFeature();
  const updateFeature = useUpdateFeature();
  const deleteFeature = useDeleteFeature();

  const [editing, setEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Wrench',
    display_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'Wrench',
      display_order: 0,
      is_active: true,
    });
    setIsCreating(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      display_order: Number(formData.display_order),
    };
    
    if (editing) {
      await updateFeature.mutateAsync({ id: editing, ...data });
    } else {
      await createFeature.mutateAsync(data);
    }
    resetForm();
  };

  const handleEdit = (feature: typeof features[0]) => {
    setEditing(feature.id);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      display_order: feature.display_order,
      is_active: feature.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      await deleteFeature.mutateAsync(id);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icon = AVAILABLE_ICONS.find(i => i.name === iconName);
    return icon ? icon.component : Wrench;
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Features / Expertise</h1>
        <Button 
          variant="primary" 
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Plus size={18} />
          Add Feature
        </Button>
      </header>

      {/* Create/Edit Form */}
      {(isCreating || editing) && (
        <Card className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3>{editing ? 'Edit Feature' : 'New Feature'}</h3>
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
            <div className={styles.textareaWrapper}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div className={styles.selectWrapper}>
              <label className={styles.label}>Icon</label>
              <div className={styles.iconGrid}>
                {AVAILABLE_ICONS.map(({ name, component: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: name })}
                    className={`${styles.iconOption} ${formData.icon === name ? styles.iconSelected : ''}`}
                  >
                    <Icon size={24} />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Display Order"
              type="number"
              value={formData.display_order.toString()}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
            <div className={styles.checkboxWrapper}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <span>Active (visible on website)</span>
              </label>
            </div>
            <div className={styles.formActions}>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={createFeature.isPending || updateFeature.isPending}>
                <Save size={18} />
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Features List */}
      <div className={styles.list}>
        {features.map((feature, index) => {
          const IconComponent = getIconComponent(feature.icon);
          return (
            <Card key={feature.id} className={`${styles.featureCard} ${!feature.is_active ? styles.inactive : ''}`}>
              <div className={styles.featureDrag}>
                <GripVertical size={16} className={styles.dragIcon} />
                <span className={styles.orderNumber}>{index + 1}</span>
              </div>
              <div className={styles.featureIcon}>
                <IconComponent size={24} />
              </div>
              <div className={styles.featureInfo}>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDesc}>{feature.description}</p>
                <div className={styles.featureMeta}>
                  <Badge variant={feature.is_active ? 'success' : 'default'} size="sm">
                    {feature.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className={styles.iconName}>{feature.icon}</span>
                </div>
              </div>
              <div className={styles.featureActions}>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(feature)}>
                  <Edit2 size={16} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(feature.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {features.length === 0 && (
        <div className={styles.empty}>
          <p>No features yet. Click "Add Feature" to add one.</p>
        </div>
      )}
    </div>
  );
};
