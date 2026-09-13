"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import type { StaffDetailsResponse } from "./type";

export const useStaffDetails = () => {
  const params = useParams<{
    staffId: string;
  }>();

  const staffId = params.staffId;

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["staff", staffId],

    queryFn: async () => {
      const response = await api.get<StaffDetailsResponse>(
        `/staff/${encodeURIComponent(staffId)}`,
      );

      return response.data?.data;
    },

    enabled: Boolean(staffId),
  });

  return {
    staffId,

    staff: data,

    isLoading,

    isFetching,

    isError,

    error,
  };
};
