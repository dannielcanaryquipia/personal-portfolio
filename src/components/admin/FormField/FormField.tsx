import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField = ({ label, error, helperText, required, children }: FormFieldProps) => {
  return (
    <div className={styles.formField}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputWrapper}>{children}</div>
      {error && <div className={styles.error}>{error}</div>}
      {helperText && !error && <div className={styles.helperText}>{helperText}</div>}
    </div>
  );
};
