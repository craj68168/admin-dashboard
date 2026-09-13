"use client";

import { useMemo, useState } from "react";

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

import type { ClientFeesResponse } from "../Fees/type";

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

const getDefaultValues = (): PaymentFormValues => ({
  feeId: "",

  amountPaid: "",

  paymentMethod: "",

  paymentDate: getTokyoDate(),

  referenceNumber: "",

  receiptNumber: "",

  bankName: "",

  note: "",
});

export const usePaymentsHook = (clientId: string) => {
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

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

  const feeId = watch("feeId");

  const paymentMethod = watch("paymentMethod");

  // =================================================
  // PAYMENTS
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
  // FEES
  // =================================================

  const {
    data: feesResponse,

    isLoading: isFeesLoading,

    isError: isFeesError,
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

  // Only fees that can still receive money
  const availableFees = useMemo(
    () =>
      fees.filter(
        (fee) => fee.status === "Active" && fee.outstandingAmount > 0,
      ),
    [fees],
  );

  const selectedFee = useMemo(
    () => fees.find((fee) => fee._id === feeId) ?? null,
    [fees, feeId],
  );

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

        feeId: values.feeId,

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
          queryKey: ["clientFees", clientId],
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

      const fee = fees.find((item) => item._id === values.feeId);

      if (!fee) {
        setServerError("Please select a valid fee.");

        return;
      }

      if (fee.status !== "Active") {
        setServerError("This fee is no longer active.");

        return;
      }

      const amount = Number(values.amountPaid);

      if (amount > fee.outstandingAmount) {
        setServerError(
          `Amount cannot exceed the outstanding balance of ¥${new Intl.NumberFormat(
            "ja-JP",
          ).format(fee.outstandingAmount)}.`,
        );

        return;
      }

      const response = await createPayment(values);

      setSuccessMessage(
        response.summary?.outstanding === 0
          ? "Payment recorded successfully. This fee is now fully paid."
          : response.message || "Payment recorded successfully.",
      );

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

  if (!loadError && isFeesError) {
    loadError = "Failed to load client fees.";
  }

  return {
    payments,
    totalPaid,

    fees,
    availableFees,
    selectedFee,

    control,
    errors,

    handleSubmit,
    onSubmit,

    paymentMethod,

    isPaymentsLoading,
    isFeesLoading,

    isSubmitting,
    isCreatingPayment,

    serverError,
    successMessage,
    loadError,
  };
};
