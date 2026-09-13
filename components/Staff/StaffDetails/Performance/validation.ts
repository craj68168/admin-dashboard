import { z } from "zod";

export const staffTargetSchema = z.object({
  targetAmount: z
    .string()
    .trim()
    .min(1, "Target amount is required")
    .refine(
      (value) => {
        const amount = Number(value);

        return Number.isFinite(amount) && amount > 0;
      },
      {
        message: "Target amount must be greater than 0",
      },
    ),

  note: z.string().trim().max(2000, "Note cannot exceed 2000 characters"),
});
