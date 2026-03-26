import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ token: null, isLoading: true, setToken: (token) => set({ token }), logout: () => set({ token: null }), setIsLoading: (loading) => set({ isLoading: loading }) }),
    { name: 'auth-storage', onRehydrateStorage: () => (state) => { state?.setIsLoading(false); } }
  )
);
