"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { api } from "@/lib/axios";

import type { AdminDashboardResponse } from "./type";

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

export const useAdminDashboard = () => {
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentJapanMonth());

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<AdminDashboardResponse>({
      queryKey: ["adminDashboard", selectedMonth],

      queryFn: async () => {
        const response = await api.get<AdminDashboardResponse>(
          "/dashboard/admin",
          {
            params: {
              month: selectedMonth,
            },
          },
        );

        return response.data;
      },
    });

  let loadError = "";

  if (isError) {
    if (axios.isAxiosError(error)) {
      loadError = error.response?.data?.message || "Failed to load dashboard.";
    } else {
      loadError = "Failed to load dashboard.";
    }
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleStaffClick = (staffId: string) => {
    router.push(`/admin/staff/${encodeURIComponent(staffId)}`);
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/admin/client/${encodeURIComponent(clientId)}`);
  };

  return {
    selectedMonth,
    handleMonthChange,

    overview: data?.overview,

    rankings: data?.rankings ?? [],

    stageBreakdown: data?.stageBreakdown ?? [],

    recentPayments: data?.recentPayments ?? [],

    isLoading,
    isFetching,
    loadError,
    refetch,

    handleStaffClick,
    handleClientClick,
  };
};
