"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { Controller } from "react-hook-form";

import Breadcrumb from "@/components/Breadcrumb";

import { useCreateClientHook } from "./hook";

import { CLIENT_STATUSES, COE_STATUSES, VISA_TYPES } from "./type";

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
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,

    "&::placeholder": {
      color: INK_MUTED,
      opacity: 0.65,
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
// GRID WRAPPER
// =================================================

const FormGrid = ({ children }: { children: React.ReactNode }) => {
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

const CreateClient = () => {
  const t = useTranslations("createClient");

  const {
    user,
    role,

    control,
    errors,
    handleSubmit,

    activeStaff,
    isStaffLoading,

    isSubmitting,
    isCreating,

    serverError,

    onSubmit,
    handleCancel,
  } = useCreateClientHook();

  const loading = isSubmitting || isCreating;

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
          maxWidth: 1100,
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
                label: t("breadcrumbs.createClient"),
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
              PAGE HEADER
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
              {t("description")}
            </Typography>
          </Box>

          {/* =================================================
              ERROR
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
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={t("fields.fullName.label")}
                    placeholder={t("fields.fullName.placeholder")}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName?.message}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={t("fields.phone.label")}
                    placeholder={t("fields.phone.placeholder")}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="visaType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    label={t("fields.visaType.label")}
                    error={Boolean(errors.visaType)}
                    helperText={errors.visaType?.message}
                    sx={fieldSx}
                  >
                    <MenuItem value="">{t("fields.visaType.placeholder")}</MenuItem>

                    {VISA_TYPES.map((item) => (
                      <MenuItem key={item} value={item}>
                        {t(`visaTypes.${item}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* =================================================
                  ADMIN SELECT STAFF
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
                      <MenuItem value="">{t("fields.assignedStaff.placeholder")}</MenuItem>

                      {activeStaff.map((staff) => (
                        <MenuItem key={staff.staffId} value={staff.staffId}>
                          {staff.name} ({staff.staffId})
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}

              {/* =================================================
                  STAFF AUTO ASSIGN
              ================================================= */}

              {role === "staff" && (
                <Controller
                  name="assignedStaff"
                  control={control}
                  render={() => (
                    <TextField
                      fullWidth
                      disabled
                      label={t("fields.assignedStaff.label")}
                      value={user ? `${user.name} (${user.staffId})` : ""}
                      helperText={t("fields.assignedStaff.autoHelper")}
                      sx={fieldSx}
                    />
                  )}
                />
              )}

              <Controller
                name="coeStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.coeStatus.label")}
                    sx={fieldSx}
                  >
                    {COE_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {t(`coeStatuses.${status}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="clientStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("fields.clientStatus.label")}
                    sx={fieldSx}
                  >
                    {CLIENT_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {t(`clientStatuses.${status}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormGrid>

            <Divider
              sx={{
                my: {
                  xs: 3.5,
                  md: 4,
                },
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

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.gender.label")}
                    placeholder={t("fields.gender.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    fullWidth
                    label={t("fields.email.label")}
                    placeholder={t("fields.email.placeholder")}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.nationality.label")}
                    placeholder={t("fields.nationality.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Box
                sx={{
                  gridColumn: {
                    xs: "auto",
                    md: "1 / -1",
                  },
                }}
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      minRows={2}
                      label={t("fields.address.label")}
                      placeholder={t("fields.address.placeholder")}
                      sx={fieldSx}
                    />
                  )}
                />
              </Box>
            </FormGrid>

            <Divider
              sx={{
                my: 4,
                borderColor: HAIRLINE,
              }}
            />

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
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.passportNumber.label")}
                    placeholder={t("fields.passportNumber.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

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

              <Controller
                name="statusOfResidence"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.statusOfResidence.label")}
                    placeholder={t("fields.statusOfResidence.placeholder")}
                    sx={fieldSx}
                  />
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
                EDUCATION
            ================================================= */}

            <SectionTitle
              title={t("sections.education.title")}
              description={t("sections.education.description")}
            />

            <FormGrid>
              <Controller
                name="lastQualification"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.lastQualification.label")}
                    placeholder={t("fields.lastQualification.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="japaneseLanguageLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.japaneseLanguageLevel.label")}
                    placeholder={t("fields.japaneseLanguageLevel.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="schoolName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.schoolName.label")}
                    placeholder={t("fields.schoolName.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="course"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.course.label")}
                    placeholder={t("fields.course.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

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
            </FormGrid>

            <Divider
              sx={{
                my: 4,
                borderColor: HAIRLINE,
              }}
            />

            {/* =================================================
                EMPLOYMENT
            ================================================= */}

            <SectionTitle
              title={t("sections.employment.title")}
              description={t("sections.employment.description")}
            />

            <FormGrid>
              <Controller
                name="jobCategory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.jobCategory.label")}
                    placeholder={t("fields.jobCategory.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.jobTitle.label")}
                    placeholder={t("fields.jobTitle.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="companyName"
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

              <Controller
                name="workLocation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.workLocation.label")}
                    placeholder={t("fields.workLocation.placeholder")}
                    sx={fieldSx}
                  />
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
                SPONSOR
            ================================================= */}

            <SectionTitle
              title={t("sections.sponsor.title")}
              description={t("sections.sponsor.description")}
            />

            <FormGrid>
              <Controller
                name="sponsorName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.sponsorName.label")}
                    placeholder={t("fields.sponsorName.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="sponsorRelationship"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.sponsorRelationship.label")}
                    placeholder={t("fields.sponsorRelationship.placeholder")}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="sponsorStatusOfResidence"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.sponsorStatusOfResidence.label")}
                    placeholder={t("fields.sponsorStatusOfResidence.placeholder")}
                    sx={fieldSx}
                  />
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
                VISA
            ================================================= */}

            <SectionTitle
              title={t("sections.visa.title")}
              description={t("sections.visa.description")}
            />

            <FormGrid>
              <Controller
                name="visaStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("fields.visaStatus.label")}
                    placeholder={t("fields.visaStatus.placeholder")}
                    sx={fieldSx}
                  />
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
                FILES
            ================================================= */}

            <SectionTitle
              title={t("sections.documents.title")}
              description={t("sections.documents.description")}
            />

            <FormGrid>
              {/* =================================================
                  CLIENT IMAGE
              ================================================= */}

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
                      sx={{
                        height: 56,

                        justifyContent: "flex-start",

                        px: 2,

                        color: value ? INK : INK_MUTED,

                        bgcolor: "#ffffff",

                        borderColor: errors.clientImage
                          ? "#DC2626"
                          : HAIRLINE,

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

                        "&:focus-visible": {
                          borderColor: BRAND,

                          outline: "none",
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
                        {value ? value.name : t("fields.clientImage.upload")}
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

                    {errors.clientImage?.message && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.75,
                          ml: 0.25,
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

              {/* =================================================
                  CV
              ================================================= */}

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

                        transition:
                          "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

                        "&:hover": {
                          bgcolor: BRAND_SOFT,

                          borderColor: "rgba(16, 122, 100, 0.35)",
                        },

                        "&:focus-visible": {
                          borderColor: BRAND,

                          outline: "none",
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
                        {value ? value.name : t("fields.cv.upload")}
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

                    {errors.cv?.message && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.75,
                          ml: 0.25,
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
                BUTTONS
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

                  transition:
                    "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

                  "&:hover": {
                    bgcolor: BRAND_SOFT,

                    borderColor: "rgba(16, 122, 100, 0.30)",

                    color: BRAND,
                  },

                  "&.Mui-disabled": {
                    borderColor: HAIRLINE,
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
                    <AddIcon />
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

                  transition:
                    "background-color 200ms ease, box-shadow 200ms ease",

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
                {loading ? t("creating") : t("create")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateClient;
