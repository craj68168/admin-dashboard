import type { StaffPerformance } from "@/data/sales-demo";

export type PerformanceData = {
  staff: StaffPerformance[];
  totalTarget: number;
  totalCollected: number;
  overallProgress: number;
};
