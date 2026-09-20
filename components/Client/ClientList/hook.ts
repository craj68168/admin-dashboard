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

  // =================================================
  // EXPORT STATE
  // =================================================

  const [exportingFormat, setExportingFormat] =
    useState<ClientExportFormat | null>(null);

  // =================================================
  // URL QUERY
  // =================================================

  const clientQuery = useMemo<ClientListQuery>(
    () => ({
      keyword: searchParams.get("keyword") ?? "",

      visaType: searchParams.get("visaType") ?? "",

      currentStage: searchParams.get("currentStage") ?? "",

      coeStatus: searchParams.get("coeStatus") ?? "",

      japaneseLevel: searchParams.get("japaneseLevel") ?? "",

      nationality: searchParams.get("nationality") ?? "",

      assignedStaff: searchParams.get("assignedStaff") ?? "",

      page: readPositiveInteger(
        searchParams.get("page"),

        1,
      ),

      limit: readPositiveInteger(
        searchParams.get("limit"),

        DEFAULT_PAGE_SIZE,
      ),
    }),

    [searchParams],
  );

  // =================================================
  // FORM FILTER VALUES
  // =================================================

  const filterValues = useMemo<ClientFilterValues>(
    () => ({
      keyword: clientQuery.keyword,

      visaType: clientQuery.visaType,

      currentStage: clientQuery.currentStage,

      coeStatus: clientQuery.coeStatus,

      japaneseLevel: clientQuery.japaneseLevel,

      nationality: clientQuery.nationality,

      assignedStaff: clientQuery.assignedStaff,
    }),

    [clientQuery],
  );

  // =================================================
  // COMMON BACKEND FILTER PARAMS
  //
  // Used by:
  // - Client list
  // - CSV
  // - PDF
  // - Excel
  // =================================================

  const filterParams = useMemo(
    () => ({
      free_word: clientQuery.keyword || undefined,

      visaType: clientQuery.visaType || undefined,

      currentStage: clientQuery.currentStage || undefined,

      coeStatus: clientQuery.coeStatus || undefined,

      japaneseLevel: clientQuery.japaneseLevel || undefined,

      nationality: clientQuery.nationality || undefined,

      staffId: clientQuery.assignedStaff || undefined,
    }),

    [clientQuery],
  );

  // =================================================
  // UPDATE URL
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
  // CLIENT LIST QUERY
  // =================================================

  const clientsQuery = useQuery<ClientListApiResponse>({
    queryKey: ["clients", clientQuery],

    queryFn: async () => {
      const response = await api.get<ClientListApiResponse>(
        "/clients",

        {
          params: {
            ...filterParams,

            page: clientQuery.page,

            limit: clientQuery.limit,
          },
        },
      );

      return response.data;
    },
  });

  // =================================================
  // STAFF OPTIONS
  // =================================================

  const staffQuery = useQuery<{
    data?: Array<{
      staffId: string;

      name: string;

      isActive: boolean;
    }>;
  }>({
    queryKey: ["staffList"],

    queryFn: async () =>
      (
        await api.get(
          "/staff",

          {
            params: {
              page: 1,

              limit: 100,
            },
          },
        )
      ).data,

    enabled: role === "superadmin",
  });

  // =================================================
  // PAGINATION
  // =================================================

  const onPageChange = (
    page: number,

    limit = clientQuery.limit,
  ) => {
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
  // RESET FILTER
  // =================================================

  const handleClientFilterReset = () => {
    applyQuery({
      keyword: "",

      visaType: "",

      currentStage: "",

      coeStatus: "",

      japaneseLevel: "",

      nationality: "",

      assignedStaff: "",

      page: 1,

      limit: clientQuery.limit,
    });
  };

  // =================================================
  // EXPORT
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
      console.error(`Failed to download ${format} client export:`, error);
    } finally {
      setExportingFormat(null);
    }
  };

  // =================================================
  // DELETE CLIENT
  // =================================================

  const {
    mutate: deleteClient,

    isPending: isDeleting,
  } = useMutation({
    mutationFn: (clientId: string) => api.delete(`/clients/${clientId}`),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffClients"],
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

    // CLIENTS

    clientData: clientsQuery.data?.data ?? [],

    pagination: clientsQuery.data?.pagination,

    clientError: clientsQuery.error,

    isClientError: clientsQuery.isError,

    isClientLoading: clientsQuery.isLoading || clientsQuery.isFetching,

    // FILTERS

    clientFilters: filterValues,

    handleClientSearch,

    handleClientFilterReset,

    // STAFF

    staffOptions: (staffQuery.data?.data ?? [])
      .filter((staff) => staff.isActive)
      .map((staff) => ({
        label: staff.name,

        value: staff.staffId,
      })),

    // PAGINATION

    onPageChange,

    // CREATE

    handleCreateClient: () => router.push("/admin/client/add"),

    // DELETE

    deleteClient,

    isDeleting,

    // EXPORT

    downloadClients,

    exportingFormat,
  };
};
