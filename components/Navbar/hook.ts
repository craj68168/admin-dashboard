"use client";

import { useAuthStore } from "@/store/auth-store";

export function useNavbar() {
  const user = useAuthStore((state) => state.user);

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    user,
    initials,
  };
}

