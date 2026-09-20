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
// OPTION VALUE HELPER
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
// =================================================

const GENDER_VALUES =
  optionValues(GENDER);

const CURRENT_VISA_STATUS_VALUES =
  optionValues(
    CURRENT_VISA_STATUS_OPTIONS,
  );

const PREFER_CATEGORY_VALUES =
  optionValues(
    PREFER_CATEGORY_OPTIONS,
  );

const CURRENT_STAGE_VALUES =
  optionValues(CURRENT_STAGES);

const NATIONALITY_VALUES =
  optionValues(NATIONALITIES);

const STATUS_OF_RESIDENCE_VALUES =
  optionValues(
    STATUS_OF_RESIDENCE_OPTIONS,
  );

const JAPANESE_LEVEL_VALUES =
  optionValues(JAPANESE_LEVELS);

const EDUCATION_TYPE_VALUES =
  optionValues(
    EDUCATION_TYPE_OPTIONS,
  );

const EMPLOYMENT_TYPE_VALUES =
  optionValues(
    EMPLOYMENT_TYPE_OPTIONS,
  );

const PREFECTURE_VALUES =
  optionValues(PREFECTURE_OPTIONS);

// =================================================
// VALIDATION MESSAGES
// =================================================

type EditClientValidationMessages = {
  emailInvalid: string;

  invalidFile: string;

  fullNameRequired: string;
  fullNameMin: string;

  phoneRequired: string;
  phoneMin: string;
  phoneMax: string;

  currentVisaStatusRequired: string;

  currentStageRequired: string;

  assignedStaffRequired: string;
};

const defaultValidationMessages: EditClientValidationMessages =
  {
    emailInvalid:
      "Enter a valid email address",

    invalidFile: "Invalid file",

    fullNameRequired:
      "Full name is required",

    fullNameMin:
      "Full name must be at least 2 characters",

    phoneRequired:
      "Phone number is required",

    phoneMin:
      "Phone number must be at least 7 characters",

    phoneMax:
      "Phone number cannot exceed 20 characters",

    currentVisaStatusRequired:
      "Current visa status is required",

    currentStageRequired:
      "Current stage is required",

    assignedStaffRequired:
      "Assigned staff is required",
  };

// =================================================
// OPTIONAL EMAIL
// =================================================

const createOptionalEmail = (
  message: string,
) =>
  z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          value,
        ),
      {
        message,
      },
    );

// =================================================
// OPTIONAL FILE
// =================================================

const createOptionalFile = (
  message: string,
) =>
  z.custom<File | null>(
    (value) => {
      if (value === null) {
        return true;
      }

      if (
        typeof File === "undefined"
      ) {
        return true;
      }

      return value instanceof File;
    },
    {
      message,
    },
  );

// =================================================
// EDIT CLIENT SCHEMA
// =================================================

export const createEditClientSchema = (
  messages: EditClientValidationMessages =
    defaultValidationMessages,
) => {
  const optionalEmail =
    createOptionalEmail(
      messages.emailInvalid,
    );

  const optionalFile =
    createOptionalFile(
      messages.invalidFile,
    );

  return z.object({
    // =================================================
    // CLIENT
    // =================================================

    fullName: z
      .string()
      .trim()
      .min(
        1,
        messages.fullNameRequired,
      )
      .min(
        2,
        messages.fullNameMin,
      ),

    phone: z
      .string()
      .trim()
      .min(
        1,
        messages.phoneRequired,
      )
      .min(
        7,
        messages.phoneMin,
      )
      .max(
        20,
        messages.phoneMax,
      ),

    currentVisaStatus: z
      .union([
        z.enum(
          CURRENT_VISA_STATUS_VALUES,
        ),
        z.literal(""),
      ])
      .refine(
        (value) => value !== "",
        {
          message:
            messages.currentVisaStatusRequired,
        },
      ),

    preferCategory: z.union([
      z.enum(
        PREFER_CATEGORY_VALUES,
      ),
      z.literal(""),
    ]),

    currentStage: z
      .union([
        z.enum(
          CURRENT_STAGE_VALUES,
        ),
        z.literal(""),
      ])
      .refine(
        (value) => value !== "",
        {
          message:
            messages.currentStageRequired,
        },
      ),

    assignedStaff: z
      .string()
      .trim()
      .min(
        1,
        messages.assignedStaffRequired,
      ),

    // =================================================
    // PERSONAL
    // =================================================

    dateOfBirth: z.string(),

    gender: z.union([
      z.enum(GENDER_VALUES),
      z.literal(""),
    ]),

    email: optionalEmail,

    nationality: z.union([
      z.enum(NATIONALITY_VALUES),
      z.literal(""),
    ]),

    address: z.string().trim(),

    prefecture: z.union([
      z.enum(PREFECTURE_VALUES),
      z.literal(""),
    ]),

    // =================================================
    // PASSPORT / RESIDENCE
    // =================================================

    passportNumber:
      z.string().trim(),

    passportExpiryDate:
      z.string(),

    statusOfResidence: z.union([
      z.enum(
        STATUS_OF_RESIDENCE_VALUES,
      ),
      z.literal(""),
    ]),

    // =================================================
    // JAPANESE
    // =================================================

    japaneseLanguageLevel:
      z.union([
        z.enum(
          JAPANESE_LEVEL_VALUES,
        ),
        z.literal(""),
      ]),

    intake: z.string().trim(),

    // =================================================
    // EDUCATION
    // =================================================

    education: z.array(
      z.object({
        schoolName:
          z.string().trim(),

        enrollmentDate:
          z.string(),

        graduationDate:
          z.string(),

        educationType:
          z.union([
            z.enum(
              EDUCATION_TYPE_VALUES,
            ),
            z.literal(""),
          ]),

        major:
          z.string().trim(),
      }),
    ),

    // =================================================
    // EMPLOYMENT HISTORY
    // =================================================

    employmentHistory: z.array(
      z.object({
        companyName:
          z.string().trim(),

        startDate:
          z.string(),

        endDate:
          z.string(),

        employmentType:
          z.union([
            z.enum(
              EMPLOYMENT_TYPE_VALUES,
            ),
            z.literal(""),
          ]),
      }),
    ),

    // =================================================
    // OTHER
    // =================================================

    remark: z.string().trim(),

    // =================================================
    // FILES
    // =================================================

    clientImage: optionalFile,

    cv: optionalFile,
  });
};

// =================================================
// DEFAULT SCHEMA
// =================================================

export const editClientSchema =
  createEditClientSchema();
