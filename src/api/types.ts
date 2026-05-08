/**
 * API Response Types
 * Single Responsibility: Shared type definitions for all API contracts.
 * These mirror the Phase 2 backend response shapes exactly.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface ApiError {
  error: string;
  errorCode?: 'PENDING_APPROVAL' | 'SUSPENDED' | 'ARCHIVED';
  status?: string;
  maxStudents?: number;
  currentCount?: number;
}

export interface Track {
  id: number;
  name: string;
  description: string | null;
  duration: string | null;
  maxStudents: number | null;
  isActive: boolean;
  createdById: number;
  createdAt: string;
}

export interface TrackWithStats extends Track {
  currentStudents: number;
  isFull: boolean;
  supervisor: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'STUDENT';
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  trackId: number | null;
  track?: { id: number; name: string } | null;
}

export interface PendingStudent {
  id: number;
  username: string;
  email: string;
  fullName: string;
  track: { id: number; name: string } | null;
  registeredAt: string;
}
