import type { z } from "zod";
import { clientFormSchema } from "./validation";

export type ClientFormValues = z.input<typeof clientFormSchema>;

export type ClientFormProps = {
  clientId?: string;
};

export type PaymentMethod = "Bank Transfer" | "Cash";

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

export type ClientStageOption = {
  _id: string;
  key: string;
  name: string;
  amount: number;
  isActive: boolean;
  isSystem: boolean;
  displayOrder: number;
};

export type ClientStageListResponse = {
  success: boolean;
  count?: number;
  data: ClientStageOption[];
};

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

export type ClientQualification = {
  _id?: string;
  name?: string;
  levelOrScore?: string;
  acquiredDate?: string | null;
  expiryDate?: string | null;
  issuer?: string;
  note?: string;
};

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

export type ClientProfile = {
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
};

export type ClientDetailsData = {
  _id: string;
  clientId: string;

  fullName: string;
  phone: string;

  currentVisaStatus: string;
  preferCategory: string;

  currentStage: string;
  clientStatus: string;

  assignedStaff: string;

  currentStageDetails?: ClientStageOption | null;

  profile?: ClientProfile | null;

  createdAt: string;
  updatedAt: string;
};

export type ClientDetailsResponse = {
  success: boolean;
  data: ClientDetailsData;
};

export type ClientSaveResponse = {
  success: boolean;
  message: string;
  data: ClientDetailsData & {
    registrationPayment?: unknown;
  };
};
