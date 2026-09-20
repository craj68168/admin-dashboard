"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { api } from "@/lib/axios";

import type { StaffDashboardResponse } from "./type";

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

export const useStaffDashboard = () => {
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentJapanMonth());

  const { data, isLoading, isFetching, isError, error } =
    useQuery<StaffDashboardResponse>({
      queryKey: ["staffDashboard", selectedMonth],

      queryFn: async () => {
        const response = await api.get<StaffDashboardResponse>(
          "/dashboard/staff",
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

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/admin/client/${encodeURIComponent(clientId)}`);
  };

  return {
    selectedMonth,
    handleMonthChange,

    staff: data?.staff,

    overview: data?.overview,

    stageBreakdown: data?.stageBreakdown ?? [],

    recentClients: data?.recentClients ?? [],

    recentPayments: data?.recentPayments ?? [],

    isLoading,
    isFetching,
    loadError,

    handleClientClick,
  };
};
