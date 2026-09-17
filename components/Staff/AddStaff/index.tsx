"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStaffAddHook } from "./hook";
import {
  StaffAddFormValues,
  createStaffAddSchema,
  STAFF_LOCATIONS,
} from "./types";

// =================================================
// THEME TOKENS (matches dashboards / sidebar / staff list)
// =================================================

const BRAND = "#107A64";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  borderRadius: 3,

  border: "1px solid",

  borderColor: HAIRLINE,

  bgcolor: "#ffffff",

  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const fieldLabelSx = {
  display: "block",

  mb: 0.75,

  fontSize: 13,

  fontWeight: 600,

  color: INK,
};

const fieldInputSx = {
  height: 44,

  borderRadius: 2,

  bgcolor: "#ffffff",

  fontSize: 14,

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(17, 24, 39, 0.12)",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(16, 122, 100, 0.4)",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: BRAND,

    borderWidth: 1,
  },

  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#DC2626",
  },
};

const fieldErrorSx = {
  mt: 0.5,

  fontSize: 12,

  color: "#DC2626",
};

export default function AddStaff() {
  const t = useTranslations("addStaff");
  const { mutate, isPending } = useStaffAddHook();
  const staffAddSchema = useMemo(
    () =>
      createStaffAddSchema({
        nameRequired: t("validation.nameRequired"),
        emailInvalid: t("validation.emailInvalid"),
        locationRequired: t("validation.locationRequired"),
        phoneRequired: t("validation.phoneRequired"),
        passwordRequired: t("validation.passwordRequired"),
        passwordMin: t("validation.passwordMin"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffAddFormValues>({
    resolver: zodResolver(staffAddSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: StaffAddFormValues) => {
    mutate(data);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F8F6" }}>
      <Box
        component="main"
        sx={{
          maxWidth: 900,

          mx: "auto",

          px: { xs: 2, sm: 3, md: 4 },

          py: { xs: 3, md: 4 },
        }}
      >
        {/* BACK LINK */}

        <Box
          component="a"
          href="/admin/staff"
          sx={{
            display: "inline-flex",

            alignItems: "center",

            gap: 0.75,

            mb: 2.5,

            fontSize: 13,

            fontWeight: 600,

            color: INK_MUTED,

            textDecoration: "none",

            transition: "color 200ms ease",

            "&:hover": {
              color: BRAND,
            },
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
          {t("backToStaff")}
        </Box>

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 2,

            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "grid",

              placeItems: "center",

              flexShrink: 0,

              width: 48,

              height: 48,

              borderRadius: 2.5,

              bgcolor: "rgba(16, 122, 100, 0.08)",

              color: BRAND,
            }}
          >
            <PersonAddAlt1OutlinedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 26 },
                fontWeight: 600,
                letterSpacing: -0.4,
                color: INK,
              }}
            >
              {t("title")}
            </Typography>

            <Typography sx={{ mt: 0.5, fontSize: 14, color: INK_MUTED }}>
              {t("description")}
            </Typography>
          </Box>
        </Box>

        {/* FORM CARD */}

        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ ...softCard, p: { xs: 2.5, sm: 4 } }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },

              gap: { xs: 2, sm: 2.5 },
            }}
          >
            {/* Name */}
            <Box>
              <Typography component="label" htmlFor="name" sx={fieldLabelSx}>
                {t("fields.name.label")}
              </Typography>

              <OutlinedInput
                {...register("name")}
                id="name"
                type="text"
                fullWidth
                autoComplete="name"
                autoFocus
                placeholder={t("fields.name.placeholder")}
                error={Boolean(errors.name)}
                aria-invalid={Boolean(errors.name)}
                sx={fieldInputSx}
              />

              {errors.name?.message && (
                <Typography role="alert" sx={fieldErrorSx}>
                  {errors.name.message}
                </Typography>
              )}
            </Box>

            {/* Phone */}
            <Box>
              <Typography component="label" htmlFor="phone" sx={fieldLabelSx}>
                {t("fields.phone.label")}
              </Typography>

              <OutlinedInput
                {...register("phone")}
                id="phone"
                type="tel"
                fullWidth
                autoComplete="tel"
                placeholder={t("fields.phone.placeholder")}
                error={Boolean(errors.phone)}
                aria-invalid={Boolean(errors.phone)}
                sx={fieldInputSx}
              />

              {errors.phone?.message && (
                <Typography role="alert" sx={fieldErrorSx}>
                  {errors.phone.message}
                </Typography>
              )}
            </Box>

            {/* Location */}
            <Box>
              <Typography
                component="label"
                htmlFor="location"
                sx={fieldLabelSx}
              >
                {t("fields.location.label")}
              </Typography>

              <Select
                {...register("location")}
                id="location"
                fullWidth
                defaultValue=""
                displayEmpty
                error={Boolean(errors.location)}
                aria-invalid={Boolean(errors.location)}
                sx={fieldInputSx}
              >
                <MenuItem value="" disabled>
                  {t("fields.location.placeholder")}
                </MenuItem>

                {STAFF_LOCATIONS.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {t(`locations.${loc}`)}
                  </MenuItem>
                ))}
              </Select>

              {errors.location?.message && (
                <Typography role="alert" sx={fieldErrorSx}>
                  {errors.location.message}
                </Typography>
              )}
            </Box>

            {/* Email */}
            <Box>
              <Typography component="label" htmlFor="email" sx={fieldLabelSx}>
                {t("fields.email.label")}
              </Typography>

              <OutlinedInput
                {...register("email")}
                id="email"
                type="email"
                fullWidth
                autoComplete="email"
                placeholder={t("fields.email.placeholder")}
                error={Boolean(errors.email)}
                aria-invalid={Boolean(errors.email)}
                sx={fieldInputSx}
              />

              {errors.email?.message && (
                <Typography role="alert" sx={fieldErrorSx}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* Password */}
            <Box>
              <Typography
                component="label"
                htmlFor="password"
                sx={fieldLabelSx}
              >
                {t("fields.password.label")}
              </Typography>

              <OutlinedInput
                {...register("password")}
                id="password"
                type="password"
                fullWidth
                autoComplete="new-password"
                placeholder={t("fields.password.placeholder")}
                error={Boolean(errors.password)}
                aria-invalid={Boolean(errors.password)}
                sx={fieldInputSx}
              />

              {errors.password?.message && (
                <Typography role="alert" sx={fieldErrorSx}>
                  {errors.password.message}
                </Typography>
              )}
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",

                justifyContent: "flex-end",

                gridColumn: { xs: "auto", md: "1 / -1" },

                mt: 1,

                pt: 2,

                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={isPending}
                sx={{
                  height: 44,

                  px: 3.5,

                  borderRadius: 2.5,

                  textTransform: "none",

                  fontWeight: 600,

                  fontSize: 14,

                  bgcolor: BRAND,

                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: "#0C5F4F",

                    boxShadow: "none",
                  },

                  "&.Mui-disabled": {
                    bgcolor: "rgba(16, 122, 100, 0.35)",

                    color: "#ffffff",
                  },
                }}
              >
                {isPending ? t("saving") : t("save")}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
