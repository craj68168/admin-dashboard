"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { Controller, useFieldArray } from "react-hook-form";

import Breadcrumb from "@/components/Breadcrumb";

import { useEditClientHook } from "./hook";

import {
  GENDER,
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  CURRENT_STAGES,
  NATIONALITIES,
  STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/components/constant";

// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";

const HAIRLINE = "rgba(17, 24, 39, 0.06)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

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

    fontSize: 14,

    "&.Mui-focused": {
      color: BRAND,
    },

    "&.Mui-error": {
      color: "#DC2626",
    },

    "&.Mui-disabled": {
      color: "rgba(75, 85, 99, 0.72)",
    },
  },

  "& .MuiOutlinedInput-root": {
    color: INK,

    bgcolor: "#ffffff",

    borderRadius: 2.5,

    transition:
      "border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease",

    "& fieldset": {
      borderColor: HAIRLINE,

      transition: "border-color 200ms ease",
    },

    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,

      borderWidth: "1px",
    },

    "&.Mui-error fieldset": {
      borderColor: "#DC2626",
    },

    "&.Mui-disabled": {
      bgcolor: "#F9FAFB",

      "& fieldset": {
        borderColor: HAIRLINE,
      },
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,

    "&::placeholder": {
      color: INK_MUTED,

      opacity: 0.65,
    },

    "&.Mui-disabled": {
      WebkitTextFillColor: INK_MUTED,
    },
  },

  "& .MuiSelect-select": {
    fontSize: 14,
  },

  "& .MuiFormHelperText-root": {
    ml: 0.25,

    mt: 0.75,

    fontSize: 11.5,

    color: INK_MUTED,

    "&.Mui-error": {
      color: "#DC2626",
    },
  },
};

// =================================================
// SECTION TITLE
// =================================================

const SectionTitle = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          color: INK,

          fontSize: 17,

          lineHeight: 1.35,

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
            mt: 0.5,

            color: INK_MUTED,

            fontSize: 13.5,

            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

// =================================================
// FORM GRID
// =================================================

const FormGrid = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",

          md: "1fr 1fr",
        },

        gap: {
          xs: 2,

          sm: 2.5,

          md: 3,
        },
      }}
    >
      {children}
    </Box>
  );
};

// =================================================
// EDUCATION GRID
// =================================================

const EducationGrid = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",

          sm: "1fr 1fr",

          lg: "1.4fr 1fr 1fr 1.2fr 0.9fr",
        },

        gap: 2,
      }}
    >
      {children}
    </Box>
  );
};

// =================================================
// EMPLOYMENT GRID
// =================================================

const EmploymentGrid = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",

          sm: "1fr 1fr",

          lg: "1.4fr 1fr 1fr 1.2fr auto",
        },

        gap: 2,

        alignItems: "start",
      }}
    >
      {children}
    </Box>
  );
};

// =================================================
// CURRENT FILE NAME
// =================================================

const getFileName = (path: string) => {
  if (!path) {
    return "";
  }

  const parts = path.split(/[\\/]/);

  return parts[parts.length - 1] || path;
};

// =================================================
// EDIT CLIENT
// =================================================

