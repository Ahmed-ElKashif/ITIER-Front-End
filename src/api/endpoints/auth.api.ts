/**
 * Auth API Module
 * Single Responsibility: User authentication operations only.
 */
import apiClient from '../client';
import type { ApiResponse, User } from '../types';

export interface LoginRequest {
  username: string;
  password: string;
}

/** Phase 2: role is always STUDENT for self-registration */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  trackId: number;
}

export interface LoginData {
  token: string;
  user: User;
}

export interface RegisterData {
  userId: number;
  username: string;
  status: 'PENDING_APPROVAL';
  track: string;
  message: string;
}

/** Authenticate user — may throw 403 with errorCode for PENDING/SUSPENDED */
export const login = async (
  credentials: LoginRequest,
): Promise<ApiResponse<LoginData>> => {
  const response = await apiClient.post<ApiResponse<LoginData>>(
    '/auth/login',
    credentials,
  );
  return response.data;
};

/** Register new student (→ PENDING_APPROVAL by default) */
export const register = async (
  data: RegisterRequest,
): Promise<ApiResponse<RegisterData>> => {
  const response = await apiClient.post<ApiResponse<RegisterData>>(
    '/auth/register',
    data,
  );
  return response.data;
};
