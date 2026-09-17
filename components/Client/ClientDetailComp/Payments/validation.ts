import { z } from "zod";

import { PAYMENT_METHODS } from "./type";

const defaultMessages = {
  feeRequired: "Please select a fee",
  amountRequired: "Amount is required",
  amountPositive: "Amount must be greater than 0",
  paymentMethodRequired: "Payment method is required",
  paymentDateRequired: "Payment date is required",
  referenceNumberMax: "Reference number is too long",
  receiptNumberMax: "Receipt number is too long",
  bankNameMax: "Bank name is too long",
  noteMax: "Note cannot exceed 3000 characters",
};

export const createPaymentSchema = (
  messages: typeof defaultMessages = defaultMessages,
) =>
  z.object({
  feeId: z.string().trim().min(1, messages.feeRequired),

  amountPaid: z
    .string()
    .trim()
    .min(1, messages.amountRequired)
    .refine(
      (value) => {
        const amount = Number(value);

        return Number.isFinite(amount) && amount > 0;
      },
      {
        message: messages.amountPositive,
      },
    ),

  paymentMethod: z
    .union([z.enum(PAYMENT_METHODS), z.literal("")])
    .refine((value) => value !== "", {
      message: messages.paymentMethodRequired,
    }),

  paymentDate: z.string().min(1, messages.paymentDateRequired),

  referenceNumber: z.string().trim().max(200, messages.referenceNumberMax),

  receiptNumber: z.string().trim().max(200, messages.receiptNumberMax),

  bankName: z.string().trim().max(200, messages.bankNameMax),

  note: z.string().trim().max(3000, messages.noteMax),
});

export const paymentSchema = createPaymentSchema();
