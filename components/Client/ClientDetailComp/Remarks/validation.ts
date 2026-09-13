import { z } from "zod";

import { REMARK_MEDIUMS } from "./type";

export const remarkSchema = z.object({
  remarkDate: z.string().min(1, "Date is required"),

  medium: z
    .union([z.enum(REMARK_MEDIUMS), z.literal("")])
    .refine((value) => value !== "", {
      message: "Medium is required",
    }),

  remarks: z
    .string()
    .trim()
    .min(1, "Memo is required")
    .max(5000, "Memo cannot exceed 5000 characters"),
});
