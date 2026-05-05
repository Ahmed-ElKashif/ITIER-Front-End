import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors, spacing } from '../utils/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.editable === false && styles.inputDisabled,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
