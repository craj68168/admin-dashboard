"use client";

import { getApiErrorMessage } from "@/lib/api-message";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import type { PerformanceHistoryResponse } from "./type";

export const usePerformanceHistoryHook = (staffId: string) => {

  const {
    data: historyResponse,

    isLoading,

    isFetching,

    isError,

    error,

    refetch,
  } = useQuery({
    queryKey: ["staffPerformanceHistory", staffId],

    queryFn: async () => {
      const response = await api.get<PerformanceHistoryResponse>(
        `/staff-targets/staff/${staffId}/history`,
        {
          params: {
            limit: 12,
          },
        },
      );

      return response.data;
    },

    enabled: Boolean(staffId),
  });

  const history = historyResponse?.data ?? [];

  const loadError = isError ? getApiErrorMessage(error) : "";

  return {
    staff: historyResponse?.staff,

    history,

    count: historyResponse?.count ?? 0,

    isLoading,

    isFetching,

    loadError,

    refetch,
  };
};
