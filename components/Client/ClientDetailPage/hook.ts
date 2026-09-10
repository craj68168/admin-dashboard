"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ClientDetailViewState, ClientRecord } from "./type";

function useClientDetailsQuery(clientId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["client-details", clientId],
    queryFn: async () => {
      const response = await api.get<{ data?: ClientRecord }>(`/clients/${clientId}`);

      return response.data;
    },
    enabled,
  });
}

export function useClientDetailPage(): ClientDetailViewState {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const clientId = searchParams.get("clientId") ?? "";
  const clientDetailsQuery = useClientDetailsQuery(clientId, Boolean(clientId));
  const client = clientDetailsQuery.data?.data ?? null;
  const assignedStaff = client?.assignedStaffDetails ?? null;

  return {
    clientId,
    client,
    assignedStaff,
    sidebarCollapsed,
    isLoading: clientDetailsQuery.isLoading,
    isError: clientDetailsQuery.isError,
    setSidebarCollapsed,
    handleCancel: () => router.push("/client"),
  };
}
