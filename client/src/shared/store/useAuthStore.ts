import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { user: User; accessToken: string }) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: (data) => {
    set({
      user: data.user,
      accessToken: data.accessToken,
      isAuthenticated: true,
      isLoading: false
    });
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/api/auth/me');
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }
}));
