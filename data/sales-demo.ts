export type BillingStatus = "Unpaid" | "Partial" | "Paid";

export type BillingMilestone = {
  id: string;
  clientName: string;
  clientId: string;
  milestone: string;
  totalCharge: number;
  amountPaid: number;
  paymentDate?: string;
  paymentMethod?: "Cash" | "Bank Transfer" | "Online";
  receivedBy?: string;
  status: BillingStatus;
};

export type StaffPerformance = {
  staffId: string;
  name: string;
  target: number;
  collected: number;
};

export const billingMilestones: BillingMilestone[] = [
  {
    id: "INV-1001",
    clientName: "Ram Sharma",
    clientId: "C-1024",
    milestone: "Job Offer Fee",
    totalCharge: 40000,
    amountPaid: 20000,
    paymentDate: "2026-09-04",
    paymentMethod: "Cash",
    receivedBy: "Sita Rai",
    status: "Partial",
  },
  {
    id: "INV-1002",
    clientName: "Maya Gurung",
    clientId: "C-1021",
    milestone: "Registration Completed",
    totalCharge: 30000,
    amountPaid: 30000,
    paymentDate: "2026-09-02",
    paymentMethod: "Bank Transfer",
    receivedBy: "Hari Thapa",
    status: "Paid",
  },
  {
    id: "INV-1003",
    clientName: "Bikash Tamang",
    clientId: "C-1018",
    milestone: "Visa Application",
    totalCharge: 50000,
    amountPaid: 0,
    status: "Unpaid",
  },
  {
    id: "INV-1004",
    clientName: "Anu Karki",
    clientId: "C-1014",
    milestone: "Registration Completed",
    totalCharge: 30000,
    amountPaid: 15000,
    paymentDate: "2026-08-28",
    paymentMethod: "Online",
    receivedBy: "Sita Rai",
    status: "Partial",
  },
];

export const staffPerformance: StaffPerformance[] = [
  { staffId: "ST-001", name: "Sita Rai", target: 500000, collected: 410000 },
  { staffId: "ST-002", name: "Hari Thapa", target: 500000, collected: 570000 },
  { staffId: "ST-003", name: "Mina Gurung", target: 400000, collected: 250000 },
];

export function formatNpr(value: number) {
  return `NPR ${new Intl.NumberFormat("en-IN").format(value)}`;
}

export function getBalance(item: BillingMilestone) {
  return Math.max(item.totalCharge - item.amountPaid, 0);
}
