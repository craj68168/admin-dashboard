"use client";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Controller, useFieldArray } from "react-hook-form";
import Breadcrumb from "@/components/Breadcrumb";
import {
  GENDER,
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  NATIONALITIES,
  STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/components/constant";
import { useClientFormHook } from "./hook";
import type { ClientFormProps } from "./type";
// =================================================
// DESIGN
// =================================================
const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const DANGER = "#DC2626";
const FIELD_HEIGHT = 40;
const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};
const fieldSx = {
  "& .MuiInputLabel-root": {
    color: INK_MUTED,
    fontSize: 13.5,
    "&.Mui-focused": {
      color: BRAND,
    },
    "&.Mui-error": {
      color: DANGER,
    },
  },
  "& .MuiOutlinedInput-root": {
    color: INK,
    bgcolor: "#ffffff",
    borderRadius: 2,
    minHeight: FIELD_HEIGHT,
    "& fieldset": {
      borderColor: HAIRLINE,
    },
    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.35)",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: "1px",
    },
    "&.Mui-error fieldset": {
      borderColor: DANGER,
    },
    "&.Mui-disabled": {
      bgcolor: "#F9FAFB",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: 13.5,
    "&::placeholder": {
      color: INK_MUTED,
      opacity: 0.65,
    },
  },
  "& .MuiSelect-select": {
    fontSize: 13.5,
  },
  "& .MuiFormHelperText-root": {
    ml: 0.25,
    mt: 0.4,
    fontSize: 11,
    lineHeight: 1.3,
    color: INK_MUTED,
    "&.Mui-error": {
      color: DANGER,
    },
  },
};
const addButtonSx = {
  borderRadius: 2,
  borderColor: "rgba(16, 122, 100, 0.25)",
  color: BRAND,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 13,
  minHeight: 34,
  px: 1.5,
  "&:hover": {
    bgcolor: BRAND_SOFT,
    borderColor: BRAND,
  },
} as const;
const uploadButtonSx = (hasValue: boolean, hasError: boolean) =>
  ({
    height: FIELD_HEIGHT,
    justifyContent: "flex-start",
    px: 1.5,
    color: hasValue ? INK : INK_MUTED,
    bgcolor: "#ffffff",
    borderColor: hasError ? DANGER : HAIRLINE,
    borderRadius: 2,
    fontSize: 13.5,
    fontWeight: 500,
    textTransform: "none",
    overflow: "hidden",
    "&:hover": {
      bgcolor: BRAND_SOFT,
      borderColor: "rgba(16, 122, 100, 0.35)",
    },
    "& .MuiButton-startIcon": {
      color: BRAND,
    },
  }) as const;
