import apiClient from './client';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

/** Phase 2: role is STUDENT only — no longer sent from the client */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  trackId: number; // Required — students must choose a track
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'STUDENT';
  /** Phase 2: accounts can be PENDING_APPROVAL before login is allowed */
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  trackId: number | null;
  track?: { id: number; name: string } | null;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data: RegisterRequest) => apiClient.post('/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data),
};

// ─── Study Entries ────────────────────────────────────────────────────────────

export const entryAPI = {
  create: (data: any) => apiClient.post('/entries', data),

  getMyEntries: (params?: any) => apiClient.get('/entries/me', { params }),

  update: (entryId: number, data: any) =>
    apiClient.put(`/entries/${entryId}`, data),

  delete: (entryId: number) => apiClient.delete(`/entries/${entryId}`),
};

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export const leaderboardAPI = {
  daily: (date: string, trackId: number) =>
    apiClient.get('/leaderboard/daily', { params: { date, trackId } }),

  weekly: (weekStart: string, trackId: number) =>
    apiClient.get('/leaderboard/weekly', { params: { weekStart, trackId } }),
};

// ─── Quotes ──────────────────────────────────────────────────────────────────

export const quoteAPI = {
  daily: () => apiClient.get('/quotes/daily'),
};

// ─── Supervisor ───────────────────────────────────────────────────────────────

export const supervisorAPI = {
  trackOverview: () => apiClient.get('/supervisor/track-overview'),

  studentDetails: (userId: number) =>
    apiClient.get(`/supervisor/student/${userId}`),

  // Phase 2: Approval workflow
  getPendingStudents: () => apiClient.get('/supervisor/pending-students'),

  approveStudent: (userId: number) =>
    apiClient.post(`/supervisor/students/${userId}/approve`),

  rejectStudent: (userId: number, reason?: string) =>
    apiClient.post(`/supervisor/students/${userId}/reject`, { reason }),
};

// ─── Tracks ───────────────────────────────────────────────────────────────────

export const trackAPI = {
  /** Public — no auth required. Used during registration to display available tracks. */
  getActive: () => apiClient.get('/tracks'),

  /** Supervisor only — create a new track */
  create: (data: { name: string; description?: string; duration?: string; maxStudents?: number }) =>
    apiClient.post('/tracks', data),

  /** Supervisor only — get own track */
  getMyTrack: () => apiClient.get('/tracks/me'),

  /** Supervisor only — update own track */
  update: (trackId: number, data: Partial<{ name: string; description: string; duration: string; maxStudents: number; isActive: boolean }>) =>
    apiClient.put(`/tracks/${trackId}`, data),
};
