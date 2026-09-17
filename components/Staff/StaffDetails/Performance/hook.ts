"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";

import { useAuthStore } from "@/store/auth-store";

import { createStaffTargetSchema } from "./validation";

import type {
  StaffTargetFormValues,
  StaffTargetMutationResponse,
  StaffTargetResponse,
} from "./type";

// =================================================
// CURRENT MONTH IN JAPAN
// =================================================

const getCurrentJapanMonth = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",

    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;

  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}-${month}`;
};

// =================================================
// DEFAULT FORM
// =================================================

const defaultValues: StaffTargetFormValues = {
  targetAmount: "",
  note: "",
};

// =================================================
// HOOK
// =================================================

export const usePerformanceHook = (staffId: string) => {
  const t = useTranslations("staffPerformance");

  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.role === "superadmin";

  const [selectedMonth, setSelectedMonth] = useState(getCurrentJapanMonth());

  const [serverError, setServerError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =================================================
  // FORM
  // =================================================

  const {
    control,

    handleSubmit,

    reset,

    formState: { errors, isSubmitting },
  } = useForm<StaffTargetFormValues>({
    resolver: zodResolver(
      createStaffTargetSchema({
        targetAmountRequired: t("validation.targetAmountRequired"),
        targetAmountPositive: t("validation.targetAmountPositive"),
        noteMax: t("validation.noteMax"),
      }),
    ),

    defaultValues,
  });

  // =================================================
  // GET TARGET / PERFORMANCE
  // =================================================

  const {
    data: performanceResponse,

    isLoading: isPerformanceLoading,

    isFetching: isPerformanceFetching,

    isError: isPerformanceError,

    error: performanceError,
  } = useQuery({
    queryKey: ["staffTarget", staffId, selectedMonth],

    queryFn: async () => {
      const response = await api.get<StaffTargetResponse>(
        `/staff-targets/staff/${staffId}`,
        {
          params: {
            month: selectedMonth,
          },
        },
      );

      return response.data;
    },

    enabled: Boolean(staffId && selectedMonth),
  });

  const target = performanceResponse?.target ?? null;

  const performance = performanceResponse?.performance ?? {
    targetAmount: 0,
    totalCollected: 0,
    remainingAmount: 0,
    achievementPercentage: 0,
    paymentCount: 0,
    clientCount: 0,
    status: "No Target" as const,
  };

  // =================================================
  // PREFILL FORM
  // =================================================

  useEffect(() => {
    if (!target) {
      reset(defaultValues);
      return;
    }

    reset({
      targetAmount: String(target.targetAmount),
      note: target.note || "",
    });
  }, [target, reset]);

  // =================================================
  // CREATE TARGET
  // =================================================

  const {
    mutateAsync: createTarget,

    isPending: isCreatingTarget,
  } = useMutation({
    mutationFn: async (values: StaffTargetFormValues) => {
      const response = await api.post<StaffTargetMutationResponse>(
        "/staff-targets",
        {
          staffId,

          targetMonth: selectedMonth,

          targetAmount: Number(values.targetAmount),

          note: values.note.trim(),
        },
      );

      return response.data;
    },
  });

  // =================================================
  // UPDATE TARGET
  // =================================================

  const {
    mutateAsync: updateTarget,

    isPending: isUpdatingTarget,
  } = useMutation({
    mutationFn: async ({
      targetId,
      values,
    }: {
      targetId: string;
      values: StaffTargetFormValues;
    }) => {
      const response = await api.patch<StaffTargetMutationResponse>(
        `/staff-targets/${targetId}`,
        {
          targetAmount: Number(values.targetAmount),
          note: values.note.trim(),
        },
      );

      return response.data;
    },
    onMutate: () => {
      setServerError("");
      setSuccessMessage("");
    },
  });

  // =================================================
  // REFRESH
  // =================================================

  const refreshPerformance = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["staffTarget", staffId, selectedMonth],
      }),

      queryClient.invalidateQueries({
        queryKey: ["staffList"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["staff", staffId],
      }),
    ]);
  };

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (values: StaffTargetFormValues) => {
    setServerError("");
    setSuccessMessage("");
    if (!isAdmin) {
      return;
    }

    try {
      setServerError("");
      setSuccessMessage("");

      if (target) {
        const response = await updateTarget({
          targetId: target._id,

          values,
        });

        setSuccessMessage(
          response.message || t("messages.targetUpdated"),
        );
      } else {
        const response = await createTarget(values);

        setSuccessMessage(
          response.message || t("messages.targetCreated"),
        );
      }

      await refreshPerformance();
    } catch (error) {
      console.error("Staff target error:", error);

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
  // MONTH CHANGE
  // =================================================

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);

    setServerError("");
    setSuccessMessage("");
  };

  // =================================================
  // LOAD ERROR
  // =================================================

  let loadError = "";

  if (isPerformanceError) {
    if (axios.isAxiosError(performanceError)) {
      loadError =
        performanceError.response?.data?.message ||
        t("messages.loadFailed");
    } else {
      loadError = t("messages.loadFailed");
    }
  }

  return {
    user,
    isAdmin,

    selectedMonth,
    handleMonthChange,

    target,
    performance,

    staff: performanceResponse?.staff,

    control,
    errors,

    handleSubmit,
    onSubmit,

    isPerformanceLoading,
    isPerformanceFetching,

    isSubmitting,
    isCreatingTarget,
    isUpdatingTarget,

    serverError,
    successMessage,
    loadError,
  };
};
