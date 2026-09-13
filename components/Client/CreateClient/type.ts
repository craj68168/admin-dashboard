export const VISA_TYPES = ["Student", "Working", "Dependent"] as const;

export const COE_STATUSES = [
  "Not Applied",
  "Applied",
  "Processing",
  "Received",
  "Rejected",
] as const;

export const CLIENT_STATUSES = [
  "New",
  "Document Collection",
  "Processing",
  "COE Applied",
  "COE Received",
  "Visa Applied",
  "Visa Approved",
  "Visa Rejected",
  "Departed",
  "Arrived in Japan",
] as const;

export type VisaType = (typeof VISA_TYPES)[number];

export type CoeStatus = (typeof COE_STATUSES)[number];

export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export type CreateClientFormValues = {
  // Client
  fullName: string;
  phone: string;
  visaType: VisaType | "";
  assignedStaff: string;
  coeStatus: CoeStatus;
  clientStatus: ClientStatus;

  // Personal
  dateOfBirth: string;
  gender: string;
  email: string;
  address: string;
  nationality: string;

  // Passport / Residence
  passportNumber: string;
  passportExpiryDate: string;
  statusOfResidence: string;

  // Education
  lastQualification: string;
  japaneseLanguageLevel: string;
  schoolName: string;
  course: string;
  intake: string;

  // Employment
  jobCategory: string;
  jobTitle: string;
  companyName: string;
  workLocation: string;

  // Sponsor
  sponsorName: string;
  sponsorRelationship: string;
  sponsorStatusOfResidence: string;

  // Visa
  visaStatus: string;

  // Files
  clientImage: File | null;
  cv: File | null;
};

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
