"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { canAssignClient as canAssignClientPermission } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";
import {
  compactPayload,
  invalidateClientData,
  useClientPageData,
} from "../client-query";
import type {
  ClientDetailViewState,
} from "./type";

function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, string | number | undefined>) =>
      api.post("/clients", payload),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

export function useClientDetailPage(): ClientDetailViewState {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formError, setFormError] = useState("");
  const [defaultClientId] = useState(() => Date.now());
  const user = useAuthStore((state) => state.user);
  const mode = searchParams.get("mode");
  const clientId = Number(searchParams.get("clientId") ?? 0);
  const { data, isLoading, isError } = useClientPageData();
  const createClient = useCreateClient();
  const staffs = useMemo(() => data?.staffs ?? [], [data?.staffs]);
  const client = useMemo(
    () =>
      mode === "create"
        ? null
        : data?.clients.find((item) => Number(item.clientId) === clientId) ?? null,
    [clientId, data?.clients, mode],
  );
  const canAssignClient = canAssignClientPermission(user);

  const assignedStaff = useMemo(() => {
    if (!client?.assignedStaff) {
      return null;
    }

    if (typeof client.assignedStaff === "object") {
      return client.assignedStaff;
    }

    return (
      staffs.find((staff) => String(staff._id) === String(client.assignedStaff)) ??
      null
    );
  }, [client, staffs]);

  const handleCreateClient = async (values: Record<string, string>) => {
    setFormError("");

    try {
      const payload = compactPayload({
        ...values,
        clientId: Number(values.clientId),
        assignedStaff: canAssignClient ? values.assignedStaff || undefined : undefined,
      });

      await createClient.mutateAsync(payload);
      router.push("/client");
    } catch (error) {
      console.error("Failed to create client", error);
      setFormError("Failed to create client.");
    }
  };

  return {
    mode,
    clientId,
    client,
    staffs,
    assignedStaff,
    sidebarCollapsed,
    defaultClientId,
    isLoading,
    isError,
    isCreating: createClient.isPending,
    formError,
    canAssignClient,
    setSidebarCollapsed,
    handleCreateClient,
    handleCancel: () => router.push("/client"),
  };
}
