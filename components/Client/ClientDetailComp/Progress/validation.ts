import { z } from "zod";

import { CLIENT_STAGES } from "./type";

export const progressSchema = z.object({
  stage: z
    .union([z.enum(CLIENT_STAGES), z.literal("")])
    .refine((value) => value !== "", {
      message: "Please select a stage",
    }),

  note: z.string().trim().max(2000, "Note cannot exceed 2000 characters"),
});
