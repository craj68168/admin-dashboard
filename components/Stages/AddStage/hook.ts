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
import toast from "react-hot-toast";

import { api } from "@/lib/axios";

import { addStageSchema } from "./validation";

import type {
  AddStageFormValues,
  AddStagePayload,
  AddStageResponse,
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
    },

    mode: "onSubmit",
  });

  // =================================================
  // CREATE STAGE
  // =================================================

  const createMutation = useMutation({
    mutationFn: createStage,

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["stages"],
      });

      toast.success(
        response.message ||
          "Stage created successfully",
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

        toast.error(
          message ||
            "Failed to create stage",
        );

        return;
      }

      toast.error(
        "Failed to create stage",
      );
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = (
    values: AddStageFormValues,
  ) => {
    const payload: AddStagePayload = {
      name: values.name.trim(),
      amount: Number(values.amount),
    };

    createMutation.mutate(payload);
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