"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import { progressStageSchema } from "./validation";

import type {
  ClientStageHistoryResponse,
  ClientStageListResponse,
  ClientStageUpdateResponse,
  ProgressUpdatePayload,
} from "./type";

const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Online Payment",
  "Cheque",
  "Other",
] as const;

const getLocalDate = () => {
  const now = new Date();

  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);

  return local.toISOString().slice(0, 10);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export const useProgressHook = (clientId: string) => {
  const queryClient = useQueryClient();

  const [selectedStage, setSelectedStage] = useState("");

  const [note, setNote] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [paymentDate, setPaymentDate] = useState(getLocalDate());

  const [referenceNumber, setReferenceNumber] = useState("");

  const [receiptNumber, setReceiptNumber] = useState("");

  const [bankName, setBankName] = useState("");

  const [formError, setFormError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =================================================
  // CLIENT PROGRESS
  // =================================================
  const {
    data: historyResponse,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
    isError: isHistoryError,
    error: historyError,
  } = useQuery<ClientStageHistoryResponse>({
    queryKey: ["clientProgress", clientId],

    queryFn: async () => {
      const response = await api.get<ClientStageHistoryResponse>(
        `/client-stages/${encodeURIComponent(clientId)}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  // =================================================
  // STAGE MASTER
  // =================================================
  const {
    data: stageResponse,
    isLoading: isStageLoading,
    isFetching: isStageFetching,
    isError: isStageError,
    error: stageError,
  } = useQuery<ClientStageListResponse>({
    queryKey: ["clientStageOptions"],

    queryFn: async () => {
      const response = await api.get<ClientStageListResponse>("/stages");

      return response.data;
    },
  });

  const historyData = historyResponse?.data;

  const history = Array.isArray(historyData?.history)
    ? historyData.history
    : [];

  const currentStage = historyData?.currentStage ?? "";

  const currentStageName = historyData?.currentStageName || currentStage || "-";

  const stageOptions = useMemo(() => {
    return [...(stageResponse?.data ?? [])]
      .filter((stage) => stage.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [stageResponse]);

  const currentStageFromOptions = stageOptions.find(
    (stage) => stage.key === currentStage,
  );

  const currentStageAmount =
    typeof historyData?.currentStageAmount === "number"
      ? historyData.currentStageAmount
      : (currentStageFromOptions?.amount ?? 0);

  const selectedStageValue = selectedStage || currentStage;

  const selectedStageDetails =
    stageOptions.find((stage) => stage.key === selectedStageValue) ?? null;

  const requiresPayment =
    selectedStageValue !== currentStage &&
    Number(selectedStageDetails?.amount ?? 0) > 0;

  // =================================================
  // UPDATE
  // =================================================
  const { mutateAsync: updateStage, isPending: isUpdatingStage } = useMutation<
    ClientStageUpdateResponse,
    unknown,
    ProgressUpdatePayload
  >({
    mutationFn: async (values) => {
      const response = await api.post<ClientStageUpdateResponse>(
        `/client-stages/${encodeURIComponent(clientId)}`,
        values,
      );

      return response.data;
    },
  });

  // =================================================
  // REFRESH
  // =================================================
  const refreshAfterStageChange = async () => {
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
  };

  // =================================================
  // RESET PAYMENT
  // =================================================
  const resetPaymentFields = () => {
    setPaymentMethod("");
    setPaymentDate(getLocalDate());
    setReferenceNumber("");
    setReceiptNumber("");
    setBankName("");
  };

  // =================================================
  // STAGE CHANGE
  // =================================================
  const handleStageChange = (value: string) => {
    setSelectedStage(value);

    setFormError("");
    setSuccessMessage("");

    resetPaymentFields();
  };

  // =================================================
  // SUBMIT
  // =================================================
  const handleUpdateStage = async () => {
    setFormError("");
    setSuccessMessage("");

    const values = {
      stage: selectedStageValue,
      note,
      paymentMethod,
      paymentDate,
      referenceNumber,
      receiptNumber,
      bankName,
    };

    const result = progressStageSchema.safeParse(values);

    if (!result.success) {
      setFormError(result.error.issues[0]?.message || "Please check the form.");

      return;
    }

    if (result.data.stage === currentStage) {
      setFormError("Please select a different stage.");

      return;
    }

    if (requiresPayment) {
      if (
        !PAYMENT_METHODS.includes(
          result.data.paymentMethod as (typeof PAYMENT_METHODS)[number],
        )
      ) {
        setFormError("Please select a payment method.");

        return;
      }

      if (!result.data.paymentDate) {
        setFormError("Payment date is required.");

        return;
      }
    }

    const payload: ProgressUpdatePayload = {
      stage: result.data.stage,

      note: result.data.note,
    };

    if (requiresPayment) {
      payload.paymentMethod = result.data.paymentMethod;

      payload.paymentDate = result.data.paymentDate;

      payload.referenceNumber = result.data.referenceNumber;

      payload.receiptNumber = result.data.receiptNumber;

      payload.bankName = result.data.bankName;
    }

    try {
      const response = await updateStage(payload);

      setSelectedStage("");
      setNote("");

      resetPaymentFields();

      setSuccessMessage(
        response.message || "Client stage updated successfully.",
      );

      await refreshAfterStageChange();
    } catch (error) {
      console.error("Update client stage error:", error);

      setFormError(getErrorMessage(error, "Failed to update client stage."));
    }
  };

  const historyLoadError = isHistoryError
    ? getErrorMessage(historyError, "Failed to load client progress.")
    : "";

  const stageLoadError = isStageError
    ? getErrorMessage(stageError, "Failed to load stages.")
    : "";

  return {
    history,

    currentStage,
    currentStageName,
    currentStageAmount,

    stageOptions,

    selectedStageValue,
    selectedStageDetails,

    requiresPayment,

    note,
    setNote,

    paymentMethod,
    setPaymentMethod,

    paymentDate,
    setPaymentDate,

    referenceNumber,
    setReferenceNumber,

    receiptNumber,
    setReceiptNumber,

    bankName,
    setBankName,

    handleStageChange,
    handleUpdateStage,

    isHistoryLoading,
    isHistoryFetching,

    isStageLoading,
    isStageFetching,

    isUpdatingStage,

    historyLoadError,
    stageLoadError,
    formError,
    successMessage,
  };
};
