import {
  GENDER,
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  CURRENT_STAGES,
  NATIONALITIES,
  STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  EMPLOYMENT_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/components/constant";

// =================================================
// SHARED OPTION TYPES
// Derived from components/constant/index.ts
// =================================================

export type Gender =
  (typeof GENDER)[number]["value"];

export type CurrentVisaStatus =
  (typeof CURRENT_VISA_STATUS_OPTIONS)[number]["value"];

export type PreferCategory =
  (typeof PREFER_CATEGORY_OPTIONS)[number]["value"];

export type CurrentStage =
  (typeof CURRENT_STAGES)[number]["value"];

export type Nationality =
  (typeof NATIONALITIES)[number]["value"];

export type StatusOfResidence =
  (typeof STATUS_OF_RESIDENCE_OPTIONS)[number]["value"];

export type JapaneseLanguageLevel =
  (typeof JAPANESE_LEVELS)[number]["value"];

export type EmploymentType =
  (typeof EMPLOYMENT_TYPE_OPTIONS)[number]["value"];

export type Prefecture =
  (typeof PREFECTURE_OPTIONS)[number]["value"];

// =================================================
// EDUCATION
// =================================================

export type EducationFormValue = {
  schoolName: string;
  enrollmentDate: string;
  graduationDate: string;
  major: string;
};

// =================================================
// EMPLOYMENT HISTORY
// =================================================

export type EmploymentHistoryFormValue = {
  companyName: string;
  startDate: string;
  endDate: string;
  employmentType: EmploymentType | "";
};

// =================================================
// CREATE CLIENT FORM
// =================================================

export type CreateClientFormValues = {
  // Client
  fullName: string;
  phone: string;

  currentVisaStatus: CurrentVisaStatus | "";
  preferCategory: PreferCategory | "";
  currentStage: CurrentStage | "";

  assignedStaff: string;

  // Profile
  dateOfBirth: string;
  gender: Gender | "";
  email: string;
  nationality: Nationality | "";

  address: string;
  prefecture: Prefecture | "";

  passportNumber: string;
  passportExpiryDate: string;

  statusOfResidence: StatusOfResidence | "";

  japaneseLanguageLevel:
    | JapaneseLanguageLevel
    | "";

  intake: string;

  education: EducationFormValue;

  employmentHistory: EmploymentHistoryFormValue[];

  remark: string;

  clientImage: File | null;
  cv: File | null;
};

// =================================================
// STAFF OPTION
// Used in Assigned Staff dropdown
// =================================================

export type StaffOption = {
  _id: string;
  staffId: string;
  name: string;

  phone?: string;
  email?: string;
  location?: string;

  isActive: boolean;
};

// =================================================
// STAFF LIST API RESPONSE
// GET /api/staff
// =================================================

export type StaffListResponse = {
  success: boolean;
  data: StaffOption[];
};