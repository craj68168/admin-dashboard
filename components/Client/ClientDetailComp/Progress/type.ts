export type PaymentMethod = "Bank Transfer" | "Cash";

// =================================================
// STAGE
// =================================================

export type StageOption = {
  _id: string;

  key: string;

  name: string;

  amount: number;

  isActive: boolean;

  isSystem?: boolean;

  displayOrder?: number;
};

export type StageOptionsResponse = {
  success: boolean;

  count?: number;

  data: StageOption[];
};

// =================================================
// ADD STAGE
// =================================================

export type AddStageFormValues = {
  name: string;

  amount: string;
};

export type CreateStagePayload = {
  name: string;

  amount: number;
};

export type CreateStageResponse = {
  success: boolean;

  message: string;

  data: StageOption;
};

export type AddStageModalProps = {
  open: boolean;

  values: AddStageFormValues;

  errors: Partial<Record<keyof AddStageFormValues, string>>;

  submitError: string;

  isSubmitting: boolean;

  onChange: <K extends keyof AddStageFormValues>(
    field: K,
    value: AddStageFormValues[K],
  ) => void;

  onClose: () => void;

  onSubmit: () => void;
};

// =================================================
// PAYMENT
// =================================================

export type ProgressPayment = {
  _id?: string;

  clientId?: string;

  stageKey?: string;

  stageName?: string;

  stageAmount?: number;

  amountPaid?: number;

  paymentMethod?: string;

  paymentDate?: string;

  paymentStatus?: string;

  referenceNumber?: string;

  receiptNumber?: string;

  bankName?: string;

  note?: string;

  creditedStaff?: string;

  creditedStaffName?: string;

  createdAt?: string;
};

// =================================================
// HISTORY
// =================================================

export type StageHistoryItem = {
  _id: string;

  clientId: string;

  fromStage?: string | null;

  fromStageName?: string | null;

  toStage: string;

  toStageName: string;

  toStageAmount?: number;

  note?: string;

  changedBy?: string;

  changedByRole?: string;

  changedByName?: string;

  staffId?: string | null;

  paymentRef?: ProgressPayment | null;

  createdAt: string;

  updatedAt?: string;
};

// =================================================
// PROGRESS DATA
// =================================================

export type ProgressData = {
  clientId: string;

  currentStage: string;

  currentStageName?: string;

  currentStageAmount?: number;

  history: StageHistoryItem[];
};

export type ProgressResponse = {
  success: boolean;

  data: ProgressData;
};

// =================================================
// CHANGE STAGE
// =================================================

export type ChangeStagePayload = {
  stage: string;

  note?: string;

  paymentMethod?: PaymentMethod;

  paymentDate?: string;

  referenceNumber?: string;

  receiptNumber?: string;

  bankName?: string;
};

export type ChangeStageResponse = {
  success: boolean;

  message: string;

  data?: {
    client?: unknown;

    stage?: StageOption;

    history?: StageHistoryItem;

    payment?: ProgressPayment | null;

    paymentRequired?: boolean;

    amountPaid?: number;
  };
};

// =================================================
// COMPONENT
// =================================================

export type ProgressProps = {
  clientId: string;
};

// =================================================
// FORM
// =================================================

export type ProgressFormValues = {
  stage: string;

  note: string;

  paymentMethod: "" | PaymentMethod;

  paymentDate: string;

  referenceNumber: string;

  receiptNumber: string;

  bankName: string;
};
