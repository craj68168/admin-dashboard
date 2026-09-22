import { z } from "zod";

export const addStageSchema = z.object({
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

  status: z.enum(
    ["active", "inactive"],
    {
      message: "Status is required.",
    },
  ),
});
