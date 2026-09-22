"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useForgotPasswordHook } from "./hook";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyResetCodeSchema,
} from "./type";

import type {
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  VerifyResetCodeFormValues,
} from "./type";

const inputSx = {
  height: "40px",
  backgroundColor: {
    xs: "#EDEDED",
    sm: "#fff",
  },

  "& .MuiOutlinedInput-input": {
    minHeight: "21px",
  },
};

const fieldLabelSx = {
  display: "block",
  mb: 0.75,
  fontSize: "14px",
  fontWeight: 600,
  color: "#333",
};

const errorTextSx = {
  mt: 0.5,
  fontSize: "12px",
  color: "error.main",
};

export default function ForgotPassword() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    step,
    title,
    helperText,
    sendOtp,
    verifyOtp,
    resetPassword,
    isSendingOtp,
    isVerifyingOtp,
    isResettingPassword,
    handleBackToEmail,
  } = useForgotPasswordHook();

  const emailForm =
    useForm<ForgotPasswordFormValues>({
      resolver: zodResolver(
        forgotPasswordSchema,
      ),
      defaultValues: {
        email: "",
      },
    });

  const otpForm =
    useForm<VerifyResetCodeFormValues>({
      resolver: zodResolver(
        verifyResetCodeSchema,
      ),
      defaultValues: {
        code: "",
      },
    });

  const resetForm =
    useForm<ResetPasswordFormValues>({
      resolver: zodResolver(
        resetPasswordSchema,
      ),
      defaultValues: {
        password: "",
        confirm_password: "",
      },
    });

  const onEmailSubmit = async (
    values: ForgotPasswordFormValues,
  ) => {
    await sendOtp(values);
    otpForm.reset({
      code: "",
    });
  };

  const onOtpSubmit = async (
    values: VerifyResetCodeFormValues,
  ) => {
    await verifyOtp(values);
    resetForm.reset({
      password: "",
      confirm_password: "",
    });
  };

  const onResetSubmit = async (
    values: ResetPasswordFormValues,
  ) => {
    await resetPassword(values);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#EDEDED",
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        px: {
          xs: 0,
          sm: 3,
          md: 0,
        },
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          width: "100%",
          maxWidth: {
            xs: "100%",
            sm: "480px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Image
            src="/company_logo.png"
            alt="Logo"
            width={120}
            height={50}
            priority
            sizes="120px"
          />
        </Box>

        <Paper
          elevation={1}
          sx={{
            p: {
              xs: 2,
              sm: 5,
            },
            borderRadius: {
              xs: 0,
              sm: 3,
            },
            backgroundColor: {
              xs: "transparent",
              sm: "#fff",
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              textAlign: "center",
              fontSize: {
                xs: "18px",
                sm: "22px",
              },
              fontWeight: 700,
              mb: 1,
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "13px",
              color: "#555",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {helperText}
          </Typography>

          {step === "email" && (
            <Box
              component="form"
              onSubmit={emailForm.handleSubmit(
                onEmailSubmit,
              )}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  component="label"
                  htmlFor="email"
                  sx={fieldLabelSx}
                >
                  Email
                </Typography>

                <OutlinedInput
                  {...emailForm.register(
                    "email",
                  )}
                  id="email"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  autoFocus
                  placeholder="yamada@example.com"
                  error={Boolean(
                    emailForm.formState
                      .errors.email,
                  )}
                  aria-invalid={Boolean(
                    emailForm.formState
                      .errors.email,
                  )}
                  sx={inputSx}
                />

                {emailForm.formState.errors
                  .email?.message && (
                  <Typography
                    role="alert"
                    sx={errorTextSx}
                  >
                    {
                      emailForm.formState
                        .errors.email
                        .message
                    }
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={
                  isSendingOtp ||
                  emailForm.formState
                    .isSubmitting
                }
                sx={{
                  mt: 1,
                  height: "45px",
                }}
              >
                {isSendingOtp
                  ? "Sending..."
                  : "Send OTP"}
              </Button>
            </Box>
          )}

          {step === "otp" && (
            <Box
              component="form"
              onSubmit={otpForm.handleSubmit(
                onOtpSubmit,
              )}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  component="label"
                  htmlFor="code"
                  sx={fieldLabelSx}
                >
                  OTP
                </Typography>

                <OutlinedInput
                  {...otpForm.register(
                    "code",
                  )}
                  id="code"
                  type="text"
                  fullWidth
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="123456"
                  error={Boolean(
                    otpForm.formState
                      .errors.code,
                  )}
                  aria-invalid={Boolean(
                    otpForm.formState
                      .errors.code,
                  )}
                  inputProps={{
                    inputMode: "numeric",
                    maxLength: 6,
                  }}
                  sx={inputSx}
                />

                {otpForm.formState.errors
                  .code?.message && (
                  <Typography
                    role="alert"
                    sx={errorTextSx}
                  >
                    {
                      otpForm.formState
                        .errors.code.message
                    }
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={
                  isVerifyingOtp ||
                  otpForm.formState
                    .isSubmitting
                }
                sx={{
                  mt: 1,
                  height: "45px",
                }}
              >
                {isVerifyingOtp
                  ? "Verifying..."
                  : "Verify OTP"}
              </Button>

              <Button
                type="button"
                fullWidth
                variant="text"
                onClick={handleBackToEmail}
                disabled={isVerifyingOtp}
              >
                Change email
              </Button>
            </Box>
          )}

          {step === "reset" && (
            <Box
              component="form"
              onSubmit={resetForm.handleSubmit(
                onResetSubmit,
              )}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  component="label"
                  htmlFor="password"
                  sx={fieldLabelSx}
                >
                  New Password
                </Typography>

                <OutlinedInput
                  {...resetForm.register(
                    "password",
                  )}
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  fullWidth
                  autoComplete="new-password"
                  autoFocus
                  placeholder="********"
                  error={Boolean(
                    resetForm.formState
                      .errors.password,
                  )}
                  aria-invalid={Boolean(
                    resetForm.formState
                      .errors.password,
                  )}
                  sx={inputSx}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword(
                            (previous) =>
                              !previous,
                          )
                        }
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />

                {resetForm.formState.errors
                  .password?.message && (
                  <Typography
                    role="alert"
                    sx={errorTextSx}
                  >
                    {
                      resetForm.formState
                        .errors.password
                        .message
                    }
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  component="label"
                  htmlFor="confirm-password"
                  sx={fieldLabelSx}
                >
                  Confirm Password
                </Typography>

                <OutlinedInput
                  {...resetForm.register(
                    "confirm_password",
                  )}
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  fullWidth
                  autoComplete="new-password"
                  placeholder="********"
                  error={Boolean(
                    resetForm.formState
                      .errors.confirm_password,
                  )}
                  aria-invalid={Boolean(
                    resetForm.formState
                      .errors.confirm_password,
                  )}
                  sx={inputSx}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) =>
                              !previous,
                          )
                        }
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />

                {resetForm.formState.errors
                  .confirm_password
                  ?.message && (
                  <Typography
                    role="alert"
                    sx={errorTextSx}
                  >
                    {
                      resetForm.formState
                        .errors
                        .confirm_password
                        .message
                    }
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={
                  isResettingPassword ||
                  resetForm.formState
                    .isSubmitting
                }
                sx={{
                  mt: 1,
                  height: "45px",
                }}
              >
                {isResettingPassword
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>
            </Box>
          )}

          <Box
            sx={{
              textAlign: "center",
              mt: 2,
            }}
          >
            <Link
              href="/login"
              style={{
                textDecoration: "underline",
                fontWeight: 600,
                color: "#06428A",
              }}
            >
              Back to login
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
