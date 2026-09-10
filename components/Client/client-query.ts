"use client";

import { useQuery, type QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export type ClientStaffRecord = {
  _id?: string;
  staffId?: number | string;
  id?: number | string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
};

export type ClientRecord = {
  _id?: string;
  clientId: number | string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  visaType?: string;
  statusOfResidence?: string;
  lastQualification?: string;
  japaneseLanguageLevel?: string;
  schoolName?: string;
  course?: string;
  intake?: string;
  jobCategory?: string;
  jobTitle?: string;
  companyName?: string;
  workLocation?: string;
  sponsorName?: string;
  sponsorRelationship?: string;
  sponsorStatusOfResidence?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  remarks?: string;
  clientImage?: string;
  cv?: string;
  assignedStaff?: ClientStaffRecord | string | null;
  assignedStaffId?: number | string | null;
  assignedStaffName?: string;
};

export type ClientApiResponse = Omit<
  ClientRecord,
  "clientId" | "assignedStaffId" | "assignedStaffName"
> & {
  clientId?: number | string;
};

export type ClientListApiResponse<T> = {
  data?: T[];
};

export type ClientPageData = {
  staffs: ClientStaffRecord[];
  clients: ClientRecord[];
};

export function getClientList<T>(
  response: ClientListApiResponse<T> | T[] | undefined,
): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
}

export function mapClientStaff(staff: ClientStaffRecord): ClientStaffRecord {
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
    clientId: String(client.clientId ?? ""),
    fullName: client.fullName ?? "Unknown Client",
    assignedStaffId,
    assignedStaffName:
      typeof assignedStaff === "object" && assignedStaff
        ? assignedStaff.name ?? "Unassigned"
        : "Unassigned",
  };
}

export function compactPayload(payload: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined),
  );
}

export function invalidateClientData(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: ["client-page-data"] });
  void queryClient.invalidateQueries({ queryKey: ["staff-clients"] });
  void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  void queryClient.invalidateQueries({ queryKey: ["staff"] });
}

export function useClientPageData() {
  return useQuery<ClientPageData>({
    queryKey: ["client-page-data"],
    queryFn: async () => {
      const [staffResponse, clientResponse] = await Promise.all([
        api.get<ClientStaffRecord[] | ClientListApiResponse<ClientStaffRecord>>(
          "/staff",
        ),
        api.get<ClientApiResponse[] | ClientListApiResponse<ClientApiResponse>>(
          "/clients",
        ),
      ]);

      return {
        staffs: getClientList(staffResponse.data).map(mapClientStaff),
        clients: getClientList(clientResponse.data).map(mapClient),
      };
    },
  });
}
