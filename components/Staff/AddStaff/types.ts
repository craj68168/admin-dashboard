import { z } from "zod";
export interface StaffAddPayload {
  name: string;
  email: string;
}
export interface LoginViewProps {
  backendErrors?: Record<string, string>;
}

export const staffAddSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("Please enter a valid email address"),
});

export type StaffAddFormValues = z.infer<typeof staffAddSchema>;
