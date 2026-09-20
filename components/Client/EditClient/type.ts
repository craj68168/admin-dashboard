import {
  GENDER,
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  CURRENT_STAGES,
  CLIENT_STATUSES,
  NATIONALITIES,
    STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/components/constant";

// =================================================
// SHARED OPTION TYPES
// =================================================

export type Gender =
  (typeof GENDER)[number]["value"];

export type CurrentVisaStatus =
  (typeof CURRENT_VISA_STATUS_OPTIONS)[number]["value"];

export type PreferCategory =
  (typeof PREFER_CATEGORY_OPTIONS)[number]["value"];

export type CurrentStage =
  (typeof CURRENT_STAGES)[number]["value"];

export type ClientStatus =
  (typeof CLIENT_STATUSES)[number]["value"];

export type Nationality =
  (typeof NATIONALITIES)[number]["value"];

export type StatusOfResidence =
  (typeof STATUS_OF_RESIDENCE_OPTIONS)[number]["value"];

export type JapaneseLanguageLevel =
  (typeof JAPANESE_LEVELS)[number]["value"];

export type EducationType =
  (typeof EDUCATION_TYPE_OPTIONS)[number]["value"];

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
  educationType: EducationType | "";
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
// EDIT CLIENT FORM
// =================================================

export type EditClientFormValues = {
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

  education: EducationFormValue[];

  employmentHistory: EmploymentHistoryFormValue[];

  remark: string;

  // Replacement files
  clientImage: File | null;
  cv: File | null;
};

// =================================================
// STAFF
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

export type StaffListResponse = {
  success: boolean;
  data: StaffOption[];
};

// =================================================
// CLIENT PROFILE RESPONSE
// =================================================

export type ClientProfile = {
  _id?: string;

  clientId?: string;

  dateOfBirth?: string;

  gender?: Gender;

  email?: string;

  address?: string;

  prefecture?: Prefecture;

  nationality?: Nationality;

  passportNumber?: string;

  passportExpiryDate?: string;

  statusOfResidence?: StatusOfResidence;

  japaneseLanguageLevel?: JapaneseLanguageLevel;

  intake?: string;

  education?:
    | Array<{
        schoolName?: string;
        enrollmentDate?: string;
        graduationDate?: string;
        educationType?: EducationType;
        major?: string;
      }>
    | {
    schoolName?: string;
    enrollmentDate?: string;
    graduationDate?: string;
    educationType?: EducationType;
    major?: string;
  };

  employmentHistory?: Array<{
    companyName?: string;
    startDate?: string;
    endDate?: string;
    employmentType?: EmploymentType;
  }>;

  remark?: string;

  clientImage?: string;

  cv?: string;
};

// =================================================
// ASSIGNED STAFF DETAILS
// =================================================

export type AssignedStaffDetails = {
  _id: string;

  staffId: string;

  name: string;

  email?: string;
  phone?: string;
  location?: string;

  isActive: boolean;
};

// =================================================
// CLIENT DETAILS
// =================================================

export type ClientDetails = {
  _id: string;

  clientId: string;

  fullName: string;

  phone: string;

  currentVisaStatus: CurrentVisaStatus;

  preferCategory: PreferCategory;

  currentStage: CurrentStage;

  // Backend-derived display/status value.
  clientStatus?: ClientStatus | string;

  assignedStaff: string;

  assignedStaffDetails?: AssignedStaffDetails | null;

  profile?: ClientProfile | null;

  createdAt: string;

  updatedAt: string;
};

// =================================================
// CLIENT DETAILS RESPONSE
// =================================================

export type ClientDetailsResponse = {
  success: boolean;

  data: ClientDetails;
};
