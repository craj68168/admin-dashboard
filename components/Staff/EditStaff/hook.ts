"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api-message";
import type { StaffEditFormValues, StaffEditRecord } from "./types";

type StaffResponse = StaffEditRecord | { data?: StaffEditRecord };

function getStaffRecord(response: StaffResponse): StaffEditRecord {
  if ("data" in response) {
    return response.data ?? {};
  }

  return response as StaffEditRecord;
}

export function useEditStaffHook() {
  const router = useRouter();
  const params = useParams<{ staffId: string }>();
  const queryClient = useQueryClient();
  const staffId = params.staffId;

  const staffQuery = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const response = await api.get<StaffResponse>(`/staff/${staffId}`);
      return getStaffRecord(response.data);
    },
    enabled: Boolean(staffId),
  });

  const updateStaff = useMutation({
    mutationFn: (payload: StaffEditFormValues) => {
      const updatePayload = payload.password
        ? payload
        : {
            name: payload.name,
            email: payload.email,
            location: payload.location,
            phone: payload.phone,
          };

      return api.patch(`/staff/${staffId}`, updatePayload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["staffList"] });
      void queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
      router.push("/admin/staff");
    },
  });

  return {
    staff: staffQuery.data,
    isLoading: staffQuery.isLoading,
    isError: staffQuery.isError,
    errorMessage: staffQuery.error ? getApiErrorMessage(staffQuery.error) : "",
    updateStaff,
  };
}
