"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import toast from "react-hot-toast";

import { api } from "@/lib/axios";

import { editStageSchema } from "./validation";

import type {
  EditStageFormValues,
  EditStagePayload,
  EditStageResponse,
  StageListResponse,
  StageRecord,
} from "./type";

// =================================================
// GET STAGES
// =================================================

const getStages = async (): Promise<StageRecord[]> => {
  const response =
    await api.get<StageListResponse>(
      "/stages",
      {
        params: {
          includeInactive: true,
        },
      },
    );

  return Array.isArray(response.data?.data)
    ? response.data.data
    : [];
};

// =================================================
// UPDATE STAGE
// =================================================

const updateStage = async ({
  stageId,
  payload,
}: {
  stageId: string;
  payload: EditStagePayload;
}): Promise<EditStageResponse> => {
  const response =
    await api.patch<EditStageResponse>(
      `/stages/${stageId}`,
      payload,
    );

  return response.data;
};

// =================================================
// HOOK
// =================================================

export function useEditStageHook() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const rawStageId = params.stageId;

  const stageId =
    typeof rawStageId === "string"
      ? rawStageId
      : "";

  // =================================================
  // FORM
  // =================================================

  const form = useForm<EditStageFormValues>({
    resolver: zodResolver(
      editStageSchema,
    ),

    defaultValues: {
      name: "",
      amount: "",
      displayOrder: "",
    },

    mode: "onSubmit",
  });

  // =================================================
  // GET STAGE
  // =================================================

  const {
    data: stages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "stages",
      "edit",
      stageId,
    ],

    queryFn: getStages,

    enabled: Boolean(stageId),
  });

  const stage =
    stages.find(
      (item) =>
        item.stageId === stageId,
    ) ?? null;

  // =================================================
  // POPULATE FORM
  // =================================================

  useEffect(() => {
    if (!stage) {
      return;
    }

    form.reset({
      name: stage.name ?? "",
      amount: String(
        stage.amount ?? 0,
      ),
      displayOrder: String(
        stage.displayOrder ?? "",
      ),
    });
  }, [stage, form]);

  // =================================================
  // UPDATE MUTATION
  // =================================================

  const updateMutation = useMutation({
    mutationFn: updateStage,

    onSuccess: async (response) => {
      toast.success(
        response.message ||
          "Stage updated successfully",
      );

      await queryClient.invalidateQueries({
        queryKey: ["stages"],
      });

      router.push("/admin/stages");
    },

    onError: (error: unknown) => {
      console.error(
        "Failed to update stage:",
        error,
      );

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        toast.error(
          message ||
            "Failed to update stage",
        );

        return;
      }

      toast.error(
        "Failed to update stage",
      );
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const handleUpdateStage = (
    values: EditStageFormValues,
  ) => {
    if (!stageId) {
      toast.error(
        "Stage ID is missing",
      );

      return;
    }

    const payload: EditStagePayload = {
      name: values.name.trim(),
      amount: Number(
        values.amount,
      ),
      displayOrder: Number(
        values.displayOrder,
      ),
    };

    updateMutation.mutate({
      stageId,
      payload,
    });
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
    stageId,
    stage,

    form,

    isLoading,
    isError,

    refetch,

    onSubmit:
      form.handleSubmit(
        handleUpdateStage,
      ),

    handleCancel,

    isSubmitting:
      updateMutation.isPending,
  };
}