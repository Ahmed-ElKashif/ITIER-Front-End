/**
 * AdminDashboardScreen — Phase 2
 * Responsibility: Display system-wide metrics and health overview.
 *
 * Architecture:
 * - Uses useAdmin hook for all data (no direct API calls here)
 * - Composes MetricCard and ProgressBar components
 * - StatusBreakdown is extracted as a local helper component (SRP)
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MetricCard } from '../../components/domain/MetricCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Header } from '../../components/Header';
import { useAdmin } from '../../hooks/useAdmin';
import { spacing } from '../../utils/theme';
import { useTheme } from "../../contexts/ThemeContext";

export const AdminDashboardScreen: React.FC = () => {
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { dashboardStats, isLoading, fetchDashboard } = useAdmin();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboardStats) {
    return (
      <View style={styles.container}>
        <Header title="Admin Dashboard" showLogout />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.error} />
          <Text style={styles.loadingText}>Loading system data…</Text>
        </View>
      </View>
    );
  }

  const students = dashboardStats?.students;
  const totalStudents = students?.total ?? 0;

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" showLogout />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchDashboard}
            colors={[colors.error]}
            tintColor={colors.error}
          />
        }
      >
        {/* System Overview */}
        <Text style={styles.sectionTitle}>System Overview</Text>

        <MetricCard
          title="Total Students"
          value={students?.total ?? '—'}
          subtitle={`${students?.active ?? 0} active right now`}
          iconName="people-outline"
          iconColor={colors.primary}
        />

        <MetricCard
          title="Pending Approvals"
          value={students?.pending ?? '—'}
          subtitle="Awaiting supervisor approval"
          iconName="time-outline"
          iconColor={students?.pending ? colors.error : colors.textSecondary}
        />

        <MetricCard
          title="Active Supervisors"
          value={dashboardStats?.supervisors.total ?? '—'}
          subtitle="Managing tracks"
          iconName="person-circle-outline"
          iconColor={colors.secondary}
        />

        <MetricCard
          title="Active Tracks"
          value={dashboardStats?.tracks.active ?? '—'}
          subtitle={`${dashboardStats?.tracks.total ?? 0} tracks total`}
          iconName="school-outline"
          iconColor={colors.primary}
        />

        {/* Study Activity */}
        <Text style={styles.sectionTitle}>Study Activity</Text>

        <MetricCard
          title="Total Study Hours"
          value={dashboardStats?.studyActivity.totalHours ?? '0'}
          subtitle={`${dashboardStats?.studyActivity.totalEntries ?? 0} study entries logged`}
          iconName="time-outline"
          iconColor={colors.secondary}
        />

        {/* Student Status Breakdown */}
        {students && totalStudents > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.subsectionTitle}>Student Status Breakdown</Text>

            <ProgressBar
              label={`Active (${students.active})`}
              value={students.active}
              max={totalStudents}
              color={colors.secondary}
              showPercentage
            />
            <ProgressBar
              label={`Pending (${students.pending})`}
              value={students.pending}
              max={totalStudents}
              color={colors.primary}
              showPercentage
            />
            <ProgressBar
              label={`Suspended (${students.suspended})`}
              value={students.suspended}
              max={totalStudents}
              color={colors.error}
              showPercentage
            />
            <ProgressBar
              label={`Archived (${students.archived ?? 0})`}
              value={students.archived ?? 0}
              max={totalStudents}
              color={colors.textSecondary}
              showPercentage
            />
          </View>
        )}

        {/* Empty state */}
        {!dashboardStats && !isLoading && (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Could not load dashboard data.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchDashboard}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  breakdownCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
  retryButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
