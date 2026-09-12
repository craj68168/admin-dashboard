import type { ReactNode } from "react";
import type { BillingMilestone, BillingStatus } from "@/data/sales-demo";

export type RevenueSummary = {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
};

export type RevenueData = {
  milestones: BillingMilestone[];
  summary: RevenueSummary;
};

export type RevenueMetricTone = "blue" | "green" | "amber";

export type RevenueMetricProps = {
  label: string;
  value: string;
  detail: string;
  tone: RevenueMetricTone;
  icon: ReactNode;
};

export type RevenueStatusStyles = Record<
  BillingStatus,
  { background: string; color: string }
>;
