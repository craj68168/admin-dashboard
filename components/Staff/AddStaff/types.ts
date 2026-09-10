import { z } from "zod";
export interface StaffAddPayload {
  name: string;
  email: string;
  location: string;
  phone: string;
  password: string;
}
export interface LoginViewProps {
  backendErrors?: Record<string, string>;
}

  const STAFF_LOCATIONS = ["USA", "Japan", "Nepal", "Other"] as const;


export const staffAddSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(1, "location is required"),
  phone: z.string().min(1, "phone is required"),
  password: z.string().min(1, "password is required"),
});

export type StaffAddFormValues = z.infer<typeof staffAddSchema>;
export { STAFF_LOCATIONS };
