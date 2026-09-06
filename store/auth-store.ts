// store/auth-store.ts

import { create } from "zustand";

type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: !!token,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));
