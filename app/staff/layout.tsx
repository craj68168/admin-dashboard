"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/auth-store";

export default function StaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isPublicPage =
    pathname === "/staff/login" || pathname === "/staff/forgot-password";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarCollapsed = isMobile ? !mobileOpen : desktopCollapsed;

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((open) => !open);
    } else {
      setDesktopCollapsed((collapsed) => !collapsed);
    }
  };

  useEffect(() => {
    if (isPublicPage) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/staff/login");
    } else if (user?.role !== "staff") {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, isPublicPage, router, user?.role]);

  if (isPublicPage) {
    return children;
  }

  if (!isAuthenticated || user?.role !== "staff") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const selected = pathname.startsWith("/staff/dashboard")
    ? "Dashboard"
    : pathname.startsWith("/staff/client")
      ? "Clients"
      : "";
  const title = pathname.startsWith("/staff/profile")
    ? "Profile"
    : selected;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        "@supports (min-height: 100dvh)": { minHeight: "100dvh" },
      }}
    >
      <Sidebar
        selected={selected}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Navbar title={title} onMenuClick={toggleSidebar} />
        <Box component="main" sx={{ width: "100%" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
