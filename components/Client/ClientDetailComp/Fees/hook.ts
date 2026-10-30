"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api-message";
import { useAuthStore } from "@/store/auth-store";

import { clientFeeSchema } from "./validation";

import type {
  ClientFee,
  ClientFeeFormValues,
  ClientFeeMutationResponse,
  ClientFeesResponse,
} from "./type";

const defaultValues: ClientFeeFormValues = {
  feeName: "",
  expectedAmount: "",
  dueDate: "",
  note: "",
};

const getTokyoDateInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;

  const month = parts.find((part) => part.type === "month")?.value;

  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
};

export const useClientFeesHook = (clientId: string) => {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.role === "superadmin";

  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);

  const [feeToCancel, setFeeToCancel] = useState<ClientFee | null>(null);

  const [serverError, setServerError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ClientFeeFormValues>({
    resolver: zodResolver(clientFeeSchema),

    defaultValues,
  });

  // =================================================
  // GET FEES
  // =================================================

  const {
    data: feesResponse,

    isLoading: isFeesLoading,

    isError: isFeesError,

    error: feesError,
  } = useQuery({
    queryKey: ["clientFees", clientId],

    queryFn: async () => {
      const response = await api.get<ClientFeesResponse>(
        `/client-fees/client/${clientId}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  const fees = feesResponse?.data ?? [];

  const totalExpected = feesResponse?.summary?.totalExpected ?? 0;

  const totalPaid = feesResponse?.summary?.totalPaid ?? 0;

  const totalOutstanding = feesResponse?.summary?.totalOutstanding ?? 0;

  // =================================================
  // CREATE
  // =================================================

  const { mutateAsync: createFee, isPending: isCreatingFee } = useMutation({
    mutationFn: async (values: ClientFeeFormValues) => {
      const response = await api.post<ClientFeeMutationResponse>(
        "/client-fees",
        {
          clientId,

          feeName: values.feeName.trim(),

          expectedAmount: Number(values.expectedAmount),

          dueDate: values.dueDate || null,

          note: values.note.trim(),
        },
      );

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clientFees", clientId],
      });
    },
  });

  // =================================================
  // UPDATE
  // =================================================

  const { mutateAsync: updateFee, isPending: isUpdatingFee } = useMutation({
    mutationFn: async ({
      feeId,
      values,
    }: {
      feeId: string;
      values: ClientFeeFormValues;
    }) => {
      const response = await api.patch<ClientFeeMutationResponse>(
        `/client-fees/${feeId}`,
        {
          feeName: values.feeName.trim(),

          expectedAmount: Number(values.expectedAmount),

          dueDate: values.dueDate || "",

          note: values.note.trim(),
        },
      );

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clientFees", clientId],
      });
    },
  });

  // =================================================
  // CANCEL
  // =================================================

  const { mutateAsync: cancelFee, isPending: isCancellingFee } = useMutation({
    mutationFn: async (feeId: string) => {
      const response = await api.patch<ClientFeeMutationResponse>(
        `/client-fees/${feeId}/cancel`,
      );

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clientFees", clientId],
      });
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (values: ClientFeeFormValues) => {
    try {
      setServerError("");
      setSuccessMessage("");

      if (editingFeeId) {
        const response = await updateFee({
          feeId: editingFeeId,
          values,
        });

        setSuccessMessage(response.message || "messages.updated");
      } else {
        const response = await createFee(values);

        setSuccessMessage(response.message || "messages.created");
      }

      setEditingFeeId(null);

      reset(defaultValues);
    } catch (error) {
      console.error("Client fee error:", error);

      setServerError(getApiErrorMessage(error));
    }
  };

  // =================================================
  // EDIT
  // =================================================

  const handleEdit = (fee: ClientFee) => {
    if (!isAdmin || fee.status !== "Active") {
      return;
    }

    setServerError("");
    setSuccessMessage("");

    setEditingFeeId(fee._id);

    reset({
      feeName: fee.feeName,

      expectedAmount: String(fee.expectedAmount),

      dueDate: getTokyoDateInputValue(fee.dueDate),

      note: fee.note || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingFeeId(null);

    setServerError("");

    reset(defaultValues);
  };

  // =================================================
  // CANCEL FEE DIALOG
  // =================================================

  const handleOpenCancelFee = (fee: ClientFee) => {
    setFeeToCancel(fee);
  };

  const handleCloseCancelFee = () => {
    if (isCancellingFee) {
      return;
    }

    setFeeToCancel(null);
  };

  const handleConfirmCancelFee = async () => {
    if (!feeToCancel) {
      return;
    }

    try {
      setServerError("");
      setSuccessMessage("");

      const response = await cancelFee(feeToCancel._id);

      setSuccessMessage(response.message || "messages.cancelled");

      if (editingFeeId === feeToCancel._id) {
        setEditingFeeId(null);

        reset(defaultValues);
      }

      setFeeToCancel(null);
    } catch (error) {
      console.error("Cancel fee error:", error);

      const message = getApiErrorMessage(error);
      setServerError(message === "Something went wrong" ? "messages.cancelFailed" : message);

      setFeeToCancel(null);
    }
  };

  // =================================================
  // LOAD ERROR
  // =================================================

  const loadError = isFeesError ? getApiErrorMessage(feesError) : "";

  return {
    isAdmin,

    fees,

    totalExpected,
    totalPaid,
    totalOutstanding,

    control,
    errors,

    handleSubmit,
    onSubmit,

    editingFeeId,

    handleEdit,
    handleCancelEdit,

    feeToCancel,

    handleOpenCancelFee,
    handleCloseCancelFee,
    handleConfirmCancelFee,

    isFeesLoading,

    isSubmitting,
    isCreatingFee,
    isUpdatingFee,
    isCancellingFee,

    serverError,
    successMessage,
    loadError,
  };
};
