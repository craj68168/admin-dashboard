"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    initializeAuth(token);
  }, [initializeAuth]);

  if (!initialized) {
    return null;
  }

  return children;
}
