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
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  visaType?: string;
  statusOfResidence?: string;
  lastQualification?: string;
  japaneseLanguageLevel?: string;
  schoolName?: string;
  course?: string;
  intake?: string;
  jobCategory?: string;
  jobTitle?: string;
  companyName?: string;
  workLocation?: string;
  sponsorName?: string;
  sponsorRelationship?: string;
  sponsorStatusOfResidence?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  remarks?: string;
  clientImage?: string;
  cv?: string;
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

export type ClientListData = {
  staffs: ClientStaffRecord[];
  clients: ClientRecord[];
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
  handleAssignClient: (clientId: number, staffId: number | string) => void;
};
