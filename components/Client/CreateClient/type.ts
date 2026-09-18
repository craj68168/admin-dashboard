// =================================================
// VISA TYPES
// =================================================

export const VISA_TYPES = ["Student", "Working", "Dependent"] as const;

export type VisaType = (typeof VISA_TYPES)[number];

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

export const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
] as const;

export const STATUS_OF_RESIDENCE_OPTIONS = [
  "Citizen",
  "Permanent Resident",
  "Temporary Resident",
  "Student Visa",
  "Work Visa",
  "Dependent Visa",
  "Refugee",
  "Other",
] as const;

export const LAST_QUALIFICATION_OPTIONS = [
  "SLC / SEE",
  "+2 / Intermediate",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Diploma",
  "Certificate Course",
  "Other",
] as const;

export const JAPANESE_LANGUAGE_LEVEL_OPTIONS = [
  "None",
  "N5",
  "N4",
  "N3",
  "N2",
  "N1",
  "JLPT Not Taken",
  "NAT-Test",
  "J-Test",
] as const;

export const SPONSOR_RELATIONSHIP_OPTIONS = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Spouse",
  "Uncle",
  "Aunt",
  "Grandparent",
  "Self",
  "Guardian",
  "Other",
] as const;

export const VISA_STATUS_OPTIONS = [
  "Not Applied",
  "Applied",
  "Processing",
  "Approved",
  "Rejected",
] as const;
export type CoeStatus = (typeof COE_STATUSES)[number];
export type Gender = (typeof GENDER_OPTIONS)[number];
export type StatusOfResidence = (typeof STATUS_OF_RESIDENCE_OPTIONS)[number];
export type LastQualification = (typeof LAST_QUALIFICATION_OPTIONS)[number];
export type JapaneseLanguageLevel = (typeof JAPANESE_LANGUAGE_LEVEL_OPTIONS)[number];
export type SponsorRelationship = (typeof SPONSOR_RELATIONSHIP_OPTIONS)[number];
export type VisaStatus = (typeof VISA_STATUS_OPTIONS)[number];

// =================================================
// CLIENT STATUSES
// =================================================

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

export type ClientStatus = (typeof CLIENT_STATUSES)[number];

// =================================================
// STAFF OPTION
//
// Used in the Assigned Staff dropdown
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
//
// GET /api/staff
// =================================================

export type StaffListResponse = {
  success: boolean;

  data: StaffOption[];
};
