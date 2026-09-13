"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export const useStaffHook = () => {
  const queryClient = useQueryClient();

  const {
    data: staffData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["staffList"],

    queryFn: async () => {
      const response = await api.get("/staff");

      return response.data;
    },

    // Call API whenever Staff page mounts
    refetchOnMount: "always",

    // Staff data can change often
    staleTime: 0,
  });

  const { mutate: updateStaffStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({
        staffId,
        isActive,
      }: {
        staffId: string;
        isActive: boolean;
      }) => {
        return api.patch(`/staff/${staffId}/status`, {
          isActive,
        });
      },

      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["staffList"],
        });
      },
    });

  return {
    staffData,

    isLoading,
    isFetching,
    isError,
    error,

    updateStaffStatus,
    isUpdatingStatus,
  };
};
