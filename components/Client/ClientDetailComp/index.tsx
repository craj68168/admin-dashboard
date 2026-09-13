"use client";

import type { ReactNode } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useClientDetailHook } from "./hook";
import Remarks from "./Remarks";

// =================================================
// DATE FORMAT
// =================================================

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

// =================================================
// EMPTY VALUE
// =================================================

const displayValue = (value?: string | null) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return value;
};

// =================================================
// SECTION
// =================================================

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
        {title}
      </Typography>

      {children}
    </Box>
  );
};

// =================================================
// DETAIL FIELD
// =================================================

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) => {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 0.4,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
};

// =================================================
// GRID
// =================================================

const DetailGrid = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "repeat(3, 1fr)",
        },

        gap: 3,
      }}
    >
      {children}
    </Box>
  );
};

const ClientDetail = () => {
  const { clientId, client, isLoading, isError, errorMessage, handleBack } =
    useClientDetailHook();

  // =================================================
  // LOADING
  // =================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =================================================
  // ERROR
  // =================================================

  if (isError || !client) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{errorMessage || "Client not found."}</Alert>
      </Box>
    );
  }

  const profile = client.profile;

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
              current: true,
            },
          ]}
        />
      </Box>

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {client.fullName}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Client ID: {clientId}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* =================================================
          DETAIL CARD
      ================================================= */}

      <Box
        sx={{
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
        <DetailSection title="Basic Information">
          <DetailGrid>
            <DetailField label="Client ID" value={client.clientId} />

            <DetailField label="Full Name" value={client.fullName} />

            <DetailField label="Phone" value={client.phone} />

            <DetailField label="Visa Type" value={client.visaType} />

            <DetailField label="Client Status" value={client.clientStatus} />

            <DetailField label="COE Status" value={client.coeStatus} />

            <DetailField
              label="Assigned Staff"
              value={
                client.assignedStaffDetails?.name
                  ? `${client.assignedStaffDetails.name} (${client.assignedStaff})`
                  : client.assignedStaff
              }
            />

            <DetailField
              label="Created At"
              value={formatDate(client.createdAt)}
            />

            <DetailField
              label="Last Updated"
              value={formatDate(client.updatedAt)}
            />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        {/* PERSONAL */}

        <DetailSection title="Personal Information">
          <DetailGrid>
            <DetailField
              label="Date of Birth"
              value={formatDate(profile?.dateOfBirth)}
            />

            <DetailField label="Gender" value={displayValue(profile?.gender)} />

            <DetailField label="Email" value={displayValue(profile?.email)} />

            <DetailField
              label="Nationality"
              value={displayValue(profile?.nationality)}
            />

            <DetailField
              label="Address"
              value={displayValue(profile?.address)}
            />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        {/* PASSPORT */}

        <DetailSection title="Passport & Residence">
          <DetailGrid>
            <DetailField
              label="Passport Number"
              value={displayValue(profile?.passportNumber)}
            />

            <DetailField
              label="Passport Expiry Date"
              value={formatDate(profile?.passportExpiryDate)}
            />

            <DetailField
              label="Status of Residence"
              value={displayValue(profile?.statusOfResidence)}
            />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        {/* EDUCATION */}

        <DetailSection title="Education & Japanese Language">
          <DetailGrid>
            <DetailField
              label="Last Qualification"
              value={displayValue(profile?.lastQualification)}
            />

            <DetailField
              label="Japanese Language Level"
              value={displayValue(profile?.japaneseLanguageLevel)}
            />

            <DetailField
              label="School Name"
              value={displayValue(profile?.schoolName)}
            />

            <DetailField label="Course" value={displayValue(profile?.course)} />

            <DetailField label="Intake" value={displayValue(profile?.intake)} />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        {/* EMPLOYMENT */}

        <DetailSection title="Employment">
          <DetailGrid>
            <DetailField
              label="Job Category"
              value={displayValue(profile?.jobCategory)}
            />

            <DetailField
              label="Job Title"
              value={displayValue(profile?.jobTitle)}
            />

            <DetailField
              label="Company Name"
              value={displayValue(profile?.companyName)}
            />

            <DetailField
              label="Work Location"
              value={displayValue(profile?.workLocation)}
            />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        {/* SPONSOR */}

        <DetailSection title="Sponsor">
          <DetailGrid>
            <DetailField
              label="Sponsor Name"
              value={displayValue(profile?.sponsorName)}
            />

            <DetailField
              label="Sponsor Relationship"
              value={displayValue(profile?.sponsorRelationship)}
            />

            <DetailField
              label="Sponsor Status of Residence"
              value={displayValue(profile?.sponsorStatusOfResidence)}
            />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        {/* VISA */}

        <DetailSection title="Visa Information">
          <DetailGrid>
            <DetailField
              label="Visa Status"
              value={displayValue(profile?.visaStatus)}
            />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        {/* DOCUMENTS */}

        <DetailSection title="Documents">
          <DetailGrid>
            <DetailField
              label="Client Image"
              value={profile?.clientImage ? "Uploaded" : "Not uploaded"}
            />

            <DetailField
              label="CV"
              value={profile?.cv ? "Uploaded" : "Not uploaded"}
            />
          </DetailGrid>
        </DetailSection>

        <Divider sx={{ my: 4 }} />

        <Remarks clientId={client.clientId} />
        {/* BASIC */}
      </Box>
    </Box>
  );
};

export default ClientDetail;
