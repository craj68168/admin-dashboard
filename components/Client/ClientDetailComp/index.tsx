"use client";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  GENDER,
  NATIONALITIES,
  STATUS_OF_RESIDENCE_OPTIONS,
  JAPANESE_LEVELS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/components/constant";
import { useClientDetailHook } from "./hook";
import Remarks from "./Remarks";
import Progress from "./Progress";
import Payments from "./Payments";
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
const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};
// =================================================
// DATE
// =================================================
const formatDate = (value?: string | null) => {
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
// VALUE
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
}) => (
  <Box>
    <Typography
      sx={{
        mb: 2.5,
        color: INK,
        fontSize: 17,
        lineHeight: 1.35,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);
// =================================================
// FIELD
// =================================================
const DetailField = ({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        color: INK_MUTED,
        fontSize: 11.5,
        lineHeight: 1.4,
        fontWeight: 500,
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </Typography>
    <Typography
      component="div"
      variant="body1"
      sx={{
        mt: 0.55,
        color: INK,
        fontSize: 14,
        lineHeight: 1.55,
        fontWeight: 500,
        wordBreak: "break-word",
      }}
    >
      {value || "-"}
    </Typography>
  </Box>
);
// =================================================
// GRID
// =================================================
const DetailGrid = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, minmax(0, 1fr))",
        lg: "repeat(3, minmax(0, 1fr))",
      },
      columnGap: {
        xs: 2,
        md: 3,
      },
      rowGap: {
        xs: 2.25,
        md: 3,
      },
    }}
  >
    {children}
  </Box>
);
// =================================================
// HISTORY CARD
// =================================================
const HistoryCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box
    sx={{
      p: {
        xs: 1.75,
        sm: 2,
      },
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 2,
      bgcolor: "#FAFBFA",
    }}
  >
    <Typography
      sx={{
        mb: 2,
        color: INK,
        fontSize: 13.5,
        fontWeight: 600,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);
// =================================================
// STATUS BADGE
// =================================================
const StatusBadge = ({ children }: { children: ReactNode }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      minHeight: 26,
      px: 1.2,
      borderRadius: 999,
      bgcolor: BRAND_SOFT,
      color: BRAND,
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    {children}
  </Box>
);
// =================================================
// DOCUMENT BADGE
// =================================================
const DocumentBadge = ({ uploaded }: { uploaded: boolean }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: 1.2,
      minHeight: 26,
      borderRadius: 999,
      bgcolor: uploaded ? BRAND_SOFT : "#FEF2F2",
      color: uploaded ? BRAND : DANGER,
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    {uploaded ? "Uploaded" : "Not uploaded"}
  </Box>
);
// =================================================
// CLIENT DETAIL
// =================================================
const ClientDetail = () => {
  const t = useTranslations("clientDetail");
  const createT = useTranslations("createClient");
  const {
    clientId,
    client,
    isLoading,
    isError,
    errorMessage,
    handleBack,
    handleEdit,
  } = useClientDetailHook();
  // =================================================
  // OPTION LABEL HELPERS
  // =================================================
  const getCurrentVisaStatusLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = CURRENT_VISA_STATUS_OPTIONS.find(
      (item) => item.value === value,
    );
    if (!option) {
      return value;
    }
    return createT(`options.currentVisaStatus.${option.key}` as never);
  };
  const getPreferCategoryLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = PREFER_CATEGORY_OPTIONS.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.preferCategory.${option.key}` as never);
  };
  const getGenderLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = GENDER.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.gender.${option.key}` as never);
  };
  const getNationalityLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = NATIONALITIES.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.nationality.${option.key}` as never);
  };
  const getPrefectureLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = PREFECTURE_OPTIONS.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.prefecture.${option.key}` as never);
  };
  const getResidenceLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = STATUS_OF_RESIDENCE_OPTIONS.find(
      (item) => item.value === value,
    );
    if (!option) {
      return value;
    }
    return createT(`options.statusOfResidence.${option.key}` as never);
  };
  const getJapaneseLevelLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = JAPANESE_LEVELS.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.japaneseLanguageLevel.${option.key}` as never);
  };
  const getEducationTypeLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = EDUCATION_TYPE_OPTIONS.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.educationType.${option.key}` as never);
  };
  const getEmploymentTypeLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = EMPLOYMENT_TYPE_OPTIONS.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.employmentType.${option.key}` as never);
  };
  // =================================================
  // LOADING
  // =================================================
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F8F6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          <CircularProgress size={30} thickness={4} sx={{ color: BRAND }} />
        </Box>
      </Box>
    );
  }
  // =================================================
  // ERROR
  // =================================================
  if (isError || !client) {
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
            }}
          >
            {errorMessage || t("messages.notFound")}
          </Alert>
        </Box>
      </Box>
    );
  }
  const profile = client.profile;
  const education = profile?.education ?? [];
  const employmentHistory = profile?.employmentHistory ?? [];
  const currentStageName =
    client.currentStageDetails?.name ||
    client.clientStatus ||
    client.currentStage;
  const currentStageAmount = client.currentStageDetails?.amount ?? 0;
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
          maxWidth: 1320,
          mx: "auto",
        }}
      >
        {/* BREADCRUMB */}
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
                current: true,
              },
            ]}
          />
        </Box>
        {/* HEADER */}
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
            mb: {
              xs: 2.5,
              md: 3,
            },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
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
                wordBreak: "break-word",
              }}
            >
              {client.fullName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.6,
                color: INK_MUTED,
                fontSize: 13.5,
                lineHeight: 1.5,
              }}
            >
              {t("clientIdLabel")}{" "}
              <Box
                component="span"
                sx={{
                  color: BRAND,
                  fontWeight: 600,
                }}
              >
                {clientId}
              </Box>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handleBack}
              sx={{
                minHeight: 42,
                px: 2.25,
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
              {t("back")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                minHeight: 42,
                px: 2.25,
                borderRadius: 2.5,
                bgcolor: BRAND,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: BRAND_HOVER,
                },
              }}
            >
              Edit Client
            </Button>
          </Box>
        </Box>
        {/* CARD */}
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
          {/* BASIC */}
          <DetailSection title="Basic Information">
            <DetailGrid>
              <DetailField label="Client ID" value={client.clientId} />
              <DetailField label="Full Name" value={client.fullName} />
              <DetailField label="Phone" value={client.phone} />
              <DetailField
                label="Current Visa Status"
                value={getCurrentVisaStatusLabel(client.currentVisaStatus)}
              />
              <DetailField
                label="Preferred Category"
                value={getPreferCategoryLabel(client.preferCategory)}
              />
              <DetailField
                label="Current Stage"
                value={<StatusBadge>{currentStageName}</StatusBadge>}
              />
              <DetailField
                label="Stage Amount"
                value={`¥${currentStageAmount.toLocaleString()}`}
              />
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
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
          {/* PERSONAL */}
          <DetailSection title="Personal Information">
            <DetailGrid>
              <DetailField
                label="Date of Birth"
                value={formatDate(profile?.dateOfBirth)}
              />
              <DetailField
                label="Gender"
                value={getGenderLabel(profile?.gender)}
              />
              <DetailField label="Email" value={displayValue(profile?.email)} />
              <DetailField
                label="Nationality"
                value={getNationalityLabel(profile?.nationality)}
              />
              <DetailField
                label="Prefecture"
                value={getPrefectureLabel(profile?.prefecture)}
              />
              <DetailField
                label="Address"
                value={displayValue(profile?.address)}
              />
            </DetailGrid>
          </DetailSection>
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
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
                value={getResidenceLabel(profile?.statusOfResidence)}
              />
            </DetailGrid>
          </DetailSection>
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
          {/* EDUCATION */}
          <DetailSection title="Education & Japanese Language">
            {education.length === 0 ? (
              <Typography
                sx={{
                  color: INK_MUTED,
                  fontSize: 14,
                }}
              >
                No education history added.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {education.map((item, index) => (
                  <HistoryCard
                    key={item._id || `${item.schoolName}-${index}`}
                    title={`Education ${index + 1}`}
                  >
                    <DetailGrid>
                      <DetailField
                        label="School Type"
                        value={getEducationTypeLabel(item.educationType)}
                      />
                      <DetailField
                        label="School"
                        value={displayValue(item.schoolName)}
                      />
                      <DetailField
                        label="Major / Course"
                        value={displayValue(item.major)}
                      />
                      <DetailField
                        label="Enrollment Date"
                        value={formatDate(item.enrollmentDate)}
                      />
                      <DetailField
                        label="Graduation Date"
                        value={formatDate(item.graduationDate)}
                      />
                    </DetailGrid>
                  </HistoryCard>
                ))}
              </Box>
            )}
            <Box sx={{ mt: 2.5 }}>
              <DetailGrid>
                <DetailField
                  label="Japanese Language Level"
                  value={getJapaneseLevelLabel(profile?.japaneseLanguageLevel)}
                />
                <DetailField
                  label="Intake"
                  value={displayValue(profile?.intake)}
                />
              </DetailGrid>
            </Box>
          </DetailSection>
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
          {/* EMPLOYMENT */}
          <DetailSection title="Employment History">
            {employmentHistory.length === 0 ? (
              <Typography
                sx={{
                  color: INK_MUTED,
                  fontSize: 14,
                }}
              >
                No employment history added.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {employmentHistory.map((item, index) => (
                  <HistoryCard
                    key={item._id || `${item.companyName}-${index}`}
                    title={`Employment ${index + 1}`}
                  >
                    <DetailGrid>
                      <DetailField
                        label="Company Name"
                        value={displayValue(item.companyName)}
                      />
                      <DetailField
                        label="Employment Type"
                        value={getEmploymentTypeLabel(item.employmentType)}
                      />
                      <DetailField
                        label="Start Date"
                        value={formatDate(item.startDate)}
                      />
                      <DetailField
                        label="End Date"
                        value={formatDate(item.endDate)}
                      />
                    </DetailGrid>
                  </HistoryCard>
                ))}
              </Box>
            )}
          </DetailSection>
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
          {/* DOCUMENTS */}
          <DetailSection title="Documents">
            <DetailGrid>
              <DetailField
                label="Client Image"
                value={
                  <DocumentBadge uploaded={Boolean(profile?.clientImage)} />
                }
              />
              <DetailField
                label="CV"
                value={<DocumentBadge uploaded={Boolean(profile?.cv)} />}
              />
            </DetailGrid>
          </DetailSection>
          {/* REMARKS */}
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
          <Box>
            <Remarks clientId={client.clientId} />
          </Box>
          {/* PROGRESS */}
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
          <Box>
            <Progress clientId={client.clientId} />
          </Box>
          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />
          {/* PAYMENTS */}
          <Box>
            <Payments clientId={client.clientId} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default ClientDetail;
