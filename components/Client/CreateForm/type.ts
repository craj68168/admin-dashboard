import type { z } from "zod";
import {
  GENDER,
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  NATIONALITIES,
  STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  PREFECTURE_OPTIONS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from "@/components/constant";
import { clientFormSchema } from "./validation";
// =================================================
// SHARED OPTION TYPES
// =================================================
export type Gender = (typeof GENDER)[number]["value"];
export type CurrentVisaStatus =
  (typeof CURRENT_VISA_STATUS_OPTIONS)[number]["value"];
export type PreferCategory = (typeof PREFER_CATEGORY_OPTIONS)[number]["value"];
export type Nationality = (typeof NATIONALITIES)[number]["value"];
export type StatusOfResidence =
  (typeof STATUS_OF_RESIDENCE_OPTIONS)[number]["value"];
export type JapaneseLanguageLevel = (typeof JAPANESE_LEVELS)[number]["value"];
export type Prefecture = (typeof PREFECTURE_OPTIONS)[number]["value"];
export type EducationType = (typeof EDUCATION_TYPE_OPTIONS)[number]["value"];
export type EmploymentType = (typeof EMPLOYMENT_TYPE_OPTIONS)[number]["value"];
// =================================================
// FORM
// =================================================
export type ClientFormValues = z.input<typeof clientFormSchema>;
export type EducationFormValue = ClientFormValues["education"][number];
export type EmploymentHistoryFormValue =
  ClientFormValues["employmentHistory"][number];
// =================================================
// COMPONENT
// =================================================
export type ClientFormProps = {
  clientId?: string;
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
// CLIENT STAGE MASTER
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
// EDUCATION API
// =================================================
export type ClientEducation = {
  _id?: string;
  schoolName?: string;
  educationType?: EducationType | "";
  enrollmentDate?: string | null;
  graduationDate?: string | null;
  major?: string;
};
// =================================================
// EMPLOYMENT API
// =================================================
export type ClientEmploymentHistory = {
  _id?: string;
  companyName?: string;
  employmentType?: EmploymentType | "";
  startDate?: string | null;
  endDate?: string | null;
};
// =================================================
// PROFILE API
// =================================================
export type ClientProfile = {
  _id?: string;
  clientId?: string;
  clientRef?: string;
  dateOfBirth?: string | null;
  gender?: Gender | "";
  email?: string;
  prefecture?: Prefecture | "";
  address?: string;
  nationality?: Nationality | "";
  passportNumber?: string;
  passportExpiryDate?: string | null;
  statusOfResidence?: StatusOfResidence | "";
  education?: ClientEducation[];
  japaneseLanguageLevel?: JapaneseLanguageLevel | "";
  intake?: string;
  employmentHistory?: ClientEmploymentHistory[];
  clientImage?: string;
  cv?: string;
  createdAt?: string;
  updatedAt?: string;
};
// =================================================
// CLIENT DETAIL API
// =================================================
export type ClientDetails = {
  _id: string;
  clientId: string;
  fullName: string;
  phone: string;
  currentVisaStatus: CurrentVisaStatus;
  preferCategory?: PreferCategory | "";
  currentStage: string;
  clientStatus: string;
  assignedStaff: string;
  assignedStaffDetails?: StaffOption | null;
  currentStageDetails?: ClientStageOption | null;
  profile?: ClientProfile | null;
  createdAt: string;
  updatedAt: string;
};
export type ClientDetailsResponse = {
  success: boolean;
  data: ClientDetails;
};
// =================================================
// SAVE RESPONSE
// =================================================
export type ClientSaveResponse = {
  success: boolean;
  message: string;
  data: ClientDetails;
};
// =================================================
// EXISTING FILES
// =================================================
export type ExistingClientFiles = {
  clientImage: string;
  cv: string;
};
