import { z } from "zod";

export const editStageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Stage name is required.")
    .max(150, "Stage name cannot exceed 150 characters."),

  amount: z
    .string()
    .trim()
    .min(1, "Amount is required.")
    .refine(
      (value) => {
        const amount = Number(value);

        return (
          Number.isFinite(amount) &&
          Number.isInteger(amount) &&
          amount >= 0
        );
      },
      {
        message:
          "Amount must be a whole number greater than or equal to 0.",
      },
    ),

  displayOrder: z
    .string()
    .trim()
    .min(1, "Display order is required.")
    .refine(
      (value) => {
        const order = Number(value);

        return (
          Number.isFinite(order) &&
          Number.isInteger(order) &&
          order >= 1
        );
      },
      {
        message:
          "Display order must be a positive whole number.",
      },
    ),
});