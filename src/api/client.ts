import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIVE_BACKEND_URL =
  'https://itierstudytracker-b04qfnm2a-ahmed-elkashifs-projects.vercel.app/api/v1';
const API_BASE_URL = __DEV__
  ? LIVE_BACKEND_URL // ← Use 10.0.2.2 for Android Emulator
  : LIVE_BACKEND_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Callback to trigger logout when token expires
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    // Only clear auth state on 401 (expired/invalid token).
    // 403 is used by Phase 2 backend to signal PENDING_APPROVAL / SUSPENDED /
    // ARCHIVED status — these must reach the screen, NOT trigger a logout.
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
