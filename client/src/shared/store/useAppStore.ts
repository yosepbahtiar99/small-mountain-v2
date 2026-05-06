import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  user: any | null;
  setUser: (user: any) => void;
  notifications: Notification[];
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  user: null,
  setUser: (user) => set({ user }),
  notifications: [],
  addNotification: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    // Auto remove after 4 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }, 4000);
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
}));
