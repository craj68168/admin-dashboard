"use client";

import type { ReactNode } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { Controller } from "react-hook-form";

import Breadcrumb from "@/components/Breadcrumb";

import { useEditClientHook } from "./hook";

import { CLIENT_STATUSES, COE_STATUSES, VISA_TYPES } from "./type";

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
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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

        gap: 3,
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

const EditClient = () => {
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

  const loading = isSubmitting || isUpdating;

  // =================================================
  // LOADING CLIENT
  // =================================================

  if (isClientLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
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
          p: 4,
        }}
      >
        <Alert severity="error">{loadError || "Client not found."}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f4f6",
        px: 4,
        pb: 4,
      }}
    >
      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <Box sx={{ mb: 3 }}>
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
              label: client.fullName,
              href: `/admin/client/clientDetailPage?clientId=${clientId}`,
            },

            {
              label: "Edit Client",
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
          maxWidth: 1100,
          mx: "auto",

          bgcolor: "white",

          borderRadius: 2,

          border: "1px solid",

          borderColor: "divider",

          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Edit Client
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Client ID: <strong>{client.clientId}</strong>
          </Typography>
        </Box>

        {/* =================================================
            UPDATE ERROR
        ================================================= */}

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <SectionTitle
            title="Basic Information"
            description="Client information, status and staff assignment."
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
                  label="Full Name"
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName?.message}
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
                  label="Phone"
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
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
                  label="Visa Type"
                  error={Boolean(errors.visaType)}
                  helperText={errors.visaType?.message}
                >
                  <MenuItem value="">Select visa type</MenuItem>

                  {VISA_TYPES.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* =================================================
                ADMIN STAFF SELECT
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
                    label="Assigned Staff"
                    disabled={isStaffLoading}
                    error={Boolean(errors.assignedStaff)}
                    helperText={errors.assignedStaff?.message}
                  >
                    <MenuItem value="">Select staff</MenuItem>

                    {staffOptions.map((staff) => (
                      <MenuItem key={staff.staffId} value={staff.staffId}>
                        {staff.name} ({staff.staffId})
                        {!staff.isActive ? " - Inactive" : ""}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            {/* =================================================
                STAFF READ-ONLY ASSIGNMENT
            ================================================= */}

            {role === "staff" && (
              <TextField
                fullWidth
                disabled
                label="Assigned Staff"
                value={
                  user
                    ? `${user.name} (${user.staffId})`
                    : client.assignedStaffDetails?.name
                      ? `${client.assignedStaffDetails.name} (${client.assignedStaff})`
                      : client.assignedStaff
                }
                helperText="Staff assignment cannot be changed."
              />
            )}

            <Controller
              name="coeStatus"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="COE Status">
                  {COE_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="clientStatus"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Client Status">
                  {CLIENT_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <SectionTitle
            title="Personal Information"
            description="Personal and contact details."
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
                  label="Date of Birth"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Gender" />
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
                  label="Email"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Nationality" />
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
                    label="Address"
                  />
                )}
              />
            </Box>
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              PASSPORT
          ================================================= */}

          <SectionTitle
            title="Passport & Residence"
            description="Passport and residence information."
          />

          <FormGrid>
            <Controller
              name="passportNumber"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Passport Number" />
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
                  label="Passport Expiry Date"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="statusOfResidence"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Status of Residence" />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              EDUCATION
          ================================================= */}

          <SectionTitle title="Education & Japanese Language" />

          <FormGrid>
            <Controller
              name="lastQualification"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Last Qualification" />
              )}
            />

            <Controller
              name="japaneseLanguageLevel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Japanese Language Level"
                />
              )}
            />

            <Controller
              name="schoolName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="School Name" />
              )}
            />

            <Controller
              name="course"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Course" />
              )}
            />

            <Controller
              name="intake"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Intake" />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              EMPLOYMENT
          ================================================= */}

          <SectionTitle title="Employment" />

          <FormGrid>
            <Controller
              name="jobCategory"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Job Category" />
              )}
            />

            <Controller
              name="jobTitle"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Job Title" />
              )}
            />

            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Company Name" />
              )}
            />

            <Controller
              name="workLocation"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Work Location" />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              SPONSOR
          ================================================= */}

          <SectionTitle title="Sponsor" />

          <FormGrid>
            <Controller
              name="sponsorName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Sponsor Name" />
              )}
            />

            <Controller
              name="sponsorRelationship"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Sponsor Relationship" />
              )}
            />

            <Controller
              name="sponsorStatusOfResidence"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sponsor Status of Residence"
                />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              VISA
          ================================================= */}

          <SectionTitle title="Visa Information" />

          <FormGrid>
            <Controller
              name="visaStatus"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Visa Status" />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              DOCUMENTS
          ================================================= */}

          <SectionTitle
            title="Documents"
            description="Selecting a new file will replace the currently uploaded file."
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
                    }}
                  >
                    {value ? value.name : "Replace Client Image"}

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
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                      }}
                    >
                      Current: {getFileName(currentClientImage)}
                    </Typography>
                  )}

                  {errors.clientImage?.message && (
                    <Typography variant="caption" color="error">
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
                    }}
                  >
                    {value ? value.name : "Replace CV"}

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
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                      }}
                    >
                      Current: {getFileName(currentCv)}
                    </Typography>
                  )}

                  {errors.cv?.message && (
                    <Typography variant="caption" color="error">
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
              justifyContent: "flex-end",
              gap: 2,
              mt: 5,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={loading}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SaveOutlinedIcon />
                )
              }
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditClient;
