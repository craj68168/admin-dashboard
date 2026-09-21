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
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

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
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#111827";
const MUTED = "#6B7280";
const DANGER = "#DC2626";

const cardSx = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

// =================================================
// HELPERS
// =================================================

const displayValue = (value?: string | null) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "-";
  }

  return String(value);
};

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

const formatCurrency = (value?: number) => {
  return `¥${Number(value || 0).toLocaleString()}`;
};

const graduationStatusLabel = (value?: string) => {
  const map: Record<string, string> = {
    graduated: "Graduated / 卒業",
    expectedGraduation: "Expected Graduation / 卒業見込",
    currentlyEnrolled: "Currently Enrolled / 在学中",
    withdrawn: "Withdrawn / 中退",
  };

  return value ? map[value] || value : "-";
};

// =================================================
// SECTION
// =================================================

const DetailSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Box>
    <Typography
      sx={{
        color: INK,
        fontSize: 17,
        fontWeight: 700,
        lineHeight: 1.35,
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
  </Box>
);

// =================================================
// DETAIL FIELD
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
      sx={{
        color: MUTED,
        fontSize: 11.5,
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      {label}
    </Typography>

    <Typography
      component="div"
      sx={{
        mt: 0.55,
        color: INK,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.6,
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      }}
    >
      {value ?? "-"}
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
      gap: {
        xs: 2,
        md: 3,
      },
    }}
  >
    {children}
  </Box>
);

// =================================================
// SUB CARD
// =================================================

