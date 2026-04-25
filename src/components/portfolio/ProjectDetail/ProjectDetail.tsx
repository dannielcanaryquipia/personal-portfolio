import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Github, ExternalLink, X, CheckCircle, Lightbulb, Wrench, Layers } from 'lucide-react';
import styles from './ProjectDetail.module.css';
import type { Project } from '@/api/supabase';

interface ProjectDetailProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetail = ({ project, isOpen, onClose }: ProjectDetailProps) => {
  if (!project) return null;

  // Parse extended fields from description if they exist
  // Expected format: JSON with problem, solution, features, techStack
  let extendedData: {
    problem?: string;
    solution?: string;
    features?: string[];
    techStack?: string[];
  } = {};

  try {
    if (project.description) {
      // Try to parse JSON from description
      const parsed = JSON.parse(project.description);
      if (parsed && typeof parsed === 'object') {
        extendedData = parsed;
      }
    }
  } catch {
    // If parsing fails, treat description as plain text
    extendedData = {
      problem: project.description || undefined,
    };
  }

  const hasExtendedData = extendedData.problem || extendedData.solution || 
                         (extendedData.features && extendedData.features.length > 0) ||
                         (extendedData.techStack && extendedData.techStack.length > 0);

  // If no extended data, show description as-is
  const displayDescription = !hasExtendedData ? project.description : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className={styles.headerContent}>
          {project.image_url && (
            <div className={styles.headerImage}>
              <img src={project.image_url} alt={project.title} />
            </div>
          )}
          <div className={styles.headerInfo}>
            <Modal.Title>{project.title}</Modal.Title>
            {displayDescription && (
              <Modal.Description>{displayDescription}</Modal.Description>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        {hasExtendedData && (
          <div className={styles.sections}>
            {extendedData.problem && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Lightbulb size={20} />
                  Problem Statement
                </h3>
                <p className={styles.sectionContent}>{extendedData.problem}</p>
              </section>
            )}

            {extendedData.solution && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <CheckCircle size={20} />
                  Solution
                </h3>
                <p className={styles.sectionContent}>{extendedData.solution}</p>
              </section>
            )}

            {extendedData.features && extendedData.features.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Wrench size={20} />
                  Key Features
                </h3>
                <ul className={styles.featureList}>
                  {extendedData.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <span className={styles.featureBullet} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {extendedData.techStack && extendedData.techStack.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Layers size={20} />
                  Tech Stack
                </h3>
                <div className={styles.techStack}>
                  {extendedData.techStack.map((tech, index) => (
                    <Badge key={index} variant="info" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!hasExtendedData && !displayDescription && (
          <div className={styles.noDetails}>
            <p>No detailed case study available for this project yet.</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className={styles.footerActions}>
          {project.github_url && (
            <Button
              variant="secondary"
              onClick={() => window.open(project.github_url!, '_blank')}
            >
              <Github size={18} />
              View Code
            </Button>
          )}
          {project.live_url && (
            <Button
              variant="primary"
              onClick={() => window.open(project.live_url!, '_blank')}
            >
              <ExternalLink size={18} />
              Live Demo
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            <X size={18} />
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
