import type { UserRole } from "@/store/type";

export const getPortalPaths = (role?: UserRole) => {
  const isStaff = role === "staff";
  const base = isStaff ? "/staff" : "/admin";
  const clients = `${base}/client`;

  return {
    dashboard: `${base}/dashboard`,
    clients,
    addClient: `${clients}/add`,
    client: (clientId: string) => `${clients}/${encodeURIComponent(clientId)}`,
    editClient: (clientId: string) =>
      `${clients}/${encodeURIComponent(clientId)}/edit`,
    profile: `${base}/profile`,
    login: isStaff ? "/staff/login" : "/login",
    loginApi: isStaff ? "/auth/staff/login" : "/auth/admin/login",
  };
};
