"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useStaffClientsHook = () => {
  const params = useParams<{ staffId: string }>();

  const staffId = params.staffId;

  const { isLoading, data } = useQuery({
    queryKey: ["staffClients", staffId],
    queryFn: async () => {
      const response = await api.get(`/clients/staff/${staffId}`);

      return response.data;
    },

    enabled: !!staffId,
  });

  return {
    isLoading,
    staffClientsData: data,
  };
};
