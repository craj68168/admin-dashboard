import { z } from "zod";

const defaultMessages = {
  feeNameRequired: "Fee name is required",
  feeNameMax: "Fee name cannot exceed 150 characters",
  expectedAmountRequired: "Expected amount is required",
  expectedAmountPositive: "Expected amount must be greater than 0",
  noteMax: "Note cannot exceed 3000 characters",
};

export const createClientFeeSchema = (
  messages: typeof defaultMessages = defaultMessages,
) =>
  z.object({
  feeName: z
    .string()
    .trim()
    .min(1, messages.feeNameRequired)
    .max(150, messages.feeNameMax),

  expectedAmount: z
    .string()
    .trim()
    .min(1, messages.expectedAmountRequired)
    .refine(
      (value) => {
        const amount = Number(value);

        return Number.isFinite(amount) && amount > 0;
      },
      {
        message: messages.expectedAmountPositive,
      },
    ),

  dueDate: z.string(),

  note: z.string().trim().max(3000, messages.noteMax),
});

export const clientFeeSchema = createClientFeeSchema();
