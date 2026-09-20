export type ClientExportFormat = "csv" | "pdf" | "xlsx";
// =================================================
// FILTER VALUES
// =================================================
export type ClientFilterValues = {
  keyword: string;
  currentVisaStatus: string;
  preferCategory: string;
  currentStage: string;
  japaneseLevel: string;
  nationality: string;
  assignedStaff: string;
};
// =================================================
// URL / API QUERY
// =================================================
export type ClientListQuery = ClientFilterValues & {
  page: number;
  limit: number;
};
// =================================================
// STAFF
// =================================================
export type ClientAssignedStaff = {
  _id?: string;
  staffId: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  isActive?: boolean;
};
export type StaffOption = {
  _id?: string;
  staffId: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  isActive: boolean;
};
export type StaffListResponse = {
  success: boolean;
  data: StaffOption[];
};
// =================================================
// CLIENT STAGE
// =================================================
export type ClientStageOption = {
  _id: string;
  key: string;
  name: string;
  amount: number;
  isActive: boolean;
  isSystem: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
};
export type ClientStageListResponse = {
  success: boolean;
  count: number;
  data: ClientStageOption[];
};
// =================================================
// EDUCATION
// =================================================
export type ClientEducation = {
  _id?: string;
  schoolName?: string;
  educationType?: string;
  enrollmentDate?: string | null;
  graduationDate?: string | null;
  major?: string;
};
// =================================================
// EMPLOYMENT
// =================================================
export type ClientEmploymentHistory = {
  _id?: string;
  companyName?: string;
  employmentType?: string;
  startDate?: string | null;
  endDate?: string | null;
};
// =================================================
// PROFILE
// =================================================
export type ClientProfile = {
  _id?: string;
  clientId?: string;
  clientRef?: string;
  dateOfBirth?: string | null;
  gender?: string;
  email?: string;
  prefecture?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: string | null;
  statusOfResidence?: string;
  education?: ClientEducation[];
  japaneseLanguageLevel?: string;
  intake?: string;
  employmentHistory?: ClientEmploymentHistory[];
  clientImage?: string;
  cv?: string;
  createdAt?: string;
  updatedAt?: string;
};
// =================================================
// CLIENT LIST ITEM
// =================================================
export type ClientListItem = {
  _id: string;
  clientId: string;
  fullName: string;
  phone: string;
  currentVisaStatus: string;
  preferCategory?: string;
  currentStage: string;
  clientStatus: string;
  assignedStaff: string;
  assignedStaffDetails?: ClientAssignedStaff | null;
  currentStageDetails?: ClientStageOption | null;
  profile?: ClientProfile | null;
  createdAt: string;
  updatedAt: string;
};
// =================================================
// PAGINATION
// =================================================
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
// =================================================
// LIST RESPONSE
// =================================================
export type ClientListApiResponse = {
  success: boolean;
  count: number;
  data: ClientListItem[];
  pagination: ClientPagination;
  filters?: {
    free_word?: string | null;
    staffId?: string | null;
    currentVisaStatus?: string | null;
    preferCategory?: string | null;
    currentStage?: string | null;
    japaneseLevel?: string | null;
    nationality?: string | null;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
};
