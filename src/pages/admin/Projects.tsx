import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useUploadFile, useDeleteFile } from '@/api/hooks';
import styles from './Projects.module.css';
import { Plus, Edit2, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react';

export const AdminProjects = () => {
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [editing, setEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    live_url: '',
    tags: '',
    image_url: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      github_url: '',
      live_url: '',
      tags: '',
      image_url: '',
    });
    setIsCreating(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editing) {
      await updateProject.mutateAsync({ id: editing, ...data });
    } else {
      await createProject.mutateAsync(data);
    }
    resetForm();
  };

  const handleEdit = (project: typeof projects[0]) => {
    setEditing(project.id);
    setFormData({
      title: project.title,
      description: project.description || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      tags: (project.tags || []).join(', '),
      image_url: project.image_url || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject.mutateAsync(id);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <Button 
          variant="primary" 
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Plus size={18} />
          New Project
        </Button>
      </header>

      {/* Create/Edit Form */}
      {(isCreating || editing) && (
        <Card className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3>{editing ? 'Edit Project' : 'New Project'}</h3>
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
              />
            </div>
            <Input
              label="GitHub URL"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            />
            <Input
              label="Live URL"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
            />
            <Input
              label="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, TypeScript, Node.js"
            />
            <div className={styles.imageUploadSection}>
              <label className={styles.label}>Project Image</label>
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
              
              <div className={styles.imagePreviewArea}>
                {formData.image_url ? (
                  <div className={styles.currentImage}>
                    <img src={formData.image_url} alt="Project preview" className={styles.previewImg} />
                  </div>
                ) : (
                  <div className={styles.noImage}>
                    <ImageIcon size={32} />
                    <span>No image uploaded</span>
                  </div>
                )}
              </div>
              
              <div className={styles.imageActions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload size={16} />
                  {formData.image_url ? 'Replace Image' : 'Upload Image'}
                </Button>
                
                {formData.image_url && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={async () => {
                      if (confirm('Remove this image?')) {
                        const fileName = formData.image_url.split('/').pop();
                        if (fileName) {
                          await deleteFile.mutateAsync({ bucket: 'projects', filePath: fileName });
                        }
                        setFormData({ ...formData, image_url: '' });
                      }
                    }}
                    loading={deleteFile.isPending}
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                )}
              </div>
              
              {selectedImage && (
                <div className={styles.selectedImage}>
                  <span>Selected: {selectedImage.name}</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      if (!selectedImage) return;
                      
                      try {
                        const oldFileName = formData.image_url?.split('/').pop();
                        
                        console.log('Uploading image to projects bucket:', selectedImage.name);
                        const { publicUrl } = await uploadFile.mutateAsync({
                          bucket: 'projects',
                          file: selectedImage,
                        });
                        console.log('Upload successful, publicUrl:', publicUrl);
                        
                        if (oldFileName) {
                          console.log('Deleting old image:', oldFileName);
                          await deleteFile.mutateAsync({ bucket: 'projects', filePath: oldFileName });
                        }
                        
                        setFormData({ ...formData, image_url: publicUrl });
                        setSelectedImage(null);
                        alert('Image uploaded successfully!');
                      } catch (error) {
                        console.error('Upload failed:', error);
                        alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
                      }
                    }}
                    loading={uploadFile.isPending}
                  >
                    <Save size={16} />
                    Save Image
                  </Button>
                </div>
              )}
            </div>
            <div className={styles.formActions}>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={createProject.isPending || updateProject.isPending}>
                <Save size={18} />
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Projects List */}
      <div className={styles.list}>
        {projects.map((project) => (
          <Card key={project.id} className={styles.projectCard}>
            <div className={styles.projectInfo}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDesc}>{project.description}</p>
              {project.tags && project.tags.length > 0 && (
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <Badge key={tag} size="sm">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.projectActions}>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                <Edit2 size={16} />
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className={styles.empty}>
          <p>No projects yet. Click "New Project" to add one.</p>
        </div>
      )}
    </div>
  );
};
