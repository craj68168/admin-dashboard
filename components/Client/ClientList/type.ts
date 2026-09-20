// =================================================
// VISA TYPES
// =================================================

export const VISA_TYPES = ["Student", "Working", "Dependent"] as const;

// =================================================
// COE STATUSES
// =================================================

export const COE_STATUSES = [
  "Not Applied",
  "Applied",
  "Processing",
  "Received",
  "Rejected",
] as const;

// =================================================
// CLIENT STAGES
// =================================================

export const CLIENT_STAGES = [
  "Registration Pending",

  "Registered / Vacancy Searching",

  "Interview Fixed / Preparation",

  "Interview Failed",

  "Naitei / Job Offer Received",

  "Visa Documents Submitted",

  "Visa Applied / Result Waiting",

  "Visa Approved",

  "Visa Rejected",

  "Waiting for Nyusha / Company Joining",

  "Return to Nepal",
] as const;

// =================================================
// JAPANESE LEVEL
// =================================================

export const JAPANESE_LEVELS = ["N1", "N2", "N3", "N4", "N5"] as const;

// =================================================
// EXPORT FORMAT
// =================================================

export type ClientExportFormat = "csv" | "pdf" | "xlsx";

// =================================================
// FILTER VALUES
// =================================================

export type ClientFilterValues = {
  keyword: string;

  visaType: string;

  currentStage: string;

  coeStatus: string;

  japaneseLevel: string;

  nationality: string;

  assignedStaff: string;
};

// =================================================
// SERVER QUERY
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

// =================================================
// PROFILE
// =================================================

export type ClientProfile = {
  _id?: string;

  clientId?: string;

  dateOfBirth?: string;

  gender?: string;

  email?: string;

  address?: string;

  nationality?: string;

  passportNumber?: string;

  passportExpiryDate?: string;

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

  visaStatus?: string;

  clientImage?: string;

  cv?: string;
};

// =================================================
// CLIENT LIST ITEM
// =================================================

export type ClientListItem = {
  _id: string;

  clientId: string;

  fullName: string;

  phone: string;

  visaType: string;

  coeStatus: string;

  clientStatus?: string;

  currentStage?: string;

  assignedStaff: string;

  assignedStaffDetails?: ClientAssignedStaff | null;

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
// API RESPONSE
// =================================================

export type ClientListApiResponse = {
  success: boolean;

  count: number;

  data: ClientListItem[];

  pagination: ClientPagination;

  filters?: {
    free_word?: string | null;

    staffId?: string | null;

    visaType?: string | null;

    currentStage?: string | null;

    coeStatus?: string | null;

    japaneseLevel?: string | null;

    nationality?: string | null;

    sortBy?: string;

    sortOrder?: "asc" | "desc";
  };
};
