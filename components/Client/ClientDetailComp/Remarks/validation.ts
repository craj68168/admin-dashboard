import { z } from "zod";

import { REMARK_MEDIUMS } from "./type";

const defaultMessages = {
  dateRequired: "validation.dateRequired",
  mediumRequired: "validation.mediumRequired",
  memoRequired: "validation.memoRequired",
  memoMax: "validation.memoMax",
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
