export type AssignedStaffDetails = {
  _id: string;
  staffId: string;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  isActive: boolean;
};
export type ClientStageDetails = {
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
export type EducationHistory = {
  _id?: string;
  schoolName?: string;
  educationType?: string;
  enrollmentDate?: string | null;
  graduationDate?: string | null;
  major?: string;
};
export type EmploymentHistory = {
  _id?: string;
  companyName?: string;
  employmentType?: string;
  startDate?: string | null;
  endDate?: string | null;
};
export type ClientProfile = {
  _id: string;
  clientId: string;
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
  education?: EducationHistory[];
  japaneseLanguageLevel?: string;
  intake?: string;
  employmentHistory?: EmploymentHistory[];
  clientImage?: string;
  cv?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type ClientDetail = {
  _id: string;
  clientId: string;
  fullName: string;
  phone: string;
  currentVisaStatus: string;
  preferCategory?: string;
  currentStage: string;
  clientStatus: string;
  assignedStaff: string;
  assignedStaffDetails?: AssignedStaffDetails | null;
  currentStageDetails?: ClientStageDetails | null;
  profile?: ClientProfile | null;
  createdAt: string;
  updatedAt: string;
};
export type ClientDetailResponse = {
  success: boolean;
  data: ClientDetail;
};
