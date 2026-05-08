/**
 * useAnalytics Hook
 * Single Responsibility: KPI data for supervisor track analytics.
 *
 * Uses the existing /supervisor/track-overview endpoint which returns
 * detailed student activity data for the supervisor's own track.
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import apiClient from '../api/client';

export interface StudentActivity {
  userId: number;
  fullName: string;
  username: string;
  weeklyHours: string;
  monthlyHours: string;
  totalHours: string;
  lastActive: string | null;
  subjects: string[];
}

export interface TrackOverview {
  track: {
    id: number;
    name: string;
    description: string | null;
    maxStudents: number | null;
  };
  totalStudents: number;
  students: StudentActivity[];
  stats: {
    averageWeeklyHours: string;
    topSubject: string | null;
    mostActiveStudentId: number | null;
  };
}

interface UseAnalyticsReturn {
  overview: TrackOverview | null;
  isLoading: boolean;
  fetchAnalytics: () => Promise<void>;
  getEngagementRate: () => number;
  getTopStudents: (limit?: number) => StudentActivity[];
  getAtRiskStudents: () => StudentActivity[];
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [overview, setOverview] = useState<TrackOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/supervisor/track-overview');
      setOverview(response.data.data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to load analytics',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Students who logged hours in the last 7 days / total students */
  const getEngagementRate = useCallback((): number => {
    if (!overview || overview.totalStudents === 0) return 0;
    const activeThisWeek = overview.students.filter(
      s => parseFloat(s.weeklyHours) > 0,
    ).length;
    return Math.round((activeThisWeek / overview.totalStudents) * 100);
  }, [overview]);

  /** Students sorted by total hours — for top performers list */
  const getTopStudents = useCallback(
    (limit = 5): StudentActivity[] => {
      if (!overview) return [];
      return [...overview.students]
        .sort((a, b) => parseFloat(b.totalHours) - parseFloat(a.totalHours))
        .slice(0, limit);
    },
    [overview],
  );

  /** Students with 0 hours this week — at-risk */
  const getAtRiskStudents = useCallback((): StudentActivity[] => {
    if (!overview) return [];
    return overview.students.filter(s => parseFloat(s.weeklyHours) === 0);
  }, [overview]);

  return {
    overview,
    isLoading,
    fetchAnalytics,
    getEngagementRate,
    getTopStudents,
    getAtRiskStudents,
  };
};
