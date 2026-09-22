import { z } from "zod";

export type ForgotPasswordStep =
  | "email"
  | "otp"
  | "reset";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const verifyResetCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "OTP is required")
    .regex(
      /^\d{6}$/,
      "OTP must contain exactly 6 digits",
    ),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(
        8,
        "Password must be at least 8 characters",
      ),

    confirm_password: z
      .string()
      .min(
        1,
        "Confirm password is required",
      ),
  })
  .refine(
    (values) =>
      values.password ===
      values.confirm_password,
    {
      path: ["confirm_password"],
      message: "Passwords do not match",
    },
  );

export type ForgotPasswordFormValues =
  z.infer<typeof forgotPasswordSchema>;

export type VerifyResetCodeFormValues =
  z.infer<typeof verifyResetCodeSchema>;

export type ResetPasswordFormValues =
  z.infer<typeof resetPasswordSchema>;

export type ForgotPasswordResponse = {
  status: string;
  message: string;
};

export type VerifyResetCodeResponse = {
  status: string;
  message: string;
  reset_token: string;
};

export type ResetPasswordResponse = {
  status: string;
  message: string;
};
