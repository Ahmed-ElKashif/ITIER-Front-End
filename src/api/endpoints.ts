import apiClient from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'STUDENT' | 'SUPERVISOR';
  trackId: number;
}

export interface Track {
  id: number;
  name: string;
  supervisorId: number;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'STUDENT' | 'SUPERVISOR';
  trackId: number;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface TracksResponse {
  success: boolean;
  data: Track[];
}

// Auth endpoints
export const authAPI = {
  register: (data: RegisterRequest) => apiClient.post('/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data),
};

// Track endpoints
export const trackAPI = {
  getTracks: () => apiClient.get<TracksResponse>('/tracks'),
};

// Entry endpoints
export const entryAPI = {
  create: (data: any) => apiClient.post('/entries', data),

  getMyEntries: (params?: any) => apiClient.get('/entries/me', { params }),

  update: (entryId: number, data: any) =>
    apiClient.put(`/entries/${entryId}`, data),

  delete: (entryId: number) => apiClient.delete(`/entries/${entryId}`),
};

// Leaderboard endpoints
export const leaderboardAPI = {
  daily: (date: string, trackId: number) =>
    apiClient.get('/leaderboard/daily', { params: { date, trackId } }),

  weekly: (weekStart: string, trackId: number) =>
    apiClient.get('/leaderboard/weekly', { params: { weekStart, trackId } }),
};

// Quote endpoint
export const quoteAPI = {
  daily: () => apiClient.get('/quotes/daily'),
};

// Supervisor endpoints
export const supervisorAPI = {
  trackOverview: () => apiClient.get('/supervisor/track-overview'),

  studentDetails: (userId: number) =>
    apiClient.get(`/supervisor/student/${userId}`),
};
