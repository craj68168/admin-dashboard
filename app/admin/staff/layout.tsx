"use client";

import type { ReactNode } from "react";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuthStore } from "@/store/auth-store";

type StaffLayoutProps = {
  children: ReactNode;
};

export default function StaffLayout({ children }: StaffLayoutProps) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && user.role !== "superadmin") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  // Auth store is still loading
  if (!user) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Prevent rendering staff-management content
  // before redirect happens
  if (user.role !== "superadmin") {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return children;
}
