"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import {
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  GENDER,
  NATIONALITIES,
  JAPANESE_LEVELS,
  PREFECTURE_OPTIONS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from "@/components/constant";

import { useClientFormHook } from "./hook";
import type { ClientFormProps } from "./type";

// =================================================
// DESIGN TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16,122,100,0.09)";
const PAGE_BG = "#F4F6F5";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const BORDER = "rgba(17,24,39,0.09)";
const INK = "#111827";
const MUTED = "#6B7280";

const WARNING = "#B45309";
const WARNING_DARK = "#92400E";
const WARNING_SOFT = "#FFFBEB";

const cardSx = {
  p: { xs: 1.75, sm: 2.25, md: 2.5 },
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  bgcolor: SURFACE,
  boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
};

const fieldSx = {
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: SURFACE,
    "& fieldset": {
      borderColor: BORDER,
    },
    "&:hover fieldset": {
      borderColor: "rgba(16,122,100,0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND,
    },
  },
  "& .MuiFormHelperText-root": {
    mx: 0.5,
    mt: 0.5,
    fontSize: 11.5,
  },
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
  gap: 1.5,
};

const grid2Sx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
  },
  gap: 1.5,
};

const outlineButtonSx = {
  alignSelf: "flex-start",
  minHeight: 34,
  px: 1.5,
  color: BRAND,
  borderColor: "rgba(16,122,100,0.35)",
  bgcolor: SURFACE,
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    borderColor: BRAND,
    bgcolor: BRAND_SOFT,
  },
} as const;

const dateProps = {
  type: "date",
  slotProps: {
    inputLabel: {
      shrink: true,
    },
  },
} as const;

// =================================================
// AUTOCOMPLETE
// =================================================

type FormOption = {
  value: string;
  label: string;
};

type FormAutocompleteProps = {
  label: string;
  value?: string | null;
  options: FormOption[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  noOptionsText?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: ReactNode;
};

const FormAutocomplete = ({
  label,
  value = "",
  options,
  onChange,
  onBlur,
  placeholder,
  noOptionsText,
  required = false,
  disabled = false,
  error = false,
  helperText,
}: FormAutocompleteProps) => {
  const t = useTranslations("clientForm");

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      clearOnEscape
      disabled={disabled}
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) =>
        option.value === selected.value
      }
      onChange={(_event, option) => {
        onChange(option?.value ?? "");
      }}
      onBlur={onBlur}
      noOptionsText={noOptionsText ?? t("noOptionsText")}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.value}
          sx={{
            fontSize: 14,
          }}
        >
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          size="small"
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          sx={fieldSx}
        />
      )}
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          bgcolor: SURFACE,
        },
      }}
    />
  );
};

// =================================================
// FILE URL
// =================================================

