"use client";

import { useQuery } from "@tanstack/react-query";
import {
  billingMilestones,
  getBalance,
  type BillingMilestone,
} from "@/data/sales-demo";
import type { RevenueData } from "./type";

export function useRevenueData() {
  return useQuery<RevenueData>({
    queryKey: ["demo-revenue"],
    queryFn: async () => {
      const milestones: BillingMilestone[] = billingMilestones;
      const summary = milestones.reduce(
        (result, milestone) => ({
          totalBilled: result.totalBilled + milestone.totalCharge,
          totalCollected: result.totalCollected + milestone.amountPaid,
          totalOutstanding: result.totalOutstanding + getBalance(milestone),
        }),
        { totalBilled: 0, totalCollected: 0, totalOutstanding: 0 },
      );

      return { milestones, summary };
    },
  });
}
