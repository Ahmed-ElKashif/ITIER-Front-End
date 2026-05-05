import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../../components/Header';
import { StatsCard } from '../../components/StatsCard';
import { supervisorAPI } from '../../api/endpoints';
import { colors, spacing } from '../../utils/theme';

export const DashboardScreen = () => {
  const [trackData, setTrackData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const response = await supervisorAPI.trackOverview();
      setTrackData(response.data.data);
    } catch (error) {
      console.error('Dashboard error:', error);
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
          />
        }
      >
        {/* Track Info */}
        <View style={styles.trackHeader}>
          <Text style={styles.trackName}>{trackData?.trackName}</Text>
          <Text style={styles.trackSubtitle}>
            {trackData?.totalStudents} Students
          </Text>
        </View>

        {/* Track Stats */}
        <StatsCard
          title="Average Weekly Hours"
          value={trackData?.trackStats.averageWeeklyHours || '0'}
          subtitle="Per student across the track"
          icon="chart-line"
          color={colors.secondary}
        />

        <StatsCard
          title="Most Studied Subject"
          value={trackData?.trackStats.mostStudiedSubject || 'N/A'}
          subtitle="Across all students"
          icon="book-open-variant"
          color={colors.primary}
        />

        <StatsCard
          title="Total Students"
          value={trackData?.totalStudents?.toString() || '0'}
          subtitle="Active in your track"
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
  scrollContent: {
    padding: spacing.md,
  },
  trackHeader: {
    backgroundColor: colors.secondary + '10',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  trackName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  trackSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
