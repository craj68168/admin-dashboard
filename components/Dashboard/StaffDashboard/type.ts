export type StaffDashboardStatus =
  | "No Target"
  | "Not Started"
  | "In Progress"
  | "Achieved";

export type StaffDashboardUser = {
  staffId: string;

  name: string;

  email?: string;

  phone?: string;

  location?: string;

  isActive: boolean;
};

export type StaffDashboardOverview = {
  totalAssignedClients: number;

  targetAmount: number;

  totalCollected: number;

  remainingAmount: number;

  achievementPercentage: number;

  performanceStatus: StaffDashboardStatus;

  paymentCount: number;

  payingClientCount: number;

  totalExpected: number;

  totalPaidAgainstFees: number;

  totalOutstanding: number;

  outstandingFeeCount: number;
};

export type StaffStageBreakdown = {
  stage: string;
  count: number;
};

export type StaffRecentClient = {
  clientId: string;

  fullName: string;

  phone?: string;

  visaType?: string;

  currentStage: string;

  createdAt: string;
};

export type StaffRecentPayment = {
  _id: string;

  clientId: string;

  paymentName: string;

  amountPaid: number;

  paymentMethod: string;

  paymentDate: string;

  stageAtPayment: string;

  createdAt: string;
};

export type StaffDashboardResponse = {
  success: boolean;

  selectedMonth: string;

  staff: StaffDashboardUser;

  overview: StaffDashboardOverview;

  stageBreakdown: StaffStageBreakdown[];

  recentClients: StaffRecentClient[];

  recentPayments: StaffRecentPayment[];
};
