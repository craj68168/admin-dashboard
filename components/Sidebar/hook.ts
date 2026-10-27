"use client";

import { useRouter } from "next/navigation";

import { useLogout } from "@/hooks/logout";
import { useAuthStore } from "@/store/auth-store";
import { getPortalPaths } from "@/lib/portal-routes";

import { sidebarItems, type SidebarItem } from "./type";

export function useSidebar() {
  const router = useRouter();

  const { logout } = useLogout();

  const user = useAuthStore((state) => state.user);
  const paths = getPortalPaths(user?.role);

  // ================================================
  // ROLE-BASED SIDEBAR
  // ================================================

  const visibleSidebarItems: SidebarItem[] =
    user?.role === "staff"
      ? ["Dashboard", "Clients"]
      : user?.role === "superadmin"
        ? sidebarItems
        : ["Dashboard"];

  // ================================================
  // NAVIGATION
  // ================================================

  const goToDashboard = () => {
    router.push(paths.dashboard);
  };

  const goToItem = (item: SidebarItem) => {
    const destinations: Record<SidebarItem, string> = {
      Dashboard: paths.dashboard,
      Staff: "/admin/staff",
      Clients: paths.clients,
      Stages: "/admin/stages",
    };

    router.push(destinations[item]);
  };

  return {
    sidebarItems: visibleSidebarItems,

    goToDashboard,
    goToItem,
    logout,
  };
}