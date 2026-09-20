import { z } from "zod";

import {
  GENDER,
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  CURRENT_STAGES,
  NATIONALITIES,
  STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/components/constant";

// =================================================
// HELPER
// Convert shared option objects into Zod enum values
// =================================================

const optionValues = <
  T extends readonly {
    value: string;
  }[],
>(
  options: T,
) =>
  options.map((option) => option.value) as [
    T[number]["value"],
    ...T[number]["value"][],
  ];

// =================================================
// ENUM VALUES
// Single source remains components/constant/index.ts
// =================================================

const GENDER_VALUES = optionValues(GENDER);

const CURRENT_VISA_STATUS_VALUES = optionValues(
  CURRENT_VISA_STATUS_OPTIONS,
);

const PREFER_CATEGORY_VALUES = optionValues(
  PREFER_CATEGORY_OPTIONS,
);

const CURRENT_STAGE_VALUES = optionValues(
  CURRENT_STAGES,
);

const NATIONALITY_VALUES = optionValues(
  NATIONALITIES,
);

const STATUS_OF_RESIDENCE_VALUES = optionValues(
  STATUS_OF_RESIDENCE_OPTIONS,
);

const JAPANESE_LEVEL_VALUES = optionValues(
  JAPANESE_LEVELS,
);

const EDUCATION_TYPE_VALUES = optionValues(
  EDUCATION_TYPE_OPTIONS,
);

const EMPLOYMENT_TYPE_VALUES = optionValues(
  EMPLOYMENT_TYPE_OPTIONS,
);

const PREFECTURE_VALUES = optionValues(
  PREFECTURE_OPTIONS,
);

// =================================================
// VALIDATION MESSAGES
// =================================================

type CreateClientValidationMessages = {
  fullNameRequired: string;
  phoneRequired: string;
  currentVisaStatusRequired: string;
  currentStageRequired: string;
  employmentTypeRequired?: string;
};

const defaultValidationMessages: CreateClientValidationMessages = {
  fullNameRequired: "Full name is required",
  phoneRequired: "Phone number is required",
  currentVisaStatusRequired: "Current visa status is required",
  currentStageRequired: "Current stage is required",
  employmentTypeRequired: "Employment type is required",
};

// =================================================
// SCHEMA FACTORY
// =================================================

export const createCreateClientSchema = (
  messages: CreateClientValidationMessages =
    defaultValidationMessages,
) =>
  z.object({
    // =================================================
    // CLIENT
    // =================================================

    fullName: z
      .string()
      .trim()
      .min(1, messages.fullNameRequired),

    phone: z
      .string()
      .trim()
      .min(1, messages.phoneRequired),

    currentVisaStatus: z
      .union([
        z.enum(CURRENT_VISA_STATUS_VALUES),
        z.literal(""),
      ])
      .refine((value) => value !== "", {
        message: messages.currentVisaStatusRequired,
      }),

    preferCategory: z.union([
      z.enum(PREFER_CATEGORY_VALUES),
      z.literal(""),
    ]),

    currentStage: z
      .union([
        z.enum(CURRENT_STAGE_VALUES),
        z.literal(""),
      ])
      .refine((value) => value !== "", {
        message: messages.currentStageRequired,
      }),

    assignedStaff: z.string(),

    // =================================================
    // PERSONAL INFORMATION
    // =================================================

    dateOfBirth: z.string(),

    gender: z.union([
      z.enum(GENDER_VALUES),
      z.literal(""),
    ]),

    email: z.string(),

    nationality: z.union([
      z.enum(NATIONALITY_VALUES),
      z.literal(""),
    ]),

    address: z.string(),

    prefecture: z.union([
      z.enum(PREFECTURE_VALUES),
      z.literal(""),
    ]),

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
    // JAPANESE LANGUAGE
    // =================================================

    japaneseLanguageLevel: z.union([
      z.enum(JAPANESE_LEVEL_VALUES),
      z.literal(""),
    ]),

    intake: z.string(),

    // =================================================
    // EDUCATION HISTORY
    // =================================================

    education: z.array(
      z.object({
        schoolName: z.string(),

        enrollmentDate: z.string(),

        graduationDate: z.string(),

        educationType: z.union([
          z.enum(EDUCATION_TYPE_VALUES),
          z.literal(""),
        ]),

        major: z.string(),
      }),
    ),

    // =================================================
    // EMPLOYMENT HISTORY
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
          const hasEmploymentHistoryValue =
            employment.companyName.trim() !== "" ||
            employment.startDate.trim() !== "" ||
            employment.endDate.trim() !== "" ||
            employment.employmentType !== "";

          if (
            hasEmploymentHistoryValue &&
            employment.employmentType === ""
          ) {
            context.addIssue({
              code: "custom",
              path: ["employmentType"],
              message:
                messages.employmentTypeRequired ??
                defaultValidationMessages.employmentTypeRequired ??
                "Employment type is required",
            });
          }
        }),
    ),

    // =================================================
    // OTHER
    // =================================================

    remark: z.string(),

    // =================================================
    // FILES
    // =================================================

    clientImage: z.instanceof(File).nullable(),

    cv: z.instanceof(File).nullable(),
  });

// =================================================
// DEFAULT SCHEMA
// =================================================

export const createClientSchema =
  createCreateClientSchema();
