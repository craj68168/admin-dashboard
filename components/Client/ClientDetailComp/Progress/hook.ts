"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";

import { progressSchema } from "./validation";

import type { ProgressFormValues, StageHistoryResponse } from "./type";

export const useProgressHook = (clientId: string) => {
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ProgressFormValues>({
    resolver: zodResolver(progressSchema),

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
        setServerError("Please select a different stage.");

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
          error.response?.data?.message || "Failed to update client stage.",
        );

        return;
      }

      setServerError("Failed to update client stage.");
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
        "Failed to load client progress.";
    } else {
      loadError = "Failed to load client progress.";
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
