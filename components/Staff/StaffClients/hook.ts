"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getClientList,
  invalidateClientData,
  mapClient,
  mapClientStaff,
} from "@/components/Client/client-query";
import { api } from "@/lib/axios";
import { canUpdateClientStatus } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";
import type {
  ClientApiResponse,
  ClientListApiResponse,
  ClientStaffRecord,
  ClientStatusField,
  StaffClientsViewState,
} from "./type";

function useStaffClients(staffId: string) {
  return useQuery({
    queryKey: ["staff-clients", staffId],
    queryFn: async () => {
      const staffResponse = await api.get<
        ClientStaffRecord[] | ClientListApiResponse<ClientStaffRecord>
      >("/staff");
      const staffs = getClientList(staffResponse.data).map(mapClientStaff);
      const selectedStaff = staffs.find(
        (staff) =>
          String(staff._id) === staffId ||
          String(staff.staffId) === staffId ||
          String(staff.id) === staffId,
      );
      const clientResponse = await api.get<
        ClientApiResponse[] | ClientListApiResponse<ClientApiResponse>
      >(`/clients/staff/${selectedStaff?._id ?? staffId}`);

      return {
        staffs,
        selectedStaff: selectedStaff ?? null,
        clients: getClientList(clientResponse.data).map((client) => {
          const mappedClient = mapClient(client);

          return {
            ...mappedClient,
            assignedStaffName:
              mappedClient.assignedStaffName ?? selectedStaff?.name ?? "Assigned Staff",
          };
        }),
      };
    },
    enabled: Boolean(staffId),
  });
}

function useUpdateClientField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recordId,
      field,
      value,
    }: {
      recordId: string;
      field: ClientStatusField;
      value: string;
    }) => api.put(`/clients/${recordId}`, { [field]: value }),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

export function useStaffClientsPage(): StaffClientsViewState {
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useStaffClients(staffId);
  const updateClientField = useUpdateClientField();
  const clients = data?.clients ?? [];
  const staffs = (data?.staffs ?? []).map((staff) => ({
    ...staff,
    id: staff._id ?? staff.id ?? staff.staffId ?? 0,
  }));

  const handleUpdateClientField = (
    clientId: number,
    field: "coeStatus" | "visaStatus" | "clientStatus",
    value: string,
  ) => {
    const selectedClient = clients.find((client) => client.clientId === clientId);

    if (!selectedClient || !canUpdateClientStatus(user, selectedClient) || !selectedClient._id) {
      return;
    }

    updateClientField.mutate({
      recordId: selectedClient._id,
      field,
      value,
    });
  };

  return {
    staffId,
    sidebarCollapsed,
    setSidebarCollapsed,
    staffs,
    clients,
    selectedStaff: data?.selectedStaff
      ? {
          ...data.selectedStaff,
          id: data.selectedStaff._id ?? data.selectedStaff.id ?? data.selectedStaff.staffId ?? 0,
        }
      : null,
    isLoading,
    isError,
    handleUpdateClientField,
  };
}
