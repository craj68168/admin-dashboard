export type ClientTableRow = {
  id?: number | string;
  clientId: number;
  fullName: string;
  phone?: string;
  visaType?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  assignedStaffId?: number | string | null;
  assignedStaffName?: string;
};

export type StaffTableRow = {
  id: number | string;
  recordId?: string;
  name: string;
  phone: string;
  location: string;
  email: string;
  clientsCount: number;
  role: string;
  isActive: boolean;
  createdAt?: string;
};

export type ClientTableVariant = "compact" | "staff" | "staff-list";

export type StaffOption = {
  id?: number | string;
  name: string;
  _id?: string;
  staffId?: number | string;
};

export type StatusField = "coeStatus" | "visaStatus" | "clientStatus";

export type ClientTableProps = {
  title: string;
  clients?: ClientTableRow[];
  staffRows?: StaffTableRow[];
  variant?: ClientTableVariant;
  staffs?: StaffOption[];
  canManageAssignments?: boolean;
  canEditClients?: boolean;
  canEditClient?: (client: ClientTableRow) => boolean;
  canUpdateClientStatus?: boolean;
  onAssignClient?: (clientId: number, staffId: number | string) => void;
  onViewStaffClients?: (staff: StaffTableRow) => void;
  onUpdateClientField?: (
    clientId: number,
    field: StatusField,
    value: string,
  ) => void;
};

export type PendingSelectProps = {
  value: string;
  options: string[];
  minWidth: number;
  onSave: (value: string) => void;
};

export type PlainSelectProps = {
  value: string;
  options: string[];
  minWidth: number;
  onChange: (value: string) => void;
};

export type AssignmentSelectProps = {
  value: string;
  staffs: StaffOption[];
  onSave: (staffId: string) => void;
};

export type StatusSelectProps = PlainSelectProps & {
  disabled?: boolean;
};

export const coeStatusOptions = [
  "Not Applied",
  "Applied",
  "Processing",
  "Received",
  "Rejected",
];

export const visaStatusOptions = [
  "Not Applied",
  "Applied",
  "Processing",
  "Approved",
  "Rejected",
];

export const clientStatusOptions = [
  "New",
  "Document Collection",
  "Processing",
  "COE Applied",
  "COE Received",
  "Visa Applied",
  "Visa Approved",
  "Visa Rejected",
  "Departed",
  "Arrived in Japan",
];
