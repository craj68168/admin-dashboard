"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import type {
  ClientFilterValues,
  ClientListApiResponse,
  ClientListQuery,
} from "./type";

const DEFAULT_PAGE_SIZE = 10;

const readPositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const useClientHook = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const clientQuery = useMemo<ClientListQuery>(
    () => ({
      keyword: searchParams.get("keyword") ?? "",
      visaType: searchParams.get("visaType") ?? "",
      coeStatus: searchParams.get("coeStatus") ?? "",
      clientStatus: searchParams.get("clientStatus") ?? "",
      assignedStaff: searchParams.get("assignedStaff") ?? "",
      page: readPositiveInteger(searchParams.get("page"), 1),
      limit: readPositiveInteger(searchParams.get("limit"), DEFAULT_PAGE_SIZE),
    }),
    [searchParams],
  );
  const filterValues = useMemo<ClientFilterValues>(
    () => ({
      keyword: clientQuery.keyword,
      visaType: clientQuery.visaType,
      coeStatus: clientQuery.coeStatus,
      clientStatus: clientQuery.clientStatus,
      assignedStaff: clientQuery.assignedStaff,
    }),
    [clientQuery],
  );

  const applyQuery = (nextQuery: ClientListQuery) => {
    const params = new URLSearchParams();
    Object.entries(nextQuery).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clientsQuery = useQuery<ClientListApiResponse>({
    queryKey: ["clients", clientQuery],
    queryFn: async () => {
      const response = await api.get<ClientListApiResponse>("/clients", {
        params: {
          page: clientQuery.page,
          limit: clientQuery.limit,
          free_word: clientQuery.keyword || undefined,
          visaType: clientQuery.visaType || undefined,
          coeStatus: clientQuery.coeStatus || undefined,
          clientStatus: clientQuery.clientStatus || undefined,
          staffId: clientQuery.assignedStaff || undefined,
        },
      });
      return response.data;
    },
  });

  const staffQuery = useQuery<{
    data?: Array<{ staffId: string; name: string; isActive: boolean }>;
  }>({
    queryKey: ["staffList"],
    queryFn: async () =>
      (await api.get("/staff", { params: { page: 1, limit: 100 } })).data,
    enabled: role === "superadmin",
  });

  const onPageChange = (page: number, limit = clientQuery.limit) =>
    applyQuery({ ...clientQuery, page, limit });

  const handleClientSearch = (values: ClientFilterValues) =>
    applyQuery({ ...values, page: 1, limit: clientQuery.limit });

  const handleClientFilterReset = () =>
    applyQuery({
      keyword: "",
      visaType: "",
      coeStatus: "",
      clientStatus: "",
      assignedStaff: "",
      page: 1,
      limit: clientQuery.limit,
    });

  const { mutate: deleteClient, isPending: isDeleting } = useMutation({
    mutationFn: (clientId: string) => api.delete(`/clients/${clientId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
      void queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });

  return {
    role,
    clientData: clientsQuery.data?.data ?? [],
    pagination: clientsQuery.data?.pagination,
    staffOptions: (staffQuery.data?.data ?? [])
      .filter((staff) => staff.isActive)
      .map((staff) => ({ label: staff.name, value: staff.staffId })),
    clientError: clientsQuery.error,
    deleteClient,
    isDeleting,
    handleCreateClient: () => router.push("/admin/client/add"),
    isClientLoading: clientsQuery.isLoading || clientsQuery.isFetching,
    isClientError: clientsQuery.isError,
    clientFilters: filterValues,
    onPageChange,
    handleClientSearch,
    handleClientFilterReset,
  };
};
