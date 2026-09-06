"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ClientPayload, ClientStatusField } from "./client.types";

function invalidateClientData(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["client-page-data"] });
  void queryClient.invalidateQueries({ queryKey: ["staff-clients"] });
  void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  void queryClient.invalidateQueries({ queryKey: ["staff"] });
}

export function useAssignClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, staffId }: { clientId: string; staffId: number | string }) =>
      api.put(`/clients/assign/${clientId}`, { staffId }),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClientPayload) => api.post("/clients", payload),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId, payload }: { recordId: string; payload: ClientPayload }) =>
      api.put(`/clients/${recordId}`, payload),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

export function useUpdateClientField() {
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
