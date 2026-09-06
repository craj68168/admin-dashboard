import axios from "axios";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  detail?: string;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const getApiSuccessMessage = (data: unknown): string | null => {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return null;
};
