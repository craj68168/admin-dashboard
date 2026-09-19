export type ClientStaffRecord = {
  _id?: string;
  staffId?: string;
  name: string;
  email?: string;
};

export type Client = {
  _id: string;
  clientId: string;
  fullName: string;
  phone: string;
  visaType: string;
  coeStatus: string;
  clientStatus: string;
  currentStage?: string;
  assignedStaff: string;
  assignedStaffDetails?: ClientStaffRecord | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientFilterValues = {
  keyword: string;
  visaType: string;
  coeStatus: string;
  clientStatus: string;
  assignedStaff: string;
};

export type ClientListQuery = ClientFilterValues & {
  page: number;
  limit: number;
};

export type ClientPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_next_page: boolean;
  has_previous_page: boolean;
};

export type ClientListApiResponse = {
  success: boolean;
  count: number;
  data: Client[];
  pagination: ClientPagination;
};
