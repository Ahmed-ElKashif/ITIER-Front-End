import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { StatsCard } from '../../components/StatsCard';
import apiClient from '../../api/client';
import { colors, spacing } from '../../utils/theme';

export const DashboardScreen = () => {
  const [trackData, setTrackData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noTrack, setNoTrack] = useState(false);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setNoTrack(false);

      const response = await apiClient.get('/supervisor/track-overview');
      setTrackData(response.data.data);
    } catch (error: any) {
      console.error('Dashboard error:', error);
      // 403 means supervisor has no track yet
      if (error.response?.status === 403) {
        setNoTrack(true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Dashboard" showLogout />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </View>
    );
  }

  // Supervisor has no track assigned yet
  if (noTrack) {
    return (
      <View style={styles.container}>
        <Header title="Dashboard" showLogout />
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Track Yet</Text>
          <Text style={styles.emptySubtitle}>
            You haven't created a track yet. Contact your admin to get set up,
            or wait for your account to be configured.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchDashboard()}
          >
            <Text style={styles.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Dashboard" showLogout />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchDashboard(true)}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
      >
        {/* Track Info Banner */}
        <View style={styles.trackHeader}>
          <Text style={styles.trackName}>{trackData?.trackName ?? '—'}</Text>
          <Text style={styles.trackSubtitle}>
            {trackData?.totalStudents ?? 0} Students enrolled
          </Text>
        </View>

        {/* Track Stats */}
        <StatsCard
          title="Average Weekly Hours"
          value={trackData?.trackStats?.averageWeeklyHours || '0'}
          subtitle="Per student this week"
          icon="chart-line"
          color={colors.secondary}
        />

        <StatsCard
          title="Most Studied Subject"
          value={trackData?.trackStats?.mostStudiedSubject || 'N/A'}
          subtitle="Across all students this week"
          icon="book-open-variant"
          color={colors.primary}
        />

        <StatsCard
          title="Total Students"
          value={trackData?.totalStudents?.toString() || '0'}
          subtitle="In your track"
          icon="account-group"
          color={colors.secondary}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.md,
  },
  trackHeader: {
    backgroundColor: colors.secondary + '12',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  trackName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  trackSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
