/**
 * KPIDashboardScreen — Phase 2
 * Responsibility: Display track analytics and KPI metrics for a supervisor.
 *
 * Clean Architecture:
 * - Uses useAnalytics hook (no direct API calls)
 * - Composed from MetricCard and ProgressBar
 * - Three sections: Engagement, Subjects, Students (at-risk + top)
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MetricCard } from '../../components/domain/MetricCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Header } from '../../components/Header';
import { useAnalytics } from '../../hooks/useAnalytics';
import { colors, spacing } from '../../utils/theme';

export const KPIDashboardScreen: React.FC = () => {
  const {
    overview,
    isLoading,
    fetchAnalytics,
    getEngagementRate,
    getTopStudents,
    getAtRiskStudents,
  } = useAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading && !overview) {
    return (
      <View style={styles.container}>
        <Header title="KPI Dashboard" showLogout />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.loadingText}>Fetching track analytics…</Text>
        </View>
      </View>
    );
  }

  const engagementRate = getEngagementRate();
  const topStudents = getTopStudents(5);
  const atRiskStudents = getAtRiskStudents();

  // Build subject list from overview if available
  const subjects = overview?.students
    .flatMap(s => s.subjects)
    .reduce<Record<string, number>>((acc, subject) => {
      acc[subject] = (acc[subject] ?? 0) + 1;
      return acc;
    }, {});
  const subjectEntries = Object.entries(subjects ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxSubjectCount = subjectEntries[0]?.[1] ?? 1;

  return (
    <View style={styles.container}>
      <Header title="KPI Dashboard" showLogout />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchAnalytics}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
      >
        {/* Track info banner */}
        {overview?.track && (
          <View style={styles.trackBanner}>
            <Ionicons name="school" size={20} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.trackName}>{overview.track.name}</Text>
              {overview.track.description ? (
                <Text style={styles.trackDesc} numberOfLines={1}>
                  {overview.track.description}
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {/* Engagement */}
        <Text style={styles.sectionTitle}>Student Engagement</Text>

        <MetricCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          subtitle={`${overview?.students.filter(s => parseFloat(s.weeklyHours) > 0).length ?? 0} of ${overview?.totalStudents ?? 0} students active this week`}
          iconName="pulse-outline"
          iconColor={engagementRate >= 60 ? colors.secondary : colors.error}
        />

        <MetricCard
          title="Avg Weekly Hours"
          value={overview?.stats.averageWeeklyHours ?? '0'}
          subtitle="Hours per student per week"
          iconName="time-outline"
          iconColor={colors.primary}
        />

        <MetricCard
          title="Total Students"
          value={overview?.totalStudents ?? '—'}
          subtitle={
            overview?.track.maxStudents
              ? `Capacity: ${overview.track.maxStudents}`
              : 'No capacity limit set'
          }
          iconName="people-outline"
          iconColor={colors.primary}
        />

        {/* Subject Distribution */}
        {subjectEntries.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Most Studied Subjects</Text>
            <View style={styles.card}>
              {subjectEntries.map(([subject, count]) => (
                <ProgressBar
                  key={subject}
                  label={subject}
                  value={count}
                  max={maxSubjectCount}
                  color={colors.primary}
                  showPercentage
                />
              ))}
            </View>
          </>
        )}

        {/* At-Risk Students */}
        {atRiskStudents.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              ⚠️ Needs Attention ({atRiskStudents.length})
            </Text>
            <View style={[styles.card, styles.alertCard]}>
              {atRiskStudents.map(student => (
                <View key={student.userId} style={styles.listItem}>
                  <View style={styles.studentAvatar}>
                    <Text style={styles.avatarText}>
                      {student.fullName.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName}>{student.fullName}</Text>
                    <Text style={styles.studentDetail}>
                      {student.lastActive
                        ? `Last active: ${new Date(student.lastActive).toLocaleDateString()}`
                        : 'No activity recorded'}
                    </Text>
                  </View>
                  <Text style={styles.riskBadge}>0h this week</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Top Performers */}
        {topStudents.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🏆 Top Performers</Text>
            <View style={[styles.card, styles.topCard]}>
              {topStudents.map((student, idx) => (
                <View key={student.userId} style={styles.listItem}>
                  <View style={[styles.rankBadge, idx === 0 && styles.rankFirst]}>
                    <Text style={[styles.rankText, idx === 0 && styles.rankFirstText]}>
                      #{idx + 1}
                    </Text>
                  </View>
                  <Text style={[styles.studentName, { flex: 1 }]}>
                    {student.fullName}
                  </Text>
                  <Text style={styles.hoursText}>{student.totalHours}h</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Empty state */}
        {!overview && !isLoading && (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={56} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No analytics data yet</Text>
            <Text style={styles.emptySubtext}>
              Data appears once students start logging study hours
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchAnalytics}>
              <Text style={styles.retryText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  trackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.secondary + '12',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  trackName: { fontSize: 15, fontWeight: '700', color: colors.text },
  trackDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertCard: {
    borderColor: colors.error + '40',
    backgroundColor: colors.error + '08',
  },
  topCard: {
    borderColor: colors.secondary + '40',
    backgroundColor: colors.secondary + '08',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', color: colors.error, fontSize: 14 },
  studentName: { fontSize: 15, fontWeight: '600', color: colors.text },
  studentDetail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  riskBadge: {
    fontSize: 11,
    color: colors.error,
    fontWeight: '700',
    backgroundColor: colors.error + '15',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankFirst: { backgroundColor: '#FFD70025' },
  rankText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  rankFirstText: { color: '#B8860B' },
  hoursText: { fontSize: 15, fontWeight: '700', color: colors.secondary },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.sm,
  },
  emptyText: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  retryBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