const getUploadedFileUrl = (filePath?: string | null) => {
  if (!filePath) {
    return "";
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

  const backendUrl = apiUrl.replace(/\/api\/?$/, "");

  const normalizedPath = filePath.replace(/\\/g, "/");

  return `${backendUrl}/${normalizedPath.replace(/^\/+/, "")}`;
};

// =================================================
// FORM SECTION
// =================================================

const FormSection = ({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Paper elevation={0} component="section" sx={cardSx}>
    <Box
      sx={{
        display: "flex",
        alignItems: description ? "flex-start" : "center",
        gap: 1.25,
        mb: 1.75,
      }}
    >
      <Box
        aria-hidden
        sx={{
          flexShrink: 0,
          width: 24,
          height: 24,
          mt: description ? 0.1 : 0,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          bgcolor: BRAND_SOFT,
          color: BRAND,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {step}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="h2"
          sx={{
            color: INK,
            fontSize: 15.5,
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              mt: 0.25,
              color: MUTED,
              fontSize: 12.5,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>

    {children}
  </Paper>
);

// =================================================
// REPEAT CARD
// =================================================

const RepeatCard = ({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) => (
  <RepeatCardContent title={title} onRemove={onRemove}>
    {children}
  </RepeatCardContent>
);

const RepeatCardContent = ({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) => {
  const t = useTranslations("clientForm");

  return (
    <Box
      sx={{
        position: "relative",
        p: { xs: 1.5, sm: 1.75 },
        pl: { xs: 2, sm: 2.25 },
        border: `1px solid ${BORDER}`,
        borderRadius: 2.5,
        bgcolor: SURFACE_ALT,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          bgcolor: BRAND,
          opacity: 0.7,
        },
      }}
    >
      <Box
        sx={{
          mb: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            color: INK,
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <IconButton
          type="button"
          size="small"
          aria-label={t("actions.removeItem", { item: title })}
          onClick={onRemove}
          sx={{
            color: MUTED,
            "&:hover": {
              color: "#B91C1C",
              bgcolor: "#FEF2F2",
            },
          }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {children}
    </Box>
  );
};

// =================================================
// STACK
// =================================================

const Stack = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
    }}
  >
    {children}
  </Box>
);

// =================================================
// UPLOAD CARD
// =================================================

const UploadCard = ({
  title,
  buttonLabel,
  accept,
  statusText,
  onSelect,
  preview,
}: {
  title: string;
  buttonLabel: string;
  accept: string;
  statusText: string;
  onSelect: (file: File) => void;
  preview: ReactNode;
}) => (
  <Box
    sx={{
      p: 1.5,
      display: "flex",
      alignItems: "center",
      gap: 1.75,
      border: `1px solid ${BORDER}`,
      borderRadius: 2.5,
      bgcolor: SURFACE_ALT,
    }}
  >
    {preview}

    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        sx={{
          color: INK,
          fontSize: 13.5,
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.25,
          mb: 1,
          color: MUTED,
          fontSize: 12,
          lineHeight: 1.45,
          wordBreak: "break-word",
        }}
      >
        {statusText}
      </Typography>

      <Button
        component="label"
        variant="outlined"
        size="small"
        startIcon={<UploadFileOutlinedIcon />}
        sx={outlineButtonSx}
      >
        {buttonLabel}

        <input
          hidden
          type="file"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              onSelect(file);
            }
          }}
        />
      </Button>
    </Box>
  </Box>
);

// =================================================
// CLIENT FORM
// =================================================

const ClientForm = ({ clientId }: ClientFormProps) => {
  const t = useTranslations("clientForm");
  const createT = useTranslations("createClient");

  const {
    isEditMode,
    role,
    user,

    control,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,

    onSubmit,

    client,

    existingClientImage,
    existingCv,

    registrationStage,
    registrationAmount,
    registrationConfigError,
    isStageLoading,

    staffOptions,
    isStaffLoading,

    isLoading,
    isSaving,
    submitError,

    handleCancel,
  } = useClientFormHook(clientId);

  // =================================================
  // ARRAYS
  // =================================================

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control,
    name: "qualifications",
  });

  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control,
    name: "employmentHistory",
  });

  // =================================================
  // WATCH
  // =================================================

  const selectedClientImage = watch("clientImage");
  const selectedCv = watch("cv");
  const paymentMethod = watch("paymentMethod");

  // =================================================
  // PHOTO PREVIEW
  // =================================================

  const photoPreviewUrl = useMemo(() => {
    if (selectedClientImage instanceof File) {
      return URL.createObjectURL(selectedClientImage);
    }

    return "";
  }, [selectedClientImage]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const existingPhotoUrl =
    typeof existingClientImage === "string"
      ? getUploadedFileUrl(existingClientImage)
      : "";

  const photoSrc = photoPreviewUrl || existingPhotoUrl;

  // =================================================
  // OPTIONS
  // =================================================

  const visaOptions = CURRENT_VISA_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: createT(`options.currentVisaStatus.${option.key}` as never),
  }));

  const categoryOptions = PREFER_CATEGORY_OPTIONS.map((option) => ({
    value: option.value,
    label: createT(`options.preferCategory.${option.key}` as never),
  }));

  const genderOptions = GENDER.map((option) => ({
    value: option.value,
    label: createT(`options.gender.${option.key}` as never),
  }));

  const nationalityOptions = NATIONALITIES.map((option) => ({
    value: option.value,
    label: createT(`options.nationality.${option.key}` as never),
  }));

  const prefectureOptions = PREFECTURE_OPTIONS.map((option) => ({
    value: option.value,
    label: createT(`options.prefecture.${option.key}` as never),
  }));

  const japaneseOptions = JAPANESE_LEVELS.map((option) => ({
    value: option.value,
    label: createT(`options.japaneseLanguageLevel.${option.key}` as never),
  }));

  const educationTypeOptions = EDUCATION_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: createT(`options.educationType.${option.key}` as never),
  }));

  const employmentTypeOptions = EMPLOYMENT_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: createT(`options.employmentType.${option.key}` as never),
  }));

  const assignedStaffOptions = staffOptions.map((staff) => ({
    value: staff.staffId,
    label: `${staff.name} (${staff.staffId})`,
  }));

  const paymentMethodOptions = [
    {
      value: "Bank Transfer",
      label: t("paymentMethods.bankTransfer"),
    },
    {
      value: "Cash",
      label: t("paymentMethods.cash"),
    },
  ];

  const graduationStatusOptions = [
    {
      value: "graduated",
      label: t("graduationStatus.graduated"),
    },
    {
      value: "expectedGraduation",
      label: t("graduationStatus.expectedGraduation"),
    },
    {
      value: "currentlyEnrolled",
      label: t("graduationStatus.currentlyEnrolled"),
    },
    {
      value: "withdrawn",
      label: t("graduationStatus.withdrawn"),
    },
  ];

  // Create has one extra registration payment section.
  const offset = isEditMode ? 0 : 1;

  // =================================================
  // LOADING
  // =================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }

  // =================================================
  // PAGE
  // =================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PAGE_BG,
        px: { xs: 1.5, sm: 3, md: 4 },
        pt: { xs: 1.5, md: 2 },
        pb: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
        }}
      >
        {/* BREADCRUMB */}

        <Box sx={{ mb: 1.5 }}>
          <Breadcrumb
            items={[
              {
                label: t("breadcrumbs.dashboard"),
                href: "/admin/dashboard",
              },
              {
                label: t("breadcrumbs.clients"),
                href: "/admin/client",
              },
              {
                label: isEditMode
                  ? t("breadcrumbs.edit")
                  : t("breadcrumbs.create"),
                current: true,
              },
            ]}
          />
        </Box>

        {/* HEADER */}

        <Box sx={{ mb: 2 }}>
          <Typography
            component="h1"
            sx={{
              color: INK,
              fontSize: { xs: 21, md: 26 },
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {isEditMode ? t("header.editTitle") : t("header.createTitle")}
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              color: MUTED,
              fontSize: 13,
            }}
          >
            {isEditMode
              ? t("header.editDescription")
              : t("header.createDescription")}
          </Typography>
        </Box>

        {/* ERRORS */}

        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              borderRadius: 2,
            }}
          >
            {submitError}
          </Alert>
        )}

        {!isEditMode && registrationConfigError && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              borderRadius: 2,
            }}
          >
            {registrationConfigError}
          </Alert>
        )}

        {/* FORM */}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* =================================================
          1 BASIC INFORMATION
          ================================================= */}

          <FormSection step={1} title={t("sections.basic.title")}>
            {" "}
            <Box sx={gridSx}>
              <TextField
                {...register("fullName")}
                label={t("fields.fullName")}
                required
                size="small"
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                sx={fieldSx}
              />

              <TextField
                {...register("furigana")}
                label={t("fields.furigana")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("phone")}
                label={t("fields.phone")}
                required
                size="small"
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                sx={fieldSx}
              />

              <TextField
                {...register("email")}
                label={t("fields.email")}
                size="small"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                sx={fieldSx}
              />

              <TextField
                {...register("dateOfBirth")}
                {...dateProps}
                label={t("fields.dateOfBirth")}
                size="small"
                sx={fieldSx}
              />

              {/* GENDER AUTOCOMPLETE */}

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.gender")}
                    value={field.value}
                    options={genderOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.gender")}
                  />
                )}
              />

              {/* NATIONALITY AUTOCOMPLETE */}

              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.nationality")}
                    value={field.value}
                    options={nationalityOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.nationality")}
                  />
                )}
              />
            </Box>
          </FormSection>

          {/* =================================================
          2 ADDRESS
          ================================================= */}

          <FormSection step={2} title={t("sections.address.title")}>
            <Box sx={gridSx}>
              <TextField
                {...register("postalCode")}
                label={t("fields.postalCode")}
                size="small"
                sx={fieldSx}
              />

              {/* PREFECTURE AUTOCOMPLETE */}

              <Controller
                name="prefecture"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.prefecture")}
                    value={field.value}
                    options={prefectureOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
placeholder={t("placeholders.prefecture")}
                  />
                )}
              />

              <TextField
                {...register("address")}
                label={t("fields.address")}
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          3 IMMIGRATION
          ================================================= */}

          <FormSection step={3} title={t("sections.immigration.title")}>
            <Box sx={gridSx}>
              {/* VISA AUTOCOMPLETE */}

              <Controller
                name="currentVisaStatus"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    required
                    label={t("fields.currentVisaStatus")}
                    value={field.value}
                    options={visaOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.currentVisaStatus")}
                    error={Boolean(errors.currentVisaStatus)}
                    helperText={errors.currentVisaStatus?.message}
                  />
                )}
              />

              <TextField
                {...register("residenceExpiryDate")}
                {...dateProps}
                label={t("fields.residenceExpiryDate")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("passportNumber")}
                label={t("fields.passportNumber")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("passportExpiryDate")}
                {...dateProps}
                label={t("fields.passportExpiryDate")}
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          4 RECRUITMENT
          ================================================= */}

          <FormSection
            step={4}
            title={t("sections.recruitment.title")}
            description={
              isEditMode
                ? t("sections.recruitment.editDescription")
                : t("sections.recruitment.createDescription")
            }
          >
            <Box sx={gridSx}>
              {/* CATEGORY AUTOCOMPLETE */}

              <Controller
                name="preferCategory"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.preferCategory")}
                    value={field.value}
                    options={categoryOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.preferCategory")}
                  />
                )}
              />

              {/* STAFF AUTOCOMPLETE */}

              {role === "superadmin" ? (
                <Controller
                  name="assignedStaff"
                  control={control}
                  render={({ field }) => (
                    <FormAutocomplete
                      required
                      label={t("fields.assignedStaff")}
                      value={field.value}
                      options={assignedStaffOptions}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isStaffLoading}
                      placeholder={t("placeholders.assignedStaff")}
                      error={Boolean(errors.assignedStaff)}
                      helperText={errors.assignedStaff?.message}
                    />
                  )}
                />
              ) : (
                <TextField
                  label={t("fields.assignedStaff")}
                  value={user?.staffId || t("assignedStaff.autoAssigned")}
                  disabled
                  size="small"
                  sx={fieldSx}
                />
              )}

              <TextField
                {...register("intake")}
                label={t("fields.intake")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                label={t("fields.currentStage")}
                value={
                  isEditMode
                    ? client?.currentStageDetails?.name ||
                      client?.clientStatus ||
                      client?.currentStage ||
                      "-"
                    : registrationStage?.name || t("registrationStageFallback")
                }
                disabled
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          5 REGISTRATION PAYMENT
          ================================================= */}

          {!isEditMode && (
            <FormSection
              step={5}
              title={t("sections.registrationPayment.title")}
              description={t("sections.registrationPayment.description")}
            >
              {isStageLoading ? (
                <Box
                  sx={{
                    py: 2,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress
                    size={22}
                    sx={{
                      color: BRAND,
                    }}
                  />
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      mb: 1.5,
                      px: 1.75,
                      py: 1.25,
                      border: "1px solid rgba(180,83,9,0.2)",
                      borderRadius: 2.5,
                      bgcolor: WARNING_SOFT,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: WARNING,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {t("registrationPayment.fullPaymentRequired")}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.2,
                          color: INK,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {registrationStage?.name || t("registrationStageFallback")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          color: MUTED,
                          fontSize: 11.5,
                        }}
                      >
                        {t("registrationPayment.registrationFee")}
                      </Typography>

                      <Typography
                        sx={{
                          color: WARNING,
                          fontSize: { xs: 20, sm: 22 },
                          fontWeight: 800,
                          lineHeight: 1.2,
                        }}
                      >
                        ¥{registrationAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Alert
                    severity="info"
                    sx={{
                      mb: 1.5,
                      py: 0,
                      borderRadius: 2,
                      fontSize: 13,
                    }}
                  >
                    {t("registrationPayment.stageMasterNote")}
                  </Alert>

                  <Box sx={gridSx}>
                    {/* PAYMENT METHOD AUTOCOMPLETE */}

                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <FormAutocomplete
                          required
                          label={t("fields.paymentMethod")}
                          value={field.value}
                          options={paymentMethodOptions}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t("placeholders.paymentMethod")}
                          error={Boolean(errors.paymentMethod)}
                          helperText={errors.paymentMethod?.message}
                        />
                      )}
                    />

                    <TextField
                      {...register("paymentDate")}
                      {...dateProps}
                      required
                      label={t("fields.paymentDate")}
                      size="small"
                      error={Boolean(errors.paymentDate)}
                      helperText={errors.paymentDate?.message}
                      sx={fieldSx}
                    />

                    {paymentMethod === "Bank Transfer" && (
                      <>
                        <TextField
                          {...register("bankName")}
                          label={t("fields.bankName")}
                          size="small"
                          sx={fieldSx}
                        />

                        <TextField
                          {...register("referenceNumber")}
                          label={t("fields.referenceNumber")}
                          size="small"
                          sx={fieldSx}
                        />
                      </>
                    )}

                    <TextField
                      {...register("receiptNumber")}
                      label={t("fields.receiptNumber")}
                      size="small"
                      sx={fieldSx}
                    />
                  </Box>

                  <TextField
                    {...register("paymentNote")}
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label={t("fields.paymentNote")}
                    sx={{
                      ...fieldSx,
                      mt: 1.5,
                    }}
                  />
                </>
              )}
            </FormSection>
          )}

          {/* =================================================
          EDUCATION
          ================================================= */}

          <FormSection step={5 + offset} title={t("sections.education.title")}>
            <Stack>
              {educationFields.map((item, index) => (
                <RepeatCard
                  key={item.id}
                  title={t("education.itemTitle", { number: index + 1 })}
                  onRemove={() => removeEducation(index)}
                >
                  <Box sx={gridSx}>
                    {/* EDUCATION TYPE AUTOCOMPLETE */}

                    <Controller
                      name={`education.${index}.educationType`}
                      control={control}
                      render={({ field }) => (
                        <FormAutocomplete
                          label={t("fields.educationType")}
                          value={field.value}
                          options={educationTypeOptions}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t("placeholders.educationType")}
                        />
                      )}
                    />

                    <TextField
                      {...register(`education.${index}.schoolName`)}
                      label={t("fields.schoolName")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.major`)}
                      label={t("fields.major")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.enrollmentDate`)}
                      {...dateProps}
                      label={t("fields.enrollmentDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.graduationDate`)}
                      {...dateProps}
                      label={t("fields.graduationDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    {/* GRADUATION STATUS AUTOCOMPLETE */}

                    <Controller
                      name={`education.${index}.graduationStatus`}
                      control={control}
                      render={({ field }) => (
                        <FormAutocomplete
                          label={t("fields.graduationStatus")}
                          value={field.value}
                          options={graduationStatusOptions}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t("placeholders.graduationStatus")}
                        />
                      )}
                    />
                  </Box>
                </RepeatCard>
              ))}

              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() =>
                  appendEducation({
                    schoolName: "",
                    educationType: "",
                    enrollmentDate: "",
                    graduationDate: "",
                    graduationStatus: "",
                    major: "",
                  })
                }
                sx={outlineButtonSx}
              >
                {t("education.add")}
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          JAPANESE & QUALIFICATIONS
          ================================================= */}

          <FormSection
            step={6 + offset}
            title={t("sections.qualifications.title")}
          >
            <Stack>
              {/* JAPANESE LEVEL AUTOCOMPLETE */}

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: 320,
                  },
                }}
              >
                <Controller
                  name="japaneseLanguageLevel"
                  control={control}
                  render={({ field }) => (
                    <FormAutocomplete
                      label={t("fields.japaneseLanguageLevel")}
                      value={field.value}
                      options={japaneseOptions}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder={t("placeholders.japaneseLanguageLevel")}
                    />
                  )}
                />
              </Box>

              {qualificationFields.map((item, index) => (
                <RepeatCard
                  key={item.id}
                  title={t("qualifications.itemTitle", { number: index + 1 })}
                  onRemove={() => removeQualification(index)}
                >
                  <Box sx={gridSx}>
                    <TextField
                      {...register(`qualifications.${index}.name`)}
                      label={t("fields.qualificationName")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.levelOrScore`)}
                      label={t("fields.levelOrScore")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.issuer`)}
                      label={t("fields.issuer")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.acquiredDate`)}
                      {...dateProps}
                      label={t("fields.acquiredDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.expiryDate`)}
                      {...dateProps}
                      label={t("fields.expiryDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.note`)}
                      label={t("fields.note")}
                      size="small"
                      sx={fieldSx}
                    />
                  </Box>
                </RepeatCard>
              ))}

              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() =>
                  appendQualification({
                    name: "",
                    levelOrScore: "",
                    acquiredDate: "",
                    expiryDate: "",
                    issuer: "",
                    note: "",
                  })
                }
                sx={outlineButtonSx}
              >
                {t("qualifications.add")}
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          EMPLOYMENT HISTORY
          ================================================= */}

          <FormSection step={7 + offset} title={t("sections.employment.title")}>
            <Stack>
              {employmentFields.map((item, index) => {
                const isCurrent = watch(`employmentHistory.${index}.isCurrent`);

                return (
                  <RepeatCard
                    key={item.id}
                    title={t("employment.itemTitle", { number: index + 1 })}
                    onRemove={() => removeEmployment(index)}
                  >
                    <Box sx={gridSx}>
                      <TextField
                        {...register(`employmentHistory.${index}.companyName`)}
                        label={t("fields.companyName")}
                        size="small"
                        sx={fieldSx}
                      />

                      {/* EMPLOYMENT TYPE AUTOCOMPLETE */}

                      <Controller
                        name={`employmentHistory.${index}.employmentType`}
                        control={control}
                        render={({ field }) => (
                          <FormAutocomplete
                            label={t("fields.employmentType")}
                            value={field.value}
                            options={employmentTypeOptions}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={t("placeholders.employmentType")}
                          />
                        )}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.department`)}
                        label={t("fields.department")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.jobTitle`)}
                        label={t("fields.jobTitle")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.workLocation`)}
                        label={t("fields.workLocation")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.startDate`)}
                        {...dateProps}
                        label={t("fields.startDate")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.endDate`)}
                        {...dateProps}
                        label={t("fields.endDate")}
                        disabled={isCurrent}
                        size="small"
                        sx={fieldSx}
                      />

                      <Controller
                        name={`employmentHistory.${index}.isCurrent`}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            sx={{
                              m: 0,
                              "& .MuiFormControlLabel-label": {
                                fontSize: 13.5,
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                checked={Boolean(field.value)}
                                onChange={(event) => {
                                  field.onChange(event.target.checked);

                                  if (event.target.checked) {
                                    setValue(
                                      `employmentHistory.${index}.endDate`,
                                      "",
                                    );
                                  }
                                }}
                                sx={{
                                  color: BRAND,
                                  "&.Mui-checked": {
                                    color: BRAND,
                                  },
                                }}
                              />
                            }
                            label={t("fields.currentlyEmployed")}
                          />
                        )}
                      />
                    </Box>

                    <Box
                      sx={{
                        ...grid2Sx,
                        mt: 1.5,
                      }}
                    >
                      <TextField
                        {...register(
                          `employmentHistory.${index}.responsibilities`,
                        )}
                        label={t("fields.responsibilities")}
                        multiline
                        minRows={3}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.achievements`)}
                        label={t("fields.achievements")}
                        multiline
                        minRows={3}
                        size="small"
                        sx={fieldSx}
                      />
                    </Box>
                  </RepeatCard>
                );
              })}

              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() =>
                  appendEmployment({
                    companyName: "",
                    employmentType: "",
                    department: "",
                    jobTitle: "",
                    workLocation: "",
                    startDate: "",
                    endDate: "",
                    isCurrent: false,
                    responsibilities: "",
                    achievements: "",
                  })
                }
                sx={outlineButtonSx}
              >
                {t("employment.add")}
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          SKILLS
          ================================================= */}

          <FormSection step={8 + offset} title={t("sections.skills.title")}>
            <Box sx={grid2Sx}>
              <TextField
                {...register("skillsText")}
                label={t("fields.skills")}
                multiline
                minRows={3}
                size="small"
                helperText={t("fields.skillsHelper")}
                sx={fieldSx}
              />

              <TextField
                {...register("careerSummary")}
                label={t("fields.careerSummary")}
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          JAPANESE APPLICATION
          ================================================= */}

          <FormSection step={9 + offset} title={t("sections.application.title")}>
            <Stack>
              <TextField
                {...register("motivation")}
                label={t("fields.motivation")}
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("selfPR")}
                label={t("fields.selfPR")}
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("desiredConditions")}
                label={t("fields.desiredConditions")}
                multiline
                minRows={2}
                size="small"
                sx={fieldSx}
              />
            </Stack>
          </FormSection>

          {/* =================================================
          DOCUMENTS
          ================================================= */}

          <FormSection step={10 + offset} title={t("sections.documents.title")}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <UploadCard
                title={t("documents.photo.title")}
                buttonLabel={
                  photoSrc
                    ? t("documents.photo.replace")
                    : t("documents.photo.select")
                }
                accept="image/*"
                statusText={
                  selectedClientImage instanceof File
                    ? selectedClientImage.name
                    : existingClientImage
                      ? t("documents.photo.existing")
                      : t("documents.photo.empty")
                }
                onSelect={(file) =>
                  setValue("clientImage", file, {
                    shouldDirty: true,
                  })
                }
                preview={
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 72,
                      aspectRatio: "3 / 4",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${BORDER}`,
                      bgcolor: BRAND_SOFT,
                      color: BRAND,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {photoSrc ? (
                      <Box
                        component="img"
                        src={photoSrc}
                        alt={t("documents.photo.previewAlt")}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center top",
                          display: "block",
                        }}
                      />
                    ) : (
                      <PersonOutlineRoundedIcon />
                    )}
                  </Box>
                }
              />

              <UploadCard
                title={t("documents.cv.title")}
                buttonLabel={
                  selectedCv instanceof File || existingCv
                    ? t("documents.cv.replace")
                    : t("documents.cv.select")
                }
                accept=".pdf"
                statusText={
                  selectedCv instanceof File
                    ? selectedCv.name
                    : existingCv
                      ? t("documents.cv.existing")
                      : t("documents.cv.empty")
                }
                onSelect={(file) =>
                  setValue("cv", file, {
                    shouldDirty: true,
                  })
                }
                preview={
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 72,
                      height: 96,
                      borderRadius: 2,
                      border: `1px solid ${BORDER}`,
                      bgcolor: BRAND_SOFT,
                      color: BRAND,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <DescriptionOutlinedIcon />
                  </Box>
                }
              />
            </Box>
          </FormSection>

          {/* =================================================
          ACTION BAR
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              p: { xs: 1.25, sm: 1.5 },
              position: "sticky",
              bottom: 12,
              zIndex: 5,
              bgcolor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 28px -12px rgba(17,24,39,0.28)",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              "& > button": {
                minHeight: 42,
                px: 2.25,
                textTransform: "none",
                fontWeight: 600,
              },
            }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={isSaving}
              onClick={handleCancel}
              sx={{
                flexShrink: 0,
                borderColor: BORDER,
                color: MUTED,
                bgcolor: SURFACE,
                "&:hover": {
                  borderColor: MUTED,
                  bgcolor: SURFACE,
                },
              }}
            >
              {t("actions.cancel")}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={
                isSaving ||
                (!isEditMode &&
                  (isStageLoading || Boolean(registrationConfigError)))
              }
              startIcon={
                isSaving ? (
                  <CircularProgress size={15} color="inherit" />
                ) : isEditMode ? (
                  <SaveOutlinedIcon />
                ) : (
                  <PaymentsOutlinedIcon />
                )
              }
              sx={{
                flex: {
                  xs: 1,
                  sm: "0 1 auto",
                },
                bgcolor: isEditMode ? BRAND : WARNING,
                color: "#ffffff",
                fontWeight: 700,
                lineHeight: 1.25,
                "&:hover": {
                  bgcolor: isEditMode ? BRAND_HOVER : WARNING_DARK,
                },
              }}
            >
              {isSaving
                ? t("actions.processing")
                : isEditMode
                  ? t("actions.update")
                  : t("actions.confirmPaymentCreate", {
                      amount: registrationAmount.toLocaleString(),
                    })}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientForm;
