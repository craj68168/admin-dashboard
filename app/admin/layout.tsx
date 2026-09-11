"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Redirecting to login...
      </Box>
    );
  }

  const getSelectedMenu = () => {
    if (pathname.startsWith("/admin/dashboard")) {
      return "Dashboard";
    }

    if (pathname.startsWith("/admin/staff")) {
      return "Staff";
    }

    if (pathname.startsWith("/admin/client")) {
      return "Clients";
    }

    return "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar
        selected={getSelectedMenu()}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Navbar title={getSelectedMenu()} />

        <Box
          component="main"
          sx={{
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
