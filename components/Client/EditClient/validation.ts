import { z } from "zod";

import { CLIENT_STATUSES, COE_STATUSES, VISA_TYPES } from "./type";

type EditClientValidationMessages = {
  emailInvalid: string;
  invalidFile: string;
  fullNameRequired: string;
  fullNameMin: string;
  phoneRequired: string;
  phoneMin: string;
  phoneMax: string;
  visaTypeRequired: string;
  assignedStaffRequired: string;
};

const defaultValidationMessages: EditClientValidationMessages = {
  emailInvalid: "Enter a valid email address",
  invalidFile: "Invalid file",
  fullNameRequired: "Full name is required",
  fullNameMin: "Full name must be at least 2 characters",
  phoneRequired: "Phone number is required",
  phoneMin: "Phone number must be at least 7 characters",
  phoneMax: "Phone number cannot exceed 20 characters",
  visaTypeRequired: "Visa type is required",
  assignedStaffRequired: "Assigned staff is required",
};

const createOptionalEmail = (message: string) =>
  z
  .string()
  .trim()
  .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message,
  });

const createOptionalFile = (message: string) =>
  z.custom<File | null>(
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
      message,
    },
  );

export const createEditClientSchema = (
  messages: EditClientValidationMessages = defaultValidationMessages,
) => {
  const optionalEmail = createOptionalEmail(messages.emailInvalid);
  const optionalFile = createOptionalFile(messages.invalidFile);

  return z.object({
  // =================================================
  // CLIENT
  // =================================================

  fullName: z
    .string()
    .trim()
    .min(1, messages.fullNameRequired)
    .min(2, messages.fullNameMin),

  phone: z
    .string()
    .trim()
    .min(1, messages.phoneRequired)
    .min(7, messages.phoneMin)
    .max(20, messages.phoneMax),

  visaType: z
    .union([z.enum(VISA_TYPES), z.literal("")])
    .refine((value) => value !== "", {
      message: messages.visaTypeRequired,
    }),

  assignedStaff: z.string().trim().min(1, messages.assignedStaffRequired),

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
  // PASSPORT
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
};

export const editClientSchema = createEditClientSchema();
