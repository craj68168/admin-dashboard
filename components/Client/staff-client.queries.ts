"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ClientApiResponse, ClientStaffRecord } from "./client.types";
import { getClientList, mapClient, mapClientStaff } from "./client.mappers";

export function useStaffClients(staffId: string) {
  return useQuery({
    queryKey: ["staff-clients", staffId],
    queryFn: async () => {
      const staffResponse = await api.get<
        ClientStaffRecord[] | { data?: ClientStaffRecord[] }
      >("/staff");
      const staffs = getClientList(staffResponse.data).map(mapClientStaff);
      const selectedStaff = staffs.find(
        (staff) =>
          String(staff._id) === staffId ||
          String(staff.staffId) === staffId ||
          String(staff.id) === staffId,
      );
      const clientResponse = await api.get<
        ClientApiResponse[] | { data?: ClientApiResponse[] }
      >(`/clients/staff/${selectedStaff?._id ?? staffId}`);

      return {
        staffs,
        selectedStaff: selectedStaff ?? null,
        clients: getClientList(clientResponse.data).map((client) => ({
          ...mapClient(client),
          assignedStaffId: selectedStaff?._id ?? staffId,
          assignedStaffName: selectedStaff?.name ?? "Assigned Staff",
        })),
      };
    },
    enabled: Boolean(staffId),
  });
}
