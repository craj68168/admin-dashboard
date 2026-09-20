export type ClientStageOption = {
  _id: string;
  key: string;
  name: string;
  amount: number;
  isActive: boolean;
  isSystem: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ClientStageListResponse = {
  success: boolean;
  count: number;
  data: ClientStageOption[];
};

export type StagePayment = {
  _id: string;
  clientId: string;
  stageKey: string;
  stageName: string;
  stageAmount: number;
  amountPaid: number;
  paymentMethod: string;
  paymentDate: string;
  paymentStatus: "Completed" | "Cancelled" | "Refunded";
  referenceNumber?: string;
  receiptNumber?: string;
  bankName?: string;
};

export type ClientStageHistoryItem = {
  _id: string;
  clientRef?: string;
  clientId: string;
  fromStage?: string | null;
  fromStageName?: string | null;
  toStage: string;
  toStageName?: string;
  toStageAmount?: number;
  paymentRef?: StagePayment | null;
  note?: string;
  changedBy?: string;
  changedByRole?: "superadmin" | "staff";
  staffId?: string | null;
  changedByName?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ClientStageHistoryData = {
  clientId: string;
  currentStage: string;
  currentStageName: string;
  currentStageAmount: number;
  history: ClientStageHistoryItem[];
};

export type ClientStageHistoryResponse = {
  success: boolean;
  data: ClientStageHistoryData;
};

export type ProgressUpdatePayload = {
  stage: string;
  note: string;
  paymentMethod?: string;
  paymentDate?: string;
  referenceNumber?: string;
  receiptNumber?: string;
  bankName?: string;
};

export type ClientStageUpdateResponse = {
  success: boolean;
  message: string;
  data: {
    client: {
      _id: string;
      clientId: string;
      currentStage: string;
      clientStatus: string;
      assignedStaff: string;
    };
    stage: ClientStageOption;
    history: ClientStageHistoryItem;
    payment: StagePayment | null;
    paymentRequired: boolean;
    amountPaid: number;
  };
};

export type ProgressProps = {
  clientId: string;
};
