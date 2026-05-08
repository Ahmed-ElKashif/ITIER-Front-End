/**
 * Approval API Module
 * Single Responsibility: Student approval workflow (supervisor endpoints).
 */
import apiClient from '../client';
import type { ApiResponse, PendingStudent, User } from '../types';

/** Get all students awaiting approval in the supervisor's track */
export const getPendingStudents = async (): Promise<
  ApiResponse<PendingStudent[]>
> => {
  const response = await apiClient.get<ApiResponse<PendingStudent[]>>(
    '/supervisor/pending-students',
  );
  return response.data;
};

/** Approve a pending student → status becomes ACTIVE */
export const approveStudent = async (
  userId: number,
): Promise<ApiResponse<{ id: number; fullName: string; status: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ id: number; fullName: string; status: string }>
  >(`/supervisor/students/${userId}/approve`);
  return response.data;
};

/** Reject a pending student → status becomes ARCHIVED (audit-safe) */
export const rejectStudent = async (
  userId: number,
  reason?: string,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.post<ApiResponse<void>>(
    `/supervisor/students/${userId}/reject`,
    { reason },
  );
  return response.data;
};
