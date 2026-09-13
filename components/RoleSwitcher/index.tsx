"use client";

import { useAuthStore } from "@/store/auth-store";
import type { AuthUser, UserRole } from "@/store/type";

// =================================================
// DEVELOPMENT USERS
// =================================================

const devUsers: Record<UserRole, AuthUser> = {
  superadmin: {
    id: "dev-superadmin",
    name: "Super Admin",
    email: "superadmin@fortunelink.local",
    role: "superadmin",
  },

  staff: {
    id: "dev-staff",
    staffId: "dev-staff",
    name: "Staff User",
    email: "staff@fortunelink.local",
    role: "staff",
  },
};

// =================================================
// ROLE SWITCHER
// DEVELOPMENT ONLY
// =================================================

export default function RoleSwitcher() {
  const user = useAuthStore((state) => state.user);

  const setAuth = useAuthStore((state) => state.setAuth);

  // Never show this component in production
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const currentRole = user?.role;

  const setRole = (role: UserRole) => {
    const devUser = devUsers[role];

    setAuth(devUser, "dev-token");
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">
      <span className="font-medium">View as</span>

      {Object.values(devUsers).map((devUser) => (
        <button
          key={devUser.role}
          type="button"
          onClick={() => setRole(devUser.role)}
          className={`rounded-md px-2 py-1 font-medium capitalize transition-colors ${
            currentRole === devUser.role
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {devUser.role}
        </button>
      ))}
    </div>
  );
}
