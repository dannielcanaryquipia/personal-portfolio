import styles from './FormSection.module.css';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

export const FormSection = ({ 
  title, 
  icon, 
  children,
  description 
}: FormSectionProps) => {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
