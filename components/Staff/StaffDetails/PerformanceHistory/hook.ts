"use client";

import { useTranslations } from "next-intl";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import type { PerformanceHistoryResponse } from "./type";

export const usePerformanceHistoryHook = (staffId: string) => {
  const t = useTranslations("staffPerformanceHistory");

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

  let loadError = "";

  if (isError) {
    if (axios.isAxiosError(error)) {
      loadError =
        error.response?.data?.message || t("loadFailed");
    } else {
      loadError = t("loadFailed");
    }
  }

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
