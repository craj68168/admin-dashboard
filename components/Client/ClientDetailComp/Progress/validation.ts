import { z } from "zod";

import { CLIENT_STAGES } from "./type";

const defaultMessages = {
  stageRequired: "Please select a stage",
  noteMax: "Note cannot exceed 2000 characters",
};

export const createProgressSchema = (
  messages: typeof defaultMessages = defaultMessages,
) =>
  z.object({
  stage: z
    .union([z.enum(CLIENT_STAGES), z.literal("")])
    .refine((value) => value !== "", {
      message: messages.stageRequired,
    }),

  note: z.string().trim().max(2000, messages.noteMax),
});

export const progressSchema = createProgressSchema();
