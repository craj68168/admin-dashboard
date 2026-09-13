export type PerformanceStatus =
  | "No Target"
  | "Not Started"
  | "In Progress"
  | "Achieved";

export type StaffTargetFormValues = {
  targetAmount: string;
  note: string;
};

export type StaffTarget = {
  _id: string;

  staffRef: string;

  staffId: string;
  staffName: string;

  targetMonth: string;

  targetAmount: number;

  note?: string;

  assignedBy: string;
  assignedByName: string;

  updatedBy?: string | null;
  updatedByName?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type StaffTargetPerformance = {
  targetAmount: number;

  totalCollected: number;

  remainingAmount: number;

  achievementPercentage: number;

  paymentCount: number;

  clientCount: number;

  status: PerformanceStatus;
};

export type StaffTargetResponse = {
  success: boolean;

  staff: {
    staffId: string;
    name: string;
    email?: string;
    isActive: boolean;
  };

  targetMonth: string;

  target: StaffTarget | null;

  performance: StaffTargetPerformance;
};

export type StaffTargetMutationResponse = {
  success: boolean;
  message: string;
  data: StaffTarget;
};

export type PerformanceProps = {
  staffId: string;
};
