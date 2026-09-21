export type DashboardPerformanceStatus =
  | "No Target"
  | "Not Started"
  | "In Progress"
  | "Achieved";

export type DashboardPaymentStatus = "Completed" | "Cancelled" | "Refunded";

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

  // Target remaining, not client outstanding.
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

export type DashboardPayment = {
  _id: string;

  clientId: string;
  clientName?: string;

  stageKey: string;
  stageName: string;
  stageAmount: number;

  amountPaid: number;

  paymentMethod: string;

  paymentDate: string;

  paymentStatus: DashboardPaymentStatus;

  creditedStaff: string;
  creditedStaffName: string;

  collectedByName: string;

  referenceNumber?: string;
  receiptNumber?: string;
  bankName?: string;

  createdAt: string;
};

export type DashboardPagination = {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  from: number | null;
  to: number | null;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedDashboardResult<T> = {
  data: T[];
  pagination: DashboardPagination;
};

export type DashboardStaffOption = {
  staffId: string;
  name: string;
  isActive: boolean;
};

export type DashboardStageOption = {
  key: string;
  name: string;
  isActive: boolean;
};

export type DashboardFilterOptions = {
  staff: DashboardStaffOption[];
  stages: DashboardStageOption[];
  nationalities: string[];
  japaneseLevels: string[];
};

export type DashboardFilters = {
  free_word: string;
  staffId: string;

  currentStage: string;
  currentVisaStatus: string;
  preferCategory: string;

  nationality: string;
  japaneseLevel: string;

  paymentStatus: string;
  paymentMethod: string;
  paymentStage: string;
};

export type AdminDashboardResponse = {
  success: boolean;

  selectedMonth: string;

  filters: DashboardFilters;

  filterOptions: DashboardFilterOptions;

  overview: DashboardOverview;

  rankings: PaginatedDashboardResult<StaffRanking>;

  stageBreakdown: StageBreakdown[];

  payments: PaginatedDashboardResult<DashboardPayment>;
};
