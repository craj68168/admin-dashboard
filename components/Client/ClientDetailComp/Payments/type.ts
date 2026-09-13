export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Online Payment",
  "Cheque",
  "Other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = "Completed" | "Cancelled" | "Refunded";

export type PaymentFormValues = {
  paymentName: string;
  expectedAmount: string;
  amountPaid: string;
  paymentMethod: PaymentMethod | "";
  paymentDate: string;
  referenceNumber: string;
  receiptNumber: string;
  bankName: string;
  note: string;
};

export type CreditedStaffRef = {
  _id: string;
  name: string;
  email?: string;
  staffId: string;
};

export type Payment = {
  _id: string;

  clientRef: string;
  clientId: string;

  paymentName: string;

  expectedAmount: number;
  amountPaid: number;

  paymentMethod: PaymentMethod;

  paymentDate: string;

  paymentStatus: PaymentStatus;

  stageAtPayment: string;

  collectedBy: string;

  collectedByRole: "superadmin" | "staff";

  collectedByName: string;

  creditedStaffRef?: CreditedStaffRef | null;

  creditedStaff: string;

  creditedStaffName: string;

  referenceNumber?: string;

  receiptNumber?: string;

  bankName?: string;

  note?: string;

  createdAt: string;
  updatedAt: string;
};

export type PaymentSummary = {
  totalPaid: number;
};

export type PaymentsResponse = {
  success: boolean;
  count: number;

  summary: PaymentSummary;

  data: Payment[];
};

export type CreatePaymentResponse = {
  success: boolean;
  message: string;
  data: Payment;
};

export type PaymentsProps = {
  clientId: string;
};
