import { renderHook, act, waitFor } from '@testing-library/react-native';
import axiosMockAdapter from 'axios-mock-adapter';
import apiClient from '../api/client';
import { useAnalytics } from './useAnalytics';
import { Alert } from 'react-native';

const mock = new axiosMockAdapter(apiClient);

// Spy on Alert to verify error handling without crashing tests
jest.spyOn(Alert, 'alert');

describe('useAnalytics Hook', () => {
  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  const mockOverviewData = {
    trackName: 'React Native',
    totalStudents: 2,
    trackStats: {
      averageWeeklyHours: '15',
      mostStudiedSubject: 'React Navigation'
    },
    students: [
      {
        userId: 1,
        fullName: 'John Doe',
        username: 'johndoe',
        weeklyHours: '20',
        monthlyHours: '80',
        lastStudyDate: '2026-05-09'
      },
      {
        userId: 2,
        fullName: 'Jane Smith',
        username: 'janesmith',
        weeklyHours: '0',
        monthlyHours: '10',
        lastStudyDate: '2026-05-01'
      }
    ]
  };

  it('fetches analytics data successfully', async () => {
    mock.onGet('/supervisor/track-overview').reply(200, {
      data: mockOverviewData
    });

    const { result } = renderHook(() => useAnalytics());

    // Initial state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.overview).toBeNull();

    // Trigger fetch
    act(() => {
      result.current.fetchAnalytics();
    });

    // Loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for resolution
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify data
    expect(result.current.overview?.trackName).toBe('React Native');
    expect(result.current.overview?.totalStudents).toBe(2);
  });

  it('calculates engagement rate correctly', async () => {
    mock.onGet('/supervisor/track-overview').reply(200, {
      data: mockOverviewData
    });

    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.fetchAnalytics();
    });

    await waitFor(() => {
      expect(result.current.overview).not.toBeNull();
    });

    // 1 out of 2 students active this week = 50%
    expect(result.current.getEngagementRate()).toBe(50);
  });

  it('identifies at-risk students correctly', async () => {
    mock.onGet('/supervisor/track-overview').reply(200, {
      data: mockOverviewData
    });

    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.fetchAnalytics();
    });

    await waitFor(() => {
      expect(result.current.overview).not.toBeNull();
    });

    const atRisk = result.current.getAtRiskStudents();
    expect(atRisk.length).toBe(1);
    expect(atRisk[0].fullName).toBe('Jane Smith');
  });

  it('suppresses Alert on 403 No Track Assigned', async () => {
    mock.onGet('/supervisor/track-overview').reply(403, {
      error: 'No track assigned to this account.'
    });

    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.fetchAnalytics();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.overview).toBeNull();
    // Verify Alert.alert was NOT called because it was a 403
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('shows Alert on 500 Internal Server Error', async () => {
    mock.onGet('/supervisor/track-overview').reply(500, {
      error: 'Database connection failed'
    });

    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.fetchAnalytics();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify Alert.alert WAS called because it was NOT a 403
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Database connection failed');
  });
});
