"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import axios from "axios";
import { useNotificationStore } from "@/store/notification-store";

import { api } from "@/lib/axios";

import type {
  ForgotPasswordFormValues,
  ForgotPasswordResponse,
  ForgotPasswordStep,
  ResetPasswordFormValues,
  ResetPasswordResponse,
  VerifyResetCodeFormValues,
  VerifyResetCodeResponse,
} from "./type";

const getErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
};

export function useForgotPasswordHook(loginPath = "/login") {
  const router = useRouter();

  const [step, setStep] =
    useState<ForgotPasswordStep>("email");

  const [email, setEmail] =
    useState("");

  const [resetToken, setResetToken] =
    useState("");

  const forgotPasswordMutation =
    useMutation({
      mutationFn: async (
        values: ForgotPasswordFormValues,
      ) => {
        const response =
          await api.post<ForgotPasswordResponse>(
            "/forgot-password",
            values,
          );

        return response.data;
      },

      onSuccess: (response, values) => {
        setEmail(values.email.trim());
        setStep("otp");

        useNotificationStore.getState().showNotification(
          response.message ||
            "Password reset OTP sent",
          "success",
        );
      },

      onError: (error) => {
        useNotificationStore.getState().showNotification(
          getErrorMessage(
            error,
            "Failed to send password reset OTP",
          ),
          "error",
        );
      },
    });

  const verifyResetCodeMutation =
    useMutation({
      mutationFn: async (
        values: VerifyResetCodeFormValues,
      ) => {
        const response =
          await api.post<VerifyResetCodeResponse>(
            "/verify-reset-code",
            {
              email,
              code: values.code,
            },
          );

        return response.data;
      },

      onSuccess: (response) => {
        setResetToken(
          response.reset_token,
        );
        setStep("reset");

        useNotificationStore.getState().showNotification(
          response.message ||
            "OTP verified successfully",
          "success",
        );
      },

      onError: (error) => {
        useNotificationStore.getState().showNotification(
          getErrorMessage(
            error,
            "Failed to verify OTP",
          ),
          "error",
        );
      },
    });

  const resetPasswordMutation =
    useMutation({
      mutationFn: async (
        values: ResetPasswordFormValues,
      ) => {
        const response =
          await api.post<ResetPasswordResponse>(
            "/reset-password",
            {
              reset_token: resetToken,
              password: values.password,
              confirm_password:
                values.confirm_password,
            },
          );

        return response.data;
      },

      onSuccess: (response) => {
        useNotificationStore.getState().showNotification(
          response.message ||
            "Password reset successfully",
          "success",
        );

        router.replace(loginPath);
      },

      onError: (error) => {
        useNotificationStore.getState().showNotification(
          getErrorMessage(
            error,
            "Failed to reset password",
          ),
          "error",
        );
      },
    });

  const title = useMemo(() => {
    if (step === "otp") {
      return "Verify OTP";
    }

    if (step === "reset") {
      return "Reset Password";
    }

    return "Forgot Password";
  }, [step]);

  const helperText = useMemo(() => {
    if (step === "otp") {
      return `Enter the 6-digit OTP sent to ${email}.`;
    }

    if (step === "reset") {
      return "Create a new password for your account.";
    }

    return "Enter your email address to receive a password reset OTP.";
  }, [email, step]);

  const handleBackToEmail = () => {
    setStep("email");
    setResetToken("");
  };

  return {
    step,
    title,
    helperText,
    email,

    sendOtp: forgotPasswordMutation.mutateAsync,
    verifyOtp:
      verifyResetCodeMutation.mutateAsync,
    resetPassword:
      resetPasswordMutation.mutateAsync,

    isSendingOtp:
      forgotPasswordMutation.isPending,
    isVerifyingOtp:
      verifyResetCodeMutation.isPending,
    isResettingPassword:
      resetPasswordMutation.isPending,

    handleBackToEmail,
  };
}
