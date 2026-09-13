"use client";

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
      <Typography variant="h6" fontWeight={600}>
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

        gap: 3,
      }}
    >
      {children}
    </Box>
  );
};

const CreateClient = () => {
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
              label: "Create Client",
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
            PAGE HEADER
        ================================================= */}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700}>
            Create Client
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter the client's information and assign them to a staff member.
          </Typography>
        </Box>

        {/* =================================================
            ERROR
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
            description="Required client information and assignment."
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
                  placeholder="Enter full name"
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
                  placeholder="Enter phone number"
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
                    label="Assigned Staff"
                    disabled={isStaffLoading}
                    error={Boolean(errors.assignedStaff)}
                    helperText={errors.assignedStaff?.message}
                  >
                    <MenuItem value="">Select staff</MenuItem>

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
                    label="Assigned Staff"
                    value={user ? `${user.name} (${user.staffId})` : ""}
                    helperText="This client will automatically be assigned to you."
                  />
                )}
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
                <TextField
                  {...field}
                  fullWidth
                  label="Gender"
                  placeholder="Enter gender"
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
                  label="Email"
                  placeholder="Enter email"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
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
                  label="Nationality"
                  placeholder="Enter nationality"
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
                    label="Address"
                    placeholder="Enter address"
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
                <TextField
                  {...field}
                  fullWidth
                  label="Passport Number"
                  placeholder="Enter passport number"
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
                <TextField
                  {...field}
                  fullWidth
                  label="Status of Residence"
                  placeholder="Enter status of residence"
                />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              EDUCATION
          ================================================= */}

          <SectionTitle
            title="Education & Japanese Language"
            description="Education and Japanese language information."
          />

          <FormGrid>
            <Controller
              name="lastQualification"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Qualification"
                  placeholder="Example: Bachelor"
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
                  label="Japanese Language Level"
                  placeholder="Example: N3"
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
                  label="School Name"
                  placeholder="Enter school name"
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
                  label="Course"
                  placeholder="Enter course"
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
                  label="Intake"
                  placeholder="Example: April 2027"
                />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              EMPLOYMENT
          ================================================= */}

          <SectionTitle
            title="Employment"
            description="Employment and desired job information."
          />

          <FormGrid>
            <Controller
              name="jobCategory"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Job Category"
                  placeholder="Enter job category"
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
                  label="Job Title"
                  placeholder="Enter job title"
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
                  label="Company Name"
                  placeholder="Enter company name"
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
                  label="Work Location"
                  placeholder="Enter work location"
                />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              SPONSOR
          ================================================= */}

          <SectionTitle
            title="Sponsor"
            description="Sponsor information if applicable."
          />

          <FormGrid>
            <Controller
              name="sponsorName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sponsor Name"
                  placeholder="Enter sponsor name"
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
                  label="Sponsor Relationship"
                  placeholder="Enter relationship"
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
                  label="Sponsor Status of Residence"
                  placeholder="Enter sponsor status"
                />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              VISA
          ================================================= */}

          <SectionTitle
            title="Visa Information"
            description="Additional visa information."
          />

          <FormGrid>
            <Controller
              name="visaStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Visa Status"
                  placeholder="Enter visa status"
                />
              )}
            />
          </FormGrid>

          <Divider sx={{ my: 4 }} />

          {/* =================================================
              FILES
          ================================================= */}

          <SectionTitle
            title="Documents"
            description="Upload client image and CV if available."
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
                    }}
                  >
                    {value ? value.name : "Upload Client Image"}

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
                      color="error"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        ml: 1.5,
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
                    }}
                  >
                    {value ? value.name : "Upload CV"}

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
                      color="error"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        ml: 1.5,
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
                  <AddIcon />
                )
              }
            >
              {loading ? "Creating..." : "Create Client"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateClient;
