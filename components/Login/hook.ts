import { useMutation } from "@tanstack/react-query";
import { LoginPayload } from "./type";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export const useLoginHook = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    mutate,
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await api.post("/auth/login", payload);

      return response.data;
    },

    onSuccess: (data) => {
      const token = data?.token ?? data?.access_token ?? null;

      if (token) {
        localStorage.setItem("access_token", token);
      }

      setAuth(data.user, token);

      router.replace("/admin/dashboard");
    },
  });

  return {
    login: mutate,
    loginAsync: mutateAsync,
    data,
    loading: isPending,
    error,
    isError,
    isSuccess,
    reset,
  };
};
