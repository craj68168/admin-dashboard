"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/logout";
import { routeMap, sidebarItems, type SidebarItem } from "./type";
import { useAuthStore } from "@/store/auth-store";

export function useSidebar() {
  const router = useRouter();
  const { logout } = useLogout();
  const role = useAuthStore((state) => state.user?.role);
  const visibleItems =
    role === "staff"
      ? sidebarItems.filter((item) => item !== "Dashboard")
      : sidebarItems;

  const goToDashboard = () => {
    router.push(role === "staff" ? routeMap.Staff : routeMap.Dashboard);
  };

  const goToItem = (item: SidebarItem) => {
    router.push(routeMap[item]);
  };

  return {
    sidebarItems: visibleItems,
    goToDashboard,
    goToItem,
    logout,
  };
}
