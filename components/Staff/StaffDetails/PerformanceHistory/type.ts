export type PerformanceHistoryStatus =
  | "No Target"
  | "Not Started"
  | "In Progress"
  | "Achieved";

export type PerformanceHistoryItem = {
  month: string;

  targetId?: string | null;

  targetAmount: number;

  totalCollected: number;

  remainingAmount: number;

  achievementPercentage: number;

  paymentCount: number;

  clientCount: number;

  status: PerformanceHistoryStatus;

  note?: string;

  assignedByName?: string | null;
};

export type PerformanceHistoryStaff = {
  staffId: string;

  name: string;

  email?: string;

  isActive: boolean;
};

export type PerformanceHistoryResponse = {
  success: boolean;

  staff: PerformanceHistoryStaff;

  count: number;

  data: PerformanceHistoryItem[];
};

export type PerformanceHistoryProps = {
  staffId: string;
};
