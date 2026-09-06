"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ClientApiResponse, ClientStaffRecord } from "./client.types";
import { getClientList, mapClient, mapClientStaff } from "./client.mappers";

export function useClientPageData() {
  return useQuery({
    queryKey: ["client-page-data"],
    queryFn: async () => {
      const [staffResponse, clientResponse] = await Promise.all([
        api.get<ClientStaffRecord[] | { data?: ClientStaffRecord[] }>("/staff/staff"),
        api.get<ClientApiResponse[] | { data?: ClientApiResponse[] }>("/clients/clients"),
      ]);

      return {
        staffs: getClientList(staffResponse.data).map(mapClientStaff),
        clients: getClientList(clientResponse.data).map(mapClient),
      };
    },
  });
}
