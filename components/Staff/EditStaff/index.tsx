"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useEditStaffHook } from "./hook";
import {
  STAFF_LOCATIONS,
  createStaffEditSchema,
  type StaffEditFormValues,
} from "./types";

// =================================================
// THEME TOKENS (matches Add Staff / dashboards / sidebar)
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

const defaultValues: StaffEditFormValues = {
  name: "",
  phone: "",
  location: "",
  email: "",
};

export default function EditStaff() {
  const t = useTranslations("editStaff");
  const { staff, isLoading, isError, errorMessage, updateStaff } =
    useEditStaffHook();
  const staffEditSchema = useMemo(
    () =>
      createStaffEditSchema({
        nameRequired: t("validation.nameRequired"),
        emailInvalid: t("validation.emailInvalid"),
        locationRequired: t("validation.locationRequired"),
        phoneRequired: t("validation.phoneRequired"),
      }),
    [t],
  );

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffEditFormValues>({
    resolver: zodResolver(staffEditSchema),
    defaultValues,
  });

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name ?? "",
        phone: staff.phone ?? "",
        location: staff.location ?? "",
        email: staff.email ?? "",
      });
    }
  }, [reset, staff]);

  const onSubmit = (values: StaffEditFormValues) => {
    updateStaff.mutate(values);
  };

  if (isLoading) {
    return <StatusScreen message={t("loading")} loading />;
  }

  if (isError || !staff) {
    return (
      <StatusScreen
        message={errorMessage || t("notFound")}
      />
    );
  }

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
            <EditOutlinedIcon fontSize="small" />
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
            <FormInput
              id="name"
              label={t("fields.name.label")}
              register={register("name")}
              error={errors.name?.message}
              placeholder={t("fields.name.placeholder")}
              autoFocus
            />

            <FormInput
              id="phone"
              label={t("fields.phone.label")}
              type="tel"
              register={register("phone")}
              error={errors.phone?.message}
              placeholder={t("fields.phone.placeholder")}
            />

            <FormInput
              id="email"
              label={t("fields.email.label")}
              type="email"
              register={register("email")}
              error={errors.email?.message}
              placeholder={t("fields.email.placeholder")}
            />

            {/* Location */}
            <Box>
              <FieldLabel htmlFor="location">
                {t("fields.location.label")}
              </FieldLabel>

              <Select
                {...register("location")}
                id="location"
                fullWidth
                displayEmpty
                error={Boolean(errors.location)}
                defaultValue=""
                sx={fieldInputSx}
              >
                <MenuItem value="" disabled>
                  {t("fields.location.placeholder")}
                </MenuItem>

                {STAFF_LOCATIONS.map((location) => (
                  <MenuItem key={location} value={location}>
                    {t(`locations.${location}`)}
                  </MenuItem>
                ))}
              </Select>

              <ErrorMessage message={errors.location?.message} />
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
                disabled={updateStaff.isPending}
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
                {updateStaff.isPending ? t("saving") : t("saveChanges")}
              </Button>
            </Box>
          </Box>

          {updateStaff.isError && (
            <Typography
              role="alert"
              sx={{ mt: 2, fontSize: 13, color: "#DC2626" }}
            >
              {getErrorMessage(updateStaff.error, t("updateError"))}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

// =================================================
// FIELD PRIMITIVES
// =================================================

type FormInputProps = {
  id: keyof StaffEditFormValues;
  label: string;
  type?: "text" | "tel" | "email" | "password";
  register: ReturnType<
    ReturnType<typeof useForm<StaffEditFormValues>>["register"]
  >;
  error?: string;
  placeholder: string;
  autoFocus?: boolean;
  autoComplete?: string;
};

function FormInput({
  id,
  label,
  type = "text",
  register,
  error,
  placeholder,
  autoFocus,
  autoComplete,
}: FormInputProps) {
  return (
    <Box>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <OutlinedInput
        {...register}
        id={id}
        type={type}
        fullWidth
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={Boolean(error)}
        aria-invalid={Boolean(error)}
        sx={fieldInputSx}
      />

      <ErrorMessage message={error} />
    </Box>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Typography component="label" htmlFor={htmlFor} sx={fieldLabelSx}>
      {children}
    </Typography>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  return message ? (
    <Typography role="alert" sx={fieldErrorSx}>
      {message}
    </Typography>
  ) : null;
}

// =================================================
// LOADING / ERROR STATE
// =================================================

function StatusScreen({
  message,
  loading,
}: {
  message: string;
  loading?: boolean;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#F7F8F6",

        display: "grid",

        placeItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        {loading && (
          <CircularProgress size={24} sx={{ color: BRAND, mb: 1.5 }} />
        )}

        <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
