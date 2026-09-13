import type { AuthUser } from "@/store/type";

// =================================================
// CLIENT ASSIGNMENT TYPE
// =================================================

type ClientAssignment = {
  assignedStaffId?: string | null;

  assignedStaff?:
    | string
    | {
        _id?: string;
        staffId?: string;
      }
    | null;
};

// =================================================
// ROLE CHECKS
// =================================================

export function isSuperAdmin(user: AuthUser | null): boolean {
  return user?.role === "superadmin";
}

export function isStaff(user: AuthUser | null): boolean {
  return user?.role === "staff";
}

// =================================================
// STAFF PERMISSIONS
// =================================================

export function canAddStaff(user: AuthUser | null): boolean {
  return isSuperAdmin(user);
}

export function canManageStaff(user: AuthUser | null): boolean {
  return isSuperAdmin(user);
}

// =================================================
// CLIENT PERMISSIONS
// =================================================

export function canAssignClient(user: AuthUser | null): boolean {
  return isSuperAdmin(user);
}

export function canCreateClient(user: AuthUser | null): boolean {
  return isSuperAdmin(user) || isStaff(user);
}

export function canEditClient(
  user: AuthUser | null,
  client: ClientAssignment,
): boolean {
  if (!user) {
    return false;
  }

  if (user.role === "superadmin") {
    return true;
  }

  return isAssignedToCurrentStaff(user, client);
}

export function canUpdateClientStatus(
  user: AuthUser | null,
  client: ClientAssignment,
): boolean {
  return canEditClient(user, client);
}

// =================================================
// ASSIGNMENT CHECK
// =================================================

export function isAssignedToCurrentStaff(
  user: AuthUser,
  client: ClientAssignment,
): boolean {
  if (user.role !== "staff" || !user.staffId) {
    return false;
  }

  const assignedStaffId = getClientAssignedStaffId(client);

  if (!assignedStaffId) {
    return false;
  }

  return assignedStaffId === user.staffId;
}

// =================================================
// GET ASSIGNED STAFF ID FROM CLIENT
// =================================================

function getClientAssignedStaffId(client: ClientAssignment): string | null {
  if (client.assignedStaffId) {
    return client.assignedStaffId;
  }

  if (typeof client.assignedStaff === "object" && client.assignedStaff) {
    return client.assignedStaff.staffId ?? client.assignedStaff._id ?? null;
  }

  return client.assignedStaff ?? null;
}
