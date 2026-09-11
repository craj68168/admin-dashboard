"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function useStaffClients() {
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;
  const queryClient = useQueryClient();
  const { isPending, data, isError } = useQuery({
    queryKey: ["staff-clients", staffId],
    queryFn: async () => {
      const response = await api.get(`/clients/staff/${staffId}`);
      return response.data;
    },
    enabled: !!staffId,
  });

  const { mutate: deleteClient, isPending: isDeleting } = useMutation({
    mutationFn: (clientId: number | string) =>
      api.delete(`/clients/${clientId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["staff-clients", staffId],
      });
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
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
