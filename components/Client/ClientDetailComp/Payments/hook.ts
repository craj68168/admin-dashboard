"use client";

import { getApiErrorMessage } from "@/lib/api-message";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import type { ClientPaymentResponse } from "./type";

export const usePaymentsHook = (clientId: string) => {
  const { data, isLoading, isFetching, isError, error } =
    useQuery<ClientPaymentResponse>({
      queryKey: ["clientPayments", clientId],

      queryFn: async () => {
        const response = await api.get<ClientPaymentResponse>(
          `/payments/client/${encodeURIComponent(clientId)}`,
        );

        return response.data;
      },

      enabled: Boolean(clientId),
    });

  return {
    payments: Array.isArray(data?.data) ? data.data : [],

    summary: data?.summary ?? {
      totalCollected: 0,
      completedCount: 0,
      cancelledCount: 0,
      refundedCount: 0,
    },

    isLoading,
    isFetching,
    isError,

    errorMessage: isError ? getApiErrorMessage(error) : "",
  };
};
