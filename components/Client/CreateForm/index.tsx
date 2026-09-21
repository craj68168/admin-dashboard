"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
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
  "& .MuiInputLabel-root.Mui-focused": { color: BRAND },
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: SURFACE,
    "& fieldset": { borderColor: BORDER },
    "&:hover fieldset": { borderColor: "rgba(16,122,100,0.4)" },
    "&.Mui-focused fieldset": { borderColor: BRAND },
  },
  "& .MuiFormHelperText-root": { mx: 0.5, mt: 0.5, fontSize: 11.5 },
};

// Fields wrap to whatever fits, so no per-breakpoint column rules are needed.
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
  "&:hover": { borderColor: BRAND, bgcolor: BRAND_SOFT },
} as const;

const dateProps = {
  type: "date",
  slotProps: { inputLabel: { shrink: true } },
} as const;

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
// PRIMITIVES
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

const RepeatCard = ({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) => (
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
      <Typography sx={{ color: INK, fontSize: 13.5, fontWeight: 700 }}>
        {title}
      </Typography>

      <IconButton
        type="button"
        size="small"
        aria-label={`Remove ${title}`}
        onClick={onRemove}
        sx={{
          color: MUTED,
          "&:hover": { color: "#B91C1C", bgcolor: "#FEF2F2" },
        }}
      >
        <DeleteOutlineRoundedIcon fontSize="small" />
      </IconButton>
    </Box>

    {children}
  </Box>
);

const Stack = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {children}
  </Box>
);

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
      <Typography sx={{ color: INK, fontSize: 13.5, fontWeight: 700 }}>
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
  } = useFieldArray({ control, name: "education" });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({ control, name: "qualifications" });

  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({ control, name: "employmentHistory" });

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

  // Step numbers shift by one when the payment section is present
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
        <CircularProgress size={28} sx={{ color: BRAND }} />
      </Box>
    );
  }

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
      <Box sx={{ width: "100%", maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ mb: 1.5 }}>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/admin/client" },
              {
                label: isEditMode ? "Edit client" : "Register client",
                current: true,
              },
            ]}
          />
        </Box>

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
            {isEditMode ? "Edit client" : "Register new client"}
          </Typography>

          <Typography sx={{ mt: 0.4, color: MUTED, fontSize: 13 }}>
            {isEditMode
              ? "Update client and Japanese CV information."
              : "A new client becomes Registered / Paid only after the full registration payment is confirmed."}
          </Typography>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>
            {submitError}
          </Alert>
        )}

        {!isEditMode && registrationConfigError && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>
            {registrationConfigError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          {/* =================================================
          1 BASIC
          ================================================= */}

          <FormSection step={1} title="Basic information">
            <Box sx={gridSx}>
              <TextField
                {...register("fullName")}
                label="Full name"
                required
                size="small"
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                sx={fieldSx}
              />

              <TextField
                {...register("furigana")}
                label="Furigana / フリガナ"
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("phone")}
                label="Phone"
                required
                size="small"
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                sx={fieldSx}
              />

              <TextField
                {...register("email")}
                label="Email"
                size="small"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                sx={fieldSx}
              />

              <TextField
                {...register("dateOfBirth")}
                {...dateProps}
                label="Date of birth"
                size="small"
                sx={fieldSx}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Gender"
                    size="small"
                    sx={fieldSx}
                  >
                    <MenuItem value="">Select gender</MenuItem>

                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Nationality"
                    size="small"
                    sx={fieldSx}
                  >
                    <MenuItem value="">Select nationality</MenuItem>

                    {nationalityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>
          </FormSection>

          {/* =================================================
          2 ADDRESS
          ================================================= */}

          <FormSection step={2} title="Address">
            <Box sx={gridSx}>
              <TextField
                {...register("postalCode")}
                label="Postal code"
                size="small"
                sx={fieldSx}
              />

              <Controller
                name="prefecture"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Prefecture"
                    size="small"
                    sx={fieldSx}
                  >
                    <MenuItem value="">Select prefecture</MenuItem>

                    {prefectureOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                {...register("address")}
                label="Address"
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          3 IMMIGRATION
          ================================================= */}

          <FormSection step={3} title="Immigration & passport">
            <Box sx={gridSx}>
              <Controller
                name="currentVisaStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    label="Current visa status"
                    size="small"
                    error={Boolean(errors.currentVisaStatus)}
                    helperText={errors.currentVisaStatus?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">Select visa status</MenuItem>

                    {visaOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                {...register("residenceExpiryDate")}
                {...dateProps}
                label="Residence expiry date"
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("passportNumber")}
                label="Passport number"
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("passportExpiryDate")}
                {...dateProps}
                label="Passport expiry date"
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
            title="Recruitment information"
            description={
              isEditMode
                ? "Stage changes for existing clients are handled only through Progress."
                : "The initial stage is automatically Registered / Paid."
            }
          >
            <Box sx={gridSx}>
              <Controller
                name="preferCategory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Preferred category"
                    size="small"
                    sx={fieldSx}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {role === "superadmin" ? (
                <Controller
                  name="assignedStaff"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      required
                      label="Assigned staff"
                      size="small"
                      disabled={isStaffLoading}
                      error={Boolean(errors.assignedStaff)}
                      helperText={errors.assignedStaff?.message}
                      sx={fieldSx}
                    >
                      <MenuItem value="">Select staff</MenuItem>

                      {staffOptions.map((staff) => (
                        <MenuItem key={staff.staffId} value={staff.staffId}>
                          {staff.name} ({staff.staffId})
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              ) : (
                <TextField
                  label="Assigned staff"
                  value={user?.staffId || "Automatically assigned"}
                  disabled
                  size="small"
                  sx={fieldSx}
                />
              )}

              <TextField
                {...register("intake")}
                label="Intake"
                size="small"
                sx={fieldSx}
              />

              <TextField
                label="Current stage"
                value={
                  isEditMode
                    ? client?.currentStageDetails?.name ||
                      client?.clientStatus ||
                      client?.currentStage ||
                      "-"
                    : registrationStage?.name || "Registered / Paid"
                }
                disabled
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          5 REGISTRATION PAYMENT (CREATE ONLY)
          ================================================= */}

          {!isEditMode && (
            <FormSection
              step={5}
              title="Registration payment"
              description="The client is created only after the full registration fee is confirmed. Partial payment is not supported."
            >
              {isStageLoading ? (
                <Box sx={{ py: 2, display: "grid", placeItems: "center" }}>
                  <CircularProgress size={22} sx={{ color: BRAND }} />
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
                        Full payment required
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.2,
                          color: INK,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {registrationStage?.name || "Registered / Paid"}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography sx={{ color: MUTED, fontSize: 11.5 }}>
                        Registration fee
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
                    sx={{ mb: 1.5, py: 0, borderRadius: 2, fontSize: 13 }}
                  >
                    The amount is controlled by the Stage Master. It cannot be
                    changed from this form.
                  </Alert>

                  <Box sx={gridSx}>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          required
                          label="Payment method"
                          size="small"
                          error={Boolean(errors.paymentMethod)}
                          helperText={errors.paymentMethod?.message}
                          sx={fieldSx}
                        >
                          <MenuItem value="">Select payment method</MenuItem>

                          <MenuItem value="Bank Transfer">
                            Bank Transfer
                          </MenuItem>

                          <MenuItem value="Cash">Cash</MenuItem>
                        </TextField>
                      )}
                    />

                    <TextField
                      {...register("paymentDate")}
                      {...dateProps}
                      required
                      label="Payment date"
                      size="small"
                      error={Boolean(errors.paymentDate)}
                      helperText={errors.paymentDate?.message}
                      sx={fieldSx}
                    />

                    {paymentMethod === "Bank Transfer" && (
                      <>
                        <TextField
                          {...register("bankName")}
                          label="Bank name"
                          size="small"
                          sx={fieldSx}
                        />

                        <TextField
                          {...register("referenceNumber")}
                          label="Reference number"
                          size="small"
                          sx={fieldSx}
                        />
                      </>
                    )}

                    <TextField
                      {...register("receiptNumber")}
                      label="Receipt number"
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
                    label="Payment note"
                    sx={{ ...fieldSx, mt: 1.5 }}
                  />
                </>
              )}
            </FormSection>
          )}

          {/* =================================================
          EDUCATION
          ================================================= */}

          <FormSection step={5 + offset} title="Education">
            <Stack>
              {educationFields.map((item, index) => (
                <RepeatCard
                  key={item.id}
                  title={`Education ${index + 1}`}
                  onRemove={() => removeEducation(index)}
                >
                  <Box sx={gridSx}>
                    <Controller
                      name={`education.${index}.educationType`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="School type"
                          size="small"
                          sx={fieldSx}
                        >
                          <MenuItem value="">Select type</MenuItem>

                          {educationTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <TextField
                      {...register(`education.${index}.schoolName`)}
                      label="School name"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.major`)}
                      label="Major / course"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.enrollmentDate`)}
                      {...dateProps}
                      label="Enrollment date"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.graduationDate`)}
                      {...dateProps}
                      label="Graduation date"
                      size="small"
                      sx={fieldSx}
                    />

                    <Controller
                      name={`education.${index}.graduationStatus`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Graduation status"
                          size="small"
                          sx={fieldSx}
                        >
                          <MenuItem value="">Select status</MenuItem>

                          <MenuItem value="graduated">
                            Graduated / 卒業
                          </MenuItem>

                          <MenuItem value="expectedGraduation">
                            Expected Graduation / 卒業見込
                          </MenuItem>

                          <MenuItem value="currentlyEnrolled">
                            Currently Enrolled / 在学中
                          </MenuItem>

                          <MenuItem value="withdrawn">
                            Withdrawn / 中退
                          </MenuItem>
                        </TextField>
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
                Add education
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          JAPANESE / QUALIFICATIONS
          ================================================= */}

          <FormSection
            step={6 + offset}
            title="Japanese language & qualifications"
          >
            <Stack>
              <Controller
                name="japaneseLanguageLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Japanese language level"
                    size="small"
                    sx={{
                      ...fieldSx,
                      width: { xs: "100%", sm: 320 },
                    }}
                  >
                    <MenuItem value="">Select level</MenuItem>

                    {japaneseOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {qualificationFields.map((item, index) => (
                <RepeatCard
                  key={item.id}
                  title={`Qualification ${index + 1}`}
                  onRemove={() => removeQualification(index)}
                >
                  <Box sx={gridSx}>
                    <TextField
                      {...register(`qualifications.${index}.name`)}
                      label="Qualification / certificate"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.levelOrScore`)}
                      label="Level / score"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.issuer`)}
                      label="Issuer"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.acquiredDate`)}
                      {...dateProps}
                      label="Acquired date"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.expiryDate`)}
                      {...dateProps}
                      label="Expiry date"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.note`)}
                      label="Note"
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
                Add qualification
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          EMPLOYMENT
          ================================================= */}

          <FormSection step={7 + offset} title="Employment history">
            <Stack>
              {employmentFields.map((item, index) => {
                const isCurrent = watch(`employmentHistory.${index}.isCurrent`);

                return (
                  <RepeatCard
                    key={item.id}
                    title={`Employment ${index + 1}`}
                    onRemove={() => removeEmployment(index)}
                  >
                    <Box sx={gridSx}>
                      <TextField
                        {...register(`employmentHistory.${index}.companyName`)}
                        label="Company name"
                        size="small"
                        sx={fieldSx}
                      />

                      <Controller
                        name={`employmentHistory.${index}.employmentType`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Employment type"
                            size="small"
                            sx={fieldSx}
                          >
                            <MenuItem value="">Select type</MenuItem>

                            {employmentTypeOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.department`)}
                        label="Department"
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.jobTitle`)}
                        label="Job title"
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.workLocation`)}
                        label="Work location"
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.startDate`)}
                        {...dateProps}
                        label="Start date"
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.endDate`)}
                        {...dateProps}
                        label="End date"
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
                                  "&.Mui-checked": { color: BRAND },
                                }}
                              />
                            }
                            label="Currently employed"
                          />
                        )}
                      />
                    </Box>

                    <Box sx={{ ...grid2Sx, mt: 1.5 }}>
                      <TextField
                        {...register(
                          `employmentHistory.${index}.responsibilities`,
                        )}
                        label="Responsibilities / main duties"
                        multiline
                        minRows={3}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.achievements`)}
                        label="Achievements"
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
                Add employment
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          SKILLS
          ================================================= */}

          <FormSection step={8 + offset} title="Skills & career summary">
            <Box sx={grid2Sx}>
              <TextField
                {...register("skillsText")}
                label="Skills"
                multiline
                minRows={3}
                size="small"
                helperText="Separate skills with commas or new lines."
                sx={fieldSx}
              />

              <TextField
                {...register("careerSummary")}
                label="Career summary / 職務要約"
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

          <FormSection step={9 + offset} title="Japanese application content">
            <Stack>
              <TextField
                {...register("motivation")}
                label="Motivation / 志望動機"
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("selfPR")}
                label="Self PR / 自己PR"
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("desiredConditions")}
                label="Desired conditions / 本人希望記入欄"
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

          <FormSection step={10 + offset} title="Documents">
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
                title="Candidate photo"
                buttonLabel={photoSrc ? "Replace photo" : "Select photo"}
                accept="image/*"
                statusText={
                  selectedClientImage instanceof File
                    ? selectedClientImage.name
                    : existingClientImage
                      ? "Existing photo is kept unless replaced."
                      : "No photo selected. Use a 3:4 portrait."
                }
                onSelect={(file) =>
                  setValue("clientImage", file, { shouldDirty: true })
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
                        alt="Candidate photo preview"
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
                title="Original applicant CV"
                buttonLabel={
                  selectedCv instanceof File || existingCv
                    ? "Replace CV"
                    : "Select CV"
                }
                accept=".pdf,.doc,.docx"
                statusText={
                  selectedCv instanceof File
                    ? selectedCv.name
                    : existingCv
                      ? "Existing CV is kept unless replaced."
                      : "No CV selected. PDF or Word."
                }
                onSelect={(file) => setValue("cv", file, { shouldDirty: true })}
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
                "&:hover": { borderColor: MUTED, bgcolor: SURFACE },
              }}
            >
              Cancel
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
                flex: { xs: 1, sm: "0 1 auto" },
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
                ? "Processing..."
                : isEditMode
                  ? "Update client"
                  : `Confirm ¥${registrationAmount.toLocaleString()} payment & create client`}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientForm;
