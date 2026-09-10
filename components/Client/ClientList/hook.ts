"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import {
  canAssignClient as canAssignClientPermission,
  canCreateClient as canCreateClientPermission,
} from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

import type {
  ClientListApiResponse,
  ClientListViewState,
  ClientRecord,
  ClientStaffRecord,
} from "./type";

function getList<T>(response: ClientListApiResponse<T> | T[] | undefined): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
}

function useClientsQuery() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await api.get<ClientListApiResponse<ClientRecord> | ClientRecord[]>(
        "/clients",
      );

      return getList(response.data);
    },
  });
}

function useStaffQuery() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await api.get<
        ClientListApiResponse<ClientStaffRecord> | ClientStaffRecord[]
      >("/staff");

      return getList(response.data);
    },
  });
}

function useAssignClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      staffId,
    }: {
      clientId: number | string;
      staffId: number | string;
    }) =>
      api.patch(`/clients/${clientId}`, {
        assignedStaff: staffId,
      }),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
      void queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useClientListHook(): ClientListViewState {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user = useAuthStore((state) => state.user);

  const clientsQuery = useClientsQuery();
  const staffQuery = useStaffQuery();
  const assignClient = useAssignClient();

  const staffs = useMemo(() => staffQuery.data ?? [], [staffQuery.data]);

  const clients = useMemo(() => {
    return (clientsQuery.data ?? []).map((client) => {
      const assignedStaff = client.assignedStaff;

      const assignedStaffId =
        typeof assignedStaff === "object" && assignedStaff
          ? assignedStaff._id ?? assignedStaff.staffId ?? assignedStaff.id ?? null
          : assignedStaff ?? null;

      const assignedStaffData = staffs.find(
        (staff) =>
          String(staff._id) === String(assignedStaffId) ||
          String(staff.staffId) === String(assignedStaffId) ||
          String(staff.id) === String(assignedStaffId),
      );

      return {
        ...client,
        clientId: String(client.clientId),
        assignedStaffId,
        assignedStaffName: assignedStaffData?.name ?? "Unassigned",
      };
    });
  }, [clientsQuery.data, staffs]);

  const canCreateClient = canCreateClientPermission(user);
  const canAssignClient = canAssignClientPermission(user);

  const handleCreateClient = () => {
    router.push("/client/clientDetailPage?mode=create");
  };

  const handleAssignClient = (clientId: number | string, staffId: number | string) => {
    if (!canAssignClient) {
      return;
    }

    const selectedStaff = staffs.find(
      (staff) =>
        String(staff._id) === String(staffId) ||
        String(staff.id) === String(staffId) ||
        String(staff.staffId) === String(staffId),
    );

    if (!selectedStaff?._id) {
      return;
    }

    assignClient.mutate({
      clientId,
      staffId: selectedStaff._id,
    });
  };

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    staffs,
    clients,
    isLoading: clientsQuery.isLoading || staffQuery.isLoading,
    isError: clientsQuery.isError || staffQuery.isError,
    canCreateClient,
    canAssignClient,
    handleCreateClient,
    handleAssignClient,
  };
}