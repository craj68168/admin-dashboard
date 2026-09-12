"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { PerformanceData } from "./type";

export function usePerformanceData() {
  return useQuery<PerformanceData>({
    queryKey: ["performance"],
    queryFn: async () => {
      const response = await api.get("/performance");
      const payload = response.data?.data ?? response.data ?? {};

      return {
        staff: payload.staff ?? [],
        totalTarget: payload.totalTarget ?? 0,
        totalCollected: payload.totalCollected ?? 0,
        overallProgress: payload.overallProgress ?? 0,
      };
    },
  });
}
