export type DashboardPerformanceStatus =
  | "No Target"
  | "Not Started"
  | "In Progress"
  | "Achieved";

export type DashboardOverview = {
  totalClients: number;

  totalStaff: number;

  activeStaff: number;

  totalCollectedAllTime: number;

  totalCompletedPayments: number;

  totalPayingClients: number;

  monthlyCollected: number;

  monthlyPaymentCount: number;

  monthlyClientCount: number;

  totalTarget: number;

  targetAchievement: number;
};

export type StaffRanking = {
  rank: number;

  staffId: string;

  staffName: string;

  email?: string;

  targetAmount: number;

  totalCollected: number;

  // Staff target remaining.
  // Not client outstanding.
  remainingAmount: number;

  achievementPercentage: number;

  paymentCount: number;

  clientCount: number;

  status: DashboardPerformanceStatus;
};

export type StageBreakdown = {
  stage: string;

  stageName: string;

  count: number;
};

export type RecentDashboardPayment = {
  _id: string;

  clientId: string;

  stageKey: string;

  stageName: string;

  stageAmount: number;

  amountPaid: number;

  paymentMethod: string;

  paymentDate: string;

  paymentStatus: "Completed";

  creditedStaff: string;

  creditedStaffName: string;

  collectedByName: string;

  referenceNumber?: string;

  receiptNumber?: string;

  bankName?: string;

  createdAt: string;
};

export type AdminDashboardResponse = {
  success: boolean;

  selectedMonth: string;

  overview: DashboardOverview;

  rankings: StaffRanking[];

  stageBreakdown: StageBreakdown[];

  recentPayments: RecentDashboardPayment[];
};
