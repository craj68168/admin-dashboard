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

  const { mutate: deleteStaff, isPending: isDeleting } = useMutation({
    mutationFn: (staffId: number | string) => api.delete(`/staff/${staffId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });

  return { isLoading, staffData: data, deleteStaff, isDeleting };
};
