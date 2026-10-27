"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import LoginComponent from "@/components/Login";

export default function StaffLoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(
        user?.role === "superadmin" ? "/admin/dashboard" : "/staff/dashboard",
      );
    }
  }, [isAuthenticated, router, user?.role]);

  if (isAuthenticated) {
    return null;
  }

  return <LoginComponent role="staff" />;
}
