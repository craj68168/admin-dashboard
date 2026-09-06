import { useMutation } from "@tanstack/react-query";
import { LoginPayload } from "./type";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/store/type";

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
      const response = await api.post("/superadmin/login", payload);
      return response.data;
    },

    onSuccess: (data) => {
      const token = data?.token ?? data?.access_token ?? null;
      const backendUser = data?.user ?? data?.admin ?? data?.profile ?? null;
      const user = {
        id: Number(backendUser?._id ?? backendUser?.id ?? 1),
        name: backendUser?.name ?? backendUser?.fullName ?? "Super Admin",
        email: backendUser?.email ?? "admin@example.com",
        role: (backendUser?.role ?? data?.role ?? "superadmin") as UserRole,
        location: backendUser?.location,
      };

      if (token) {
        localStorage.setItem("access_token", token);
      }

      setAuth(user, token ?? "");

      router.push("/admin/dashboard");
    },

    onError: () => {},
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

//  const user = useAuthStore(  // to use the user role
//     (state) => state.user,
//   );
