import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Header } from '../../components/Header';
import { LeaderboardCard } from '../../components/LeaderboardCard';
import { leaderboardAPI } from '../../api/endpoints';
import { useAuth } from '../../contexts/AuthContext';
import { LeaderboardEntry } from '../../types';
import { colors, spacing } from '../../utils/theme';

type LeaderboardType = 'daily' | 'weekly';

export const LeaderboardScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardType>('daily');
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async (isRefresh = false) => {
    const getWeekStart = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek;
      const weekStart = new Date(now.setDate(diff));
      return weekStart.toISOString().split('T')[0];
    };

    try {
      if (!user || !user.trackId) return;
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const today = new Date().toISOString().split('T')[0];
      const response =
        activeTab === 'daily'
          ? await leaderboardAPI.daily(today, user.trackId)
          : await leaderboardAPI.weekly(getWeekStart(), user.trackId);

      setRankings(response.data.data.rankings);
    } catch (error) {
      console.error('Leaderboard error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const renderRanking = ({ item }: { item: LeaderboardEntry }) => (
    <LeaderboardCard entry={item} isCurrentUser={item.userId === user?.id} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No data yet</Text>
      <Text style={styles.emptySubtext}>
        Student study entries will appear in the leaderboard
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Leaderboard" showLogout />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => setActiveTab('daily')}
        >
          <Text
            style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}
          >
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text
            style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <FlatList
          data={rankings}
          renderItem={renderRanking}
          keyExtractor={(item) => item.userId.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchLeaderboard(true)}
              colors={[colors.secondary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.secondary, // Green theme for supervisor
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.md,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
