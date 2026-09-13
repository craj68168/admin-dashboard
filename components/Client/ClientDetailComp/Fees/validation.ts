import { z } from "zod";

export const clientFeeSchema = z.object({
  feeName: z
    .string()
    .trim()
    .min(1, "Fee name is required")
    .max(150, "Fee name cannot exceed 150 characters"),

  expectedAmount: z
    .string()
    .trim()
    .min(1, "Expected amount is required")
    .refine(
      (value) => {
        const amount = Number(value);

        return Number.isFinite(amount) && amount > 0;
      },
      {
        message: "Expected amount must be greater than 0",
      },
    ),

  dueDate: z.string(),

  note: z.string().trim().max(3000, "Note cannot exceed 3000 characters"),
});
