import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { StaffAddPayload } from "./types";
import { useRouter } from "next/navigation";

export const useStaffAddHook = () => {
  const router = useRouter();
  const { mutate, isPending, isError, isSuccess } = useMutation<
    StaffAddPayload,
    unknown,
    StaffAddPayload
  >({
    mutationFn: async (payload) => {
      return api.post("/staff", payload);
    },
    onSuccess: () => {
      console.warn("Staff created successfully");
      router.push("/staff");
    },
    onError: (error) => {
      console.error("Failed to create staff", error);
    },
  });
  return { mutate, isPending, isError, isSuccess };
};
