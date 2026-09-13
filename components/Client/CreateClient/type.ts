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

export type CoeStatus = (typeof COE_STATUSES)[number];

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
