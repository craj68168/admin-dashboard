export const CLIENT_STAGES = [
  "Registration Pending",
  "Registered / Vacancy Searching",
  "Interview Fixed / Preparation",
  "Interview Failed",
  "Naitei / Job Offer Received",
  "Visa Documents Submitted",
  "Visa Applied / Result Waiting",
  "Visa Approved",
  "Visa Rejected",
  "Waiting for Nyusha / Company Joining",
  "Return to Nepal",
] as const;

export type ClientStage = (typeof CLIENT_STAGES)[number];

export type ProgressFormValues = {
  stage: ClientStage | "";
  note: string;
};

export type StageHistory = {
  _id: string;

  clientId: string;

  fromStage: ClientStage | null;

  toStage: ClientStage;

  note?: string;

  changedBy: string;

  changedByRole: "superadmin" | "staff";

  staffId?: string | null;

  changedByName: string;

  createdAt: string;
  updatedAt: string;
};

export type StageHistoryResponse = {
  success: boolean;

  currentStage: ClientStage;

  count: number;

  data: StageHistory[];
};

export type ProgressProps = {
  clientId: string;
};
