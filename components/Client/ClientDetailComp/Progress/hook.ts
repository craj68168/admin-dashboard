"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";
import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";

import { createProgressSchema } from "./validation";

import type { ProgressFormValues, StageHistoryResponse } from "./type";

export const useProgressHook = (clientId: string) => {
  const t = useTranslations("clientProgress");

  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState("");

  const schema = useMemo(
    () =>
      createProgressSchema({
        stageRequired: t("validation.stageRequired"),
        noteMax: t("validation.noteMax"),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ProgressFormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      stage: "",
      note: "",
    },
  });

  // =================================================
  // GET PROGRESS
  // =================================================

  const {
    data: progressResponse,

    isLoading: isProgressLoading,

    isError: isProgressError,

    error: progressError,
  } = useQuery({
    queryKey: ["clientProgress", clientId],

    queryFn: async () => {
      const response = await api.get<StageHistoryResponse>(
        `/client-stages/${clientId}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  const currentStage = progressResponse?.currentStage;

  const history = progressResponse?.data ?? [];

  // =================================================
  // SET CURRENT STAGE IN SELECT
  // =================================================

  useEffect(() => {
    if (!currentStage) {
      return;
    }

    reset({
      stage: currentStage,
      note: "",
    });
  }, [currentStage, reset]);

  // =================================================
  // CHANGE STAGE
  // =================================================

  const {
    mutateAsync: changeStage,

    isPending: isChangingStage,
  } = useMutation({
    mutationFn: async (values: ProgressFormValues) => {
      const response = await api.post(`/client-stages/${clientId}`, {
        stage: values.stage,

        note: values.note.trim(),
      });

      return response.data;
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clientProgress", clientId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["client", clientId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["clients"],
        }),
      ]);
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (values: ProgressFormValues) => {
    try {
      setServerError("");

      if (values.stage === currentStage) {
        setServerError(t("messages.selectDifferentStage"));

        return;
      }

      await changeStage(values);

      reset({
        stage: values.stage,

        note: "",
      });
    } catch (error) {
      console.error("Change stage error:", error);

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || t("messages.updateFailed"),
        );

        return;
      }

      setServerError(t("messages.updateFailed"));
    }
  };

  // =================================================
  // LOAD ERROR
  // =================================================

  let loadError = "";

  if (isProgressError) {
    if (axios.isAxiosError(progressError)) {
      loadError =
        progressError.response?.data?.message ||
        t("messages.loadFailed");
    } else {
      loadError = t("messages.loadFailed");
    }
  }

  return {
    currentStage,
    history,

    control,
    errors,
    handleSubmit,

    onSubmit,

    isProgressLoading,

    isSubmitting,
    isChangingStage,

    serverError,
    loadError,
  };
};
