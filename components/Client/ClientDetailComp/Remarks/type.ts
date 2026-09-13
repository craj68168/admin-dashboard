export const REMARK_MEDIUMS = [
  "Phone Call",
  "Meeting",
  "WhatsApp",
  "Email",
  "Company Visit",
  "LINE",
  "Other",
] as const;

export type RemarkMedium = (typeof REMARK_MEDIUMS)[number];

export type RemarkFormValues = {
  remarkDate: string;
  medium: RemarkMedium | "";
  remarks: string;
};

export type RemarkStaffRef = {
  _id: string;
  staffId: string;
  name: string;
  email?: string;
};

export type Remark = {
  _id: string;

  clientId: string;
  clientCode: string;

  createdBy: string;

  createdByRole: "superadmin" | "staff";

  staffRef?: RemarkStaffRef | null;

  staffId?: string | null;

  staffName: string;

  remarkDate: string;

  medium: RemarkMedium;

  remarks: string;

  createdAt: string;
  updatedAt: string;
};

export type RemarksResponse = {
  success: boolean;
  count: number;
  data: Remark[];
};

export type CreateRemarkResponse = {
  success: boolean;
  message: string;
  data: Remark;
};

export type RemarksProps = {
  clientId: string;
};
