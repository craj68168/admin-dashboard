"use client";

import { useRouter } from "next/navigation";

import { useLogout } from "@/hooks/logout";
import { useAuthStore } from "@/store/auth-store";

import { routeMap, sidebarItems, type SidebarItem } from "./type";

export function useSidebar() {
  const router = useRouter();

  const { logout } = useLogout();

  const user = useAuthStore((state) => state.user);

  // ================================================
  // ROLE-BASED SIDEBAR
  // ================================================

  const visibleSidebarItems: SidebarItem[] = sidebarItems.filter((item) => {
    // Super Admin can see everything
    if (user?.role === "superadmin") {
      return true;
    }

    // Staff cannot access Staff management
    if (user?.role === "staff") {
      return item !== "Staff";
    }

    // Safe fallback while auth is loading
    return item === "Dashboard";
  });

  // ================================================
  // NAVIGATION
  // ================================================

  const goToDashboard = () => {
    router.push(routeMap.Dashboard);
  };

  const goToItem = (item: SidebarItem) => {
    router.push(routeMap[item]);
  };

  return {
    sidebarItems: visibleSidebarItems,

    goToDashboard,
    goToItem,
    logout,
  };
}
