import { z } from "zod";
export const progressStageSchema = z.object({
  stage: z.string().trim().min(1, "Please select a stage."),
  note: z.string().trim().max(2000, "Note cannot exceed 2000 characters."),
});
