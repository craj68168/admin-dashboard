"use client";

import { useParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export function useStaffClients() {
  const params = useParams<{
    staffId: string;
  }>();

  const staffId = params.staffId;

  const queryClient = useQueryClient();

  // =================================================
  // GET STAFF CLIENTS
  // =================================================

  const { data, isPending, isError } = useQuery({
    queryKey: ["staff-clients", staffId],

    queryFn: async () => {
      const response = await api.get(`/staff/${staffId}/clients`);

      return response.data;
    },

    enabled: Boolean(staffId),
  });

  // =================================================
  // DELETE CLIENT
  // =================================================

  const { mutate: deleteClient, isPending: isDeleting } = useMutation({
    mutationFn: (clientId: string | number) => {
      return api.delete(`/clients/${clientId}`);
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["staff-clients", staffId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staff", staffId],
      });
    },
  });

  return {
    data,
    isPending,
    isError,

    deleteClient,
    isDeleting,
  };
}
