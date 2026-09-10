"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import {
  canAssignClient as canAssignClientPermission,
  canCreateClient as canCreateClientPermission,
} from "@/lib/permissions";

import { useAuthStore } from "@/store/auth-store";
import { invalidateClientData, useClientPageData } from "../client-query";

import type {
  ClientListViewState,
} from "./type";


function useAssignClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      staffId,
    }: {
      clientId: string;
      staffId: number | string;
    }) =>
      api.patch(`/clients/${clientId}`, {
        assignedStaff: staffId,
      }),

    onSuccess: () => {
      invalidateClientData(queryClient);
    },

    onError: (error) => {
      console.error("Failed to assign client", error);
    },
  });
}


export function useClientListHook(): ClientListViewState {
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError } = useClientPageData();

  const assignClient = useAssignClient();

  const staffs = data?.staffs ?? [];
  const clients = data?.clients ?? [];

  const canCreateClient = canCreateClientPermission(user);
  const canAssignClient = canAssignClientPermission(user);


  const handleCreateClient = () => {
    router.push("/client/clientDetailPage?mode=create");
  };


  const handleAssignClient = (
    clientId: number | string,
    staffId: number | string
  ) => {
    if (!canAssignClient) {
      return;
    }


    const selectedClient = clients.find(
      (client) => String(client.clientId) === String(clientId)
    );


    if (!selectedClient?._id) {
      return;
    }


    const selectedStaff = staffs.find(
      (staff) =>
        String(staff._id ?? staff.id ?? staff.staffId) ===
        String(staffId)
    );


    if (!selectedStaff) {
      return;
    }


    assignClient.mutate({
      clientId: String(selectedClient.clientId),

      staffId:
        selectedStaff._id ??
        selectedStaff.id ??
        selectedStaff.staffId ??
        0,
    });
  };


  return {
    sidebarCollapsed,
    setSidebarCollapsed,

    staffs,
    clients,

    isLoading,
    isError,

    canCreateClient,
    canAssignClient,

    handleCreateClient,
    handleAssignClient,
  };
}
