export type StaffFilterValues = {
  keyword: string;
  staffId: string;
  location: string;
  isActive: string;
};

export type StaffListQuery = StaffFilterValues & {
  page: number;
  limit: number;
};

export type StaffRecord = {
  _id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  isActive: boolean;
  totalClients: number;
  createdAt: string;
};

export type StaffPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_next_page: boolean;
  has_previous_page: boolean;
};

export type StaffListApiResponse = {
  success: boolean;
  count: number;
  data: StaffRecord[];
  pagination: StaffPagination;
};
