"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import LoginComponent from "@/components/Login";

export default function LoginPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(
        role === "superadmin" ? "/admin/dashboard" : "/admin/staff",
      );
    }
  }, [isAuthenticated, role, router]);

  if (isAuthenticated) {
    return null;
  }

  return <LoginComponent />;
}
