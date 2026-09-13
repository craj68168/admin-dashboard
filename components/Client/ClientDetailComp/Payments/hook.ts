"use client";

import { useState } from "react";

import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";

import { paymentSchema } from "./validation";

import type {
  CreatePaymentResponse,
  PaymentFormValues,
  PaymentsResponse,
} from "./type";

// =================================================
// TODAY IN JAPAN
// =================================================

const getTokyoDate = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",

    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;

  const month = parts.find((part) => part.type === "month")?.value;

  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
};

// =================================================
// DEFAULT FORM VALUES
// =================================================

const getDefaultValues = (): PaymentFormValues => ({
  paymentName: "",

  expectedAmount: "",

  amountPaid: "",

  paymentMethod: "",

  paymentDate: getTokyoDate(),

  referenceNumber: "",

  receiptNumber: "",

  bankName: "",

  note: "",
});

// =================================================
// HOOK
// =================================================

export const usePaymentsHook = (clientId: string) => {
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =================================================
  // FORM
  // =================================================

  const {
    control,

    handleSubmit,

    reset,

    watch,

    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),

    defaultValues: getDefaultValues(),
  });

  const paymentMethod = watch("paymentMethod");

  // =================================================
  // GET PAYMENTS
  // =================================================

  const {
    data: paymentsResponse,

    isLoading: isPaymentsLoading,

    isError: isPaymentsError,

    error: paymentsError,
  } = useQuery({
    queryKey: ["clientPayments", clientId],

    queryFn: async () => {
      const response = await api.get<PaymentsResponse>(
        `/payments/client/${clientId}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  const payments = paymentsResponse?.data ?? [];

  const totalPaid = paymentsResponse?.summary?.totalPaid ?? 0;

  // =================================================
  // CREATE PAYMENT
  // =================================================

  const {
    mutateAsync: createPayment,

    isPending: isCreatingPayment,
  } = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      const response = await api.post<CreatePaymentResponse>("/payments", {
        clientId,

        paymentName: values.paymentName.trim(),

        expectedAmount: Number(values.expectedAmount),

        amountPaid: Number(values.amountPaid),

        paymentMethod: values.paymentMethod,

        paymentDate: values.paymentDate,

        referenceNumber: values.referenceNumber.trim(),

        receiptNumber: values.receiptNumber.trim(),

        bankName: values.bankName.trim(),

        note: values.note.trim(),
      });

      return response.data;
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clientPayments", clientId],
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

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const result = await createPayment(values);

      setSuccessMessage(result.message || "Payment recorded successfully.");

      reset(getDefaultValues());
    } catch (error) {
      console.error("Create payment error:", error);

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Failed to record payment.",
        );

        return;
      }

      setServerError("Failed to record payment.");
    }
  };

  // =================================================
  // LOAD ERROR
  // =================================================

  let loadError = "";

  if (isPaymentsError) {
    if (axios.isAxiosError(paymentsError)) {
      loadError =
        paymentsError.response?.data?.message || "Failed to load payments.";
    } else {
      loadError = "Failed to load payments.";
    }
  }

  return {
    payments,

    totalPaid,

    control,

    errors,

    handleSubmit,

    onSubmit,

    paymentMethod,

    isPaymentsLoading,

    isSubmitting,

    isCreatingPayment,

    serverError,

    successMessage,

    loadError,
  };
};
