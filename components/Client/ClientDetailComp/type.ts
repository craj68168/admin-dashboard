// =================================================
// EDUCATION
// =================================================

export type ClientEducation = {
  _id?: string;
  schoolName?: string;
  educationType?: string;
  enrollmentDate?: string | null;
  graduationDate?: string | null;
  graduationStatus?:
    | ""
    | "graduated"
    | "expectedGraduation"
    | "currentlyEnrolled"
    | "withdrawn";
  major?: string;
};

// =================================================
// QUALIFICATION
// =================================================

export type ClientQualification = {
  _id?: string;
  name?: string;
  levelOrScore?: string;
  acquiredDate?: string | null;
  expiryDate?: string | null;
  issuer?: string;
  note?: string;
};

// =================================================
// EMPLOYMENT
// =================================================

export type ClientEmploymentHistory = {
  _id?: string;
  companyName?: string;
  employmentType?: string;
  department?: string;
  jobTitle?: string;
  workLocation?: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  responsibilities?: string;
  achievements?: string;
};

// =================================================
// PROFILE
// =================================================

export type ClientProfile = {
  _id?: string;
  clientId?: string;
  clientRef?: string;

  furigana?: string;

  dateOfBirth?: string | null;
  gender?: string;
  email?: string;
  nationality?: string;

  postalCode?: string;
  prefecture?: string;
  address?: string;

  passportNumber?: string;
  passportExpiryDate?: string | null;
  residenceExpiryDate?: string | null;

  // Legacy field.
  statusOfResidence?: string;

  education?: ClientEducation[];

  japaneseLanguageLevel?: string;

  qualifications?: ClientQualification[];

  skills?: string[];

  employmentHistory?: ClientEmploymentHistory[];

  careerSummary?: string;

  motivation?: string;
  selfPR?: string;
  desiredConditions?: string;

  intake?: string;

  clientImage?: string;
  cv?: string;

  createdAt?: string;
  updatedAt?: string;
};

// =================================================
// STAFF
// =================================================

export type ClientAssignedStaffDetails = {
  _id?: string;
  staffId?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: string;
  isActive?: boolean;
};

// =================================================
// STAGE
// =================================================

export type ClientStageDetails = {
  _id?: string;
  key?: string;
  name?: string;
  amount?: number;
  isActive?: boolean;
  isSystem?: boolean;
  displayOrder?: number;
};

// =================================================
// CLIENT
// =================================================

export type ClientDetailData = {
  _id: string;
  clientId: string;

  fullName: string;
  phone: string;

  currentVisaStatus: string;
  preferCategory: string;

  currentStage: string;
  clientStatus: string;

  assignedStaff: string;

  assignedStaffDetails?: ClientAssignedStaffDetails | null;

  currentStageDetails?: ClientStageDetails | null;

  profile?: ClientProfile | null;

  createdAt?: string;
  updatedAt?: string;
};

// =================================================
// RESPONSE
// =================================================

export type ClientDetailResponse = {
  success: boolean;
  data: ClientDetailData;
};
