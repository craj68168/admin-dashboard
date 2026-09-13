"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export type StaffDetailsRecord = {
  staffId?: number | string;
  name?: string;
  phone?: string;
  location?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  totalClients?: number;
  createdAt?: string;
};

type StaffResponse = {
  data?: StaffDetailsRecord;
};

export function useStaffDetails() {
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;

  const query = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const response = await api.get<StaffResponse>(`/staff/${staffId}`);
      return response.data.data;
    },
    enabled: Boolean(staffId),
  });

  return {
    staff: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
