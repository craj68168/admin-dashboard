"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { RevenueData } from "./type";

export function useRevenueData() {
  return useQuery<RevenueData>({
    queryKey: ["revenue"],
    queryFn: async () => {
      const response = await api.get("/revenue");
      const payload = response.data?.data ?? response.data ?? {};

      return {
        milestones: payload.milestones ?? [],
        summary: payload.summary ?? {
          totalBilled: 0,
          totalCollected: 0,
          totalOutstanding: 0,
        },
      };
    },
  });
}
