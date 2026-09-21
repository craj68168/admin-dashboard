"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { api } from "@/lib/axios";

import type {
  ChangeStagePayload,
  ChangeStageResponse,
  ProgressFormValues,
  ProgressResponse,
  StageOptionsResponse,
} from "./type";

import { validateProgressForm } from "./validation";

// =================================================
// LOCAL DATE
// =================================================

const getTodayInputValue = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =================================================
// ERROR
// =================================================

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

// =================================================
// HOOK
// =================================================

export const useProgressHook = (clientId: string) => {
  const queryClient = useQueryClient();

  const [values, setValues] = useState<ProgressFormValues>({
    stage: "",
    note: "",
    paymentMethod: "",
    paymentDate: getTodayInputValue(),
    referenceNumber: "",
    receiptNumber: "",
    bankName: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ProgressFormValues, string>>
  >({});

  const [submitError, setSubmitError] = useState("");

  // =================================================
  // PROGRESS
  // =================================================

  const {
    data: progressResponse,
    isLoading: isProgressLoading,
    isFetching: isProgressFetching,
    isError: isProgressError,
    error: progressError,
  } = useQuery<ProgressResponse>({
    queryKey: ["clientProgress", clientId],

    queryFn: async () => {
      const response = await api.get<ProgressResponse>(
        `/client-stages/${encodeURIComponent(clientId)}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  const progressData = progressResponse?.data;

  const history = Array.isArray(progressData?.history)
    ? progressData.history
    : [];

  const currentStage = progressData?.currentStage ?? "";

  const currentStageName =
    progressData?.currentStageName || currentStage || "-";

  // =================================================
  // STAGES
  // =================================================

  const {
    data: stageResponse,
    isLoading: isStageLoading,
    isError: isStageError,
    error: stageError,
  } = useQuery<StageOptionsResponse>({
    queryKey: ["clientStageOptions"],

    queryFn: async () => {
      const response = await api.get<StageOptionsResponse>("/stages");

      return response.data;
    },
  });

  const stageOptions = useMemo(() => {
    return [...(stageResponse?.data ?? [])]
      .filter((stage) => stage.isActive)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [stageResponse]);

  const selectableStageOptions = stageOptions.filter(
    (stage) => stage.key !== currentStage,
  );

  const currentStageFromOptions = stageOptions.find(
    (stage) => stage.key === currentStage,
  );

  const currentStageAmount =
    typeof progressData?.currentStageAmount === "number"
      ? progressData.currentStageAmount
      : (currentStageFromOptions?.amount ?? 0);

  // =================================================
  // SELECTED STAGE
  // =================================================

  const selectedStageDetails = stageOptions.find(
    (stage) => stage.key === values.stage,
  );

  const selectedStageAmount = Number(selectedStageDetails?.amount || 0);

  const requiresPayment = Boolean(
    selectedStageDetails && selectedStageAmount > 0,
  );

  // =================================================
  // CHANGE VALUE
  // =================================================

  const updateValue = <K extends keyof ProgressFormValues>(
    field: K,
    value: ProgressFormValues[K],
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setSubmitError("");
  };

  // =================================================
  // STAGE CHANGE
  // =================================================

  const { mutateAsync: changeStage, isPending: isUpdating } = useMutation<
    ChangeStageResponse,
    unknown,
    ChangeStagePayload
  >({
    mutationFn: async (payload) => {
      const response = await api.post<ChangeStageResponse>(
        `/client-stages/${encodeURIComponent(clientId)}`,
        payload,
      );

      return response.data;
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const handleUpdateStage = async () => {
    setSubmitError("");

    const validation = validateProgressForm(values, requiresPayment);

    if (!validation.valid) {
      setFormErrors(validation.errors);

      return;
    }

    if (values.stage === currentStage) {
      setFormErrors({
        stage: "Please select a different stage.",
      });

      return;
    }

    const payload: ChangeStagePayload = {
      stage: values.stage,

      note: values.note.trim(),
    };

    // =================================================
    // PAYMENT
    // =================================================

    if (requiresPayment) {
      payload.paymentMethod = values.paymentMethod || undefined;

      payload.paymentDate = values.paymentDate;

      if (values.referenceNumber.trim()) {
        payload.referenceNumber = values.referenceNumber.trim();
      }

      if (values.receiptNumber.trim()) {
        payload.receiptNumber = values.receiptNumber.trim();
      }

      if (values.bankName.trim()) {
        payload.bankName = values.bankName.trim();
      }
    }

    try {
      const response = await changeStage(payload);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clientProgress", clientId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["clientPayments", clientId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["client", clientId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["clients"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["adminDashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staffDashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staffTarget"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staffPerformance"],
        }),
      ]);

      setValues({
        stage: "",
        note: "",
        paymentMethod: "",
        paymentDate: getTodayInputValue(),
        referenceNumber: "",
        receiptNumber: "",
        bankName: "",
      });

      setFormErrors({});

      toast.success(
        response.message ||
          (requiresPayment
            ? `Payment of ¥${selectedStageAmount.toLocaleString()} completed and stage updated.`
            : "Stage updated successfully."),
      );
    } catch (error) {
      console.error("UPDATE CLIENT STAGE ERROR:", error);

      const message = getErrorMessage(error, "Failed to update client stage.");

      setSubmitError(message);

      toast.error(message);
    }
  };

  // =================================================
  // DISABLED
  // =================================================

  const isSubmitDisabled =
    isUpdating ||
    !values.stage ||
    values.stage === currentStage ||
    (requiresPayment && (!values.paymentMethod || !values.paymentDate));

  // =================================================
  // ERRORS
  // =================================================

  const loadError = isProgressError
    ? getErrorMessage(progressError, "Failed to load stage history.")
    : isStageError
      ? getErrorMessage(stageError, "Failed to load stages.")
      : "";

  return {
    values,
    updateValue,

    formErrors,
    submitError,

    history,

    currentStage,
    currentStageName,
    currentStageAmount,

    stageOptions: selectableStageOptions,

    selectedStageDetails,
    selectedStageAmount,

    requiresPayment,

    isLoading: isProgressLoading || isProgressFetching || isStageLoading,

    isUpdating,
    isSubmitDisabled,

    loadError,

    handleUpdateStage,
  };
};
