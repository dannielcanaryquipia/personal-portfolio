import { useState, useCallback, useMemo } from 'react';

// Validation rule types
export type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | undefined;
};

export type ValidationSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export type FormErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string;
};

export type FormTouched<T extends Record<string, unknown>> = {
  [K in keyof T]?: boolean;
};

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
export const URL_REGEX = /^https?:\/\/.+/;

// Common validation rules
export const commonValidations = {
  email: {
    required: true,
    pattern: EMAIL_REGEX,
  } as ValidationRule<string>,
  url: {
    pattern: URL_REGEX,
  } as ValidationRule<string>,
  requiredString: {
    required: true,
    minLength: 1,
  } as ValidationRule<string>,
};

interface UseFormValidationOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema: ValidationSchema<T>;
  validateOnChange?: boolean;
}

interface UseFormValidationReturn<T extends Record<string, unknown>> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isValid: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setTouched: <K extends keyof T>(field: K, isTouched?: boolean) => void;
  setAllTouched: () => void;
  resetForm: () => void;
  validateField: <K extends keyof T>(field: K, value: T[K]) => string | undefined;
  validateForm: () => FormErrors<T>;
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    error: string | undefined;
  };
}

export function useFormValidation<T extends Record<string, unknown>>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const { initialValues, validationSchema, validateOnChange = true } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouchedState] = useState<FormTouched<T>>({});

  // Validate a single field
  const validateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]): string | undefined => {
      const rules = validationSchema[field];
      if (!rules) return undefined;

      // Required check
      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return `${String(field)} is required`;
      }

      // Skip other validations if value is empty and not required
      if (!value && !rules.required) {
        return undefined;
      }

      // String validations
      if (typeof value === 'string') {
        // Min length
        if (rules.minLength !== undefined && value.length < rules.minLength) {
          return `${String(field)} must be at least ${rules.minLength} characters`;
        }

        // Max length
        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
          return `${String(field)} must be no more than ${rules.maxLength} characters`;
        }

        // Pattern
        if (rules.pattern && !rules.pattern.test(value)) {
          return `Please enter a valid ${String(field)}`;
        }
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(value);
      }

      return undefined;
    },
    [validationSchema]
  );

  // Validate all fields
  const validateForm = useCallback((): FormErrors<T> => {
    const newErrors: FormErrors<T> = {};

    (Object.keys(validationSchema) as Array<keyof T>).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return newErrors;
  }, [values, validationSchema, validateField]);

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(validateForm()).length === 0;
  }, [values, validationSchema, validateForm]);

  // Set a single value
  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));

      if (validateOnChange && touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    },
    [touched, validateOnChange, validateField]
  );

  // Set multiple values
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Set touched state for a field
  const setTouched = useCallback(
    <K extends keyof T>(field: K, isTouched = true) => {
      setTouchedState((prev) => ({ ...prev, [field]: isTouched }));

      if (isTouched && validateOnChange) {
        const error = validateField(field, values[field]);
        setErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    },
    [values, validateOnChange, validateField]
  );

  // Set all fields as touched (useful on form submit)
  const setAllTouched = useCallback(() => {
    const allTouched: FormTouched<T> = {};
    (Object.keys(values) as Array<keyof T>).forEach((key) => {
      allTouched[key] = true;
    });
    setTouchedState(allTouched);
    validateForm();
  }, [values, validateForm]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  // Get field props for easy binding
  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: values[field],
      onChange: (value: T[K]) => setValue(field, value),
      onBlur: () => setTouched(field, true),
      error: touched[field] ? errors[field] : undefined,
    }),
    [values, errors, touched, setValue, setTouched]
  );

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setValues,
    setTouched,
    setAllTouched,
    resetForm,
    validateField,
    validateForm,
    getFieldProps,
  };
}
