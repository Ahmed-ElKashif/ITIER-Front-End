/**
 * Track API Module
 * Single Responsibility: All track-related API calls.
 */
import apiClient from '../client';
import type { ApiResponse, Track, TrackWithStats } from '../types';

export interface CreateTrackRequest {
  name: string;
  description?: string;
  duration?: string;
  maxStudents?: number;
}

/** Fetch all active tracks — public endpoint, no auth required */
export const getActiveTracks = async (): Promise<ApiResponse<TrackWithStats[]>> => {
  const response = await apiClient.get<ApiResponse<TrackWithStats[]>>('/tracks');
  return response.data;
};

/** Create a new track (supervisor only — 1 per supervisor) */
export const createTrack = async (
  data: CreateTrackRequest,
): Promise<ApiResponse<Track>> => {
  const response = await apiClient.post<ApiResponse<Track>>('/tracks', data);
  return response.data;
};

/** Get supervisor's own track with live student count */
export const getMyTrack = async (): Promise<ApiResponse<Track & { activeStudents: number; isFull: boolean }>> => {
  const response = await apiClient.get<ApiResponse<Track & { activeStudents: number; isFull: boolean }>>('/tracks/me');
  return response.data;
};

/** Update own track (supervisor only) */
export const updateTrack = async (
  trackId: number,
  data: Partial<CreateTrackRequest & { isActive: boolean }>,
): Promise<ApiResponse<Track>> => {
  const response = await apiClient.put<ApiResponse<Track>>(
    `/tracks/${trackId}`,
    data,
  );
  return response.data;
};
