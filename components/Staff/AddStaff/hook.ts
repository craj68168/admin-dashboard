import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useStaffAddHook = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (payload) => {
      return api.post("/staff", payload);
    },
    onSuccess: () => {
      console.warn("Staff created successfully");
    },
    onError: (error) => {
      console.error("Failed to create staff", error);
    },
  });
  return { mutate, isPending, isError, isSuccess };
};
