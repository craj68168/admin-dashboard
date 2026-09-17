"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Progress from "./Progress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Payments from "./Payments";

import Breadcrumb from "@/components/Breadcrumb";

import { useClientDetailHook } from "./hook";
import Remarks from "./Remarks";
import ClientFees from "./Fees";

// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
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
    <Box
      sx={{
        minWidth: 0,
      }}
    >
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
};

const ClientDetail = () => {
  const t = useTranslations("clientDetail");

  const { clientId, client, isLoading, isError, errorMessage, handleBack } =
    useClientDetailHook();

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

              boxShadow:
                "0 1px 2px rgba(17,24,39,0.02), 0 12px 32px -26px rgba(17,24,39,0.20)",

              "& .MuiAlert-icon": {
                color: "#DC2626",
              },
            }}
          >
            {errorMessage || t("messages.notFound")}
          </Alert>
        </Box>
      </Box>
    );
  }

  const profile = client.profile;

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

            mb: {
              xs: 2.5,
              md: 3,
            },
          }}
        >
          <Box
            sx={{
              minWidth: 0,
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
              gap: 1.5,

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
                width: {
                  xs: "100%",
                  sm: "auto",
                },

                minHeight: 42,

                px: 2.25,

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

                "&:focus-visible": {
                  borderColor: BRAND,
                  outline: "none",
                },

                "& .MuiButton-startIcon .MuiSvgIcon-root": {
                  fontSize: 19,
                },
              }}
            >
              {t("back")}
            </Button>
          </Box>
        </Box>

        {/* =================================================
            DETAIL CARD
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
          <DetailSection title={t("sections.basic")}>
            <DetailGrid>
              <DetailField label={t("fields.clientId")} value={client.clientId} />

              <DetailField label={t("fields.fullName")} value={client.fullName} />

              <DetailField label={t("fields.phone")} value={client.phone} />

              <DetailField
                label={t("fields.visaType")}
                value={t(`visaTypes.${client.visaType}`)}
              />

              <DetailField
                label={t("fields.clientStatus")}
                value={
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
                    {t(`clientStatuses.${client.clientStatus}`)}
                  </Box>
                }
              />

              <DetailField
                label={t("fields.coeStatus")}
                value={t(`coeStatuses.${client.coeStatus}`)}
              />

              <DetailField
                label={t("fields.assignedStaff")}
                value={
                  client.assignedStaffDetails?.name
                    ? `${client.assignedStaffDetails.name} (${client.assignedStaff})`
                    : client.assignedStaff
                }
              />

              <DetailField
                label={t("fields.createdAt")}
                value={formatDate(client.createdAt)}
              />

              <DetailField
                label={t("fields.lastUpdated")}
                value={formatDate(client.updatedAt)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider
            sx={{
              my: {
                xs: 3.5,
                md: 4,
              },
              borderColor: HAIRLINE,
            }}
          />

          {/* PERSONAL */}

          <DetailSection title={t("sections.personal")}>
            <DetailGrid>
              <DetailField
                label={t("fields.dateOfBirth")}
                value={formatDate(profile?.dateOfBirth)}
              />

              <DetailField
                label={t("fields.gender")}
                value={displayValue(profile?.gender)}
              />

              <DetailField
                label={t("fields.email")}
                value={displayValue(profile?.email)}
              />

              <DetailField
                label={t("fields.nationality")}
                value={displayValue(profile?.nationality)}
              />

              <DetailField
                label={t("fields.address")}
                value={displayValue(profile?.address)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          {/* PASSPORT */}

          <DetailSection title={t("sections.passport")}>
            <DetailGrid>
              <DetailField
                label={t("fields.passportNumber")}
                value={displayValue(profile?.passportNumber)}
              />

              <DetailField
                label={t("fields.passportExpiryDate")}
                value={formatDate(profile?.passportExpiryDate)}
              />

              <DetailField
                label={t("fields.statusOfResidence")}
                value={displayValue(profile?.statusOfResidence)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          {/* EDUCATION */}

          <DetailSection title={t("sections.education")}>
            <DetailGrid>
              <DetailField
                label={t("fields.lastQualification")}
                value={displayValue(profile?.lastQualification)}
              />

              <DetailField
                label={t("fields.japaneseLanguageLevel")}
                value={displayValue(profile?.japaneseLanguageLevel)}
              />

              <DetailField
                label={t("fields.schoolName")}
                value={displayValue(profile?.schoolName)}
              />

              <DetailField
                label={t("fields.course")}
                value={displayValue(profile?.course)}
              />

              <DetailField
                label={t("fields.intake")}
                value={displayValue(profile?.intake)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          {/* EMPLOYMENT */}

          <DetailSection title={t("sections.employment")}>
            <DetailGrid>
              <DetailField
                label={t("fields.jobCategory")}
                value={displayValue(profile?.jobCategory)}
              />

              <DetailField
                label={t("fields.jobTitle")}
                value={displayValue(profile?.jobTitle)}
              />

              <DetailField
                label={t("fields.companyName")}
                value={displayValue(profile?.companyName)}
              />

              <DetailField
                label={t("fields.workLocation")}
                value={displayValue(profile?.workLocation)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          {/* SPONSOR */}

          <DetailSection title={t("sections.sponsor")}>
            <DetailGrid>
              <DetailField
                label={t("fields.sponsorName")}
                value={displayValue(profile?.sponsorName)}
              />

              <DetailField
                label={t("fields.sponsorRelationship")}
                value={displayValue(profile?.sponsorRelationship)}
              />

              <DetailField
                label={t("fields.sponsorStatusOfResidence")}
                value={displayValue(profile?.sponsorStatusOfResidence)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          {/* VISA */}

          <DetailSection title={t("sections.visa")}>
            <DetailGrid>
              <DetailField
                label={t("fields.visaStatus")}
                value={displayValue(profile?.visaStatus)}
              />
            </DetailGrid>
          </DetailSection>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          {/* DOCUMENTS */}

          <DetailSection title={t("sections.documents")}>
            <DetailGrid>
              <DetailField
                label={t("fields.clientImage")}
                value={
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",

                      alignItems: "center",

                      px: 1.2,

                      minHeight: 26,

                      borderRadius: 999,

                      bgcolor: profile?.clientImage
                        ? BRAND_SOFT
                        : "#FEF2F2",

                      color: profile?.clientImage
                        ? BRAND
                        : "#DC2626",

                      fontSize: 12,

                      fontWeight: 600,
                    }}
                  >
                    {profile?.clientImage
                      ? t("documents.uploaded")
                      : t("documents.notUploaded")}
                  </Box>
                }
              />

              <DetailField
                label={t("fields.cv")}
                value={
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",

                      alignItems: "center",

                      px: 1.2,

                      minHeight: 26,

                      borderRadius: 999,

                      bgcolor: profile?.cv
                        ? BRAND_SOFT
                        : "#FEF2F2",

                      color: profile?.cv
                        ? BRAND
                        : "#DC2626",

                      fontSize: 12,

                      fontWeight: 600,
                    }}
                  >
                    {profile?.cv
                      ? t("documents.uploaded")
                      : t("documents.notUploaded")}
                  </Box>
                }
              />
            </DetailGrid>
          </DetailSection>

          {/* Remarks */}

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          <Box
            sx={{
              transition: "all 300ms ease",
            }}
          >
            <Remarks clientId={client.clientId} />
          </Box>

          {/* Progress */}

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          <Box
            sx={{
              transition: "all 300ms ease",
            }}
          >
            <Progress clientId={client.clientId} />
          </Box>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          <Box
            sx={{
              transition: "all 300ms ease",
            }}
          >
            <ClientFees clientId={client.clientId} />
          </Box>

          <Divider
            sx={{
              my: 4,
              borderColor: HAIRLINE,
            }}
          />

          <Box
            sx={{
              transition: "all 300ms ease",
            }}
          >
            <Payments clientId={client.clientId} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientDetail;
