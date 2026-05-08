/**
 * LoginScreen — Phase 2
 *
 * Changes:
 * - On PENDING_APPROVAL errorCode → navigate to PendingApproval screen
 * - On SUSPENDED errorCode → show specific alert (no screen nav)
 * - On ARCHIVED → show rejection message
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthError } from '../../contexts/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors, spacing } from '../../utils/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

interface LoginFormData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'At least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'At least 6 characters'),
});

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      // On success: RootNavigator auto-switches to the correct tab stack
    } catch (error: any) {
      const authErr = error as AuthError;

      // Phase 2: route on errorCode — don't just show a generic alert
      if (authErr.errorCode === 'PENDING_APPROVAL') {
        navigation.navigate('PendingApproval', { username: data.username });
        return;
      }

      if (authErr.errorCode === 'SUSPENDED') {
        Alert.alert(
          '🚫 Account Suspended',
          'Your account has been suspended. Please contact your supervisor for details.',
        );
        return;
      }

      if (authErr.errorCode === 'ARCHIVED') {
        Alert.alert(
          '❌ Registration Not Approved',
          'Your registration was not approved. Please contact your supervisor.',
        );
        return;
      }

      // Generic credential error (401)
      Alert.alert('Login Failed', authErr.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>itier</Text>
          <Text style={styles.subtitle}>Study Tracker for ITI Students</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="Enter your username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            )}
          />

          <Button
            title={isLoading ? 'Logging in…' : 'Login'}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.loginButton}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Phase 2: updated demo credentials */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Demo Credentials</Text>
          <Text style={styles.footerText}>Admin: ahmed_admin / admin123</Text>
          <Text style={styles.footerText}>
            Supervisor: amira_supervisor / supervisor123
          </Text>
          <Text style={styles.footerText}>Student: student1 / password123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: { marginBottom: spacing.xl },
  loginButton: { marginTop: spacing.md },
  registerLink: { marginTop: spacing.lg, alignItems: 'center' },
  registerText: { fontSize: 14, color: colors.textSecondary },
  registerTextBold: { color: colors.primary, fontWeight: '600' },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
});
