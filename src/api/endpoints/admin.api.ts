/**
 * Admin API Module
 * Single Responsibility: All admin-level API calls.
 */
import apiClient from '../client';
import type { ApiResponse } from '../types';

// ── Response shapes ────────────────────────────────────────────────────────────

export interface DashboardStats {
  students: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    archived: number;
  };
  supervisors: { total: number };
  tracks: { total: number; active: number };
  studyActivity: {
    totalHours: string;
    totalEntries: number;
  };
}

export interface SupervisorRecord {
  id: number;
  username: string;
  email: string;
  fullName: string;
  track: {
    id: number;
    name: string;
    studentCount: number;
    isActive: boolean;
  } | null;
  createdAt: string;
}

export interface CreateSupervisorResponse {
  supervisor: SupervisorRecord;
  temporaryPassword: string;
}

export interface SystemAnalytics {
  topStudents: { userId: number; fullName: string; totalHours: string }[];
  subjectDistribution: { subject: string; totalHours: string; entryCount: number }[];
  trackStats: {
    id: number;
    name: string;
    totalStudents: number;
    totalHours: string;
    avgHoursPerStudent: string;
  }[];
  recentActivity: { userId: number; fullName: string; lastEntry: string }[];
}

export interface AdminStudentRecord {
  id: number;
  username: string;
  fullName: string;
  email: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  track: { id: number; name: string } | null;
  totalEntries: number;
  totalHours: string;
  createdAt: string;
}

// ── API functions ──────────────────────────────────────────────────────────────

/** GET /admin/dashboard — system-wide counts (parallel queries on backend) */
export const getDashboard = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard');
  return response.data;
};

/** GET /admin/supervisors — all supervisors with track info */
export const getSupervisors = async (): Promise<ApiResponse<SupervisorRecord[]>> => {
  const response = await apiClient.get<ApiResponse<SupervisorRecord[]>>('/admin/supervisors');
  return response.data;
};

/** POST /admin/supervisors — create supervisor + get temp password */
export const createSupervisor = async (data: {
  email: string;
  fullName: string;
}): Promise<ApiResponse<CreateSupervisorResponse>> => {
  const response = await apiClient.post<ApiResponse<CreateSupervisorResponse>>(
    '/admin/supervisors',
    data,
  );
  return response.data;
};

/** GET /admin/analytics — top students, subject distribution, track stats */
export const getSystemAnalytics = async (): Promise<ApiResponse<SystemAnalytics>> => {
  const response = await apiClient.get<ApiResponse<SystemAnalytics>>('/admin/analytics');
  return response.data;
};

/** GET /admin/students — all students with optional filters */
export const getAllStudents = async (params?: {
  status?: string;
  trackId?: number;
  search?: string;
}): Promise<ApiResponse<AdminStudentRecord[]>> => {
  const response = await apiClient.get<ApiResponse<AdminStudentRecord[]>>(
    '/admin/students',
    { params },
  );
  return response.data;
};

/** PUT /admin/students/:id/status */
export const updateStudentStatus = async (
  userId: number,
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED',
): Promise<ApiResponse<{ id: number; status: string }>> => {
  const response = await apiClient.put<ApiResponse<{ id: number; status: string }>>(
    `/admin/students/${userId}/status`,
    { status },
  );
  return response.data;
};

/** DELETE /admin/users/:id */
export const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${userId}`);
  return response.data;
};
