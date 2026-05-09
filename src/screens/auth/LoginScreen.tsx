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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthError } from '../../contexts/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { spacing } from '../../utils/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from "../../contexts/ThemeContext";

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
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
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

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.lg }]}
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

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceAlt || colors.background },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 1.5,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  form: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loginButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  registerLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  registerText: { fontSize: 14, color: colors.textSecondary },
  registerTextBold: { color: colors.primary, fontWeight: '700' },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted || colors.textSecondary,
    marginBottom: spacing.sm,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
