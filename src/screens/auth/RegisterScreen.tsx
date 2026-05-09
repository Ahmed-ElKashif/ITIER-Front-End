/**
 * RegisterScreen — Phase 2
 *
 * Changes from Phase 1:
 * - trackId is now selected via TrackSelector (no longer hardcoded to 1)
 * - role is no longer sent (always STUDENT for self-registration)
 * - After successful register → navigate to PendingApproval (NOT auto-login)
 * - Track capacity 409 errors shown clearly
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
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { TrackSelector } from '../../components/domain/TrackSelector';
import { spacing } from '../../utils/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import type { TrackWithStats } from '../../api/types';
import { useTheme } from "../../contexts/ThemeContext";

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  trackId: number;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'At least 3 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Letters, numbers and underscores only',
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'At least 2 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'At least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackWithStats | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      trackId: 0,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Validate track selection before submitting
    if (!selectedTrack) {
      Alert.alert('Track Required', 'Please select a track to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        trackId: selectedTrack.id,
        // NOTE: role is NOT sent — backend defaults to STUDENT
      });

      // Phase 2: navigate to pending screen — do NOT auto-login
      navigation.replace('PendingApproval', { username: result.username });
    } catch (error: any) {
      // Handle track full (409) and other errors
      const msg = error.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the ITI community</Text>
        </View>

        <View style={styles.form}>
          {/* Personal Info */}
          <Text style={styles.sectionLabel}>Personal Information</Text>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="Choose a username"
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
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your ITI email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
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
                placeholder="Create a password (min 6 chars)"
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Repeat your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            )}
          />

          {/* Phase 2: Track selection */}
          <View style={styles.sectionDivider} />
          <TrackSelector
            selectedTrackId={selectedTrack?.id ?? null}
            onSelect={setSelectedTrack}
          />

          {/* Track error hint */}
          {!selectedTrack && (
            <Text style={styles.trackHint}>
              ⚠️ You must select a track to register
            </Text>
          )}

          <Button
            title={isLoading ? 'Submitting…' : 'Register'}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.registerButton}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceAlt || colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing.xl * 1.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 1.5,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
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
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  trackHint: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  registerButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  loginLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginTextBold: {
    color: colors.primary,
    fontWeight: '700',
  },
  trackContainer: {
    marginBottom: spacing.md,
  },
  trackLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  trackSelector: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 52,
    justifyContent: 'center',
  },
  trackSelectorText: {
    fontSize: 16,
    color: colors.text,
  },
  trackSelectorPlaceholder: {
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text,
  },
  modalItemTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
});
