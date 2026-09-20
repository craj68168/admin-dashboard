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

  // Monthly staff target remaining.
  // NOT client outstanding.
  remainingAmount: number;

  achievementPercentage: number;

  performanceStatus: StaffDashboardStatus;

  paymentCount: number;

  payingClientCount: number;

  allTimeCollected: number;

  allTimePaymentCount: number;

  allTimePayingClientCount: number;
};

export type StaffStageBreakdown = {
  stage: string;

  stageName: string;

  count: number;
};

export type StaffRecentClient = {
  clientId: string;

  fullName: string;

  phone?: string;

  currentVisaStatus?: string;

  currentStage: string;

  currentStageName: string;

  createdAt: string;
};

export type StaffRecentPayment = {
  _id: string;

  clientId: string;

  stageKey: string;

  stageName: string;

  stageAmount: number;

  amountPaid: number;

  paymentMethod: string;

  paymentDate: string;

  paymentStatus: "Completed";

  referenceNumber?: string;

  receiptNumber?: string;

  bankName?: string;

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
