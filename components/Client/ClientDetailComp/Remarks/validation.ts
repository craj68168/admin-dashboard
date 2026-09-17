import { z } from "zod";

import { REMARK_MEDIUMS } from "./type";

const defaultMessages = {
  dateRequired: "Date is required",
  mediumRequired: "Medium is required",
  memoRequired: "Memo is required",
  memoMax: "Memo cannot exceed 5000 characters",
};

export const createRemarkSchema = (
  messages: typeof defaultMessages = defaultMessages,
) =>
  z.object({
  remarkDate: z.string().min(1, messages.dateRequired),

  medium: z
    .union([z.enum(REMARK_MEDIUMS), z.literal("")])
    .refine((value) => value !== "", {
      message: messages.mediumRequired,
    }),

  remarks: z
    .string()
    .trim()
    .min(1, messages.memoRequired)
    .max(5000, messages.memoMax),
});

export const remarkSchema = createRemarkSchema();
