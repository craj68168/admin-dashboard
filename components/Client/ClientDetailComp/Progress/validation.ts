import { z } from "zod";

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

export const progressFormSchema = z.object({
  stage: z.string().trim().min(1, "Please select the next stage."),

  note: z.string().trim().max(2000, "Note must be 2000 characters or less."),

  paymentMethod: z.union([
    z.literal(""),
    z.literal("Bank Transfer"),
    z.literal("Cash"),
  ]),

  paymentDate: z.string(),

  referenceNumber: z.string().trim().max(200),

  receiptNumber: z.string().trim().max(200),

  bankName: z.string().trim().max(200),
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
