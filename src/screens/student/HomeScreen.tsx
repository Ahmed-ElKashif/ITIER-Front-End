import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../../components/Header';
import { QuoteCard } from '../../components/QuoteCard';
import { StatsCard } from '../../components/StatsCard';
import { quoteAPI, entryAPI } from '../../api/endpoints';
import { Quote } from '../../types';
import { colors, spacing } from '../../utils/theme';

export const HomeScreen = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [weeklyHours, setWeeklyHours] = useState('0');
  const [monthlyHours, setMonthlyHours] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      // Fetch quote
      const quoteResponse = await quoteAPI.daily();
      setQuote(quoteResponse.data.data);

      // Fetch weekly stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyResponse = await entryAPI.getMyEntries({
        startDate: weekAgo.toISOString().split('T')[0],
      });

      // Fetch monthly stats
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthlyResponse = await entryAPI.getMyEntries({
        startDate: monthAgo.toISOString().split('T')[0],
      });

      setWeeklyHours(weeklyResponse.data.meta.totalHours);
      setMonthlyHours(monthlyResponse.data.meta.totalHours);
    } catch (error) {
      console.error('Home screen error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Home" showLogout />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Home" showLogout />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchData(true)}
            colors={[colors.primary]}
          />
        }
      >
        {/* Daily Quote */}
        {quote && <QuoteCard quote={quote} />}

        {/* Stats */}
        <StatsCard
          title="This Week"
          value={`${parseFloat(weeklyHours).toFixed(1)}h`}
          subtitle="Study hours in the last 7 days"
          icon="calendar-week"
          color={colors.primary}
        />

        <StatsCard
          title="This Month"
          value={`${parseFloat(monthlyHours).toFixed(1)}h`}
          subtitle="Study hours in the last 30 days"
          icon="calendar-month"
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
});
