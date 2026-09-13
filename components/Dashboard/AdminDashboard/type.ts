export type DashboardPerformanceStatus =
  | "No Target"
  | "Not Started"
  | "In Progress"
  | "Achieved";

export type DashboardOverview = {
  totalClients: number;

  totalStaff: number;

  activeStaff: number;

  totalExpected: number;

  totalPaid: number;

  totalOutstanding: number;

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

  remainingAmount: number;

  achievementPercentage: number;

  paymentCount: number;

  clientCount: number;

  status: DashboardPerformanceStatus;
};

export type StageBreakdown = {
  stage: string;
  count: number;
};

export type RecentDashboardPayment = {
  _id: string;

  clientId: string;

  paymentName: string;

  amountPaid: number;

  paymentMethod: string;

  paymentDate: string;

  creditedStaff: string;

  creditedStaffName: string;

  collectedByName: string;

  stageAtPayment: string;

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
