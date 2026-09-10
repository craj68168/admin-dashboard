"use client";

import {  useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import {
  canAssignClient as canAssignClientPermission,
  canCreateClient as canCreateClientPermission,
} from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

export const useClientHook = () =>{
   const queryClient = useQueryClient();
   
   const {isLoading:isClientLoading, data:clientData} =  useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await api.get(
        "/clients",
      );

      return response.data
    },
  });

  const { data:staffData} = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await api.get("/staff");

      return response?.data
    },
  });

  const {mutate:staffAdd,isPending:isStaffAdding } =  useMutation({
    mutationFn: ({
      clientId,
      staffId,
    }: {
      clientId: number | string;
      staffId: number | string;
    }) =>
      api.put(`/clients/assign/${clientId}`, {
        staffId,
      }),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
      void queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  return {isClientLoading,clientData,staffData,staffAdd,isStaffAdding}
}

export function useClientListHook() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user = useAuthStore((state) => state.user);


  const canCreateClient = canCreateClientPermission(user);
  const canAssignClient = canAssignClientPermission(user);

  const handleCreateClient = () => {
    router.push("/client/add");
  };

  const handleAssignClient = (clientId: number | string, staffId: number | string) => {
    if (!canAssignClient) {
      return;
    }
  }

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    canCreateClient,
    canAssignClient,
    handleCreateClient,
    handleAssignClient,
  };
}
