export type ClientStaffRecord = {
  _id?: string;
  staffId?: number | string;
  id?: number | string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
};

export type ClientRecord = {
  _id?: string;
  clientId: number;
  fullName: string;
  phone?: string;
  visaType?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  assignedStaff?: ClientStaffRecord | string | null;
  assignedStaffId?: number | string | null;
  assignedStaffName?: string;
};

export type ClientApiResponse = Omit<
  ClientRecord,
  "clientId" | "assignedStaffId" | "assignedStaffName"
> & {
  clientId?: number | string;
};

export type ClientListApiResponse<T> = {
  data?: T[];
};

export type ClientStatusField = "coeStatus" | "visaStatus" | "clientStatus";

export type StaffClientStatusField = ClientStatusField;

export type UpdateClientFieldHandler = (
  clientId: number,
  field: StaffClientStatusField,
  value: string,
) => void;

export type StaffClientOption = ClientStaffRecord & {
  id: number | string;
};

export type StaffClientsViewState = {
  staffId: string;
  sidebarCollapsed: boolean;
  staffs: StaffClientOption[];
  clients: ClientRecord[];
  selectedStaff: StaffClientOption | null;
  isLoading: boolean;
  isError: boolean;
  setSidebarCollapsed: (value: boolean | ((previous: boolean) => boolean)) => void;
  handleUpdateClientField: UpdateClientFieldHandler;
};
