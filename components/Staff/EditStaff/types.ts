import { z } from "zod";

export const STAFF_LOCATIONS = ["USA", "Japan", "Nepal", "Other"] as const;

type StaffEditValidationMessages = {
  nameRequired: string;
  emailInvalid: string;
  locationRequired: string;
  phoneRequired: string;
};

const defaultValidationMessages: StaffEditValidationMessages = {
  nameRequired: "Name is required",
  emailInvalid: "Please enter a valid email address",
  locationRequired: "Location is required",
  phoneRequired: "Phone is required",
};

export const createStaffEditSchema = (
  messages: StaffEditValidationMessages = defaultValidationMessages,
) =>
  z.object({
    name: z.string().min(1, messages.nameRequired),
    email: z.string().email(messages.emailInvalid),
    location: z.string().min(1, messages.locationRequired),
    phone: z.string().min(1, messages.phoneRequired),
  });

export const staffEditSchema = createStaffEditSchema();

export type StaffEditFormValues = z.infer<typeof staffEditSchema>;

export type StaffEditRecord = {
  name?: string;
  email?: string;
  location?: string;
  phone?: string;
};
