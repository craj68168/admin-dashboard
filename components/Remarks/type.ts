export type RemarkEntry = {
  id: string;
  date: string;
  staffName: string;
  text: string;
  medium?: "WhatsApp" | "Phone Call" | "Company Visit";
};

export type RemarksProps = {
  mode?: "view" | "edit";
  value?: string;
  remarks?: RemarkEntry[];
  staffName?: string;
  staffLocation?: string;
  clientId?: string | number;
};