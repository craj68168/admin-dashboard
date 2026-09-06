"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { DashboardStat } from "./dashboard.type";

type ClientApiResponse = {
  clientStatus?: string;
};

const completedClientStatuses = new Set([
  "Visa Approved",
  "Departed",
  "Arrived in Japan",
]);

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStat[]> => {
      const [staffResponse, clientResponse] = await Promise.all([
        api.get("/staff"),
        api.get("/clients"),
      ]);

      const staffList = Array.isArray(staffResponse.data?.data)
        ? staffResponse.data.data
        : Array.isArray(staffResponse.data)
          ? staffResponse.data
          : [];
      const clientList = Array.isArray(clientResponse.data?.data)
        ? clientResponse.data.data
        : Array.isArray(clientResponse.data)
          ? clientResponse.data
          : [];
      const completedClients = clientList.filter((client: ClientApiResponse) =>
        completedClientStatuses.has(client.clientStatus ?? ""),
      ).length;

      return [
        { title: "Total Staff", value: String(staffList.length) },
        { title: "Total Clients", value: String(clientList.length) },
        { title: "Completed Clients", value: String(completedClients) },
      ];
    },
  });
}
