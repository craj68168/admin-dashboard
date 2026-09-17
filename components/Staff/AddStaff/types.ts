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

type StaffAddValidationMessages = {
  nameRequired: string;
  emailInvalid: string;
  locationRequired: string;
  phoneRequired: string;
  passwordRequired: string;
  passwordMin: string;
};

const defaultValidationMessages: StaffAddValidationMessages = {
  nameRequired: "Name is required",
  emailInvalid: "Please enter a valid email address",
  locationRequired: "Location is required",
  phoneRequired: "Phone is required",
  passwordRequired: "Password is required",
  passwordMin: "Password must be at least 6 characters",
};

export const createStaffAddSchema = (
  messages: StaffAddValidationMessages = defaultValidationMessages,
) =>
  z.object({
    name: z.string().min(1, messages.nameRequired),
    email: z.string().email(messages.emailInvalid),
    location: z.string().min(1, messages.locationRequired),
    phone: z.string().min(1, messages.phoneRequired),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(6, messages.passwordMin),
  });

export const staffAddSchema = createStaffAddSchema();

export type StaffAddFormValues = z.infer<typeof staffAddSchema>;
export { STAFF_LOCATIONS };
