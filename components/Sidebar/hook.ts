"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/logout";
import { routeMap, sidebarItems, type SidebarItem } from "./type";

export function useSidebar() {
  const router = useRouter();
  const { logout } = useLogout();

  const goToDashboard = () => {
    router.push(routeMap.Dashboard);
  };

  const goToItem = (item: SidebarItem) => {
    router.push(routeMap[item]);
  };

  return {
    sidebarItems,
    goToDashboard,
    goToItem,
    logout,
  };
}
