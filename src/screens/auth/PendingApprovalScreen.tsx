/**
 * PendingApprovalScreen
 *
 * Shown in two cases:
 * 1. After successful registration — student just signed up
 * 2. After login attempt returns errorCode: PENDING_APPROVAL
 *
 * Provides clear instructions and a "Try login again" button.
 * No token is stored at this point — user is not authenticated.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { spacing } from '../../utils/theme';
import { useTheme } from "../../contexts/ThemeContext";

type NavigationProp = StackNavigationProp<AuthStackParamList, 'PendingApproval'>;
type RouteType = RouteProp<AuthStackParamList, 'PendingApproval'>;

interface Props {
  navigation: NavigationProp;
  route: RouteType;
}

export const PendingApprovalScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { username } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={80} color={colors.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Awaiting Approval</Text>

        {/* Username badge */}
        <View style={styles.usernameBadge}>
          <Ionicons name="person-outline" size={16} color={colors.primary} />
          <Text style={styles.usernameText}>{username}</Text>
        </View>

        {/* Status description */}
        <Text style={styles.description}>
          Your registration has been submitted successfully. Your account is
          currently <Text style={styles.highlight}>pending supervisor approval</Text>.
        </Text>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>What happens next?</Text>

          <View style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Your supervisor will review your registration request
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>
              You'll be approved and your account will become active
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Come back and log in once your supervisor approves your account
            </Text>
          </View>
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Approval is typically done within one business day. Contact your
            supervisor if you haven't heard back after 24 hours.
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.tryLoginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={styles.tryLoginText}>Try Login Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backLinkText}>← Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  usernameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '12',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  usernameText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  highlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingTop: 4,
  },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  tryLoginButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tryLoginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    paddingVertical: spacing.sm,
  },
  backLinkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
