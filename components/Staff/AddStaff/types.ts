import { z } from "zod";
export interface StaffAddPayload {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
}
export interface LoginViewProps {
  backendErrors?: Record<string, string>;
}

export const staffAddSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "phone is required"),
  location: z.string().min(1, "location is required"),
  password: z.string().min(1, "password is required"),
});

export type StaffAddFormValues = z.infer<typeof staffAddSchema>;
