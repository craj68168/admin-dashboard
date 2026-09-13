import { z } from "zod";

import { PAYMENT_METHODS } from "./type";

export const paymentSchema = z.object({
  feeId: z.string().trim().min(1, "Please select a fee"),

  amountPaid: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine(
      (value) => {
        const amount = Number(value);

        return Number.isFinite(amount) && amount > 0;
      },
      {
        message: "Amount must be greater than 0",
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
