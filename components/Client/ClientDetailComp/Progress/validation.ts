import { z } from "zod";

export const progressStageSchema = z.object({
  stage: z.string().trim().min(1, "Please select a stage."),

  note: z.string().trim().max(3000, "Note cannot exceed 3000 characters."),

  paymentMethod: z.string().trim(),

  paymentDate: z.string().trim(),

  referenceNumber: z.string().trim().max(200, "Reference number is too long."),

  receiptNumber: z.string().trim().max(200, "Receipt number is too long."),

  bankName: z.string().trim().max(200, "Bank name is too long."),
});

export type ProgressStageValues = z.infer<typeof progressStageSchema>;
