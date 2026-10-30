"use client";

import { useRouter } from "next/navigation";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useNotificationStore } from "@/store/notification-store";

import { api } from "@/lib/axios";

import { addStageSchema } from "./validation";

import type {
  AddStageFormValues,
  AddStagePayload,
  AddStageResponse,
  UpdateStageStatusPayload,
} from "./type";

// =================================================
// API
// =================================================

const createStage = async (
  payload: AddStagePayload,
): Promise<AddStageResponse> => {
  const response =
    await api.post<AddStageResponse>(
      "/stages",
      payload,
    );

  return response.data;
};

const updateStageStatus = async ({
  stageId,
  isActive,
}: UpdateStageStatusPayload): Promise<void> => {
  await api.patch(
    `/stages/${stageId}/status`,
    {
      isActive,
    },
  );
};

// =================================================
// HOOK
// =================================================

export function useAddStageHook() {
  const router = useRouter();
  const queryClient =
    useQueryClient();

  // =================================================
  // FORM
  // =================================================

  const form = useForm<AddStageFormValues>({
    resolver: zodResolver(
      addStageSchema,
    ),

    defaultValues: {
      name: "",
      amount: "",
      status: "active",
    },

    mode: "onSubmit",
  });

  // =================================================
  // CREATE STAGE
  // =================================================

  const createMutation = useMutation({
    mutationFn: async (
      values: AddStageFormValues,
    ) => {
      const response = await createStage({
        name: values.name.trim(),
        amount: Number(values.amount),
      });

      const createdStageId =
        response.data?.stageId;

      if (
        values.status === "inactive" &&
        createdStageId
      ) {
        await updateStageStatus({
          stageId: createdStageId,
          isActive: false,
        });
      }

      return response;
    },

onSuccess: async (response) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["stages"],
    }),

    queryClient.invalidateQueries({
      queryKey: ["clientStageOptions"],
    }),
  ]);

  useNotificationStore.getState().showNotification(
    response.message ||
      "Stage created successfully",
    "success",
  );

  router.push("/admin/stages");
},

    onError: (error: unknown) => {
      console.error(
        "Failed to create stage:",
        error,
      );

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        useNotificationStore.getState().showNotification(
          message ||
            "Failed to create stage",
          "error",
        );

        return;
      }

      useNotificationStore.getState().showNotification(
        "Failed to create stage",
        "error",
      );
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = (
    values: AddStageFormValues,
  ) => {
    createMutation.mutate(values);
  };

  // =================================================
  // CANCEL
  // =================================================

  const handleCancel = () => {
    router.push("/admin/stages");
  };

  // =================================================
  // RETURN
  // =================================================

  return {
    form,

    onSubmit:
      form.handleSubmit(onSubmit),

    handleCancel,

    isSubmitting:
      createMutation.isPending,
  };
}
