import { z } from "zod";
export const createStageSchema = z.object({
  name: z.string().trim().min(1, "Stage name is required"),
  amount: z
    .string()
    .trim()
    .refine(
      (value) => {
        const amount = Number(value);
        return (
          Number.isFinite(amount) && amount >= 0 && Number.isInteger(amount)
        );
      },
      {
        message: "Amount must be 0 or a positive whole number",
      },
    ),
});
