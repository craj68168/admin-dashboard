"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

export const useClientHook = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const role = user?.role;

  // =================================================
  // GET CLIENTS
  //
  // Admin:
  // backend returns all clients
  //
  // Staff:
  // backend returns only their assigned clients
  // =================================================

  const {
    data: clientData,
    isLoading: isClientLoading,
    isError: isClientError,
    error: clientError,
  } = useQuery({
    queryKey: ["clients"],

    queryFn: async () => {
      const response = await api.get("/clients", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      return response.data;
    },
  });

  // =================================================
  // DELETE CLIENT
  // SUPERADMIN ONLY
  // =================================================

  const { mutate: deleteClient, isPending: isDeleting } = useMutation({
    mutationFn: (clientId: string) => {
      return api.delete(`/clients/${clientId}`);
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });
    },
  });

  // =================================================
  // CREATE
  // =================================================

  const handleCreateClient = () => {
    router.push("/admin/client/add");
  };

  // =================================================
  // VIEW
  // =================================================

  return {
    role,

    clientData,
    isClientLoading,
    isClientError,
    clientError,

    deleteClient,
    isDeleting,

    handleCreateClient,
  };
};
