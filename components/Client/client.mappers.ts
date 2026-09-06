import type {
  ApiResponse,
  ClientApiResponse,
  ClientRecord,
  ClientStaffRecord,
} from "./client.types";

export function getClientList<T>(response: { data?: T[] } | T[] | undefined): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
}

export function mapClientStaff(staff: ClientStaffRecord) {
  return {
    ...staff,
    id: staff.staffId ?? staff._id ?? 0,
  };
}

export function mapClient(client: ClientApiResponse): ClientRecord {
  const assignedStaff = client.assignedStaff;
  const assignedStaffId =
    typeof assignedStaff === "object" && assignedStaff
      ? assignedStaff._id ?? assignedStaff.staffId ?? null
      : assignedStaff ?? null;

  return {
    ...client,
    clientId: Number(client.clientId ?? 0),
    fullName: client.fullName ?? "Unknown Client",
    assignedStaffId,
    assignedStaffName:
      typeof assignedStaff === "object" && assignedStaff
        ? assignedStaff.name ?? "Unassigned"
        : "Unassigned",
  };
}

export type ClientListResponse<T> = T[] | ApiResponse<T>;
