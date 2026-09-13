import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffAddPayload } from "./types";
import { useRouter } from "next/navigation";

export const useStaffAddHook = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, isSuccess } = useMutation<
    StaffAddPayload,
    unknown,
    StaffAddPayload
  >({
    mutationFn: async (payload) => {
      return api.post("/staff", payload);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });

      router.push("/admin/staff");
    },
    onError: (error) => {
      console.error("Failed to create staff", error);
    },
  });
  return { mutate, isPending, isError, isSuccess };
};
