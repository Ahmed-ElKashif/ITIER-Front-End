import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/endpoints';
import { setOnUnauthorized } from '../api/client';
import { User } from '../types';

// ── Error type for Phase 2 login gates ────────────────────────────────────────

export interface AuthError {
  message: string;
  /** Phase 2: PENDING_APPROVAL | SUSPENDED | ARCHIVED — drives screen routing */
  errorCode?: 'PENDING_APPROVAL' | 'SUSPENDED' | 'ARCHIVED';
  status?: string;
}

// ── Context interface ─────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Phase 2: register no longer auto-logs in — students land on PendingApproval */
  register: (data: any) => Promise<{ username: string; status: string }>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setOnUnauthorized(() => {
      setUser(null);
    });
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login — throws AuthError if credentials are invalid OR if the account
   * is PENDING_APPROVAL / SUSPENDED / ARCHIVED.
   * The errorCode field tells LoginScreen which screen to navigate to.
   */
  const login = async (username: string, password: string) => {
    try {
      const result = await authAPI.login({ username, password });
      const { token, user: loggedInUser } = result.data.data;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));

      setUser(loggedInUser);
    } catch (error: any) {
      console.error('Login error:', error);
      // Phase 2: 403 carries errorCode for PENDING_APPROVAL / SUSPENDED / ARCHIVED
      const authError: AuthError = {
        message: error.response?.data?.error || 'Login failed',
        errorCode: error.response?.data?.errorCode,
        status: error.response?.data?.status,
      };
      throw authError;
    }
  };

  /**
   * Phase 2 Register — does NOT auto-login.
   * Students start as PENDING_APPROVAL and must be approved before logging in.
   * Returns { username, status } so the screen can navigate to PendingApproval.
   */
  const register = async (data: any): Promise<{ username: string; status: string }> => {
    try {
      const result = await authAPI.register(data);
      const reg = result.data.data;
      return { username: reg.username, status: reg.status };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
