"use client";

import type { ReactNode } from "react";

import { Controller, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
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
// DESIGN
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16,122,100,0.07)";
const BORDER = "rgba(17,24,39,0.09)";
const INK = "#111827";
const MUTED = "#6B7280";

const WARNING = "#B45309";
const WARNING_DARK = "#92400E";
const WARNING_SOFT = "#FFFBEB";

const cardSx = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },

  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  bgcolor: "#ffffff",

  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const fieldSx = {
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },

  "& .MuiOutlinedInput-root": {
    borderRadius: 2,

    "& fieldset": {
      borderColor: BORDER,
    },

    "&:hover fieldset": {
      borderColor: "rgba(16,122,100,0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
    },
  },
};

const grid2Sx = {
  display: "grid",

  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, minmax(0,1fr))",
  },

  gap: 2,
};

const grid3Sx = {
  display: "grid",

  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, minmax(0,1fr))",
    xl: "repeat(3, minmax(0,1fr))",
  },

  gap: 2,
};

// =================================================
// SECTION
// =================================================

const FormSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Paper elevation={0} sx={cardSx}>
    <Typography
      sx={{
        color: INK,
        fontSize: 17,
        fontWeight: 700,
      }}
    >
      {title}
    </Typography>

    {description && (
      <Typography
        sx={{
          mt: 0.5,
          mb: 2.5,
          color: MUTED,
          fontSize: 12.5,
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    )}

    {!description && <Box sx={{ mb: 2.5 }} />}

    {children}
  </Paper>
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

  const selectedClientImage = watch("clientImage");

  const selectedCv = watch("cv");

  const paymentMethod = watch("paymentMethod");

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
        bgcolor: "#F7F8F6",

        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        py: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1250,
          mx: "auto",
        }}
      >
        <Box sx={{ mb: 2.5 }}>
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                href: "/admin/dashboard",
              },

              {
                label: "Clients",
                href: "/admin/client",
              },

              {
                label: isEditMode ? "Edit Client" : "Register Client",

                current: true,
              },
            ]}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              color: INK,

              fontSize: {
                xs: 24,
                md: 30,
              },

              fontWeight: 700,
            }}
          >
            {isEditMode ? "Edit Client" : "Register New Client"}
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              color: MUTED,
              fontSize: 13.5,
            }}
          >
            {isEditMode
              ? "Update client and Japanese CV information."
              : "A new client becomes Registered / Paid only after the full registration payment is confirmed."}
          </Typography>
        </Box>

        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
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
              mb: 2,
              borderRadius: 2,
            }}
          >
            {registrationConfigError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* =================================================
          1 BASIC
          ================================================= */}

          <FormSection title="1. Basic Information">
            <Box sx={grid3Sx}>
              <TextField
                {...register("fullName")}
                label="Full Name"
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
                label="Date of Birth"
                type="date"
                size="small"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
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

          <FormSection title="2. Address">
            <Box sx={grid3Sx}>
              <TextField
                {...register("postalCode")}
                label="Postal Code"
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

          <FormSection title="3. Immigration & Passport">
            <Box sx={grid3Sx}>
              <Controller
                name="currentVisaStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    label="Current Visa Status"
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
                label="Residence Expiry Date"
                type="date"
                size="small"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldSx}
              />

              <TextField
                {...register("passportNumber")}
                label="Passport Number"
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("passportExpiryDate")}
                label="Passport Expiry Date"
                type="date"
                size="small"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          4 RECRUITMENT
          ================================================= */}

          <FormSection
            title="4. Recruitment Information"
            description={
              isEditMode
                ? "Stage changes for existing clients are handled only through Progress."
                : "The initial stage is automatically Registered / Paid."
            }
          >
            <Box sx={grid3Sx}>
              <Controller
                name="preferCategory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Preferred Category"
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
                      label="Assigned Staff"
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
                  label="Assigned Staff"
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
                label="Current Stage"
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
          5 REGISTRATION PAYMENT
          CREATE ONLY
          ================================================= */}

          {!isEditMode && (
            <FormSection
              title="5. Registration Payment"
              description="The client is created only after the full registration fee is confirmed. Partial payment is not supported."
            >
              {isStageLoading ? (
                <Box
                  sx={{
                    py: 3,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress size={24} sx={{ color: BRAND }} />
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      mb: 2.5,
                      p: 2,

                      border: "1px solid rgba(180,83,9,0.18)",

                      borderRadius: 2.5,

                      bgcolor: WARNING_SOFT,

                      display: "flex",
                      justifyContent: "space-between",

                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },

                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },

                      gap: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: WARNING,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        FULL REGISTRATION PAYMENT REQUIRED
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.35,
                          color: INK,
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {registrationStage?.name || "Registered / Paid"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: MUTED,
                          fontSize: 11,
                          textAlign: {
                            xs: "left",
                            sm: "right",
                          },
                        }}
                      >
                        Registration Fee
                      </Typography>

                      <Typography
                        sx={{
                          color: WARNING,
                          fontSize: 24,
                          fontWeight: 800,
                        }}
                      >
                        ¥{registrationAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Alert
                    severity="info"
                    sx={{
                      mb: 2.5,
                      borderRadius: 2,
                    }}
                  >
                    The amount is controlled by the Stage Master. It cannot be
                    changed from this form.
                  </Alert>

                  <Box sx={grid2Sx}>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          required
                          label="Payment Method"
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
                      required
                      label="Payment Date"
                      type="date"
                      size="small"
                      error={Boolean(errors.paymentDate)}
                      helperText={errors.paymentDate?.message}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      sx={fieldSx}
                    />

                    {paymentMethod === "Bank Transfer" && (
                      <>
                        <TextField
                          {...register("bankName")}
                          label="Bank Name"
                          size="small"
                          sx={fieldSx}
                        />

                        <TextField
                          {...register("referenceNumber")}
                          label="Reference Number"
                          size="small"
                          sx={fieldSx}
                        />
                      </>
                    )}

                    <TextField
                      {...register("receiptNumber")}
                      label="Receipt Number"
                      size="small"
                      sx={fieldSx}
                    />
                  </Box>

                  <TextField
                    {...register("paymentNote")}
                    fullWidth
                    multiline
                    minRows={2}
                    label="Payment Note"
                    sx={{
                      ...fieldSx,
                      mt: 2,
                    }}
                  />
                </>
              )}
            </FormSection>
          )}

          {/* =================================================
          EDUCATION
          ================================================= */}

          <FormSection title={`${isEditMode ? "5" : "6"}. Education`}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {educationFields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 2,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 2,
                    bgcolor: "#FAFBFA",
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      Education {index + 1}
                    </Typography>

                    <IconButton
                      type="button"
                      onClick={() => removeEducation(index)}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>

                  <Box sx={grid3Sx}>
                    <Controller
                      name={`education.${index}.educationType`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="School Type"
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
                      label="School Name"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.major`)}
                      label="Major / Course"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.enrollmentDate`)}
                      label="Enrollment Date"
                      type="date"
                      size="small"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.graduationDate`)}
                      label="Graduation Date"
                      type="date"
                      size="small"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      sx={fieldSx}
                    />

                    <Controller
                      name={`education.${index}.graduationStatus`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Graduation Status"
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
                </Box>
              ))}

              <Button
                type="button"
                variant="outlined"
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
                sx={{
                  alignSelf: "flex-start",
                  color: BRAND,
                  borderColor: BRAND,
                  textTransform: "none",
                }}
              >
                Add Education
              </Button>
            </Box>
          </FormSection>

          {/* =================================================
          JAPANESE / QUALIFICATIONS
          ================================================= */}

          <FormSection
            title={`${isEditMode ? "6" : "7"}. Japanese Language & Qualifications`}
          >
            <Controller
              name="japaneseLanguageLevel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Japanese Language Level"
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: {
                      xs: "100%",
                      md: 400,
                    },
                    mb: 2.5,
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

            <Divider sx={{ mb: 2.5 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {qualificationFields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 2,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 2,
                    bgcolor: "#FAFBFA",
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      Qualification {index + 1}
                    </Typography>

                    <IconButton
                      type="button"
                      onClick={() => removeQualification(index)}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Box>

                  <Box sx={grid3Sx}>
                    <TextField
                      {...register(`qualifications.${index}.name`)}
                      label="Qualification / Certificate"
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.levelOrScore`)}
                      label="Level / Score"
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
                      label="Acquired Date"
                      type="date"
                      size="small"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.expiryDate`)}
                      label="Expiry Date"
                      type="date"
                      size="small"
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.note`)}
                      label="Note"
                      size="small"
                      sx={fieldSx}
                    />
                  </Box>
                </Box>
              ))}

              <Button
                type="button"
                variant="outlined"
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
                sx={{
                  alignSelf: "flex-start",
                  color: BRAND,
                  borderColor: BRAND,
                  textTransform: "none",
                }}
              >
                Add Qualification
              </Button>
            </Box>
          </FormSection>

          {/* =================================================
          EMPLOYMENT
          ================================================= */}

          <FormSection title={`${isEditMode ? "7" : "8"}. Employment History`}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {employmentFields.map((item, index) => {
                const isCurrent = watch(`employmentHistory.${index}.isCurrent`);

                return (
                  <Box
                    key={item.id}
                    sx={{
                      p: 2,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 2,
                      bgcolor: "#FAFBFA",
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        Employment {index + 1}
                      </Typography>

                      <IconButton
                        type="button"
                        onClick={() => removeEmployment(index)}
                      >
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </Box>

                    <Box sx={grid3Sx}>
                      <TextField
                        {...register(`employmentHistory.${index}.companyName`)}
                        label="Company Name"
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
                            label="Employment Type"
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
                        label="Job Title"
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.workLocation`)}
                        label="Work Location"
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.startDate`)}
                        label="Start Date"
                        type="date"
                        size="small"
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.endDate`)}
                        label="End Date"
                        type="date"
                        disabled={isCurrent}
                        size="small"
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                        sx={fieldSx}
                      />

                      <Controller
                        name={`employmentHistory.${index}.isCurrent`}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
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
                            label="Currently Employed"
                          />
                        )}
                      />
                    </Box>

                    <Box
                      sx={{
                        ...grid2Sx,
                        mt: 2,
                      }}
                    >
                      <TextField
                        {...register(
                          `employmentHistory.${index}.responsibilities`,
                        )}
                        label="Responsibilities / Main Duties"
                        multiline
                        minRows={4}
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.achievements`)}
                        label="Achievements"
                        multiline
                        minRows={4}
                        sx={fieldSx}
                      />
                    </Box>
                  </Box>
                );
              })}

              <Button
                type="button"
                variant="outlined"
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
                sx={{
                  alignSelf: "flex-start",
                  color: BRAND,
                  borderColor: BRAND,
                  textTransform: "none",
                }}
              >
                Add Employment
              </Button>
            </Box>
          </FormSection>

          {/* =================================================
          SKILLS
          ================================================= */}

          <FormSection
            title={`${isEditMode ? "8" : "9"}. Skills & Career Summary`}
          >
            <Box sx={grid2Sx}>
              <TextField
                {...register("skillsText")}
                label="Skills"
                multiline
                minRows={4}
                helperText="Separate skills with commas or new lines."
                sx={fieldSx}
              />

              <TextField
                {...register("careerSummary")}
                label="Career Summary / 職務要約"
                multiline
                minRows={4}
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          JAPANESE APPLICATION
          ================================================= */}

          <FormSection
            title={`${isEditMode ? "9" : "10"}. Japanese Application Content`}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                {...register("motivation")}
                label="Motivation / 志望動機"
                multiline
                minRows={4}
                sx={fieldSx}
              />

              <TextField
                {...register("selfPR")}
                label="Self PR / 自己PR"
                multiline
                minRows={4}
                sx={fieldSx}
              />

              <TextField
                {...register("desiredConditions")}
                label="Desired Conditions / 本人希望記入欄"
                multiline
                minRows={3}
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          DOCUMENTS
          ================================================= */}

          <FormSection title={`${isEditMode ? "10" : "11"}. Documents`}>
            <Box sx={grid2Sx}>
              <Box
                sx={{
                  p: 2,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    mb: 1.5,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Candidate Photo
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileOutlinedIcon />}
                  sx={{
                    color: BRAND,
                    borderColor: BRAND,
                    textTransform: "none",
                  }}
                >
                  Select Photo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        setValue("clientImage", file, {
                          shouldDirty: true,
                        });
                      }
                    }}
                  />
                </Button>

                <Typography
                  sx={{
                    mt: 1,
                    color: MUTED,
                    fontSize: 12,
                  }}
                >
                  {selectedClientImage instanceof File
                    ? selectedClientImage.name
                    : existingClientImage
                      ? "Existing photo will be kept unless replaced."
                      : "No photo selected."}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    mb: 1.5,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Original Applicant CV
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileOutlinedIcon />}
                  sx={{
                    color: BRAND,
                    borderColor: BRAND,
                    textTransform: "none",
                  }}
                >
                  Select CV
                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        setValue("cv", file, {
                          shouldDirty: true,
                        });
                      }
                    }}
                  />
                </Button>

                <Typography
                  sx={{
                    mt: 1,
                    color: MUTED,
                    fontSize: 12,
                  }}
                >
                  {selectedCv instanceof File
                    ? selectedCv.name
                    : existingCv
                      ? "Existing CV will be kept unless replaced."
                      : "No CV selected."}
                </Typography>
              </Box>
            </Box>
          </FormSection>

          {/* =================================================
          ACTION
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              position: "sticky",
              bottom: 16,
              zIndex: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                disabled={isSaving}
                onClick={handleCancel}
                sx={{
                  minHeight: 44,
                  px: 2.5,
                  borderColor: BORDER,
                  color: MUTED,
                  textTransform: "none",
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
                  minHeight: 44,
                  px: 2.5,

                  bgcolor: isEditMode ? BRAND : WARNING,

                  color: "#ffffff",
                  fontWeight: 700,
                  textTransform: "none",

                  "&:hover": {
                    bgcolor: isEditMode ? BRAND_HOVER : WARNING_DARK,
                  },
                }}
              >
                {isSaving
                  ? "Processing..."
                  : isEditMode
                    ? "Update Client"
                    : `Confirm ¥${registrationAmount.toLocaleString()} Payment & Create Client`}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientForm;
