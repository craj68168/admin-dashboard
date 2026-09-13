"use client";

import { ReactNode, useEffect } from "react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const initialized = useAuthStore((state) => state.initialized);

  const setAuth = useAuthStore((state) => state.setAuth);

  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      // =============================================
      // NO TOKEN
      // =============================================
      if (!token) {
        initializeAuth(null);
        return;
      }

      try {
        // =============================================
        // VERIFY TOKEN WITH BACKEND
        // =============================================
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!mounted) return;

        const user = response.data?.user;

        if (!user) {
          throw new Error("User data not returned");
        }

        // =============================================
        // REFRESH ZUSTAND WITH CURRENT USER
        // =============================================
        setAuth(user, token);
      } catch (error) {
        if (!mounted) return;

        console.error("Authentication check failed:", error);

        // Remove invalid / expired token
        localStorage.removeItem("access_token");

        logout();
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [initializeAuth, logout, setAuth]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm font-medium text-gray-600">
        Loading...
      </div>
    );
  }

  return children;
}
