"use client";

import { useMemo, useState } from "react";

import axios from "axios";
import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import { createRemarkSchema } from "./validation";

import type {
  CreateRemarkResponse,
  RemarkFormValues,
  RemarksResponse,
} from "./type";

// =================================================
// TODAY IN JAPAN
// =================================================

const getTokyoDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

export const useRemarksHook = (clientId: string) => {
  const t = useTranslations("clientRemarks");

  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const [serverError, setServerError] = useState("");

  const schema = useMemo(
    () =>
      createRemarkSchema({
        dateRequired: t("validation.dateRequired"),
        mediumRequired: t("validation.mediumRequired"),
        memoRequired: t("validation.memoRequired"),
        memoMax: t("validation.memoMax"),
      }),
    [t],
  );

  // =================================================
  // FORM
  // =================================================

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<RemarkFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      remarkDate: getTokyoDate(),

      medium: "",

      remarks: "",
    },
  });

  // =================================================
  // GET REMARK HISTORY
  // =================================================

  const {
    data: remarksResponse,

    isLoading: isRemarksLoading,

    isError: isRemarksError,

    error: remarksError,
  } = useQuery({
    queryKey: ["clientRemarks", clientId],

    queryFn: async () => {
      const response = await api.get<RemarksResponse>(
        `/remarks/client/${clientId}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  // =================================================
  // CREATE REMARK
  // =================================================

  const {
    mutateAsync: createRemark,

    isPending: isCreatingRemark,
  } = useMutation({
    mutationFn: async (values: RemarkFormValues) => {
      const response = await api.post<CreateRemarkResponse>("/remarks", {
        clientId,

        remarkDate: values.remarkDate,

        medium: values.medium,

        remarks: values.remarks.trim(),
      });

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clientRemarks", clientId],
      });
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (values: RemarkFormValues) => {
    try {
      setServerError("");

      await createRemark(values);

      reset({
        remarkDate: getTokyoDate(),

        medium: "",

        remarks: "",
      });
    } catch (error) {
      console.error("Create remark error:", error);

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || t("messages.saveFailed"),
        );

        return;
      }

      setServerError(t("messages.saveFailed"));
    }
  };

  // =================================================
  // LOAD ERROR
  // =================================================

  let loadError = "";

  if (isRemarksError) {
    if (axios.isAxiosError(remarksError)) {
      loadError =
        remarksError.response?.data?.message || t("messages.loadFailed");
    } else {
      loadError = t("messages.loadFailed");
    }
  }

  return {
    user,

    remarks: remarksResponse?.data ?? [],

    control,
    errors,
    handleSubmit,

    onSubmit,

    isRemarksLoading,

    isSubmitting,
    isCreatingRemark,

    serverError,
    loadError,
  };
};
