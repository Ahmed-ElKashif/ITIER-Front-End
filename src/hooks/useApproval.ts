/**
 * useApproval Hook
 * Single Responsibility: Supervisor student approval workflow.
 *
 * NOTE: Alert.prompt is iOS-only. Rejection reason is handled via a separate
 * modal input rather than Alert.prompt for cross-platform compatibility.
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { ApprovalAPI } from '../api/endpoints/index';
import type { PendingStudent } from '../api/types';

interface UseApprovalReturn {
  pendingStudents: PendingStudent[];
  isLoading: boolean;
  fetchPending: () => Promise<void>;
  approveStudent: (userId: number, studentName: string) => Promise<boolean>;
  rejectStudent: (userId: number, studentName: string, reason?: string) => Promise<boolean>;
}

export const useApproval = (): UseApprovalReturn => {
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPending = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ApprovalAPI.getPendingStudents();
      setPendingStudents(response.data);
    } catch (error: any) {
      if (error.response?.status !== 403) {
        Alert.alert(
          'Error',
          error.response?.data?.error || 'Failed to fetch pending students',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Shows a confirmation alert then calls the approve endpoint.
   * Refreshes the pending list on success.
   */
  const approveStudent = useCallback(
    async (userId: number, studentName: string): Promise<boolean> => {
      return new Promise(resolve => {
        Alert.alert(
          'Approve Student',
          `Grant ${studentName} access to your track?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            {
              text: 'Approve',
              style: 'default',
              onPress: async () => {
                try {
                  await ApprovalAPI.approveStudent(userId);
                  Alert.alert('✅ Approved', `${studentName} can now log in.`);
                  await fetchPending();
                  resolve(true);
                } catch (error: any) {
                  const msg =
                    error.response?.data?.error || 'Approval failed';
                  Alert.alert('Error', msg);
                  resolve(false);
                }
              },
            },
          ],
        );
      });
    },
    [fetchPending],
  );

  /**
   * Rejects a student with an optional reason.
   * reason is passed from the modal in PendingStudentsScreen (cross-platform safe).
   */
  const rejectStudent = useCallback(
    async (
      userId: number,
      studentName: string,
      reason?: string,
    ): Promise<boolean> => {
      try {
        await ApprovalAPI.rejectStudent(userId, reason);
        Alert.alert('Rejected', `${studentName}'s registration has been rejected.`);
        await fetchPending();
        return true;
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || 'Rejection failed');
        return false;
      }
    },
    [fetchPending],
  );

  return {
    pendingStudents,
    isLoading,
    fetchPending,
    approveStudent,
    rejectStudent,
  };
};
