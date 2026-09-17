"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib/axios";

import type { ClientDetailResponse } from "./type";

export const useClientDetailHook = () => {
  const t = useTranslations("clientDetail");

  const router = useRouter();

  const params = useParams<{
    clientId: string;
  }>();

  const clientId = decodeURIComponent(params.clientId ?? "");

  // =================================================
  // GET CLIENT DETAIL
  // =================================================

  const {
    data: clientResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["client", clientId],

    queryFn: async () => {
      const response = await api.get<ClientDetailResponse>(
        `/clients/${clientId}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  const client = clientResponse?.data;

  // =================================================
  // BACK
  // =================================================

  const handleBack = () => {
    router.push("/admin/client");
  };

  // =================================================
  // ERROR MESSAGE
  // =================================================

  let errorMessage = "";

  if (isError) {
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || t("messages.loadFailed");
    } else {
      errorMessage = t("messages.loadFailed");
    }
  }

  return {
    clientId,
    client,

    isLoading,
    isError,
    errorMessage,

    handleBack,
  };
};
