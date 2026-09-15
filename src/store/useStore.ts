import { create } from 'zustand';

interface AppState {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  setLoggedIn: (value: boolean) => void;
  setUser: (user: { name: string; email: string } | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  user: null,
  setLoggedIn: (value) => set({ isLoggedIn: value }),
  setUser: (user) => set({ user }),
}));
