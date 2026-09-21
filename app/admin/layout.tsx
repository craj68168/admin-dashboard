"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Same breakpoint the Sidebar uses to switch between drawer and column.
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Two separate states, because "collapsed" means different things per screen:
  //  - desktop: narrow icon rail (true) or full sidebar (false). Starts full.
  //  - mobile:  drawer open (true) or closed (false). Always starts closed.
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // What the Sidebar understands as `collapsed`.
  const sidebarCollapsed = isMobile ? !mobileOpen : desktopCollapsed;

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((open) => !open);
    } else {
      setDesktopCollapsed((collapsed) => !collapsed);
    }
  };

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

  const getNavbarTitle = () =>
    pathname.startsWith("/admin/profile") ? "Profile" : getSelectedMenu();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        "@supports (min-height: 100dvh)": { minHeight: "100dvh" },
      }}
    >
      <Sidebar
        selected={getSelectedMenu()}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* onMenuClick shows the ☰ button below 900px and opens the drawer */}
        <Navbar title={getNavbarTitle()} onMenuClick={toggleSidebar} />

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