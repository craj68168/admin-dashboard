"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";

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
// DESIGN TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5546";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";
const PAGE_BG = "#F4F6F5";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const MUTED = "#6B7280";
const DANGER = "#B91C1C";
const DANGER_SOFT = "#FEF2F2";

// Japanese resume photos are 3:4 (30 x 40 mm), so the portrait keeps that ratio.
const PHOTO_RATIO = "3 / 4";

const cardSx = {
  bgcolor: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
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

const getUploadedFileUrl = (filePath?: string | null) => {
  if (!filePath) {
    return "";
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

  const backendUrl = apiUrl.replace(/\/api\/?$/, "");

  const normalizedPath = filePath.replace(/\\/g, "/");

  return `${backendUrl}/${normalizedPath.replace(/^\/+/, "")}`;
};

const getInitials = (name?: string) => {
  if (!name) {
    return "";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
// LAYOUT PRIMITIVES
// =================================================

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Box
    component="section"
    sx={{
      ...cardSx,
      p: { xs: 2, sm: 3, md: 3.5 },
    }}
  >
    <Box
      sx={{
        pb: 2,
        mb: 2.5,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: INK,
          fontSize: { xs: 16, md: 17 },
          fontWeight: 700,
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            mt: 0.5,
            color: MUTED,
            fontSize: 12.5,
            lineHeight: 1.55,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>

    {children}
  </Box>
);

const Field = ({ label, value }: { label: string; value?: ReactNode }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      sx={{
        color: MUTED,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.4,
      }}
    >
      {label}
    </Typography>

    <Typography
      component="div"
      sx={{
        mt: 0.5,
        color: INK,
        fontSize: 14.5,
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

// Fields wrap on their own, so no per-breakpoint tuning is needed.
const FieldGrid = ({
  children,
  min = 200,
}: {
  children: ReactNode;
  min?: number;
}) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`,
      columnGap: { xs: 2, md: 3 },
      rowGap: { xs: 2, md: 2.75 },
    }}
  >
    {children}
  </Box>
);

const ItemCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box
    sx={{
      position: "relative",
      p: { xs: 1.75, sm: 2.25 },
      pl: { xs: 2.25, sm: 2.75 },
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 2.5,
      bgcolor: SURFACE_ALT,
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        bgcolor: BRAND,
        opacity: 0.75,
      },
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

const EmptyNote = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      py: 2.5,
      px: 2,
      border: `1px dashed ${HAIRLINE}`,
      borderRadius: 2.5,
      bgcolor: SURFACE_ALT,
      color: MUTED,
      fontSize: 13.5,
      textAlign: "center",
    }}
  >
    {children}
  </Box>
);

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
      lineHeight: 1.2,
    }}
  >
    {children}
  </Box>
);

const DocumentBadge = ({ uploaded }: { uploaded: boolean }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.75,
      minHeight: 26,
      px: 1.25,
      borderRadius: 999,
      bgcolor: uploaded ? BRAND_SOFT : DANGER_SOFT,
      color: uploaded ? BRAND : DANGER,
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    <Box
      component="span"
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "currentColor",
      }}
    />
    {uploaded ? "Uploaded" : "Not uploaded"}
  </Box>
);

// =================================================
// CANDIDATE PHOTO
// =================================================

const CandidatePhoto = ({
  src,
  name,
  failed,
  onFail,
  onOpen,
}: {
  src: string;
  name?: string;
  failed: boolean;
  onFail: () => void;
  onOpen: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const hasPhoto = Boolean(src) && !failed;
  const initials = getInitials(name);

  const frameSx = {
    position: "relative",
    width: "100%",
    aspectRatio: PHOTO_RATIO,
    borderRadius: 2.5,
    overflow: "hidden",
    border: `1px solid ${HAIRLINE}`,
    boxShadow: "0 8px 24px -14px rgba(17,24,39,0.35)",
    bgcolor: "#EEF3F1",
  } as const;

  // No photo, or the file failed to load
  if (!hasPhoto) {
    return (
      <Box
        sx={{
          ...frameSx,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          background: `linear-gradient(160deg, ${BRAND_SOFT}, rgba(16,122,100,0.16))`,
          color: BRAND,
        }}
      >
        {initials ? (
          <Typography
            sx={{
              fontSize: { xs: 26, lg: 42 },
              fontWeight: 700,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            {initials}
          </Typography>
        ) : (
          <PersonOutlineRoundedIcon sx={{ fontSize: { xs: 34, lg: 52 } }} />
        )}

        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: 12,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          {src ? "Photo unavailable" : "No photo uploaded"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={onOpen}
      aria-label="View candidate photo"
      sx={{
        ...frameSx,
        p: 0,
        display: "block",
        cursor: "zoom-in",
        font: "inherit",
        "& .photo-overlay": {
          opacity: 0,
          transition: "opacity 160ms ease",
        },
        "&:hover .photo-overlay, &:focus-visible .photo-overlay": {
          opacity: 1,
        },
        "&:focus-visible": {
          outline: `3px solid ${BRAND}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        component="img"
        src={src}
        alt={name || "Candidate photo"}
        onLoad={() => setLoaded(true)}
        onError={onFail}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 240ms ease",
        }}
      />

      {!loaded && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress size={22} sx={{ color: BRAND }} />
        </Box>
      )}

      <Box
        className="photo-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          pb: 1.25,
          background:
            "linear-gradient(to top, rgba(10,30,25,0.55), rgba(10,30,25,0) 45%)",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <ZoomInRoundedIcon sx={{ fontSize: 16 }} />
          View
        </Box>
      </Box>
    </Box>
  );
};

// =================================================
// CONTACT ROW (profile card)
// =================================================

const ContactRow = ({
  icon,
  value,
}: {
  icon: ReactNode;
  value?: string | null;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      minWidth: 0,
      color: MUTED,
      "& svg": { fontSize: 17, flexShrink: 0 },
    }}
  >
    {icon}
    <Typography
      sx={{
        color: INK,
        fontSize: 13.5,
        fontWeight: 500,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      title={value || undefined}
    >
      {displayValue(value)}
    </Typography>
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

  // Hooks must run before any early return
  const [photoOpen, setPhotoOpen] = useState(false);
  const [failedPhotoUrl, setFailedPhotoUrl] = useState("");

  const candidatePhotoUrl = getUploadedFileUrl(client?.profile?.clientImage);
  const photoFailed = failedPhotoUrl === candidatePhotoUrl;
  const hasPhoto = Boolean(candidatePhotoUrl) && !photoFailed;

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
          bgcolor: PAGE_BG,
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
          bgcolor: PAGE_BG,
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
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
        bgcolor: PAGE_BG,
        px: { xs: 1.5, sm: 3, md: 4 },
        pb: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1360, mx: "auto" }}>
        {/* =================================================
        BREADCRUMB
        ================================================= */}

        <Box sx={{ mb: 2 }}>
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
        HEADER + ACTIONS
        ================================================= */}

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: INK,
              fontSize: { xs: 22, md: 28 },
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            Client profile
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3, auto)",
              },
              gap: 1,
              "& > button": {
                minHeight: 42,
                textTransform: "none",
                fontWeight: 600,
                whiteSpace: "nowrap",
              },
              // Edit is the primary action, keep it on its own row on phones
              "& > button:last-of-type": {
                gridColumn: { xs: "1 / -1", sm: "auto" },
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handleBack}
              sx={{
                borderColor: HAIRLINE,
                color: MUTED,
                bgcolor: SURFACE,
                "&:hover": { borderColor: MUTED, bgcolor: SURFACE },
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
                borderColor: DANGER,
                color: DANGER,
                bgcolor: SURFACE,
                "&:hover": {
                  borderColor: "#991B1B",
                  bgcolor: DANGER_SOFT,
                },
              }}
            >
              {isGeneratingCv ? "Generating..." : "Japanese CV"}
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                bgcolor: BRAND,
                "&:hover": { bgcolor: BRAND_HOVER },
              }}
            >
              Edit client
            </Button>
          </Box>
        </Box>

        {cvError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
            {cvError}
          </Alert>
        )}

        {/* =================================================
        BODY: PROFILE SIDEBAR + CONTENT
        ================================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "300px minmax(0, 1fr)",
            },
            gap: { xs: 2, md: 3 },
            alignItems: "start",
          }}
        >
          {/* -------------------------------------------------
          PROFILE CARD
          ------------------------------------------------- */}

          <Box
            component="aside"
            sx={{
              ...cardSx,
              p: { xs: 2, sm: 2.5 },
              display: "flex",
              flexDirection: { xs: "row", lg: "column" },
              alignItems: { xs: "flex-start", lg: "stretch" },
              flexWrap: { xs: "wrap", lg: "nowrap" },
              gap: { xs: 2, lg: 2.5 },
              position: { lg: "sticky" },
              top: { lg: 16 },
            }}
          >
            {/* Photo */}
            <Box
              sx={{
                width: { xs: 108, sm: 140, lg: "100%" },
                flexShrink: 0,
                // keep the portrait from becoming huge in the sidebar
                maxWidth: { lg: 240 },
                mx: { lg: "auto" },
              }}
            >
              <CandidatePhoto
                src={candidatePhotoUrl}
                name={client.fullName}
                failed={photoFailed}
                onFail={() => setFailedPhotoUrl(candidatePhotoUrl)}
                onOpen={() => setPhotoOpen(true)}
              />
            </Box>

            {/* Identity */}
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 0, lg: "auto" },
                flexBasis: { xs: 0, lg: "auto" },
                // On very narrow screens the name block drops below the photo
                "@media (max-width:399px)": { flexBasis: "100%" },
                textAlign: { xs: "left", lg: "center" },
              }}
            >
              <Typography
                component="h2"
                sx={{
                  color: INK,
                  fontSize: { xs: 19, sm: 22 },
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  wordBreak: "break-word",
                }}
              >
                {client.fullName}
              </Typography>

              {profile?.furigana && (
                <Typography
                  sx={{ mt: 0.25, color: MUTED, fontSize: 13 }}
                >
                  {profile.furigana}
                </Typography>
              )}

              <Typography sx={{ mt: 1, color: MUTED, fontSize: 12.5 }}>
                Client ID{" "}
                <Box
                  component="span"
                  sx={{ color: BRAND, fontWeight: 700 }}
                >
                  {clientId}
                </Box>
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  justifyContent: { xs: "flex-start", lg: "center" },
                }}
              >
                <StatusBadge>{currentStageName}</StatusBadge>
              </Box>
            </Box>

            {/* Contact + documents */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
                pt: 2,
                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              <ContactRow
                icon={<PhoneOutlinedIcon />}
                value={client.phone}
              />
              <ContactRow
                icon={<EmailOutlinedIcon />}
                value={profile?.email}
              />

              <Divider sx={{ my: 0.5, borderColor: HAIRLINE }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography sx={{ color: MUTED, fontSize: 12.5 }}>
                  Photo
                </Typography>
                <DocumentBadge uploaded={hasPhoto} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography sx={{ color: MUTED, fontSize: 12.5 }}>
                  Original CV
                </Typography>
                <DocumentBadge uploaded={Boolean(profile?.cv)} />
              </Box>
            </Box>
          </Box>

          {/* -------------------------------------------------
          MAIN CONTENT
          ------------------------------------------------- */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
              minWidth: 0,
            }}
          >
            {/* RECRUITMENT */}
            <Section
              title="Recruitment information"
              description="Internal client management information. These fields are not automatically included in the employer CV."
            >
              <FieldGrid>
                <Field label="Client ID" value={client.clientId} />

                <Field
                  label="Preferred category"
                  value={getPreferCategoryLabel(client.preferCategory)}
                />

                <Field label="Assigned staff" value={assignedStaffName} />

                <Field
                  label="Current stage"
                  value={<StatusBadge>{currentStageName}</StatusBadge>}
                />

                <Field
                  label="Current stage amount"
                  value={formatCurrency(currentStageAmount)}
                />

                <Field label="Intake" value={displayValue(profile?.intake)} />

                <Field
                  label="Created at"
                  value={formatDate(client.createdAt)}
                />

                <Field
                  label="Updated at"
                  value={formatDate(client.updatedAt)}
                />
              </FieldGrid>
            </Section>

            {/* PERSONAL */}
            <Section
              title="Personal information"
              description="Candidate information used for Japanese resume generation."
            >
              <FieldGrid>
                <Field label="Full name / 氏名" value={client.fullName} />

                <Field
                  label="Furigana / フリガナ"
                  value={displayValue(profile?.furigana)}
                />

                <Field label="Phone" value={client.phone} />

                <Field label="Email" value={displayValue(profile?.email)} />

                <Field
                  label="Date of birth"
                  value={formatDate(profile?.dateOfBirth)}
                />

                <Field
                  label="Gender"
                  value={getGenderLabel(profile?.gender)}
                />

                <Field
                  label="Nationality"
                  value={getNationalityLabel(profile?.nationality)}
                />
              </FieldGrid>
            </Section>

            {/* ADDRESS */}
            <Section title="Address">
              <FieldGrid>
                <Field
                  label="Postal code / 郵便番号"
                  value={displayValue(profile?.postalCode)}
                />

                <Field
                  label="Prefecture"
                  value={getPrefectureLabel(profile?.prefecture)}
                />

                <Field
                  label="Address"
                  value={displayValue(profile?.address)}
                />
              </FieldGrid>
            </Section>

            {/* IMMIGRATION */}
            <Section
              title="Immigration & passport"
              description="Current visa status is the primary residence-status field used for the Japanese CV."
            >
              <FieldGrid>
                <Field
                  label="Current visa status / 在留資格"
                  value={getCurrentVisaStatusLabel(client.currentVisaStatus)}
                />

                <Field
                  label="Residence expiry date / 在留期限"
                  value={formatDate(profile?.residenceExpiryDate)}
                />

                <Field
                  label="Passport number"
                  value={displayValue(profile?.passportNumber)}
                />

                <Field
                  label="Passport expiry date"
                  value={formatDate(profile?.passportExpiryDate)}
                />
              </FieldGrid>
            </Section>

            {/* EDUCATION */}
            <Section
              title="Education"
              description="Education history used in the 履歴書."
            >
              {education.length === 0 ? (
                <EmptyNote>No education history added.</EmptyNote>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {education.map((item, index) => (
                    <ItemCard
                      key={item._id || `${item.schoolName}-${index}`}
                      title={
                        item.schoolName
                          ? item.schoolName
                          : `Education ${index + 1}`
                      }
                    >
                      <FieldGrid min={180}>
                        <Field
                          label="School type"
                          value={getEducationTypeLabel(item.educationType)}
                        />

                        <Field
                          label="School name"
                          value={displayValue(item.schoolName)}
                        />

                        <Field
                          label="Major / course"
                          value={displayValue(item.major)}
                        />

                        <Field
                          label="Enrollment date"
                          value={formatDate(item.enrollmentDate)}
                        />

                        <Field
                          label="Graduation date"
                          value={formatDate(item.graduationDate)}
                        />

                        <Field
                          label="Graduation status"
                          value={graduationStatusLabel(item.graduationStatus)}
                        />
                      </FieldGrid>
                    </ItemCard>
                  ))}
                </Box>
              )}
            </Section>

            {/* JAPANESE / QUALIFICATIONS */}
            <Section title="Japanese language & qualifications">
              <Field
                label="Japanese language level"
                value={
                  profile?.japaneseLanguageLevel ? (
                    <StatusBadge>
                      {getJapaneseLevelLabel(profile.japaneseLanguageLevel)}
                    </StatusBadge>
                  ) : (
                    "-"
                  )
                }
              />

              <Box sx={{ mt: 3 }}>
                {qualifications.length === 0 ? (
                  <EmptyNote>No qualifications added.</EmptyNote>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {qualifications.map((item, index) => (
                      <ItemCard
                        key={item._id || `${item.name}-${index}`}
                        title={item.name || `Qualification ${index + 1}`}
                      >
                        <FieldGrid min={180}>
                          <Field
                            label="Qualification / certificate"
                            value={displayValue(item.name)}
                          />

                          <Field
                            label="Level / score"
                            value={displayValue(item.levelOrScore)}
                          />

                          <Field
                            label="Issuer"
                            value={displayValue(item.issuer)}
                          />

                          <Field
                            label="Acquired date"
                            value={formatDate(item.acquiredDate)}
                          />

                          <Field
                            label="Expiry date"
                            value={formatDate(item.expiryDate)}
                          />

                          <Field
                            label="Note"
                            value={displayValue(item.note)}
                          />
                        </FieldGrid>
                      </ItemCard>
                    ))}
                  </Box>
                )}
              </Box>
            </Section>

            {/* EMPLOYMENT */}
            <Section
              title="Employment history"
              description="Detailed employment history used in the 職務経歴書."
            >
              {employmentHistory.length === 0 ? (
                <EmptyNote>No employment history added.</EmptyNote>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {employmentHistory.map((item, index) => (
                    <ItemCard
                      key={item._id || `${item.companyName}-${index}`}
                      title={
                        item.companyName
                          ? item.companyName
                          : `Employment ${index + 1}`
                      }
                    >
                      <FieldGrid min={180}>
                        <Field
                          label="Company name"
                          value={displayValue(item.companyName)}
                        />

                        <Field
                          label="Employment type"
                          value={getEmploymentTypeLabel(item.employmentType)}
                        />

                        <Field
                          label="Department"
                          value={displayValue(item.department)}
                        />

                        <Field
                          label="Job title"
                          value={displayValue(item.jobTitle)}
                        />

                        <Field
                          label="Work location"
                          value={displayValue(item.workLocation)}
                        />

                        <Field
                          label="Start date"
                          value={formatDate(item.startDate)}
                        />

                        <Field
                          label="End date"
                          value={
                            item.isCurrent
                              ? "Currently employed"
                              : formatDate(item.endDate)
                          }
                        />
                      </FieldGrid>

                      {(item.responsibilities || item.achievements) && (
                        <>
                          <Divider
                            sx={{ my: 2.5, borderColor: HAIRLINE }}
                          />

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "minmax(0, 1fr)",
                                md: "repeat(2, minmax(0, 1fr))",
                              },
                              gap: { xs: 2, md: 3 },
                            }}
                          >
                            <Field
                              label="Responsibilities / main duties"
                              value={displayValue(item.responsibilities)}
                            />

                            <Field
                              label="Achievements"
                              value={displayValue(item.achievements)}
                            />
                          </Box>
                        </>
                      )}
                    </ItemCard>
                  ))}
                </Box>
              )}
            </Section>

            {/* SKILLS / CAREER */}
            <Section title="Skills & career summary">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "minmax(0, 1fr) minmax(0, 1.5fr)",
                  },
                  gap: { xs: 2.5, md: 3 },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      mb: 1,
                      color: MUTED,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Skills
                  </Typography>

                  {skills.length === 0 ? (
                    <Typography sx={{ color: INK, fontSize: 14.5 }}>
                      -
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {skills.map((skill, index) => (
                        <Box
                          key={`${skill}-${index}`}
                          sx={{
                            px: 1.25,
                            py: 0.6,
                            borderRadius: 999,
                            bgcolor: BRAND_SOFT,
                            color: BRAND_DEEP,
                            fontSize: 12.5,
                            fontWeight: 600,
                          }}
                        >
                          {skill}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Field
                  label="Career summary / 職務要約"
                  value={displayValue(profile?.careerSummary)}
                />
              </Box>
            </Section>

            {/* APPLICATION CONTENT */}
            <Section
              title="Japanese application content"
              description="Content used in the generated Japanese application documents."
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                <Field
                  label="Motivation / 志望動機"
                  value={displayValue(profile?.motivation)}
                />

                <Field
                  label="Self PR / 自己PR"
                  value={displayValue(profile?.selfPR)}
                />

                <Field
                  label="Desired conditions / 本人希望記入欄"
                  value={displayValue(profile?.desiredConditions)}
                />
              </Box>
            </Section>

            {/* REMARKS / PROGRESS / PAYMENTS
                These components render their own content, so they get the
                same card shell as every other section. */}
            <Box
              sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}
            >
              <Remarks clientId={client.clientId} />
            </Box>

            <Box
              sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}
            >
              <Progress clientId={client.clientId} />
            </Box>

            <Box
              sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}
            >
              <Payments clientId={client.clientId} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =================================================
      PHOTO LIGHTBOX
      ================================================= */}

      <Dialog
        open={photoOpen && hasPhoto}
        onClose={() => setPhotoOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              m: { xs: 2, sm: 3 },
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "visible",
              alignItems: "center",
            },
          },
          backdrop: {
            sx: { bgcolor: "rgba(10,20,17,0.78)" },
          },
        }}
      >
        <IconButton
          onClick={() => setPhotoOpen(false)}
          aria-label="Close photo"
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            zIndex: 1,
            bgcolor: SURFACE,
            color: INK,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            "&:hover": { bgcolor: "#F3F4F6" },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>

        <Box
          component="img"
          src={candidatePhotoUrl}
          alt={client.fullName || "Candidate photo"}
          sx={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "82vh",
            objectFit: "contain",
            borderRadius: 2.5,
            bgcolor: SURFACE,
          }}
        />
      </Dialog>
    </Box>
  );
};

export default ClientDetail;