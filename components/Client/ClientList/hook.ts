"use client";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import type {
  ClientExportFormat,
  ClientFilterValues,
  ClientListApiResponse,
  ClientListQuery,
  ClientStageListResponse,
  StaffListResponse,
} from "./type";
// =================================================
// CONFIG
// =================================================
const DEFAULT_PAGE_SIZE = 10;
// =================================================
// POSITIVE INTEGER
// =================================================
const readPositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
// =================================================
// HOOK
// =================================================
export const useClientHook = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const [exportingFormat, setExportingFormat] =
    useState<ClientExportFormat | null>(null);
  // =================================================
  // URL QUERY
  // =================================================
  const clientQuery = useMemo<ClientListQuery>(
    () => ({
      keyword: searchParams.get("keyword") ?? "",
      currentVisaStatus: searchParams.get("currentVisaStatus") ?? "",
      preferCategory: searchParams.get("preferCategory") ?? "",
      currentStage: searchParams.get("currentStage") ?? "",
      japaneseLevel: searchParams.get("japaneseLevel") ?? "",
      nationality: searchParams.get("nationality") ?? "",
      assignedStaff: searchParams.get("assignedStaff") ?? "",
      page: readPositiveInteger(searchParams.get("page"), 1),
      limit: readPositiveInteger(searchParams.get("limit"), DEFAULT_PAGE_SIZE),
    }),
    [searchParams],
  );
  // =================================================
  // FILTER VALUES
  // =================================================
  const filterValues = useMemo<ClientFilterValues>(
    () => ({
      keyword: clientQuery.keyword,
      currentVisaStatus: clientQuery.currentVisaStatus,
      preferCategory: clientQuery.preferCategory,
      currentStage: clientQuery.currentStage,
      japaneseLevel: clientQuery.japaneseLevel,
      nationality: clientQuery.nationality,
      assignedStaff: clientQuery.assignedStaff,
    }),
    [clientQuery],
  );
  // =================================================
  // COMMON BACKEND FILTER PARAMS
  //
  // IMPORTANT:
  // These exact filters are used by:
  // GET /clients
  // GET /clients/export/csv
  // GET /clients/export/pdf
  // GET /clients/export/xlsx
  // =================================================
  const filterParams = useMemo(
    () => ({
      free_word: clientQuery.keyword || undefined,
      currentVisaStatus: clientQuery.currentVisaStatus || undefined,
      preferCategory: clientQuery.preferCategory || undefined,
      currentStage: clientQuery.currentStage || undefined,
      japaneseLevel: clientQuery.japaneseLevel || undefined,
      nationality: clientQuery.nationality || undefined,
      staffId: clientQuery.assignedStaff || undefined,
    }),
    [clientQuery],
  );
  // =================================================
  // APPLY URL QUERY
  // =================================================
  const applyQuery = (nextQuery: ClientListQuery) => {
    const params = new URLSearchParams();
    Object.entries(nextQuery).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };
  // =================================================
  // CLIENT LIST
  // =================================================
  const clientsQuery = useQuery<ClientListApiResponse>({
    queryKey: ["clients", clientQuery],
    queryFn: async () => {
      const response = await api.get<ClientListApiResponse>("/clients", {
        params: {
          ...filterParams,
          page: clientQuery.page,
          limit: clientQuery.limit,
        },
      });
      return response.data;
    },
  });
  // =================================================
  // STAFF OPTIONS
  // =================================================
  const staffQuery = useQuery<StaffListResponse>({
    queryKey: ["staffList"],
    queryFn: async () => {
      const response = await api.get<StaffListResponse>("/staff", {
        params: {
          page: 1,
          limit: 100,
        },
      });
      return response.data;
    },
    enabled: role === "superadmin",
  });
  // =================================================
  // STAGE OPTIONS
  // =================================================
  const stageQuery = useQuery<ClientStageListResponse>({
    queryKey: ["clientStageOptions"],
    queryFn: async () => {
      const response = await api.get<ClientStageListResponse>("/stages");
      return response.data;
    },
  });
  // =================================================
  // STAFF SELECT OPTIONS
  // =================================================
  const staffOptions = useMemo(() => {
    return (staffQuery.data?.data ?? [])
      .filter((staff) => staff.isActive)
      .map((staff) => ({
        label: `${staff.name} (${staff.staffId})`,
        value: staff.staffId,
      }));
  }, [staffQuery.data]);
  // =================================================
  // STAGE SELECT OPTIONS
  // =================================================
  const stageOptions = useMemo(() => {
    return (stageQuery.data?.data ?? [])
      .filter((stage) => stage.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((stage) => ({
        label: stage.name,
        value: stage.key,
      }));
  }, [stageQuery.data]);
  // =================================================
  // PAGINATION
  // =================================================
  const onPageChange = (page: number, limit = clientQuery.limit) => {
    applyQuery({
      ...clientQuery,
      page,
      limit,
    });
  };
  // =================================================
  // SEARCH
  // =================================================
  const handleClientSearch = (values: ClientFilterValues) => {
    applyQuery({
      ...values,
      page: 1,
      limit: clientQuery.limit,
    });
  };
  // =================================================
  // RESET
  // =================================================
  const handleClientFilterReset = () => {
    applyQuery({
      keyword: "",
      currentVisaStatus: "",
      preferCategory: "",
      currentStage: "",
      japaneseLevel: "",
      nationality: "",
      assignedStaff: "",
      page: 1,
      limit: clientQuery.limit,
    });
  };
  // =================================================
  // DOWNLOAD
  // =================================================
  const downloadClients = async (format: ClientExportFormat) => {
    try {
      setExportingFormat(format);
      const response = await api.get(`/clients/export/${format}`, {
        params: filterParams,
        responseType: "blob",
      });
      let contentType = "application/octet-stream";
      if (format === "csv") {
        contentType = "text/csv;charset=utf-8";
      }
      if (format === "pdf") {
        contentType = "application/pdf";
      }
      if (format === "xlsx") {
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }
      const blob = new Blob([response.data], {
        type: contentType,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `clients-${date}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to download ${format} clients:`, error);
    } finally {
      setExportingFormat(null);
    }
  };
  // =================================================
  // DELETE
  // =================================================
  const { mutate: deleteClient, isPending: isDeleting } = useMutation({
    mutationFn: (clientId: string) =>
      api.delete(`/clients/${encodeURIComponent(clientId)}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["staffClients"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["adminDashboard"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["staffDashboard"],
      });
    },
  });
  // =================================================
  // RETURN
  // =================================================
  return {
    role,
    clientData: clientsQuery.data?.data ?? [],
    pagination: clientsQuery.data?.pagination,
    clientError: clientsQuery.error,
    isClientError: clientsQuery.isError,
    isClientLoading: clientsQuery.isLoading || clientsQuery.isFetching,
    clientFilters: filterValues,
    staffOptions,
    stageOptions,
    isStaffLoading: staffQuery.isLoading,
    isStageLoading: stageQuery.isLoading,
    onPageChange,
    handleClientSearch,
    handleClientFilterReset,
    handleCreateClient: () => router.push("/admin/client/add"),
    deleteClient,
    isDeleting,
    downloadClients,
    exportingFormat,
  };
};
