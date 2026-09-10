"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { canAssignClient as canAssignClientPermission } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";
import {
  compactPayload,
  getClientList,
  invalidateClientData,
} from "../client-query";
import type { ClientListApiResponse, ClientStaffRecord } from "../client-query";

function useStaffQuery() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await api.get<ClientStaffRecord[] | ClientListApiResponse<ClientStaffRecord>>(
        "/staff",
      );

      return getClientList(response.data);
    },
  });
}

function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, string | number | undefined>) =>
      api.post("/clients", payload),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

export function useAddClientPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formError, setFormError] = useState("");
  const user = useAuthStore((state) => state.user);
  const staffQuery = useStaffQuery();
  const createClient = useCreateClient();
  const canAssignClient = canAssignClientPermission(user);

  const handleCreateClient = async (values: Record<string, string>) => {
    setFormError("");

    try {
      await createClient.mutateAsync(
        compactPayload({
          ...values,
          assignedStaff: canAssignClient ? values.assignedStaff || undefined : undefined,
        }),
      );

      router.push("/client");
    } catch {
      setFormError("Failed to create client.");
    }
  };

  return {
    staffs: staffQuery.data ?? [],
    sidebarCollapsed,
    setSidebarCollapsed,
    defaultClientId: Date.now(),
    isLoading: staffQuery.isLoading,
    isError: staffQuery.isError,
    isCreating: createClient.isPending,
    formError,
    canAssignClient,
    handleCreateClient,
    handleCancel: () => router.push("/client"),
  };
}
