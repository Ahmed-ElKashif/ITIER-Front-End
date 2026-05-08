/**
 * useAdmin Hook
 * Single Responsibility: Admin operations — dashboard, supervisors, students.
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { AdminAPI } from '../api/endpoints/index';
import type {
  DashboardStats,
  SupervisorRecord,
  CreateSupervisorResponse,
  SystemAnalytics,
  AdminStudentRecord,
} from '../api/endpoints/admin.api';

interface UseAdminReturn {
  dashboardStats: DashboardStats | null;
  supervisors: SupervisorRecord[];
  analytics: SystemAnalytics | null;
  students: AdminStudentRecord[];
  isLoading: boolean;
  fetchDashboard: () => Promise<void>;
  fetchSupervisors: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchStudents: (params?: { status?: string; search?: string }) => Promise<void>;
  createSupervisor: (
    email: string,
    fullName: string,
  ) => Promise<CreateSupervisorResponse | null>;
  updateStudentStatus: (
    userId: number,
    status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED',
  ) => Promise<boolean>;
  deleteUser: (userId: number) => Promise<boolean>;
}

export const useAdmin = (): UseAdminReturn => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [supervisors, setSupervisors] = useState<SupervisorRecord[]>([]);
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AdminAPI.getDashboard();
      setDashboardStats(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSupervisors = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AdminAPI.getSupervisors();
      setSupervisors(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to load supervisors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AdminAPI.getSystemAnalytics();
      setAnalytics(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(
    async (params?: { status?: string; search?: string }) => {
      try {
        setIsLoading(true);
        const response = await AdminAPI.getAllStudents(params);
        setStudents(response.data);
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || 'Failed to load students');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createSupervisor = useCallback(
    async (
      email: string,
      fullName: string,
    ): Promise<CreateSupervisorResponse | null> => {
      try {
        setIsLoading(true);
        const response = await AdminAPI.createSupervisor({ email, fullName });
        await fetchSupervisors();
        return response.data;
      } catch (error: any) {
        Alert.alert(
          'Error',
          error.response?.data?.error || 'Failed to create supervisor',
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchSupervisors],
  );

  const updateStudentStatus = useCallback(
    async (
      userId: number,
      status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED',
    ): Promise<boolean> => {
      try {
        await AdminAPI.updateStudentStatus(userId, status);
        await fetchStudents();
        return true;
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || 'Status update failed');
        return false;
      }
    },
    [fetchStudents],
  );

  const deleteUser = useCallback(async (userId: number): Promise<boolean> => {
    try {
      await AdminAPI.deleteUser(userId);
      await fetchStudents();
      return true;
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Delete failed');
      return false;
    }
  }, [fetchStudents]);

  return {
    dashboardStats,
    supervisors,
    analytics,
    students,
    isLoading,
    fetchDashboard,
    fetchSupervisors,
    fetchAnalytics,
    fetchStudents,
    createSupervisor,
    updateStudentStatus,
    deleteUser,
  };
};
