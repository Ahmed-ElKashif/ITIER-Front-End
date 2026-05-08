/**
 * useTracks Hook — Task 15.5 update
 * Fetch and cache active tracks for registration with retry logic.
 */
import { useState, useEffect, useCallback } from 'react';
import { TrackAPI } from '../api/endpoints/index';
import { retryRequest } from '../utils/retryRequest';
import type { TrackWithStats } from '../api/types';

interface UseTracksReturn {
  tracks: TrackWithStats[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTracks = (): UseTracksReturn => {
  const [tracks, setTracks] = useState<TrackWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Wrap in retry for Vercel cold-start recovery
      const response = await retryRequest(() => TrackAPI.getActiveTracks());
      setTracks(response.data);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Failed to load tracks. Please try again.';
      setError(msg);
      console.error('useTracks fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return { tracks, isLoading, error, refetch: fetchTracks };
};
