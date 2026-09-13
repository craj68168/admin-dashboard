export type ClientFeeStatus = "Active" | "Cancelled";

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

export type ClientFeesResponse = {
  success: boolean;

  count: number;

  summary: {
    totalExpected: number;
  };

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
