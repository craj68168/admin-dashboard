import { z } from "zod";

export const STAFF_LOCATIONS = ["USA", "Japan", "Nepal", "Other"] as const;

export const staffEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().refine((value) => value === "" || value.length >= 6, {
    message: "Password must be at least 6 characters",
  }),
});

export type StaffEditFormValues = z.infer<typeof staffEditSchema>;

export type StaffEditRecord = {
  name?: string;
  email?: string;
  location?: string;
  phone?: string;
};
