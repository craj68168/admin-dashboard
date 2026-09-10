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
  clientId: number | string;
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

export type ClientListApiResponse<T> = {
  data?: T[];
};

export type ClientListViewState = {
  sidebarCollapsed: boolean;
  staffs: ClientStaffRecord[];
  clients: ClientRecord[];
  isLoading: boolean;
  isError: boolean;
  canCreateClient: boolean;
  canAssignClient: boolean;
  setSidebarCollapsed: (value: boolean | ((previous: boolean) => boolean)) => void;
  handleCreateClient: () => void;
  handleAssignClient: (clientId: number | string, staffId: number | string) => void;
};