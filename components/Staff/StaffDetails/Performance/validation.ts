import { z } from "zod";

type StaffTargetValidationMessages = {
  targetAmountRequired: string;
  targetAmountPositive: string;
  noteMax: string;
};

const defaultValidationMessages: StaffTargetValidationMessages = {
  targetAmountRequired: "Target amount is required",
  targetAmountPositive: "Target amount must be greater than 0",
  noteMax: "Note cannot exceed 2000 characters",
};

export const createStaffTargetSchema = (
  messages: StaffTargetValidationMessages = defaultValidationMessages,
) =>
  z.object({
    targetAmount: z
      .string()
      .trim()
      .min(1, messages.targetAmountRequired)
      .refine(
        (value) => {
          const amount = Number(value);

          return Number.isFinite(amount) && amount > 0;
        },
        {
          message: messages.targetAmountPositive,
        },
      ),

    note: z.string().trim().max(2000, messages.noteMax),
  });

export const staffTargetSchema = createStaffTargetSchema();
