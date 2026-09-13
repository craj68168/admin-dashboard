export type ClientFeeStatus = "Active" | "Cancelled";

export type PaymentProgressStatus = "Unpaid" | "Partial" | "Paid" | "Cancelled";

export type ClientFeeFormValues = {
  feeName: string;
  expectedAmount: string;
  dueDate: string;
  note: string;
};

export type ClientFee = {
  _id: string;

  clientRef: string;
  clientId: string;

  feeName: string;

  expectedAmount: number;

  paidAmount: number;

  outstandingAmount: number;

  paymentProgressStatus: PaymentProgressStatus;

  dueDate?: string | null;

  note?: string;

  status: ClientFeeStatus;

  createdBy: string;

  createdByRole: "superadmin" | "staff";

  createdByName: string;

  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancelledByName?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type ClientFeesSummary = {
  totalExpected: number;
  totalPaid: number;
  totalOutstanding: number;
};

export type ClientFeesResponse = {
  success: boolean;

  count: number;

  summary: ClientFeesSummary;

  data: ClientFee[];
};

export type ClientFeeMutationResponse = {
  success: boolean;
  message: string;
  data: ClientFee;
};

export type ClientFeesProps = {
  clientId: string;
};
