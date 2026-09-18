"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import type {
  Client,
  ClientFilterValues,
} from "./type";

// =================================================
// INITIAL FILTER VALUES
// =================================================

const INITIAL_CLIENT_FILTERS: ClientFilterValues = {
  keyword: "",
  visaType: "",
  coeStatus: "",
  clientStatus: "",
  assignedStaff: "",
};

export const useClientHook = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const role = user?.role;

  // =================================================
  // APPLIED CLIENT FILTERS
  //
  // These values change only when Search or Clear
  // is clicked from the shared SearchFilter.
  // =================================================

  const [clientFilters, setClientFilters] =
    useState<ClientFilterValues>(
      INITIAL_CLIENT_FILTERS,
    );

  // =================================================
  // GET CLIENTS
  //
  // Admin:
  // backend returns all clients
  //
  // Staff:
  // backend returns only their assigned clients
  //
  // Search/filter backend is not ready yet,
  // so filtering is temporarily done below.
  // =================================================

  const {
    data: clientData,
    isLoading: isClientLoading,
    isError: isClientError,
    error: clientError,
  } = useQuery({
    queryKey: ["clients"],

    queryFn: async () => {
      const response = await api.get("/clients", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      return response.data;
    },
  });

  // =================================================
  // SEARCH
  // =================================================

  const handleClientSearch = (
    values: ClientFilterValues,
  ) => {
    setClientFilters(values);
  };

  // =================================================
  // RESET SEARCH / FILTER
  // =================================================

  const handleClientFilterReset = (
    values: ClientFilterValues,
  ) => {
    setClientFilters(values);
  };

  // =================================================
  // TEMPORARY FRONTEND SEARCH / FILTER
  //
  // Later this moves to backend.
  // =================================================

  const filteredClients = useMemo(() => {
    const clients: Client[] =
      clientData?.data || [];

    const keyword = clientFilters.keyword
      .trim()
      .toLowerCase();

    return clients.filter((client) => {
      // =============================================
      // KEYWORD SEARCH
      // =============================================

      const clientId = String(
        client.clientId ?? "",
      ).toLowerCase();

      const fullName = String(
        client.fullName ?? "",
      ).toLowerCase();

      const phone = String(
        client.phone ?? "",
      ).toLowerCase();

      const matchesKeyword =
        !keyword ||
        clientId.includes(keyword) ||
        fullName.includes(keyword) ||
        phone.includes(keyword);

      // =============================================
      // VISA TYPE
      // =============================================

      const matchesVisaType =
        !clientFilters.visaType ||
        client.visaType ===
          clientFilters.visaType;

      // =============================================
      // COE STATUS
      // =============================================

      const matchesCoeStatus =
        !clientFilters.coeStatus ||
        client.coeStatus ===
          clientFilters.coeStatus;

      // =============================================
      // CLIENT STATUS
      // =============================================

      const matchesClientStatus =
        !clientFilters.clientStatus ||
        client.clientStatus ===
          clientFilters.clientStatus;

      // =============================================
      // ASSIGNED STAFF
      // =============================================

      const matchesAssignedStaff =
        !clientFilters.assignedStaff ||
        client.assignedStaff ===
          clientFilters.assignedStaff;

      // =============================================
      // ALL ACTIVE FILTERS MUST MATCH
      // =============================================

      return (
        matchesKeyword &&
        matchesVisaType &&
        matchesCoeStatus &&
        matchesClientStatus &&
        matchesAssignedStaff
      );
    });
  }, [
    clientData,
    clientFilters,
  ]);

  // =================================================
  // DELETE CLIENT
  // SUPERADMIN ONLY
  // =================================================

  const {
    mutate: deleteClient,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (clientId: string) => {
      return api.delete(
        `/clients/${clientId}`,
      );
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });
    },
  });

  // =================================================
  // CREATE
  // =================================================

  const handleCreateClient = () => {
    router.push("/admin/client/add");
  };

  // =================================================
  // RETURN
  // =================================================

  return {
    role,

    clientData,
    filteredClients,

    isClientLoading,
    isClientError,
    clientError,

    deleteClient,
    isDeleting,

    handleCreateClient,

    // Search / Filter
    clientFilters,

    initialClientFilters:
      INITIAL_CLIENT_FILTERS,

    handleClientSearch,
    handleClientFilterReset,
  };
};