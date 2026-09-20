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
  ProgressFormValues,
} from "./type";
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
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // =================================================
  // CLIENT CURRENT STAGE + HISTORY
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
  // ACTIVE STAGE MASTER
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
  // =================================================
  // SAFE HISTORY DATA
  //
  // Backend now returns:
  // data:{
  //   clientId,
  //   currentStage,
  //   currentStageName,
  //   currentStageAmount,
  //   history:[]
  // }
  // =================================================
  const historyData = historyResponse?.data;
  const history = Array.isArray(historyData?.history)
    ? historyData.history
    : [];
  const currentStage = historyData?.currentStage ?? "";
  const currentStageName = historyData?.currentStageName || currentStage || "-";
  // =================================================
  // STAGE OPTIONS
  // =================================================
  const stageOptions = useMemo(() => {
    return [...(stageResponse?.data ?? [])]
      .filter((stage) => stage.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [stageResponse]);
  // =================================================
  // CURRENT STAGE AMOUNT
  // Backend sends the current configured amount.
  // Fallback to stage master if needed.
  // =================================================
  const currentStageFromOptions = stageOptions.find(
    (item) => item.key === currentStage,
  );
  const currentStageAmount =
    typeof historyData?.currentStageAmount === "number"
      ? historyData.currentStageAmount
      : (currentStageFromOptions?.amount ?? 0);
  // =================================================
  // SELECTED STAGE
  //
  // No useEffect needed.
  // Empty local selection means use current stage.
  // =================================================
  const selectedStageValue = selectedStage || currentStage;
  const selectedStageDetails = useMemo(() => {
    return (
      stageOptions.find((stage) => stage.key === selectedStageValue) ?? null
    );
  }, [stageOptions, selectedStageValue]);
  // =================================================
  // UPDATE STAGE
  // =================================================
  const { mutateAsync: updateStage, isPending: isUpdatingStage } = useMutation<
    ClientStageUpdateResponse,
    unknown,
    ProgressFormValues
  >({
    mutationFn: async (values) => {
      const response = await api.post<ClientStageUpdateResponse>(
        `/client-stages/${encodeURIComponent(clientId)}`,
        {
          stage: values.stage,
          note: values.note.trim(),
        },
      );
      return response.data;
    },
  });
  // =================================================
  // REFRESH RELATED DATA
  // =================================================
  const refreshAfterStageChange = async () => {
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
      queryClient.invalidateQueries({
        queryKey: ["adminDashboard"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["staffDashboard"],
      }),
    ]);
  };
  // =================================================
  // STAGE CHANGE
  // =================================================
  const handleStageChange = (value: string) => {
    setSelectedStage(value);
    setFormError("");
    setSuccessMessage("");
  };
  // =================================================
  // NOTE CHANGE
  // =================================================
  const handleNoteChange = (value: string) => {
    setNote(value);
    setFormError("");
    setSuccessMessage("");
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
    };
    const result = progressStageSchema.safeParse(values);
    if (!result.success) {
      setFormError(
        result.error.issues[0]?.message ||
          "Please check the stage information.",
      );
      return;
    }
    if (result.data.stage === currentStage) {
      setFormError("Please select a different stage.");
      return;
    }
    try {
      const response = await updateStage(result.data);
      setSelectedStage("");
      setNote("");
      setSuccessMessage(
        response.message || "Client stage updated successfully.",
      );
      await refreshAfterStageChange();
    } catch (error) {
      console.error("Update client stage error:", error);
      setFormError(getErrorMessage(error, "Failed to update client stage."));
    }
  };
  // =================================================
  // HISTORY LOAD ERROR
  // =================================================
  const historyLoadError = isHistoryError
    ? getErrorMessage(historyError, "Failed to load client progress.")
    : "";
  // =================================================
  // STAGE LOAD ERROR
  // =================================================
  const stageLoadError = isStageError
    ? getErrorMessage(stageError, "Failed to load stages.")
    : "";
  // =================================================
  // RETURN
  // =================================================
  return {
    history,
    currentStage,
    currentStageName,
    currentStageAmount,
    stageOptions,
    selectedStageValue,
    selectedStageDetails,
    note,
    handleStageChange,
    handleNoteChange,
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
