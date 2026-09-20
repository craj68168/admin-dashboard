import { z } from "zod";
import {
  GENDER,
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  NATIONALITIES,
  STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/components/constant";
// =================================================
// OPTION HELPER
// =================================================
const optionValues = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [
    T[number]["value"],
    ...T[number]["value"][],
  ];
// =================================================
// VALUES
// =================================================
const GENDER_VALUES = optionValues(GENDER);
const CURRENT_VISA_STATUS_VALUES = optionValues(CURRENT_VISA_STATUS_OPTIONS);
const PREFER_CATEGORY_VALUES = optionValues(PREFER_CATEGORY_OPTIONS);
const NATIONALITY_VALUES = optionValues(NATIONALITIES);
const STATUS_OF_RESIDENCE_VALUES = optionValues(STATUS_OF_RESIDENCE_OPTIONS);
const JAPANESE_LEVEL_VALUES = optionValues(JAPANESE_LEVELS);
const EDUCATION_TYPE_VALUES = optionValues(EDUCATION_TYPE_OPTIONS);
const EMPLOYMENT_TYPE_VALUES = optionValues(EMPLOYMENT_TYPE_OPTIONS);
const PREFECTURE_VALUES = optionValues(PREFECTURE_OPTIONS);
// =================================================
// FILE
// Safe for Next.js build / SSR.
// =================================================
const fileSchema = z
  .custom<File>(
    (value) => {
      if (typeof File === "undefined") {
        return true;
      }
      return value instanceof File;
    },
    {
      message: "Invalid file.",
    },
  )
  .nullable();
// =================================================
// MESSAGES
// =================================================
export type ClientFormValidationMessages = {
  fullNameRequired: string;
  phoneRequired: string;
  currentVisaStatusRequired: string;
  assignedStaffRequired: string;
  currentStageRequired: string;
  employmentTypeRequired: string;
};
const defaultMessages: ClientFormValidationMessages = {
  fullNameRequired: "Full name is required",
  phoneRequired: "Phone number is required",
  currentVisaStatusRequired: "Current visa status is required",
  assignedStaffRequired: "Assigned staff is required",
  currentStageRequired: "Current stage is required",
  employmentTypeRequired: "Employment type is required",
};
// =================================================
// FACTORY
// =================================================
export const createClientFormSchema = (
  messages: ClientFormValidationMessages = defaultMessages,
) =>
  z.object({
    // =================================================
    // CLIENT
    // =================================================
    fullName: z.string().trim().min(1, messages.fullNameRequired),
    phone: z.string().trim().min(1, messages.phoneRequired),
    currentVisaStatus: z
      .union([z.enum(CURRENT_VISA_STATUS_VALUES), z.literal("")])
      .refine((value) => value !== "", {
        message: messages.currentVisaStatusRequired,
      }),
    assignedStaff: z.string().trim().min(1, messages.assignedStaffRequired),
    preferCategory: z.union([z.enum(PREFER_CATEGORY_VALUES), z.literal("")]),
    currentStage: z.string().trim().min(1, messages.currentStageRequired),
    // =================================================
    // PERSONAL
    // =================================================
    dateOfBirth: z.string(),
    gender: z.union([z.enum(GENDER_VALUES), z.literal("")]),
    email: z.string(),
    nationality: z.union([z.enum(NATIONALITY_VALUES), z.literal("")]),
    address: z.string(),
    prefecture: z.union([z.enum(PREFECTURE_VALUES), z.literal("")]),
    // =================================================
    // PASSPORT / RESIDENCE
    // =================================================
    passportNumber: z.string(),
    passportExpiryDate: z.string(),
    statusOfResidence: z.union([
      z.enum(STATUS_OF_RESIDENCE_VALUES),
      z.literal(""),
    ]),
    // =================================================
    // EDUCATION
    // =================================================
    education: z.array(
      z.object({
        schoolName: z.string(),
        enrollmentDate: z.string(),
        graduationDate: z.string(),
        educationType: z.union([z.enum(EDUCATION_TYPE_VALUES), z.literal("")]),
        major: z.string(),
      }),
    ),
    // =================================================
    // JAPANESE
    // =================================================
    japaneseLanguageLevel: z.union([
      z.enum(JAPANESE_LEVEL_VALUES),
      z.literal(""),
    ]),
    intake: z.string(),
    // =================================================
    // EMPLOYMENT
    // =================================================
    employmentHistory: z.array(
      z
        .object({
          companyName: z.string(),
          startDate: z.string(),
          endDate: z.string(),
          employmentType: z.union([
            z.enum(EMPLOYMENT_TYPE_VALUES),
            z.literal(""),
          ]),
        })
        .superRefine((employment, context) => {
          const hasValue =
            employment.companyName.trim() !== "" ||
            employment.startDate.trim() !== "" ||
            employment.endDate.trim() !== "" ||
            employment.employmentType !== "";
          if (hasValue && employment.employmentType === "") {
            context.addIssue({
              code: "custom",
              path: ["employmentType"],
              message: messages.employmentTypeRequired,
            });
          }
        }),
    ),
    // =================================================
    // FILES
    // =================================================
    clientImage: fileSchema,
    cv: fileSchema,
  });
export const clientFormSchema = createClientFormSchema();
