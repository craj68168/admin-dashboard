import type { AuthUser } from "@/store/type";

export const assumedUser: AuthUser = {
  id: "dev-superadmin",
  name: "Super Admin",
  email: "superadmin@fortunelink.local",
  role: "superadmin",
};

export function getCurrentUser(user: AuthUser | null): AuthUser {
  return user ?? assumedUser;
}

export function isSuperAdmin(user: AuthUser | null): boolean {
  return getCurrentUser(user).role === "superadmin";
}

export function isStaff(user: AuthUser | null): boolean {
  return getCurrentUser(user).role === "staff";
}

export function canAddStaff(user: AuthUser | null): boolean {
  return isSuperAdmin(user);
}

export function canManageStaff(user: AuthUser | null): boolean {
  return isSuperAdmin(user);
}

export function canAssignClient(user: AuthUser | null): boolean {
  return isSuperAdmin(user);
}

export function canCreateClient(user: AuthUser | null): boolean {
  return isSuperAdmin(user) || isStaff(user);
}

export function canEditClient(
  user: AuthUser | null,
  client: { assignedStaffId?: number | string | null; assignedStaff?: number | string | { _id?: string; staffId?: number | string } | null },
): boolean {
  const currentUser = getCurrentUser(user);

  if (currentUser.role === "superadmin") {
    return true;
  }

  return isAssignedToCurrentStaff(currentUser, client);
}

export function canUpdateClientStatus(
  user: AuthUser | null,
  client: { assignedStaffId?: number | string | null; assignedStaff?: number | string | { _id?: string; staffId?: number | string } | null },
): boolean {
  return canEditClient(user, client);
}

export function isAssignedToCurrentStaff(
  user: AuthUser,
  client: { assignedStaffId?: number | string | null; assignedStaff?: number | string | { _id?: string; staffId?: number | string } | null },
): boolean {
  if (user.role !== "staff" || !user.staffId) {
    return false;
  }

  const assignedStaffId = getClientAssignedStaffId(client);
  const currentStaffIds = [user.id, user.staffId].filter(
    (value): value is string | number => value !== undefined && value !== null,
  );

  return Boolean(
    assignedStaffId &&
      currentStaffIds.some((currentStaffId) => String(assignedStaffId) === String(currentStaffId)),
  );
}

function getClientAssignedStaffId(client: {
  assignedStaffId?: number | string | null;
  assignedStaff?: number | string | { _id?: string; staffId?: number | string } | null;
}) {
  if (client.assignedStaffId) {
    return client.assignedStaffId;
  }

  if (typeof client.assignedStaff === "object" && client.assignedStaff) {
    return client.assignedStaff._id ?? client.assignedStaff.staffId;
  }

  return client.assignedStaff;
}