const EditClient = () => {
  const t = useTranslations("editClient");

  const optionT = useTranslations("createClient.options");
  const {
    clientId,

    user,
    role,

    client,

    control,
    errors,
    handleSubmit,

    staffOptions,
    isStaffLoading,

    isClientLoading,

    isSubmitting,
    isUpdating,

    serverError,
    loadError,

    currentClientImage,
    currentCv,

    onSubmit,
    handleCancel,
  } = useEditClientHook();

  // =================================================
  // EDUCATION HISTORY
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
  // EMPLOYMENT HISTORY
  // =================================================

  const {
    fields: employmentFields,

    append: appendEmployment,

    remove: removeEmployment,
  } = useFieldArray({
    control,

    name: "employmentHistory",
  });

  const loading = isSubmitting || isUpdating;

  // =================================================
  // LOADING CLIENT
  // =================================================

  if (isClientLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",

          bgcolor: "#F7F8F6",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            ...softCard,

            width: 92,

            height: 92,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={30}
            thickness={4}
            sx={{
              color: BRAND,
            }}
          />
        </Box>
      </Box>
    );
  }

  // =================================================
  // LOAD ERROR
  // =================================================

  if (loadError || !client) {
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

            maxWidth: 900,

            mx: "auto",
          }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: 2.5,

              border: "1px solid rgba(220, 38, 38, 0.12)",

              bgcolor: "#FEF2F2",

              color: "#991B1B",

              boxShadow:
                "0 1px 2px rgba(17,24,39,0.02), 0 12px 32px -26px rgba(17,24,39,0.20)",

              "& .MuiAlert-icon": {
                color: "#DC2626",
              },
            }}
          >
            {loadError || t("messages.notFound")}
          </Alert>
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
          xs: 2,

          sm: 3,

          md: 4,
        },

        pb: {
          xs: 3,

          md: 4,
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
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <Box
          sx={{
            mb: {
              xs: 2.5,

              md: 3,
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

              {
                label: client.fullName,

                href: `/admin/client/clientDetailPage?clientId=${encodeURIComponent(
                  clientId,
                )}`,
              },

              {
                label: t("breadcrumbs.editClient"),

                current: true,
              },
            ]}
          />
        </Box>

        {/* =================================================
            CARD
        ================================================= */}

        <Box
          sx={{
            ...softCard,

            p: {
              xs: 2,

              sm: 3,

              md: 4,
            },
          }}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <Box
            sx={{
              mb: {
                xs: 3,

                md: 4,
              },
            }}
          >
            <Typography
              sx={{
                color: INK,

                fontSize: {
                  xs: 22,

                  sm: 25,

                  md: 28,
                },

                lineHeight: 1.25,

                fontWeight: 600,

                letterSpacing: "-0.025em",
              }}
            >
              {t("title")}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.75,

                color: INK_MUTED,

                fontSize: {
                  xs: 13.5,

                  sm: 14,
                },

                lineHeight: 1.6,
              }}
            >
              {t("clientIdLabel")}{" "}
              <Box
                component="strong"
                sx={{
                  color: BRAND,

                  fontWeight: 600,
                }}
              >
                {client.clientId}
              </Box>
            </Typography>
          </Box>

          {/* =================================================
              UPDATE ERROR
          ================================================= */}

          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,

                borderRadius: 2.5,

                border: "1px solid rgba(220, 38, 38, 0.12)",

                bgcolor: "#FEF2F2",

                color: "#991B1B",

                boxShadow: "none",

                "& .MuiAlert-icon": {
                  color: "#DC2626",
                },
              }}
            >
              {serverError}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <SectionTitle
              title={t("sections.basic.title")}
              description={t("sections.basic.description")}
            />

            <FormGrid>
              {/* FULL NAME */}

              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={t("fields.fullName.label")}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName?.message}
                    sx={fieldSx}
                  />
                )}
              />

              {/* PHONE */}

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={t("fields.phone.label")}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                    sx={fieldSx}
                  />
                )}
              />

              {/* CURRENT VISA STATUS */}

              <Controller
                name="currentVisaStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    label={t("fields.currentVisaStatus.label")}
                    error={Boolean(errors.currentVisaStatus)}
                    helperText={errors.currentVisaStatus?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.currentVisaStatus.placeholder")}
                    </MenuItem>

                    {CURRENT_VISA_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(`currentVisaStatus.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* =================================================
                  SUPER ADMIN STAFF SELECT
              ================================================= */}

              {role === "superadmin" && (
                <Controller
                  name="assignedStaff"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      required
                      fullWidth
                      label={t("fields.assignedStaff.label")}
                      disabled={isStaffLoading}
                      error={Boolean(errors.assignedStaff)}
                      helperText={errors.assignedStaff?.message}
                      sx={fieldSx}
                    >
                      <MenuItem value="">
                        {t("fields.assignedStaff.placeholder")}
                      </MenuItem>

                      {staffOptions.map((staff) => (
                        <MenuItem key={staff.staffId} value={staff.staffId}>
                          {staff.name} ({staff.staffId})
                          {!staff.isActive ? ` - ${t("inactive")}` : ""}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}

              {/* =================================================
                  STAFF READ ONLY
              ================================================= */}

              {role === "staff" && (
                <TextField
                  fullWidth
                  disabled
                  label={t("fields.assignedStaff.label")}
                  value={
                    client.assignedStaffDetails?.name
                      ? `${client.assignedStaffDetails.name} (${client.assignedStaff})`
                      : user?.staffId
                        ? `${user.name} (${user.staffId})`
                        : client.assignedStaff
                  }
                  helperText={t("fields.assignedStaff.readOnlyHelper")}
                  sx={fieldSx}
                />
              )}

              {/* PREFERRED CATEGORY */}

              <Controller
                name="preferCategory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.preferCategory.label")}
                    error={Boolean(errors.preferCategory)}
                    helperText={errors.preferCategory?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.preferCategory.placeholder")}
                    </MenuItem>

                    {PREFER_CATEGORY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(`preferCategory.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* CURRENT STAGE */}

              <Controller
                name="currentStage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    label={t("fields.currentStage.label")}
                    error={Boolean(errors.currentStage)}
                    helperText={errors.currentStage?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.currentStage.placeholder")}
                    </MenuItem>

                    {CURRENT_STAGES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(`currentStage.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormGrid>

            <Divider
              sx={{
                my: 4,

                borderColor: HAIRLINE,
              }}
            />

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <SectionTitle
              title={t("sections.personal.title")}
              description={t("sections.personal.description")}
            />

            <FormGrid>
              {/* DATE OF BIRTH */}

              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    label={t("fields.dateOfBirth.label")}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    sx={fieldSx}
                  />
                )}
              />

              {/* GENDER */}

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.gender.label")}
                    error={Boolean(errors.gender)}
                    helperText={errors.gender?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.gender.placeholder")}
                    </MenuItem>

                    {GENDER.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(`gender.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* EMAIL */}

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    fullWidth
                    label={t("fields.email.label")}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    sx={fieldSx}
                  />
                )}
              />

              {/* NATIONALITY */}

              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.nationality.label")}
                    error={Boolean(errors.nationality)}
                    helperText={errors.nationality?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.nationality.placeholder")}
                    </MenuItem>

                    {NATIONALITIES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(`nationality.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* CURRENT ADDRESS */}

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.address.label")}
                    placeholder={t("fields.address.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              {/* PREFECTURE */}

              <Controller
                name="prefecture"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.prefecture.label")}
                    error={Boolean(errors.prefecture)}
                    helperText={errors.prefecture?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.prefecture.placeholder")}
                    </MenuItem>

                    {PREFECTURE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(`prefecture.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormGrid>

            <Divider
              sx={{
                my: 4,

                borderColor: HAIRLINE,
              }}
            />

            {/* =================================================
                PASSPORT / RESIDENCE
            ================================================= */}

            <SectionTitle
              title={t("sections.passport.title")}
              description={t("sections.passport.description")}
            />

            <FormGrid>
              {/* PASSPORT NUMBER */}

              <Controller
                name="passportNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.passportNumber.label")}
                    sx={fieldSx}
                  />
                )}
              />

              {/* PASSPORT EXPIRY */}

              <Controller
                name="passportExpiryDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    label={t("fields.passportExpiryDate.label")}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    sx={fieldSx}
                  />
                )}
              />

              {/* STATUS OF RESIDENCE */}

              <Controller
                name="statusOfResidence"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.statusOfResidence.label")}
                    error={Boolean(errors.statusOfResidence)}
                    helperText={errors.statusOfResidence?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.statusOfResidence.placeholder")}
                    </MenuItem>

                    {STATUS_OF_RESIDENCE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(`statusOfResidence.${option.key}` as never)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormGrid>

            <Divider
              sx={{
                my: 4,

                borderColor: HAIRLINE,
              }}
            />

            {/* =================================================
                EDUCATION HISTORY
            ================================================= */}

            <SectionTitle
              title={t("sections.education.title")}
              description={t("sections.education.description")}
            />

            <Box
              sx={{
                display: "flex",

                flexDirection: "column",

                gap: 2.5,
              }}
            >
              {educationFields.map((education, index) => (
                <Box
                  key={education.id}
                  sx={{
                    p: 2.5,

                    border: `1px solid ${HAIRLINE}`,

                    borderRadius: 2.5,

                    bgcolor: "#FAFBFA",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: INK,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {t("education.itemLabel", {
                        number: index + 1,
                      })}
                    </Typography>

                    <Button
                      type="button"
                      variant="outlined"
                      disabled={educationFields.length === 1}
                      onClick={() => removeEducation(index)}
                      sx={{
                        minWidth: 44,
                        height: 40,
                        borderRadius: 2.5,
                        borderColor: HAIRLINE,
                        color: "#DC2626",

                        "&:hover": {
                          borderColor: "rgba(220, 38, 38, 0.35)",
                          bgcolor: "rgba(220, 38, 38, 0.04)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>

                  <EducationGrid>
                    <Controller
                      name={`education.${index}.educationType`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label={t("fields.educationType.label")}
                          error={Boolean(
                            errors.education?.[index]?.educationType,
                          )}
                          helperText={
                            errors.education?.[index]?.educationType?.message
                          }
                          sx={fieldSx}
                        >
                          <MenuItem value="">
                            {t("fields.educationType.placeholder")}
                          </MenuItem>

                          {EDUCATION_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {optionT(
                                `educationType.${option.key}` as never,
                              )}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <Controller
                      name={`education.${index}.schoolName`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("fields.schoolName.label")}
                          placeholder={t("fields.schoolName.placeholder")}
                          error={Boolean(errors.education?.[index]?.schoolName)}
                          helperText={
                            errors.education?.[index]?.schoolName?.message
                          }
                          sx={fieldSx}
                        />
                      )}
                    />

                    <Controller
                      name={`education.${index}.enrollmentDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label={t("fields.enrollmentDate.label")}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          error={Boolean(
                            errors.education?.[index]?.enrollmentDate,
                          )}
                          helperText={
                            errors.education?.[index]?.enrollmentDate?.message
                          }
                          sx={fieldSx}
                        />
                      )}
                    />

                    <Controller
                      name={`education.${index}.graduationDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label={t("fields.graduationDate.label")}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          error={Boolean(
                            errors.education?.[index]?.graduationDate,
                          )}
                          helperText={
                            errors.education?.[index]?.graduationDate?.message
                          }
                          sx={fieldSx}
                        />
                      )}
                    />

                    <Controller
                      name={`education.${index}.major`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("fields.major.label")}
                          placeholder={t("fields.major.placeholder")}
                          error={Boolean(errors.education?.[index]?.major)}
                          helperText={errors.education?.[index]?.major?.message}
                          sx={fieldSx}
                        />
                      )}
                    />
                  </EducationGrid>
                </Box>
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
                  sx={{
                    borderRadius: 2.5,
                    borderColor: "rgba(16, 122, 100, 0.25)",
                    color: BRAND,
                    textTransform: "none",
                    fontWeight: 600,

                    "&:hover": {
                      bgcolor: BRAND_SOFT,
                      borderColor: BRAND,
                    },
                  }}
                >
                  {t("education.add")}
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 3,
                maxWidth: 500,
              }}
            >
              <Controller
                name="japaneseLanguageLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.japaneseLanguageLevel.label")}
                    error={Boolean(errors.japaneseLanguageLevel)}
                    helperText={errors.japaneseLanguageLevel?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">
                      {t("fields.japaneseLanguageLevel.placeholder")}
                    </MenuItem>

                    {JAPANESE_LEVELS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {optionT(
                          `japaneseLanguageLevel.${option.key}` as never,
                        )}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            {/* INTAKE */}

            <Box
              sx={{
                mt: 2.5,

                maxWidth: 500,
              }}
            >
              <Controller
                name="intake"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.intake.label")}
                    placeholder={t("fields.intake.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />
            </Box>

            <Divider
              sx={{
                my: 4,

                borderColor: HAIRLINE,
              }}
            />

            {/* =================================================
                EMPLOYMENT HISTORY
            ================================================= */}

            <SectionTitle
              title={t("sections.employment.title")}
              description={t("sections.employment.description")}
            />

            <Box
              sx={{
                display: "flex",

                flexDirection: "column",

                gap: 2.5,
              }}
            >
              {employmentFields.map((employment, index) => (
                <Box
                  key={employment.id}
                  sx={{
                    p: 2.5,

                    border: `1px solid ${HAIRLINE}`,

                    borderRadius: 2.5,

                    bgcolor: "#FAFBFA",
                  }}
                >
                  <EmploymentGrid>
                    {/* COMPANY NAME */}

                    <Controller
                      name={`employmentHistory.${index}.companyName`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("fields.companyName.label")}
                          placeholder={t("fields.companyName.placeholder")}
                          sx={fieldSx}
                        />
                      )}
                    />

                    {/* START DATE */}

                    <Controller
                      name={`employmentHistory.${index}.startDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label={t("fields.startDate.label")}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          sx={fieldSx}
                        />
                      )}
                    />

                    {/* END DATE */}

                    <Controller
                      name={`employmentHistory.${index}.endDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label={t("fields.endDate.label")}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          sx={fieldSx}
                        />
                      )}
                    />

                    {/* EMPLOYMENT TYPE */}

                    <Controller
                      name={`employmentHistory.${index}.employmentType`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label={t("fields.employmentType.label")}
                          sx={fieldSx}
                        >
                          <MenuItem value="">
                            {t("fields.employmentType.placeholder")}
                          </MenuItem>

                          {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {optionT(`employmentType.${option.key}` as never)}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    {/* REMOVE */}

                    <Button
                      type="button"
                      variant="outlined"
                      disabled={employmentFields.length === 1}
                      onClick={() => removeEmployment(index)}
                      sx={{
                        minWidth: 44,

                        height: 56,

                        borderRadius: 2.5,

                        borderColor: HAIRLINE,

                        color: "#DC2626",

                        "&:hover": {
                          borderColor: "rgba(220, 38, 38, 0.35)",

                          bgcolor: "rgba(220, 38, 38, 0.04)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </EmploymentGrid>
                </Box>
              ))}

              {/* ADD EMPLOYMENT */}

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
                  sx={{
                    borderRadius: 2.5,

                    borderColor: "rgba(16, 122, 100, 0.25)",

                    color: BRAND,

                    textTransform: "none",

                    fontWeight: 600,

                    "&:hover": {
                      bgcolor: BRAND_SOFT,

                      borderColor: BRAND,
                    },
                  }}
                >
                  {t("employment.add")}
                </Button>
              </Box>
            </Box>

            <Divider
              sx={{
                my: 4,

                borderColor: HAIRLINE,
              }}
            />

            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <SectionTitle
              title={t("sections.documents.title")}
              description={t("sections.documents.description")}
            />

            <FormGrid>
              {/* CLIENT IMAGE */}

              <Controller
                name="clientImage"
                control={control}
                render={({ field: { onChange, value, ref, ...field } }) => (
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      startIcon={<CloudUploadOutlinedIcon />}
                      sx={{
                        height: 56,

                        justifyContent: "flex-start",

                        px: 2,

                        color: value ? INK : INK_MUTED,

                        bgcolor: "#ffffff",

                        borderColor: errors.clientImage ? "#DC2626" : HAIRLINE,

                        borderRadius: 2.5,

                        fontSize: 14,

                        fontWeight: 500,

                        textTransform: "none",

                        overflow: "hidden",

                        transition:
                          "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

                        "&:hover": {
                          bgcolor: BRAND_SOFT,

                          borderColor: "rgba(16, 122, 100, 0.35)",
                        },

                        "& .MuiButton-startIcon": {
                          color: BRAND,
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          overflow: "hidden",

                          textOverflow: "ellipsis",

                          whiteSpace: "nowrap",
                        }}
                      >
                        {value ? value.name : t("fields.clientImage.replace")}
                      </Box>

                      <input
                        {...field}
                        ref={ref}
                        hidden
                        type="file"
                        accept="image/*"
                        value={undefined}
                        onChange={(event) => {
                          onChange(event.target.files?.[0] ?? null);
                        }}
                      />
                    </Button>

                    {currentClientImage && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",

                          mt: 1,

                          color: INK_MUTED,

                          fontSize: 11.5,

                          lineHeight: 1.5,

                          overflow: "hidden",

                          textOverflow: "ellipsis",

                          whiteSpace: "nowrap",
                        }}
                      >
                        {t("currentFile")}{" "}
                        <Box
                          component="span"
                          sx={{
                            color: INK,

                            fontWeight: 500,
                          }}
                        >
                          {getFileName(currentClientImage)}
                        </Box>
                      </Typography>
                    )}

                    {errors.clientImage?.message && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",

                          mt: 0.75,

                          color: "#DC2626",

                          fontSize: 11.5,
                        }}
                      >
                        {errors.clientImage.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />

              {/* CV */}

              <Controller
                name="cv"
                control={control}
                render={({ field: { onChange, value, ref, ...field } }) => (
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      startIcon={<CloudUploadOutlinedIcon />}
                      sx={{
                        height: 56,

                        justifyContent: "flex-start",

                        px: 2,

                        color: value ? INK : INK_MUTED,

                        bgcolor: "#ffffff",

                        borderColor: errors.cv ? "#DC2626" : HAIRLINE,

                        borderRadius: 2.5,

                        fontSize: 14,

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
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          overflow: "hidden",

                          textOverflow: "ellipsis",

                          whiteSpace: "nowrap",
                        }}
                      >
                        {value ? value.name : t("fields.cv.replace")}
                      </Box>

                      <input
                        {...field}
                        ref={ref}
                        hidden
                        type="file"
                        accept=".pdf,.doc,.docx"
                        value={undefined}
                        onChange={(event) => {
                          onChange(event.target.files?.[0] ?? null);
                        }}
                      />
                    </Button>

                    {currentCv && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",

                          mt: 1,

                          color: INK_MUTED,

                          fontSize: 11.5,

                          lineHeight: 1.5,

                          overflow: "hidden",

                          textOverflow: "ellipsis",

                          whiteSpace: "nowrap",
                        }}
                      >
                        {t("currentFile")}{" "}
                        <Box
                          component="span"
                          sx={{
                            color: INK,

                            fontWeight: 500,
                          }}
                        >
                          {getFileName(currentCv)}
                        </Box>
                      </Typography>
                    )}

                    {errors.cv?.message && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",

                          mt: 0.75,

                          color: "#DC2626",

                          fontSize: 11.5,
                        }}
                      >
                        {errors.cv.message}
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

                gap: 1.5,

                mt: {
                  xs: 4,

                  md: 5,
                },

                pt: 3,

                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                disabled={loading}
                onClick={handleCancel}
                sx={{
                  minHeight: 42,

                  px: 2.5,

                  borderRadius: 2.5,

                  borderColor: HAIRLINE,

                  color: INK_MUTED,

                  bgcolor: "#ffffff",

                  fontSize: 14,

                  fontWeight: 600,

                  textTransform: "none",

                  "&:hover": {
                    bgcolor: BRAND_SOFT,

                    borderColor: "rgba(16, 122, 100, 0.30)",

                    color: BRAND,
                  },
                }}
              >
                {t("cancel")}
              </Button>

              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }
                sx={{
                  minHeight: 42,

                  px: 2.5,

                  bgcolor: BRAND,

                  color: "#ffffff",

                  borderRadius: 2.5,

                  fontSize: 14,

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
                {loading ? t("saving") : t("saveChanges")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditClient;
