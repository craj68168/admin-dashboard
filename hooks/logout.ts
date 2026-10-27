// hooks/useLogout.ts

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { getPortalPaths } from "@/lib/portal-routes";

export const useLogout = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);

  const logout = () => {
    localStorage.removeItem("access_token");

    logoutStore();

    router.replace(getPortalPaths(user?.role).login);
  };

  return {
    logout,
  };
};
