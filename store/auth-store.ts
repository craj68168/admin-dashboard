import { create } from "zustand";
import type { AuthUser } from "./type";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  initialized: boolean;

  setAuth: (user: AuthUser | null, token: string | null) => void;
  initializeAuth: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  initialized: false,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: Boolean(token),
      initialized: true,
    }),

  initializeAuth: (token) =>
    set({
      token,
      isAuthenticated: Boolean(token),
      initialized: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      initialized: true,
    }),
}));
