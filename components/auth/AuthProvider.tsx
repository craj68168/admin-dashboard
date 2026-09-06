"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      setAuth(null, token);
    }

    setLoading(false);
  }, [setAuth]);

  if (loading) {
    return null;
  }

  return children;
}
