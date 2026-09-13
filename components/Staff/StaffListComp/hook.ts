import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStaffHook = () => {
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["staffList"],
    queryFn: async () => {
      return api.get("/staff");
    },
  });

  const { mutate: updateStaffStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({
        staffId,
        isActive,
      }: {
        staffId: string;
        isActive: boolean;
      }) =>
        api.patch(`/staff/${staffId}/status`, {
          isActive,
        }),

      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["staffList"],
        });
      },
    });

  return {
    isLoading,
    staffData: data,

    updateStaffStatus,
    isUpdatingStatus,
  };
};
