/**
 * API Client — Production Configuration
 * Task 15.2: Robust client with interceptors, logging, error transformation,
 * and helpers for token management.
 *
 * Key features:
 * - Auto token injection
 * - Dev-mode request/response logging (📤 / 📥)
 * - Structured error transformation
 * - onUnauthorized callback for auth state management
 */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

// ── Environment Configuration ──────────────────────────────────────────────────
const DEV_PC_URL = 'http://localhost:3000/api/v1';
const DEV_MOBILE_URL = 'http://192.168.1.3:3000/api/v1';

// 🛠️ Toggle for testing:
const USE_PHYSICAL_DEVICE = true; // Set to true to use your mobile IP (192.168.1.3)

const BASE_URL = USE_PHYSICAL_DEVICE || Platform.OS !== 'web'
  ? DEV_MOBILE_URL
  : DEV_PC_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Unauthorized callback ──────────────────────────────────────────────────────

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// ── Token helpers ──────────────────────────────────────────────────────────────

/** Save auth token to AsyncStorage */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

/** Get auth token from AsyncStorage */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/** Remove auth token from AsyncStorage */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

/** Ping /health to check if backend is reachable */
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    // Health is at root (not /api/v1/health), strip the /api/v1 prefix
    const url = BASE_URL.replace('/api/v1', '') + '/health';
    const response = await axios.get(url, { timeout: 10000 });
    return response.status === 200;
  } catch {
    return false;
  }
};

// ── Request Interceptor ────────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// ── Response Interceptor ───────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as any;

    if (__DEV__ && status !== 403) {
      console.error('❌ API Error:', {
        message: error.message,
        status,
        url: error.config?.url,
        data,
      });
    }

    // 401: expired/invalid token — clear auth state
    // 403: PENDING_APPROVAL / SUSPENDED / ARCHIVED — let screen handle it
    if (status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
