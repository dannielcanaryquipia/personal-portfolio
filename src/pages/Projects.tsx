import { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Tag } from '@/components/ui/Tag/Tag';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { ProjectDetail } from '@/components/portfolio/ProjectDetail';
import { useProjects, useSiteSettings } from '@/api/hooks';
import { useSEO, projectStructuredData } from '@/utils/seo';
import styles from './Projects.module.css';
import { Github, ExternalLink, Eye, FolderOpen } from 'lucide-react';
import type { Project } from '@/api/supabase';

export const Projects = () => {
  const { data: projects = [], isLoading } = useProjects();
  const { data: settings = [] } = useSiteSettings();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const siteUrl = settings.find(s => s.key === 'site_url')?.value || window.location.origin;
  const siteName = settings.find(s => s.key === 'hero_title')?.value || 'Danniel Canary';

  // SEO for Projects page
  useSEO({
    title: 'Projects',
    description: `Explore ${projects.length} projects by ${siteName} in web development, engineering, and AI. View case studies with problem statements, solutions, and tech stacks.`,
    keywords: ['Projects', 'Portfolio', 'Web Development', 'React', 'TypeScript', 'Case Studies'],
    ogUrl: `${siteUrl}/projects`,
    canonicalUrl: `${siteUrl}/projects`,
    structuredData: projects.map(p => projectStructuredData({
      name: p.title,
      description: p.description || '',
      url: p.live_url || `${siteUrl}/projects`,
      image: p.image_url || undefined,
      codeRepository: p.github_url || undefined,
      programmingLanguage: p.tags?.filter((t): t is string => t !== null) || [],
    })),
  });

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            A collection of my work in web development, engineering, and AI
          </p>
        </header>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <Skeleton.Card key={i} animation="wave" />
          ))}
        </div>
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
          <Card 
            key={project.id} 
            hover 
            className={styles.projectCard}
            onClick={() => handleViewDetails(project)}
          >
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
                    <Tag key={tag} variant="primary" size="sm">{tag}</Tag>
                  ))}
                </div>
              )}

              <div className={styles.actions}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(project);
                  }}
                >
                  <Eye size={16} />
                  View Details
                </Button>
                {project.github_url && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.github_url!, '_blank');
                    }}
                  >
                    <Github size={16} />
                    Code
                  </Button>
                )}
                {project.live_url && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.live_url!, '_blank');
                    }}
                  >
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
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Add some projects via the admin dashboard to showcase your work!"
        />
      )}

      <ProjectDetail
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default Projects;
