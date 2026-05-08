/**
 * useFormValidation Hook
 * Single Responsibility: Generic, reusable form field validation.
 */
import { useState, useCallback } from 'react';

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

type ValidationRuleMap<T> = Partial<Record<keyof T, ValidationRule<any>[]>>;

interface UseFormValidationReturn<T> {
  errors: Partial<Record<keyof T, string>>;
  validate: (field: keyof T, value: any) => boolean;
  validateAll: (values: T) => boolean;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
}

export function useFormValidation<T extends Record<string, any>>(
  rules: ValidationRuleMap<T>,
): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback(
    (field: keyof T, value: any): boolean => {
      const fieldRules = rules[field];
      if (!fieldRules) return true;

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          setErrors(prev => ({ ...prev, [field]: rule.message }));
          return false;
        }
      }
      // Clear error if validation passes
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return true;
    },
    [rules],
  );

  const validateAll = useCallback(
    (values: T): boolean => {
      let isValid = true;
      const newErrors: Partial<Record<keyof T, string>> = {};

      (Object.keys(rules) as Array<keyof T>).forEach(field => {
        const fieldRules = rules[field]!;
        const value = values[field];

        for (const rule of fieldRules) {
          if (!rule.validate(value)) {
            newErrors[field] = rule.message;
            isValid = false;
            break;
          }
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [rules],
  );

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => setErrors({}), []);

  return { errors, validate, validateAll, clearError, clearAllErrors };
}

// ── Rule builders ─────────────────────────────────────────────────────────────

export const Rules = {
  required: (message = 'This field is required'): ValidationRule<any> => ({
    validate: (v) => v !== undefined && v !== null && v !== '',
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (v) => typeof v === 'string' && v.trim().length >= min,
    message: message ?? `Minimum ${min} characters required`,
  }),

  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message,
  }),

  number: (message = 'Must be a valid number'): ValidationRule<any> => ({
    validate: (v) => !isNaN(Number(v)) && isFinite(Number(v)),
    message,
  }),

  positive: (message = 'Must be a positive number'): ValidationRule<any> => ({
    validate: (v) => Number(v) > 0,
    message,
  }),

  custom: <T>(
    validateFn: (value: T) => boolean,
    message: string,
  ): ValidationRule<T> => ({
    validate: validateFn,
    message,
  }),
};
