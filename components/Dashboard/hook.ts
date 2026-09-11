"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type {
  DashboardData,
  DashboardStatus,
  RecentClient,
} from "./dashboard.type";

type ClientApiResponse = {
  clientId?: number | string;
  fullName?: string;
  clientStatus?: string;
  createdAt?: string;
};

type StaffApiResponse = {
  isActive?: boolean;
};

const completedClientStatuses = new Set([
  "Visa Approved",
  "Departed",
  "Arrived in Japan",
]);

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardData> => {
      const [staffResponse, clientResponse] = await Promise.all([
        api.get("/staff"),
        api.get("/clients"),
      ]);

      const staffList: StaffApiResponse[] = Array.isArray(
        staffResponse.data?.data,
      )
        ? staffResponse.data.data
        : Array.isArray(staffResponse.data)
          ? staffResponse.data
          : [];
      const clientList: ClientApiResponse[] = Array.isArray(
        clientResponse.data?.data,
      )
        ? clientResponse.data.data
        : Array.isArray(clientResponse.data)
          ? clientResponse.data
          : [];
      const activeStaff = staffList.filter(
        (staff: StaffApiResponse) => staff.isActive !== false,
      ).length;
      const completedClients = clientList.filter((client: ClientApiResponse) =>
        completedClientStatuses.has(client.clientStatus ?? ""),
      ).length;

      const statusColors: Record<string, string> = {
        New: "#2563EB",
        Processing: "#D97706",
        Approved: "#059669",
        Rejected: "#DC2626",
        "Visa Approved": "#0F766E",
        Departed: "#7C3AED",
        "Arrived in Japan": "#0891B2",
      };
      const statusCounts = clientList.reduce<Record<string, number>>(
        (counts, client: ClientApiResponse) => {
          const status = client.clientStatus || "Unassigned";
          counts[status] = (counts[status] ?? 0) + 1;
          return counts;
        },
        {},
      );
      const statuses: DashboardStatus[] = Object.entries(statusCounts)
        .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
        .map(([label, count]) => ({
          label,
          count,
          color: statusColors[label] ?? "#64748B",
        }));

      const recentClients: RecentClient[] = clientList
        .filter((client: ClientApiResponse) => client.clientId !== undefined)
        .sort(
          (first, second) =>
            new Date(second.createdAt ?? 0).getTime() -
            new Date(first.createdAt ?? 0).getTime(),
        )
        .slice(0, 5)
        .map((client: ClientApiResponse) => ({
          clientId: client.clientId ?? "",
          fullName: client.fullName ?? "Unnamed client",
          clientStatus: client.clientStatus ?? "Unassigned",
          createdAt: client.createdAt,
        }));

      return {
        stats: [
          {
            title: "Total staff",
            value: String(staffList.length),
            detail: `${activeStaff} currently active`,
            tone: "blue",
            icon: "staff",
          },
          {
            title: "Total clients",
            value: String(clientList.length),
            detail: `${statuses.length} tracked statuses`,
            tone: "violet",
            icon: "clients",
          },
          {
            title: "Active staff",
            value: String(activeStaff),
            detail: staffList.length
              ? "Ready to manage clients"
              : "No staff registered",
            tone: "green",
            icon: "active",
          },
          {
            title: "Completed clients",
            value: String(completedClients),
            detail: clientList.length
              ? `${Math.round((completedClients / clientList.length) * 100)}% of all clients`
              : "No client data yet",
            tone: "amber",
            icon: "complete",
          },
        ],
        statuses,
        recentClients,
      };
    },
  });
}
