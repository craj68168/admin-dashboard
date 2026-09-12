"use client";

import { useQuery } from "@tanstack/react-query";
import { staffPerformance, type StaffPerformance } from "@/data/sales-demo";
import type { PerformanceData } from "./type";

export function usePerformanceData() {
  return useQuery<PerformanceData>({
    queryKey: ["demo-performance"],
    queryFn: async () => {
      const staff: StaffPerformance[] = staffPerformance;
      const totalTarget = staff.reduce((sum, item) => sum + item.target, 0);
      const totalCollected = staff.reduce(
        (sum, item) => sum + item.collected,
        0,
      );

      return {
        staff,
        totalTarget,
        totalCollected,
        overallProgress: totalTarget
          ? Math.round((totalCollected / totalTarget) * 100)
          : 0,
      };
    },
  });
}
