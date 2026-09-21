"use client";

import { useState, type FormEvent } from "react";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { api } from "@/lib/axios";

import type {
  AdminDashboardResponse,
  DashboardFilters,
  DashboardPagination,
} from "./type";

// =================================================
// CURRENT JAPAN MONTH
// =================================================

const getCurrentJapanMonth = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",

    year: "numeric",

    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;

  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}-${month}`;
};

// =================================================
// DEFAULT FILTERS
// =================================================

const DEFAULT_FILTERS: DashboardFilters = {
  free_word: "",
  staffId: "",

  currentStage: "",
  currentVisaStatus: "",
  preferCategory: "",

  nationality: "",
  japaneseLevel: "",

  paymentStatus: "",
  paymentMethod: "",
  paymentStage: "",
};

// =================================================
// DEFAULT PAGINATION
// =================================================

const createDefaultPagination = (limit = 10): DashboardPagination => ({
  currentPage: 1,
  totalPages: 0,
  perPage: limit,
  total: 0,

  from: null,
  to: null,

  hasNextPage: false,
  hasPreviousPage: false,
});

// =================================================
// HOOK
// =================================================

export const useAdminDashboard = () => {
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentJapanMonth());

  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  const [searchInput, setSearchInput] = useState("");

  const [rankingPage, setRankingPage] = useState(1);

  const [rankingLimit, setRankingLimit] = useState(10);

  const [paymentPage, setPaymentPage] = useState(1);

  const [paymentLimit, setPaymentLimit] = useState(10);

  // =================================================
  // QUERY
  // =================================================

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<AdminDashboardResponse>({
      queryKey: [
        "adminDashboard",

        selectedMonth,

        filters,

        rankingPage,
        rankingLimit,

        paymentPage,
        paymentLimit,
      ],

      queryFn: async () => {
        const params: Record<string, string | number> = {
          month: selectedMonth,

          rankingPage,
          rankingLimit,

          paymentPage,
          paymentLimit,
        };

        Object.entries(filters).forEach(([key, value]) => {
          const normalized = String(value || "").trim();

          if (normalized) {
            params[key] = normalized;
          }
        });

        const response = await api.get<AdminDashboardResponse>(
          "/dashboard/admin",
          {
            params,
          },
        );

        return response.data;
      },
    });

  // =================================================
  // ERROR
  // =================================================

  let loadError = "";

  if (isError) {
    if (axios.isAxiosError(error)) {
      loadError = error.response?.data?.message || "Failed to load dashboard.";
    } else {
      loadError = "Failed to load dashboard.";
    }
  }

  // =================================================
  // MONTH
  // =================================================

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);

    setRankingPage(1);
    setPaymentPage(1);
  };

  // =================================================
  // FILTER
  // =================================================

  const handleFilterChange = (name: keyof DashboardFilters, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    setRankingPage(1);
    setPaymentPage(1);
  };

  // =================================================
  // SEARCH
  // =================================================

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFilters((previous) => ({
      ...previous,

      free_word: searchInput.trim(),
    }));

    setRankingPage(1);
    setPaymentPage(1);
  };

  // =================================================
  // RESET
  // =================================================

  const handleResetFilters = () => {
    setSearchInput("");

    setFilters({
      ...DEFAULT_FILTERS,
    });

    setRankingPage(1);
    setPaymentPage(1);
  };

  // =================================================
  // RANKING PAGINATION
  // =================================================

  const handleRankingPageChange = (page: number) => {
    setRankingPage(page);
  };

  const handleRankingLimitChange = (limit: number) => {
    setRankingLimit(limit);

    setRankingPage(1);
  };

  // =================================================
  // PAYMENT PAGINATION
  // =================================================

  const handlePaymentPageChange = (page: number) => {
    setPaymentPage(page);
  };

  const handlePaymentLimitChange = (limit: number) => {
    setPaymentLimit(limit);

    setPaymentPage(1);
  };

  // =================================================
  // NAVIGATION
  // =================================================

  const handleStaffClick = (staffId: string) => {
    router.push(`/admin/staff/${encodeURIComponent(staffId)}`);
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/admin/client/${encodeURIComponent(clientId)}`);
  };

  // =================================================
  // ACTIVE FILTER
  // =================================================

  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value || "").trim() !== "",
  );

  // =================================================
  // RETURN
  // =================================================

  return {
    selectedMonth,
    handleMonthChange,

    filters,
    searchInput,
    setSearchInput,

    handleFilterChange,
    handleSearchSubmit,
    handleResetFilters,

    hasActiveFilters,

    overview: data?.overview,

    rankings: data?.rankings?.data ?? [],

    rankingPagination:
      data?.rankings?.pagination ?? createDefaultPagination(rankingLimit),

    stageBreakdown: data?.stageBreakdown ?? [],

    payments: data?.payments?.data ?? [],

    paymentPagination:
      data?.payments?.pagination ?? createDefaultPagination(paymentLimit),

    filterOptions: data?.filterOptions ?? {
      staff: [],
      stages: [],
      nationalities: [],
      japaneseLevels: [],
    },

    isLoading,
    isFetching,

    loadError,

    refetch,

    handleRankingPageChange,
    handleRankingLimitChange,

    handlePaymentPageChange,
    handlePaymentLimitChange,

    handleStaffClick,
    handleClientClick,
  };
};
