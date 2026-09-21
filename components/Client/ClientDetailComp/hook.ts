"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib/axios";

import type { ClientDetailResponse } from "./type";

const getDownloadFileName = (contentDisposition?: string) => {
  if (!contentDisposition) {
    return "";
  }

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }

  const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/i);

  return normalMatch?.[1]?.trim() ?? "";
};

export const useClientDetailHook = () => {
  const t = useTranslations("clientDetail");
  const router = useRouter();

  const params = useParams<{
    clientId: string;
  }>();

  const clientId = decodeURIComponent(params.clientId ?? "");

  const [isGeneratingCv, setIsGeneratingCv] = useState(false);

  const [cvError, setCvError] = useState("");

  // =================================================
  // GET CLIENT DETAIL
  // =================================================

  const {
    data: clientResponse,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<ClientDetailResponse>({
    queryKey: ["client", clientId],

    queryFn: async () => {
      const response = await api.get<ClientDetailResponse>(
        `/clients/${encodeURIComponent(clientId)}`,
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
  // EDIT
  // =================================================

  const handleEdit = () => {
    if (!clientId) {
      return;
    }

    router.push(`/admin/client/${encodeURIComponent(clientId)}/edit`);
  };

  // =================================================
  // GENERATE JAPANESE CV
  // =================================================

  const handleGenerateJapaneseCv = async () => {
    if (!clientId || isGeneratingCv) {
      return;
    }

    try {
      setCvError("");
      setIsGeneratingCv(true);

      const response = await api.get(
        `/clients/${encodeURIComponent(clientId)}/japanese-cv`,
        {
          responseType: "blob",
        },
      );

      const rawContentType = response.headers["content-type"];

      const contentType =
        typeof rawContentType === "string" ? rawContentType : "application/pdf";

      const blob = new Blob([response.data], {
        type: contentType,
      });

      const objectUrl = window.URL.createObjectURL(blob);

      const rawDisposition = response.headers["content-disposition"];

      const disposition =
        typeof rawDisposition === "string" ? rawDisposition : undefined;

      const serverFileName = getDownloadFileName(disposition);

      const fallbackName =
        `${clientId}_${client?.fullName ?? "client"}_Japanese-CV.pdf`.replace(
          /\s+/g,
          "-",
        );

      const link = document.createElement("a");

      link.href = objectUrl;

      link.download = serverFileName || fallbackName;

      document.body.appendChild(link);

      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (error) {
      console.error("Generate Japanese CV error:", error);

      let message = "Failed to generate Japanese CV.";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData instanceof Blob) {
          try {
            const text = await responseData.text();

            const parsed = JSON.parse(text);

            message = parsed?.message || message;
          } catch {
            // Keep fallback message.
          }
        } else if (responseData?.message) {
          message = responseData.message;
        }
      }

      setCvError(message);
    } finally {
      setIsGeneratingCv(false);
    }
  };

  // =================================================
  // DETAIL ERROR
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

    isLoading: isLoading || isFetching,

    isError,
    errorMessage,

    isGeneratingCv,
    cvError,

    handleBack,
    handleEdit,
    handleGenerateJapaneseCv,
  };
};
