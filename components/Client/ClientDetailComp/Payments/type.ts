export type ClientPayment = {
  _id: string;
  clientId: string;

  stageKey: string;
  stageName: string;
  stageAmount: number;

  amountPaid: number;

  paymentMethod:
    | "Cash"
    | "Bank Transfer"
    | "Online Payment"
    | "Cheque"
    | "Other";

  paymentDate: string;

  paymentStatus: "Completed" | "Cancelled" | "Refunded";

  collectedByRole: "superadmin" | "staff";

  collectedByName: string;

  creditedStaff: string;
  creditedStaffName: string;

  referenceNumber?: string;
  receiptNumber?: string;
  bankName?: string;
  note?: string;

  createdAt: string;
  updatedAt: string;
};

export type ClientPaymentResponse = {
  success: boolean;
  count: number;

  summary: {
    totalCollected: number;
    completedCount: number;
    cancelledCount: number;
    refundedCount: number;
  };

  data: ClientPayment[];
};

export type PaymentsProps = {
  clientId: string;
};
