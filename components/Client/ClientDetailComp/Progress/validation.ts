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
  stage: z.string().trim().min(1, "validation.stageRequired"),

  note: z.string().trim().max(2000, "validation.noteMax"),

  paymentMethod: z.union([
    z.literal(""),
    z.literal("Bank Transfer"),
    z.literal("Cash"),
  ]),

  paymentDate: z.string(),

  referenceNumber: z
    .string()
    .trim()
    .max(200, "validation.referenceMax"),

  receiptNumber: z
    .string()
    .trim()
    .max(200, "validation.receiptMax"),

  bankName: z
    .string()
    .trim()
    .max(200, "validation.bankMax"),
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
      errors.paymentMethod = "validation.paymentMethodRequired";
    }

    if (!values.paymentDate) {
      errors.paymentDate = "validation.paymentDateRequired";
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
    .min(1, "validation.nameRequired")
    .max(150, "validation.nameMax"),

  amount: z
    .string()
    .trim()
    .min(1, "validation.amountRequired")
    .refine(
      (value) => /^\d+$/.test(value),
      "validation.amountWhole",
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
