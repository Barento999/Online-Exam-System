import { useState, useCallback } from "react";

/**
 * Custom hook for form validation with real-time feedback
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationRules - Function that returns validation rules
 * @returns {Object} Form validation state and handlers
 */
export const useFormValidation = (initialValues = {}, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (fieldName, value) => {
      const rules = validationRules(values);
      const fieldRules = rules[fieldName];

      if (!fieldRules) return null;

      for (const rule of fieldRules) {
        const error = rule(value, values);
        if (error) return error;
      }

      return null;
    },
    [validationRules, values],
  );

  /**
   * Validate all fields
   */
  const validateAll = useCallback(() => {
    const rules = validationRules(values);
    const newErrors = {};

    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules, validateField]);

  /**
   * Handle field change with real-time validation
   */
  const handleChange = useCallback(
    (fieldName, value) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));

      // Only validate if field has been touched
      if (touched[fieldName]) {
        const error = validateField(fieldName, value);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error || undefined,
        }));
      }
    },
    [touched, validateField],
  );

  /**
   * Handle field blur (mark as touched and validate)
   */
  const handleBlur = useCallback(
    (fieldName) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));

      // Validate on blur
      const error = validateField(fieldName, values[fieldName]);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error || undefined,
      }));
    },
    [values, validateField],
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Set form values programmatically
   */
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  /**
   * Check if form is valid
   */
  const isValid = Object.keys(errors).length === 0;

  /**
   * Check if form has been modified
   */
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isValidating,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    validateAll,
    validateField,
    resetForm,
    setFormValues,
    setErrors,
    setTouched,
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  required:
    (message = "This field is required") =>
    (value) => {
      if (!value || (typeof value === "string" && !value.trim())) {
        return message;
      }
      return null;
    },

  email:
    (message = "Invalid email address") =>
    (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message;
      }
      return null;
    },

  minLength:
    (min, message = `Must be at least ${min} characters`) =>
    (value) => {
      if (value && value.length < min) {
        return message;
      }
      return null;
    },

  maxLength:
    (max, message = `Must be at most ${max} characters`) =>
    (value) => {
      if (value && value.length > max) {
        return message;
      }
      return null;
    },

  min:
    (min, message = `Must be at least ${min}`) =>
    (value) => {
      if (value !== "" && value !== null && value !== undefined) {
        const num = Number(value);
        if (!isNaN(num) && num < min) {
          return message;
        }
      }
      return null;
    },

  max:
    (max, message = `Must be at most ${max}`) =>
    (value) => {
      if (value !== "" && value !== null && value !== undefined) {
        const num = Number(value);
        if (!isNaN(num) && num > max) {
          return message;
        }
      }
      return null;
    },

  pattern:
    (regex, message = "Invalid format") =>
    (value) => {
      if (value && !regex.test(value)) {
        return message;
      }
      return null;
    },

  match:
    (fieldName, message = "Fields do not match") =>
    (value, allValues) => {
      if (value && value !== allValues[fieldName]) {
        return message;
      }
      return null;
    },

  custom: (validatorFn) => (value, allValues) => {
    return validatorFn(value, allValues);
  },
};
