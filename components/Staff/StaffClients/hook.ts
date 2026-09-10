"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function useStaffClients() {
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;
  const { isPending, data, isError } = useQuery({
    queryKey: ["staff-clients", staffId],
    queryFn: async () => {
      const response = await api.get(`/clients/staff/${staffId}`);
      return response.data;
    },
    enabled: !!staffId,
  });
  return {
    data,
    isPending,
    isError,
  };
}
