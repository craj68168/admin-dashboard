"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { StaffFilterValues, StaffListApiResponse, StaffListQuery } from "./type";

const DEFAULT_PAGE_SIZE = 10;

const readPositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const useStaffHook = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const staffQuery = useMemo<StaffListQuery>(
    () => ({
      keyword: searchParams.get("keyword") ?? "",
      staffId: searchParams.get("staffId") ?? "",
      location: searchParams.get("location") ?? "",
      isActive: searchParams.get("isActive") ?? "",
      page: readPositiveInteger(searchParams.get("page"), 1),
      limit: readPositiveInteger(searchParams.get("limit"), DEFAULT_PAGE_SIZE),
    }),
    [searchParams],
  );

  const filterValues = useMemo<StaffFilterValues>(
    () => ({
      keyword: staffQuery.keyword,
      staffId: staffQuery.staffId,
      location: staffQuery.location,
      isActive: staffQuery.isActive,
    }),
    [staffQuery],
  );

  const applyQuery = (nextQuery: StaffListQuery) => {
    const params = new URLSearchParams();
    Object.entries(nextQuery).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const staffListQuery = useQuery<StaffListApiResponse>({
    queryKey: ["staffList", staffQuery],
    queryFn: async () => {
      const response = await api.get<StaffListApiResponse>("/staff", {
        params: staffQuery,
      });
      return response.data;
    },
  });

  const staffOptionsQuery = useQuery<{
    data?: Array<{ staffId: string; name: string }>;
  }>({
    queryKey: ["staffOptions"],
    queryFn: async () =>
      (await api.get("/staff", { params: { page: 1, limit: 100 } })).data,
  });

  const onPageChange = (page: number) => applyQuery({ ...staffQuery, page });
  const handleStaffSearch = (values: StaffFilterValues) =>
    applyQuery({ ...values, page: 1, limit: staffQuery.limit });
  const handleStaffFilterReset = () =>
    applyQuery({ keyword: "", staffId: "", location: "", isActive: "", page: 1, limit: staffQuery.limit });

  const { mutate: updateStaffStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: ({ staffId, isActive }: { staffId: string; isActive: boolean }) =>
      api.patch(`/staff/${staffId}/status`, { isActive }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });

  return {
    staffData: staffListQuery.data?.data ?? [],
    pagination: staffListQuery.data?.pagination,
    staffFilters: filterValues,
    staffOptions: (staffOptionsQuery.data?.data ?? []).map((staff) => ({
      label: `${staff.name} (${staff.staffId})`,
      value: staff.staffId,
    })),
    isLoading: staffListQuery.isLoading || staffListQuery.isFetching,
    isError: staffListQuery.isError,
    error: staffListQuery.error,
    onPageChange,
    handleStaffSearch,
    handleStaffFilterReset,
    updateStaffStatus,
    isUpdatingStatus,
  };
};
