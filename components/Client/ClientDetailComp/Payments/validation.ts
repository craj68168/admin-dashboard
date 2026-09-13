import { z } from "zod";

import { PAYMENT_METHODS } from "./type";

const positiveAmountString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)
    .refine(
      (value) => {
        const amount = Number(value);

        return Number.isFinite(amount) && amount >= 0;
      },
      {
        message: `${fieldName} must be a valid amount`,
      },
    );

export const paymentSchema = z.object({
  paymentName: z
    .string()
    .trim()
    .min(1, "Payment name is required")
    .max(150, "Payment name cannot exceed 150 characters"),

  expectedAmount: positiveAmountString("Expected amount"),

  amountPaid: positiveAmountString("Amount paid").refine(
    (value) => Number(value) > 0,
    {
      message: "Amount paid must be greater than 0",
    },
  ),

  paymentMethod: z
    .union([z.enum(PAYMENT_METHODS), z.literal("")])
    .refine((value) => value !== "", {
      message: "Payment method is required",
    }),

  paymentDate: z.string().min(1, "Payment date is required"),

  referenceNumber: z.string().trim().max(200, "Reference number is too long"),

  receiptNumber: z.string().trim().max(200, "Receipt number is too long"),

  bankName: z.string().trim().max(200, "Bank name is too long"),

  note: z.string().trim().max(3000, "Note cannot exceed 3000 characters"),
});
