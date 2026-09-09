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

import { LoginFormValues, loginSchema } from "./type";
import { useLoginHook } from "./hook";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { loginAsync, loading } = useLoginHook();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginAsync(data);
  };

  const submitting = isSubmitting || loading;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#EDEDED",
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 0, sm: 3, md: 0 },
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
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: { xs: 3, sm: 4 },
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
              mb: 3,
              textTransform: "uppercase",
            }}
          >
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Email */}
            <Box>
              <Typography
                component="label"
                htmlFor="email"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                Email
              </Typography>

              <OutlinedInput
                {...register("email")}
                id="email"
                type="email"
                fullWidth
                autoComplete="email"
                autoFocus
                placeholder="yamada@example.com"
                error={Boolean(errors.email)}
                aria-invalid={Boolean(errors.email)}
                sx={{
                  height: "40px",
                  backgroundColor: {
                    xs: "#EDEDED",
                    sm: "#fff",
                  },
                }}
              />

              {errors.email?.message && (
                <Typography
                  role="alert"
                  sx={{
                    mt: 0.5,
                    fontSize: "12px",
                    color: "error.main",
                  }}
                >
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* Password */}
            <Box>
              <Typography
                component="label"
                htmlFor="password"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                Password
              </Typography>

              <OutlinedInput
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                autoComplete="current-password"
                placeholder="**************"
                error={Boolean(errors.password)}
                aria-invalid={Boolean(errors.password)}
                sx={{
                  height: "40px",
                  backgroundColor: {
                    xs: "#EDEDED",
                    sm: "#fff",
                  },

                  "& .MuiOutlinedInput-input": {
                    minHeight: "21px",
                  },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((previous) => !previous)}
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

              {errors.password?.message && (
                <Typography
                  role="alert"
                  sx={{
                    mt: 0.5,
                    fontSize: "12px",
                    color: "error.main",
                  }}
                >
                  {errors.password.message}
                </Typography>
              )}
            </Box>

            {/* Actions */}
            <Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
                sx={{
                  mt: 1,
                  mb: 2,
                  height: "45px",
                }}
              >
                {submitting ? "Logging in..." : "Login"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Link
                  href="/forgot-password"
                  style={{
                    textDecoration: "underline",
                    fontWeight: 600,
                    color: "#06428A",
                  }}
                >
                  Forgot password
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
export default LoginComponent;
