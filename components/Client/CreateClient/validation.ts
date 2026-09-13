import { z } from "zod";

import { CLIENT_STATUSES, COE_STATUSES, VISA_TYPES } from "./type";

const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: "Enter a valid email address",
  });

const optionalFile = z.custom<File | null>(
  (value) => {
    if (value === null) {
      return true;
    }

    if (typeof File === "undefined") {
      return true;
    }

    return value instanceof File;
  },
  {
    message: "Invalid file",
  },
);

export const createClientSchema = z.object({
  // =================================================
  // CLIENT
  // =================================================

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .min(7, "Phone number must be at least 7 characters")
    .max(20, "Phone number cannot exceed 20 characters"),

  visaType: z.enum(VISA_TYPES, {
    message: "Visa type is required",
  }),

  // Admin selects this.
  // Staff gets this automatically from logged-in user.
  assignedStaff: z.string().trim().min(1, "Assigned staff is required"),

  coeStatus: z.enum(COE_STATUSES),

  clientStatus: z.enum(CLIENT_STATUSES),

  // =================================================
  // PERSONAL
  // =================================================

  dateOfBirth: z.string(),

  gender: z.string().trim(),

  email: optionalEmail,

  address: z.string().trim(),

  nationality: z.string().trim(),

  // =================================================
  // PASSPORT / RESIDENCE
  // =================================================

  passportNumber: z.string().trim(),

  passportExpiryDate: z.string(),

  statusOfResidence: z.string().trim(),

  // =================================================
  // EDUCATION
  // =================================================

  lastQualification: z.string().trim(),

  japaneseLanguageLevel: z.string().trim(),

  schoolName: z.string().trim(),

  course: z.string().trim(),

  intake: z.string().trim(),

  // =================================================
  // EMPLOYMENT
  // =================================================

  jobCategory: z.string().trim(),

  jobTitle: z.string().trim(),

  companyName: z.string().trim(),

  workLocation: z.string().trim(),

  // =================================================
  // SPONSOR
  // =================================================

  sponsorName: z.string().trim(),

  sponsorRelationship: z.string().trim(),

  sponsorStatusOfResidence: z.string().trim(),

  // =================================================
  // VISA
  // =================================================

  visaStatus: z.string().trim(),

  // =================================================
  // FILES
  // =================================================

  clientImage: optionalFile,

  cv: optionalFile,
});
