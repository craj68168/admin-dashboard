export type RemarkEntry = {
  id: string;
  date: string;
  staffName: string;
  text: string;
  medium?: "Phone Call" | "Meeting" | "WhatsApp" | "Company Visit" | "Other";
};

export type RemarksProps = {
  mode?: "view" | "edit";
  value?: string;
  remarks?: RemarkEntry[];
  staffName?: string;
  staffLocation?: string;
  clientId?: string | number;
};