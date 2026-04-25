import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { useProjects } from '@/api/hooks';
import styles from './Projects.module.css';
import { Github, ExternalLink } from 'lucide-react';

export const Projects = () => {
  const { data: projects = [], isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading projects...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>
          A collection of my work in web development, engineering, and AI
        </p>
      </header>

      <div className={styles.grid}>
        {projects.map((project) => (
          <Card key={project.id} hover className={styles.projectCard}>
            {project.image_url && (
              <div className={styles.imageWrapper}>
                <img src={project.image_url} alt={project.title} className={styles.image} />
              </div>
            )}
            <div className={styles.content}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>
              
              {project.tags && project.tags.length > 0 && (
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                  ))}
                </div>
              )}

              <div className={styles.actions}>
                {project.github_url && (
                  <Button variant="secondary" size="sm" onClick={() => window.open(project.github_url!, '_blank')}>
                    <Github size={16} />
                    Code
                  </Button>
                )}
                {project.live_url && (
                  <Button variant="primary" size="sm" onClick={() => window.open(project.live_url!, '_blank')}>
                    <ExternalLink size={16} />
                    Live Demo
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className={styles.empty}>
          <p>No projects yet. Add some via the admin dashboard!</p>
        </div>
      )}
    </div>
  );
};
