// hooks/useLogout.ts

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export const useLogout = () => {
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);

  const logout = () => {
    localStorage.removeItem("access_token");

    logoutStore();

    router.replace("/login");
  };

  return {
    logout,
  };
};
