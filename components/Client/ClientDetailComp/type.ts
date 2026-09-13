export type AssignedStaffDetails = {
  _id: string;
  staffId: string;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  isActive: boolean;
};

export type ClientProfile = {
  _id: string;
  clientId: string;

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

export type ClientDetail = {
  _id: string;

  clientId: string;

  fullName: string;
  phone: string;

  visaType: "Student" | "Working" | "Dependent";

  coeStatus: "Not Applied" | "Applied" | "Processing" | "Received" | "Rejected";

  clientStatus:
    | "New"
    | "Document Collection"
    | "Processing"
    | "COE Applied"
    | "COE Received"
    | "Visa Applied"
    | "Visa Approved"
    | "Visa Rejected"
    | "Departed"
    | "Arrived in Japan";

  assignedStaff: string;

  assignedStaffDetails?: AssignedStaffDetails | null;

  profile?: ClientProfile | null;

  createdAt: string;
  updatedAt: string;
};

export type ClientDetailResponse = {
  success: boolean;
  data: ClientDetail;
};