// =================================================
// INPUT
// =================================================
const Input = (props: TextFieldProps) => (
  <TextField size="small" fullWidth {...props} sx={fieldSx} />
);
// =================================================
// DATE
// =================================================
const DateInput = (props: TextFieldProps) => (
  <Input
    type="date"
    {...props}
    slotProps={{
      inputLabel: {
        shrink: true,
      },
    }}
  />
);
// =================================================
// TITLE
// =================================================
const SectionTitle = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <Box sx={{ mb: 1.75 }}>
    <Typography
      sx={{
        color: INK,
        fontSize: 15.5,
        lineHeight: 1.3,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </Typography>
    {description && (
      <Typography
        variant="body2"
        sx={{
          mt: 0.25,
          color: INK_MUTED,
          fontSize: 12.5,
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    )}
  </Box>
);
// =================================================
// GRID
// =================================================
const FormGrid = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
      },
      columnGap: 2,
      rowGap: 1.75,
      alignItems: "start",
    }}
  >
    {children}
  </Box>
);
// =================================================
// DIVIDER
// =================================================
const SectionDivider = () => (
  <Divider
    sx={{
      my: 2.75,
      borderColor: HAIRLINE,
    }}
  />
);
// =================================================
// ITEM CARD
// =================================================
const ItemCard = ({
  children,
  onRemove,
  removeDisabled,
  label,
}: {
  children: ReactNode;
  onRemove: () => void;
  removeDisabled: boolean;
  label: string;
}) => (
  <Box
    sx={{
      position: "relative",
      p: {
        xs: 1.5,
        sm: 2,
      },
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 2,
      bgcolor: "#FAFBFA",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 28,
        mb: 1.25,
      }}
    >
      <Typography
        sx={{
          color: INK,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <IconButton
        size="small"
        disabled={removeDisabled}
        onClick={onRemove}
        sx={{
          color: DANGER,
          borderRadius: 1.5,
          "&:hover": {
            bgcolor: "rgba(220, 38, 38, 0.06)",
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
    {children}
  </Box>
);
// =================================================
// CLIENT FORM
// =================================================
const ClientForm = ({ clientId }: ClientFormProps) => {
  const t = useTranslations("createClient");
  const {
    user,
    role,
    isEditMode,
    control,
    errors,
    handleSubmit,
    activeStaff,
    stageOptions,
    existingFiles,
    isStaffLoading,
    isStageLoading,
    isClientLoading,
    isSubmitting,
    isSaving,
    serverError,
    clientLoadError,
    stageLoadError,
    onSubmit,
    handleCancel,
  } = useClientFormHook(clientId);
  // =================================================
  // DYNAMIC EDUCATION
  // =================================================
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });
  // =================================================
  // DYNAMIC EMPLOYMENT
  // =================================================
  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control,
    name: "employmentHistory",
  });
  const loading = isSubmitting || isSaving;
  // =================================================
  // INITIAL EDIT LOAD
  // =================================================
  if (isEditMode && isClientLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F7F8F6",
        }}
      >
        <CircularProgress
          size={30}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }
  // =================================================
  // CLIENT LOAD ERROR
  // =================================================
  if (isEditMode && clientLoadError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F8F6",
          p: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 1180,
            mx: "auto",
          }}
        >
          <Alert severity="error">{clientLoadError}</Alert>
          <Button
            onClick={handleCancel}
            sx={{
              mt: 2,
              color: BRAND,
            }}
          >
            Back
          </Button>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F8F6",
        px: {
          xs: 1.5,
          sm: 2.5,
          md: 3,
        },
        pb: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
        }}
      >
        {/* BREADCRUMB */}
        <Box
          sx={{
            mb: {
              xs: 1.5,
              md: 2,
            },
          }}
        >
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
              ...(isEditMode && clientId
                ? [
                    {
                      label: clientId,
                      href: `/admin/client/${encodeURIComponent(clientId)}`,
                    },
                  ]
                : []),
              {
                label: isEditMode
                  ? "Edit Client"
                  : t("breadcrumbs.createClient"),
                current: true,
              },
            ]}
          />
        </Box>
        {/* CARD */}
        <Box
          sx={{
            ...softCard,
            p: {
              xs: 1.75,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              mb: {
                xs: 2,
                md: 2.5,
              },
            }}
          >
            <Typography
              sx={{
                color: INK,
                fontSize: {
                  xs: 20,
                  sm: 22,
                  md: 24,
                },
                lineHeight: 1.25,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {isEditMode ? "Edit Client" : t("title")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.25,
                color: INK_MUTED,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {isEditMode
                ? "Update the client's information. Change progress from the client Progress section."
                : t("description")}
            </Typography>
          </Box>
          {/* ERRORS */}
          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              {serverError}
            </Alert>
          )}
          {stageLoadError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              {stageLoadError}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* =================================================
BASIC
================================================= */}
            <SectionTitle
              title={t("sections.basic.title")}
              description={t("sections.basic.description")}
            />
            <FormGrid>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    required
                    label={t("fields.fullName.label")}
                    placeholder={t("fields.fullName.placeholder")}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    required
                    label={t("fields.phone.label")}
                    placeholder={t("fields.phone.placeholder")}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                  />
                )}
              />
              <Controller
                name="currentVisaStatus"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    required
                    label={t("fields.currentVisaStatus.label")}
                    error={Boolean(errors.currentVisaStatus)}
                    helperText={errors.currentVisaStatus?.message}
                  >
                    <MenuItem value="">
                      {t("fields.currentVisaStatus.placeholder")}
                    </MenuItem>
                    {CURRENT_VISA_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`options.currentVisaStatus.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
              {/* ASSIGNED STAFF - ADMIN */}
              {role === "superadmin" && (
                <Controller
                  name="assignedStaff"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      select
                      required
                      label={t("fields.assignedStaff.label")}
                      disabled={isStaffLoading}
                      error={Boolean(errors.assignedStaff)}
                      helperText={errors.assignedStaff?.message}
                    >
                      <MenuItem value="">
                        {isStaffLoading
                          ? "Loading staff..."
                          : t("fields.assignedStaff.placeholder")}
                      </MenuItem>
                      {activeStaff.map((staff) => (
                        <MenuItem key={staff.staffId} value={staff.staffId}>
                          {staff.name} ({staff.staffId})
                        </MenuItem>
                      ))}
                    </Input>
                  )}
                />
              )}
              {/* ASSIGNED STAFF - STAFF */}
              {role === "staff" && (
                <Controller
                  name="assignedStaff"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled
                      label={t("fields.assignedStaff.label")}
                      value={
                        isEditMode
                          ? field.value
                          : user
                            ? `${user.name} (${user.staffId})`
                            : ""
                      }
                      helperText={t("fields.assignedStaff.autoHelper")}
                    />
                  )}
                />
              )}
              <Controller
                name="preferCategory"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    label={t("fields.preferCategory.label")}
                    error={Boolean(errors.preferCategory)}
                    helperText={errors.preferCategory?.message}
                  >
                    <MenuItem value="">
                      {t("fields.preferCategory.placeholder")}
                    </MenuItem>
                    {PREFER_CATEGORY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`options.preferCategory.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
              <Controller
                name="currentStage"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    required={!isEditMode}
                    disabled={
                      isEditMode || isStageLoading || Boolean(stageLoadError)
                    }
                    label={t("fields.currentStage.label")}
                    error={Boolean(errors.currentStage)}
                    helperText={
                      isEditMode
                        ? "Change stage from the Progress section."
                        : errors.currentStage?.message
                    }
                  >
                    <MenuItem value="">
                      {isStageLoading
                        ? "Loading stages..."
                        : t("fields.currentStage.placeholder")}
                    </MenuItem>
                    {stageOptions.map((stage) => (
                      <MenuItem key={stage._id} value={stage.key}>
                        {stage.name} — ¥{stage.amount.toLocaleString()}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
            </FormGrid>
            <SectionDivider />
            {/* =================================================
PERSONAL
================================================= */}
            <SectionTitle
              title={t("sections.personal.title")}
              description={t("sections.personal.description")}
            />
            <FormGrid>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DateInput {...field} label={t("fields.dateOfBirth.label")} />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    label={t("fields.gender.label")}
                    error={Boolean(errors.gender)}
                    helperText={errors.gender?.message}
                  >
                    <MenuItem value="">
                      {t("fields.gender.placeholder")}
                    </MenuItem>
                    {GENDER.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`options.gender.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    label={t("fields.email.label")}
                    placeholder={t("fields.email.placeholder")}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    label={t("fields.nationality.label")}
                    error={Boolean(errors.nationality)}
                    helperText={errors.nationality?.message}
                  >
                    <MenuItem value="">
                      {t("fields.nationality.placeholder")}
                    </MenuItem>
                    {NATIONALITIES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`options.nationality.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
              <Controller
                name="prefecture"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    label={t("fields.prefecture.label")}
                    error={Boolean(errors.prefecture)}
                    helperText={errors.prefecture?.message}
                  >
                    <MenuItem value="">
                      {t("fields.prefecture.placeholder")}
                    </MenuItem>
                    {PREFECTURE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`options.prefecture.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={t("fields.address.label")}
                    placeholder={t("fields.address.placeholder")}
                  />
                )}
              />
            </FormGrid>
            <SectionDivider />
            {/* =================================================
PASSPORT
================================================= */}
            <SectionTitle
              title={t("sections.passport.title")}
              description={t("sections.passport.description")}
            />
            <FormGrid>
              <Controller
                name="passportNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={t("fields.passportNumber.label")}
                    placeholder={t("fields.passportNumber.placeholder")}
                  />
                )}
              />
              <Controller
                name="passportExpiryDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    label={t("fields.passportExpiryDate.label")}
                  />
                )}
              />
              <Controller
                name="statusOfResidence"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    select
                    label={t("fields.statusOfResidence.label")}
                    error={Boolean(errors.statusOfResidence)}
                    helperText={errors.statusOfResidence?.message}
                  >
                    <MenuItem value="">
                      {t("fields.statusOfResidence.placeholder")}
                    </MenuItem>
                    {STATUS_OF_RESIDENCE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(`options.statusOfResidence.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </Input>
                )}
              />
            </FormGrid>
            <SectionDivider />
            {/* =================================================
EDUCATION
================================================= */}
            <SectionTitle
              title={t("sections.education.title")}
              description={t("sections.education.description")}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {educationFields.map((education, index) => (
                <ItemCard
                  key={education.id}
                  label={`Education ${index + 1}`}
                  removeDisabled={educationFields.length === 1}
                  onRemove={() => removeEducation(index)}
                >
                  <FormGrid>
                    <Controller
                      name={`education.${index}.educationType`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          select
                          label={t("fields.educationType.label")}
                          error={Boolean(
                            errors.education?.[index]?.educationType,
                          )}
                          helperText={
                            errors.education?.[index]?.educationType?.message
                          }
                        >
                          <MenuItem value="">
                            {t("fields.educationType.placeholder")}
                          </MenuItem>
                          {EDUCATION_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {t(
                                `options.educationType.${option.key}` as never,
                              )}
                            </MenuItem>
                          ))}
                        </Input>
                      )}
                    />
                    <Controller
                      name={`education.${index}.schoolName`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={t("fields.schoolName.label")}
                          placeholder={t("fields.schoolName.placeholder")}
                          error={Boolean(errors.education?.[index]?.schoolName)}
                          helperText={
                            errors.education?.[index]?.schoolName?.message
                          }
                        />
                      )}
                    />
                    <Controller
                      name={`education.${index}.major`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={t("fields.major.label")}
                          placeholder={t("fields.major.placeholder")}
                          error={Boolean(errors.education?.[index]?.major)}
                          helperText={errors.education?.[index]?.major?.message}
                        />
                      )}
                    />
                    <Controller
                      name={`education.${index}.enrollmentDate`}
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          {...field}
                          label={t("fields.enrollmentDate.label")}
                          error={Boolean(
                            errors.education?.[index]?.enrollmentDate,
                          )}
                          helperText={
                            errors.education?.[index]?.enrollmentDate?.message
                          }
                        />
                      )}
                    />
                    <Controller
                      name={`education.${index}.graduationDate`}
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          {...field}
                          label={t("fields.graduationDate.label")}
                          error={Boolean(
                            errors.education?.[index]?.graduationDate,
                          )}
                          helperText={
                            errors.education?.[index]?.graduationDate?.message
                          }
                        />
                      )}
                    />
                  </FormGrid>
                </ItemCard>
              ))}
              <Box>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    appendEducation({
                      schoolName: "",
                      enrollmentDate: "",
                      graduationDate: "",
                      educationType: "",
                      major: "",
                    })
                  }
                  sx={addButtonSx}
                >
                  Add Education
                </Button>
              </Box>
            </Box>
            {/* JAPANESE + INTAKE */}
            <Box sx={{ mt: 2 }}>
              <FormGrid>
                <Controller
                  name="japaneseLanguageLevel"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      select
                      label={t("fields.japaneseLanguageLevel.label")}
                      error={Boolean(errors.japaneseLanguageLevel)}
                      helperText={errors.japaneseLanguageLevel?.message}
                    >
                      <MenuItem value="">
                        {t("fields.japaneseLanguageLevel.placeholder")}
                      </MenuItem>
                      {JAPANESE_LEVELS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(
                            `options.japaneseLanguageLevel.${option.key}` as never,
                          )}
                        </MenuItem>
                      ))}
                    </Input>
                  )}
                />
                <Controller
                  name="intake"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Intake"
                      placeholder="e.g. April 2015"
                    />
                  )}
                />
              </FormGrid>
            </Box>
            <SectionDivider />
            {/* =================================================
EMPLOYMENT
================================================= */}
            <SectionTitle
              title={t("sections.employment.title")}
              description={t("sections.employment.description")}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {employmentFields.map((employment, index) => (
                <ItemCard
                  key={employment.id}
                  label={`Employment ${index + 1}`}
                  removeDisabled={employmentFields.length === 1}
                  onRemove={() => removeEmployment(index)}
                >
                  <FormGrid>
                    <Controller
                      name={`employmentHistory.${index}.companyName`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={t("fields.companyName.label")}
                          placeholder={t("fields.companyName.placeholder")}
                        />
                      )}
                    />
                    <Controller
                      name={`employmentHistory.${index}.employmentType`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          select
                          label={t("fields.employmentType.label")}
                          error={Boolean(
                            errors.employmentHistory?.[index]?.employmentType,
                          )}
                          helperText={
                            errors.employmentHistory?.[index]?.employmentType
                              ?.message
                          }
                        >
                          <MenuItem value="">
                            {t("fields.employmentType.placeholder")}
                          </MenuItem>
                          {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {t(
                                `options.employmentType.${option.key}` as never,
                              )}
                            </MenuItem>
                          ))}
                        </Input>
                      )}
                    />
                    <Controller
                      name={`employmentHistory.${index}.startDate`}
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          {...field}
                          label={t("fields.startDate.label")}
                        />
                      )}
                    />
                    <Controller
                      name={`employmentHistory.${index}.endDate`}
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          {...field}
                          label={t("fields.endDate.label")}
                        />
                      )}
                    />
                  </FormGrid>
                </ItemCard>
              ))}
              <Box>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    appendEmployment({
                      companyName: "",
                      startDate: "",
                      endDate: "",
                      employmentType: "",
                    })
                  }
                  sx={addButtonSx}
                >
                  Add Employment
                </Button>
              </Box>
            </Box>
            <SectionDivider />
            {/* =================================================
DOCUMENTS
================================================= */}
            <SectionTitle
              title={t("sections.documents.title")}
              description={t("sections.documents.description")}
            />
            <FormGrid>
              <Controller
                name="clientImage"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      startIcon={<CloudUploadOutlinedIcon />}
                      sx={uploadButtonSx(
                        Boolean(value),
                        Boolean(errors.clientImage),
                      )}
                    >
                      <Box
                        component="span"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {value
                          ? value.name
                          : isEditMode && existingFiles.clientImage
                            ? "Replace Client Image"
                            : t("fields.clientImage.upload")}
                      </Box>
                      <input
                        {...field}
                        hidden
                        type="file"
                        accept="image/*"
                        value={undefined}
                        onChange={(event) => {
                          onChange(event.target.files?.[0] ?? null);
                        }}
                      />
                    </Button>
                    {isEditMode && existingFiles.clientImage && !value && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          color: INK_MUTED,
                        }}
                      >
                        Existing image will be kept unless a new image is
                        uploaded.
                      </Typography>
                    )}
                    {errors.clientImage?.message && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.4,
                          color: DANGER,
                        }}
                      >
                        {String(errors.clientImage.message)}
                      </Typography>
                    )}
                  </Box>
                )}
              />
              <Controller
                name="cv"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      startIcon={<CloudUploadOutlinedIcon />}
                      sx={uploadButtonSx(Boolean(value), Boolean(errors.cv))}
                    >
                      <Box
                        component="span"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {value
                          ? value.name
                          : isEditMode && existingFiles.cv
                            ? "Replace CV"
                            : t("fields.cv.upload")}
                      </Box>
                      <input
                        {...field}
                        hidden
                        type="file"
                        accept=".pdf,.doc,.docx"
                        value={undefined}
                        onChange={(event) => {
                          onChange(event.target.files?.[0] ?? null);
                        }}
                      />
                    </Button>
                    {isEditMode && existingFiles.cv && !value && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          color: INK_MUTED,
                        }}
                      >
                        Existing CV will be kept unless a new CV is uploaded.
                      </Typography>
                    )}
                    {errors.cv?.message && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.4,
                          color: DANGER,
                        }}
                      >
                        {String(errors.cv.message)}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </FormGrid>
            {/* =================================================
ACTIONS
================================================= */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column-reverse",
                  sm: "row",
                },
                justifyContent: "flex-end",
                gap: 1,
                mt: {
                  xs: 3,
                  md: 3.5,
                },
                pt: 2,
                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                disabled={loading}
                onClick={handleCancel}
                sx={{
                  minHeight: 38,
                  px: 2.25,
                  borderRadius: 2,
                  borderColor: HAIRLINE,
                  color: INK_MUTED,
                  bgcolor: "#ffffff",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: BRAND_SOFT,
                    borderColor: "rgba(16, 122, 100, 0.30)",
                    color: BRAND,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={loading || isStageLoading || Boolean(stageLoadError)}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                sx={{
                  minHeight: 38,
                  px: 2.25,
                  bgcolor: BRAND,
                  color: "#ffffff",
                  borderRadius: 2,
                  fontSize: 13.5,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: BRAND_HOVER,
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "rgba(16, 122, 100, 0.45)",
                    color: "#ffffff",
                  },
                }}
              >
                {loading
                  ? isEditMode
                    ? "Saving..."
                    : "Creating..."
                  : isEditMode
                    ? "Save Changes"
                    : "Create Client"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default ClientForm;
