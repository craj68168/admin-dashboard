import { z } from "zod";

import { CLIENT_STATUSES, COE_STATUSES, VISA_TYPES } from "./type";

type CreateClientValidationMessages = {
  fullNameRequired: string;
  phoneRequired: string;
  visaTypeRequired: string;
};

const defaultValidationMessages: CreateClientValidationMessages = {
  fullNameRequired: "Full name is required",
  phoneRequired: "Phone number is required",
  visaTypeRequired: "Visa type is required",
};

export const createCreateClientSchema = (
  messages: CreateClientValidationMessages = defaultValidationMessages,
) =>
  z.object({
  // =================================================
  // CLIENT
  // =================================================

  fullName: z.string().trim().min(1, messages.fullNameRequired),

  phone: z.string().trim().min(1, messages.phoneRequired),

  visaType: z
    .union([z.enum(VISA_TYPES), z.literal("")])
    .refine((value) => value !== "", {
      message: messages.visaTypeRequired,
    }),

  assignedStaff: z.string(),

  coeStatus: z.enum(COE_STATUSES),

  clientStatus: z.enum(CLIENT_STATUSES),

  // =================================================
  // PERSONAL
  // =================================================

  dateOfBirth: z.string(),

  gender: z.string(),

  email: z.string(),

  address: z.string(),

  nationality: z.string(),

  // =================================================
  // PASSPORT / RESIDENCE
  // =================================================

  passportNumber: z.string(),

  passportExpiryDate: z.string(),

  statusOfResidence: z.string(),

  // =================================================
  // EDUCATION
  // =================================================

  lastQualification: z.string(),

  japaneseLanguageLevel: z.string(),

  schoolName: z.string(),

  course: z.string(),

  intake: z.string(),

  // =================================================
  // EMPLOYMENT
  // =================================================

  jobCategory: z.string(),

  jobTitle: z.string(),

  companyName: z.string(),

  workLocation: z.string(),

  // =================================================
  // SPONSOR
  // =================================================

  sponsorName: z.string(),

  sponsorRelationship: z.string(),

  sponsorStatusOfResidence: z.string(),

  // =================================================
  // VISA
  // =================================================

  visaStatus: z.string(),

  // =================================================
  // FILES
  // =================================================

  clientImage: z.instanceof(File).nullable(),

  cv: z.instanceof(File).nullable(),
  });

export const createClientSchema = createCreateClientSchema();

// =================================================
// FORM TYPE
// =================================================

export type CreateClientFormValues = z.input<typeof createClientSchema>;
