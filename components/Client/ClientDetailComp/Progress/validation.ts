import { z } from "zod";

// =================================================
// PAYMENT OPTIONS
// =================================================

export const PAYMENT_METHOD_OPTIONS = [
  {
    value: "Bank Transfer",
    label: "Bank Transfer",
  },
  {
    value: "Cash",
    label: "Cash",
  },
] as const;

// =================================================
// PROGRESS FORM
// =================================================

export const progressFormSchema = z.object({
  stage: z.string().trim().min(1, "Please select the next stage."),

  note: z.string().trim().max(2000, "Note must be 2000 characters or less."),

  paymentMethod: z.union([
    z.literal(""),
    z.literal("Bank Transfer"),
    z.literal("Cash"),
  ]),

  paymentDate: z.string(),

  referenceNumber: z
    .string()
    .trim()
    .max(200, "Reference number must be 200 characters or less."),

  receiptNumber: z
    .string()
    .trim()
    .max(200, "Receipt number must be 200 characters or less."),

  bankName: z
    .string()
    .trim()
    .max(200, "Bank name must be 200 characters or less."),
});

export type ProgressValidationErrors = Partial<
  Record<keyof z.infer<typeof progressFormSchema>, string>
>;

export const validateProgressForm = (
  values: z.infer<typeof progressFormSchema>,
  requiresPayment: boolean,
) => {
  const result = progressFormSchema.safeParse(values);

  const errors: ProgressValidationErrors = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string") {
        errors[field as keyof ProgressValidationErrors] = issue.message;
      }
    }
  }

  if (requiresPayment) {
    if (!values.paymentMethod) {
      errors.paymentMethod = "Payment method is required.";
    }

    if (!values.paymentDate) {
      errors.paymentDate = "Payment date is required.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// =================================================
// ADD STAGE FORM
// =================================================

export const addStageFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Stage name is required.")
    .max(150, "Stage name must be 150 characters or less."),

  amount: z
    .string()
    .trim()
    .min(1, "Stage amount is required.")
    .refine(
      (value) => /^\d+$/.test(value),
      "Amount must be a whole number of yen.",
    ),
});

export type AddStageValidationErrors = Partial<
  Record<keyof z.infer<typeof addStageFormSchema>, string>
>;

export const validateAddStageForm = (
  values: z.infer<typeof addStageFormSchema>,
) => {
  const result = addStageFormSchema.safeParse(values);

  const errors: AddStageValidationErrors = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string") {
        errors[field as keyof AddStageValidationErrors] = issue.message;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
