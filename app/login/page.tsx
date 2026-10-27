"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import LoginComponent from "@/components/Login";

export default function LoginPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(user?.role === "staff" ? "/staff/dashboard" : "/admin/dashboard");
    }
  }, [isAuthenticated, router, user?.role]);

  if (isAuthenticated) {
    return null;
  }

  return <LoginComponent />;
}