const DetailCard = ({
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
      borderRadius: 2.5,
      bgcolor: "#FAFBFA",
    }}
  >
    <Typography
      sx={{
        mb: 2,
        color: INK,
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {title}
    </Typography>

    {children}
  </Box>
);

// =================================================
// STATUS
// =================================================

const StatusBadge = ({ children }: { children: ReactNode }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      minHeight: 26,
      px: 1.25,
      borderRadius: 999,
      bgcolor: BRAND_SOFT,
      color: BRAND,
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    {children}
  </Box>
);

// =================================================
// DOCUMENT
// =================================================

const DocumentBadge = ({ uploaded }: { uploaded: boolean }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      minHeight: 26,
      px: 1.25,
      borderRadius: 999,
      bgcolor: uploaded ? BRAND_SOFT : "#FEF2F2",
      color: uploaded ? BRAND : DANGER,
      fontSize: 12,
      fontWeight: 700,
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

    isGeneratingCv,
    cvError,

    handleBack,
    handleEdit,
    handleGenerateJapaneseCv,
  } = useClientDetailHook();

  // =================================================
  // OPTION LABELS
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
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress size={30} sx={{ color: BRAND }} />
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
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <Alert severity="error" sx={{ borderRadius: 2.5 }}>
            {errorMessage || t("messages.notFound")}
          </Alert>
        </Box>
      </Box>
    );
  }

  const profile = client.profile;

  const education = profile?.education ?? [];

  const qualifications = profile?.qualifications ?? [];

  const employmentHistory = profile?.employmentHistory ?? [];

  const skills = profile?.skills ?? [];

  const currentStageName =
    client.currentStageDetails?.name ||
    client.clientStatus ||
    client.currentStage;

  const currentStageAmount = client.currentStageDetails?.amount ?? 0;

  const assignedStaffName = client.assignedStaffDetails?.name
    ? `${client.assignedStaffDetails.name} (${client.assignedStaff})`
    : client.assignedStaff;

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
        pb: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1320,
          mx: "auto",
        }}
      >
        {/* =================================================
        BREADCRUMB
        ================================================= */}

        <Box sx={{ mb: 2.5 }}>
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

        {/* =================================================
        HEADER
        ================================================= */}

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: INK,
                fontSize: {
                  xs: 23,
                  md: 29,
                },
                fontWeight: 700,
                letterSpacing: "-0.025em",
              }}
            >
              {client.fullName}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: MUTED,
                fontSize: 13,
              }}
            >
              Client ID:{" "}
              <Box
                component="span"
                sx={{
                  color: BRAND,
                  fontWeight: 700,
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
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handleBack}
              sx={{
                minHeight: 42,
                borderColor: HAIRLINE,
                color: MUTED,
                bgcolor: "#ffffff",
                textTransform: "none",
              }}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              startIcon={
                isGeneratingCv ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <PictureAsPdfOutlinedIcon />
                )
              }
              disabled={isGeneratingCv}
              onClick={handleGenerateJapaneseCv}
              sx={{
                minHeight: 42,
                borderColor: "#B91C1C",
                color: "#B91C1C",
                bgcolor: "#ffffff",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#991B1B",
                  bgcolor: "#FEF2F2",
                },
              }}
            >
              {isGeneratingCv ? "Generating..." : "Generate Japanese CV"}
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                minHeight: 42,
                bgcolor: BRAND,
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

        {cvError && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
            }}
          >
            {cvError}
          </Alert>
        )}

        {/* =================================================
        DETAIL CARD
        ================================================= */}

        <Box
          sx={{
            ...cardSx,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {/* =================================================
          INTERNAL RECRUITMENT
          ================================================= */}

          <DetailSection
            title="Recruitment Information"
            description="Internal client management information. These fields are not automatically included in the employer CV."
          >
            <DetailGrid>
              <DetailField label="Client ID" value={client.clientId} />

              <DetailField
                label="Preferred Category"
                value={getPreferCategoryLabel(client.preferCategory)}
              />

              <DetailField label="Assigned Staff" value={assignedStaffName} />

              <DetailField
                label="Current Stage"
                value={<StatusBadge>{currentStageName}</StatusBadge>}
              />

              <DetailField
                label="Current Stage Amount"
                value={formatCurrency(currentStageAmount)}
              />

              <DetailField
                label="Intake"
                value={displayValue(profile?.intake)}
              />

              <DetailField
                label="Created At"
                value={formatDate(client.createdAt)}
              />

              <DetailField
                label="Updated At"
                value={formatDate(client.updatedAt)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          PERSONAL
          ================================================= */}

          <DetailSection
            title="Personal Information"
            description="Candidate information used for Japanese resume generation."
          >
            <DetailGrid>
              <DetailField label="Full Name / 氏名" value={client.fullName} />

              <DetailField
                label="Furigana / フリガナ"
                value={displayValue(profile?.furigana)}
              />

              <DetailField label="Phone" value={client.phone} />

              <DetailField label="Email" value={displayValue(profile?.email)} />

              <DetailField
                label="Date of Birth"
                value={formatDate(profile?.dateOfBirth)}
              />

              <DetailField
                label="Gender"
                value={getGenderLabel(profile?.gender)}
              />

              <DetailField
                label="Nationality"
                value={getNationalityLabel(profile?.nationality)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          ADDRESS
          ================================================= */}

          <DetailSection title="Address">
            <DetailGrid>
              <DetailField
                label="Postal Code / 郵便番号"
                value={displayValue(profile?.postalCode)}
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

          {/* =================================================
          IMMIGRATION
          ================================================= */}

          <DetailSection
            title="Immigration & Passport"
            description="Current Visa Status is the primary residence-status field used for the Japanese CV."
          >
            <DetailGrid>
              <DetailField
                label="Current Visa Status / 在留資格"
                value={getCurrentVisaStatusLabel(client.currentVisaStatus)}
              />

              <DetailField
                label="Residence Expiry Date / 在留期限"
                value={formatDate(profile?.residenceExpiryDate)}
              />

              <DetailField
                label="Passport Number"
                value={displayValue(profile?.passportNumber)}
              />

              <DetailField
                label="Passport Expiry Date"
                value={formatDate(profile?.passportExpiryDate)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          EDUCATION
          ================================================= */}

          <DetailSection
            title="Education"
            description="Education history used in the 履歴書."
          >
            {education.length === 0 ? (
              <Typography
                sx={{
                  color: MUTED,
                  fontSize: 13.5,
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
                  <DetailCard
                    key={item._id || `${item.schoolName}-${index}`}
                    title={`Education ${index + 1}`}
                  >
                    <DetailGrid>
                      <DetailField
                        label="School Type"
                        value={getEducationTypeLabel(item.educationType)}
                      />

                      <DetailField
                        label="School Name"
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

                      <DetailField
                        label="Graduation Status"
                        value={graduationStatusLabel(item.graduationStatus)}
                      />
                    </DetailGrid>
                  </DetailCard>
                ))}
              </Box>
            )}
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          JAPANESE / QUALIFICATIONS
          ================================================= */}

          <DetailSection title="Japanese Language & Qualifications">
            <DetailField
              label="Japanese Language Level"
              value={getJapaneseLevelLabel(profile?.japaneseLanguageLevel)}
            />

            <Box sx={{ mt: 3 }}>
              {qualifications.length === 0 ? (
                <Typography
                  sx={{
                    color: MUTED,
                    fontSize: 13.5,
                  }}
                >
                  No qualifications added.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {qualifications.map((item, index) => (
                    <DetailCard
                      key={item._id || `${item.name}-${index}`}
                      title={`Qualification ${index + 1}`}
                    >
                      <DetailGrid>
                        <DetailField
                          label="Qualification / Certificate"
                          value={displayValue(item.name)}
                        />

                        <DetailField
                          label="Level / Score"
                          value={displayValue(item.levelOrScore)}
                        />

                        <DetailField
                          label="Issuer"
                          value={displayValue(item.issuer)}
                        />

                        <DetailField
                          label="Acquired Date"
                          value={formatDate(item.acquiredDate)}
                        />

                        <DetailField
                          label="Expiry Date"
                          value={formatDate(item.expiryDate)}
                        />

                        <DetailField
                          label="Note"
                          value={displayValue(item.note)}
                        />
                      </DetailGrid>
                    </DetailCard>
                  ))}
                </Box>
              )}
            </Box>
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          EMPLOYMENT
          ================================================= */}

          <DetailSection
            title="Employment History"
            description="Detailed employment history used in the 職務経歴書."
          >
            {employmentHistory.length === 0 ? (
              <Typography
                sx={{
                  color: MUTED,
                  fontSize: 13.5,
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
                  <DetailCard
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
                        label="Department"
                        value={displayValue(item.department)}
                      />

                      <DetailField
                        label="Job Title"
                        value={displayValue(item.jobTitle)}
                      />

                      <DetailField
                        label="Work Location"
                        value={displayValue(item.workLocation)}
                      />

                      <DetailField
                        label="Start Date"
                        value={formatDate(item.startDate)}
                      />

                      <DetailField
                        label="End Date"
                        value={
                          item.isCurrent
                            ? "Currently Employed"
                            : formatDate(item.endDate)
                        }
                      />
                    </DetailGrid>

                    {(item.responsibilities || item.achievements) && (
                      <>
                        <Divider
                          sx={{
                            my: 2.5,
                            borderColor: HAIRLINE,
                          }}
                        />

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              lg: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 3,
                          }}
                        >
                          <DetailField
                            label="Responsibilities / Main Duties"
                            value={displayValue(item.responsibilities)}
                          />

                          <DetailField
                            label="Achievements"
                            value={displayValue(item.achievements)}
                          />
                        </Box>
                      </>
                    )}
                  </DetailCard>
                ))}
              </Box>
            )}
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          SKILLS / CAREER
          ================================================= */}

          <DetailSection title="Skills & Career Summary">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "1fr 1.5fr",
                },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    mb: 1,
                    color: MUTED,
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  Skills
                </Typography>

                {skills.length === 0 ? (
                  <Typography
                    sx={{
                      color: INK,
                      fontSize: 14,
                    }}
                  >
                    -
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {skills.map((skill, index) => (
                      <Box
                        key={`${skill}-${index}`}
                        sx={{
                          px: 1.25,
                          py: 0.65,
                          borderRadius: 999,
                          bgcolor: BRAND_SOFT,
                          color: BRAND,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <DetailField
                label="Career Summary / 職務要約"
                value={displayValue(profile?.careerSummary)}
              />
            </Box>
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          APPLICATION CONTENT
          ================================================= */}

          <DetailSection
            title="Japanese Application Content"
            description="Content used in the generated Japanese application documents."
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <DetailField
                label="Motivation / 志望動機"
                value={displayValue(profile?.motivation)}
              />

              <DetailField
                label="Self PR / 自己PR"
                value={displayValue(profile?.selfPR)}
              />

              <DetailField
                label="Desired Conditions / 本人希望記入欄"
                value={displayValue(profile?.desiredConditions)}
              />
            </Box>
          </DetailSection>

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          {/* =================================================
          DOCUMENTS
          ================================================= */}

          <DetailSection title="Documents">
            <DetailGrid>
              <DetailField
                label="Candidate Photo"
                value={
                  <DocumentBadge uploaded={Boolean(profile?.clientImage)} />
                }
              />

              <DetailField
                label="Original Applicant CV"
                value={<DocumentBadge uploaded={Boolean(profile?.cv)} />}
              />
            </DetailGrid>
          </DetailSection>

          {/* =================================================
          REMARKS
          ================================================= */}

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          <Remarks clientId={client.clientId} />

          {/* =================================================
          PROGRESS
          ================================================= */}

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          <Progress clientId={client.clientId} />

          {/* =================================================
          PAYMENTS
          ================================================= */}

          <Divider sx={{ my: 4, borderColor: HAIRLINE }} />

          <Payments clientId={client.clientId} />
        </Box>
      </Box>
    </Box>
  );
};

export default ClientDetail;
