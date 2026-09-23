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

const DocumentBadge = ({
  uploaded,
  uploadedLabel,
  notUploadedLabel,
}: {
  uploaded: boolean;
  uploadedLabel: string;
  notUploadedLabel: string;
}) => (
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

    {uploaded ? uploadedLabel : notUploadedLabel}
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
  photoUnavailableLabel,
  noPhotoUploadedLabel,
  viewPhotoLabel,
  photoAltLabel,
  viewLabel,
}: {
  src: string;
  name?: string;
  failed: boolean;
  onFail: () => void;
  onOpen: () => void;
  photoUnavailableLabel: string;
  noPhotoUploadedLabel: string;
  viewPhotoLabel: string;
  photoAltLabel: string;
  viewLabel: string;
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
          {src ? photoUnavailableLabel : noPhotoUploadedLabel}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={onOpen}
      aria-label={viewPhotoLabel}
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
        alt={name || photoAltLabel}
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
          {viewLabel}
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

  const getGraduationStatusLabel = (value?: string) => {
    if (!value) {
      return "-";
    }

    const labels: Record<string, string> = {
      graduated: createT("graduationStatus.graduated"),
      expectedGraduation: createT("graduationStatus.expectedGraduation"),
      currentlyEnrolled: createT("graduationStatus.currentlyEnrolled"),
      withdrawn: createT("graduationStatus.withdrawn"),
    };

    return labels[value] || value;
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

  const originalCvUrl =
  getUploadedFileUrl(profile?.cv);

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
            {t("header.title")}
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
              {t("actions.back")}
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
              {isGeneratingCv
                ? t("actions.generating")
                : t("actions.japaneseCv")}
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
              {t("actions.editClient")}
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
                photoUnavailableLabel={t("photo.unavailable")}
                noPhotoUploadedLabel={t("photo.notUploaded")}
                viewPhotoLabel={t("photo.viewPhoto")}
                photoAltLabel={t("photo.alt")}
                viewLabel={t("photo.view")}
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
                <Typography sx={{ mt: 0.25, color: MUTED, fontSize: 13 }}>
                  {profile.furigana}
                </Typography>
              )}

              <Typography sx={{ mt: 1, color: MUTED, fontSize: 12.5 }}>
                {t("fields.clientId")}{" "}
                <Box component="span" sx={{ color: BRAND, fontWeight: 700 }}>
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
              <ContactRow icon={<PhoneOutlinedIcon />} value={client.phone} />
              <ContactRow icon={<EmailOutlinedIcon />} value={profile?.email} />

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
                  {t("documents.photo")}
                </Typography>
                <DocumentBadge
                  uploaded={hasPhoto}
                  uploadedLabel={t("documents.uploaded")}
                  notUploadedLabel={t("documents.notUploaded")}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: MUTED,
                    fontSize: 12.5,
                  }}
                >
                  {t("documents.originalCv")}
                </Typography>

                {originalCvUrl ? (
                  <Button
                    component="a"
                    href={originalCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<PictureAsPdfOutlinedIcon />}
                    sx={{
                      textTransform: "none",
                      color: BRAND,
                      fontWeight: 600,
                      minWidth: "auto",
                    }}
                  >
                    View CV
                  </Button>
                ) : (
                  <DocumentBadge
                    uploaded={false}
                    uploadedLabel={t("documents.uploaded")}
                    notUploadedLabel={t("documents.notUploaded")}
                  />
                )}
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
              title={t("sections.recruitment")}
              description={t("descriptions.recruitment")}
            >
              <FieldGrid>
                <Field label={t("fields.clientId")} value={client.clientId} />

                <Field
                  label={t("fields.preferredCategory")}
                  value={getPreferCategoryLabel(client.preferCategory)}
                />

                <Field
                  label={t("fields.assignedStaff")}
                  value={assignedStaffName}
                />

                <Field
                  label={t("fields.currentStage")}
                  value={<StatusBadge>{currentStageName}</StatusBadge>}
                />

                <Field
                  label={t("fields.currentStageAmount")}
                  value={formatCurrency(currentStageAmount)}
                />

                <Field
                  label={t("fields.intake")}
                  value={displayValue(profile?.intake)}
                />

                <Field
                  label={t("fields.createdAt")}
                  value={formatDate(client.createdAt)}
                />

                <Field
                  label={t("fields.updatedAt")}
                  value={formatDate(client.updatedAt)}
                />
              </FieldGrid>
            </Section>

            {/* PERSONAL */}
            <Section
              title={t("sections.personal")}
              description={t("descriptions.personal")}
            >
              <FieldGrid>
                <Field label={t("fields.fullName")} value={client.fullName} />

                <Field
                  label={t("fields.furigana")}
                  value={displayValue(profile?.furigana)}
                />

                <Field label={t("fields.phone")} value={client.phone} />

                <Field
                  label={t("fields.email")}
                  value={displayValue(profile?.email)}
                />

                <Field
                  label={t("fields.dateOfBirth")}
                  value={formatDate(profile?.dateOfBirth)}
                />

                <Field
                  label={t("fields.gender")}
                  value={getGenderLabel(profile?.gender)}
                />

                <Field
                  label={t("fields.nationality")}
                  value={getNationalityLabel(profile?.nationality)}
                />
              </FieldGrid>
            </Section>

            {/* ADDRESS */}
            <Section title={t("sections.address")}>
              <FieldGrid>
                <Field
                  label={t("fields.postalCode")}
                  value={displayValue(profile?.postalCode)}
                />

                <Field
                  label={t("fields.prefecture")}
                  value={getPrefectureLabel(profile?.prefecture)}
                />

                <Field
                  label={t("fields.address")}
                  value={displayValue(profile?.address)}
                />
              </FieldGrid>
            </Section>

            {/* IMMIGRATION */}
            <Section
              title={t("sections.immigration")}
              description={t("descriptions.immigration")}
            >
              <FieldGrid>
                <Field
                  label={t("fields.currentVisaStatus")}
                  value={getCurrentVisaStatusLabel(client.currentVisaStatus)}
                />

                <Field
                  label={t("fields.residenceExpiryDate")}
                  value={formatDate(profile?.residenceExpiryDate)}
                />

                <Field
                  label={t("fields.passportNumber")}
                  value={displayValue(profile?.passportNumber)}
                />

                <Field
                  label={t("fields.passportExpiryDate")}
                  value={formatDate(profile?.passportExpiryDate)}
                />
              </FieldGrid>
            </Section>

            {/* EDUCATION */}
            <Section
              title={t("sections.education")}
              description={t("descriptions.education")}
            >
              {education.length === 0 ? (
                <EmptyNote>{t("empty.education")}</EmptyNote>
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
                          : t("itemTitles.education", { number: index + 1 })
                      }
                    >
                      <FieldGrid min={180}>
                        <Field
                          label={t("fields.schoolType")}
                          value={getEducationTypeLabel(item.educationType)}
                        />

                        <Field
                          label={t("fields.schoolName")}
                          value={displayValue(item.schoolName)}
                        />

                        <Field
                          label={t("fields.majorCourse")}
                          value={displayValue(item.major)}
                        />

                        <Field
                          label={t("fields.enrollmentDate")}
                          value={formatDate(item.enrollmentDate)}
                        />

                        <Field
                          label={t("fields.graduationDate")}
                          value={formatDate(item.graduationDate)}
                        />

                        <Field
                          label={t("fields.graduationStatus")}
                          value={getGraduationStatusLabel(
                            item.graduationStatus,
                          )}
                        />
                      </FieldGrid>
                    </ItemCard>
                  ))}
                </Box>
              )}
            </Section>

            {/* JAPANESE / QUALIFICATIONS */}
            <Section title={t("sections.japaneseQualifications")}>
              <Field
                label={t("fields.japaneseLanguageLevel")}
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
                  <EmptyNote>{t("empty.qualifications")}</EmptyNote>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {qualifications.map((item, index) => (
                      <ItemCard
                        key={item._id || `${item.name}-${index}`}
                        title={
                          item.name ||
                          t("itemTitles.qualification", { number: index + 1 })
                        }
                      >
                        <FieldGrid min={180}>
                          <Field
                            label={t("fields.qualificationCertificate")}
                            value={displayValue(item.name)}
                          />

                          <Field
                            label={t("fields.levelScore")}
                            value={displayValue(item.levelOrScore)}
                          />

                          <Field
                            label={t("fields.issuer")}
                            value={displayValue(item.issuer)}
                          />

                          <Field
                            label={t("fields.acquiredDate")}
                            value={formatDate(item.acquiredDate)}
                          />

                          <Field
                            label={t("fields.expiryDate")}
                            value={formatDate(item.expiryDate)}
                          />

                          <Field
                            label={t("fields.note")}
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
              title={t("sections.employment")}
              description={t("descriptions.employment")}
            >
              {employmentHistory.length === 0 ? (
                <EmptyNote>{t("empty.employment")}</EmptyNote>
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
                          : t("itemTitles.employment", { number: index + 1 })
                      }
                    >
                      <FieldGrid min={180}>
                        <Field
                          label={t("fields.companyName")}
                          value={displayValue(item.companyName)}
                        />

                        <Field
                          label={t("fields.employmentType")}
                          value={getEmploymentTypeLabel(item.employmentType)}
                        />

                        <Field
                          label={t("fields.department")}
                          value={displayValue(item.department)}
                        />

                        <Field
                          label={t("fields.jobTitle")}
                          value={displayValue(item.jobTitle)}
                        />

                        <Field
                          label={t("fields.workLocation")}
                          value={displayValue(item.workLocation)}
                        />

                        <Field
                          label={t("fields.startDate")}
                          value={formatDate(item.startDate)}
                        />

                        <Field
                          label={t("fields.endDate")}
                          value={
                            item.isCurrent
                              ? t("employment.currentlyEmployed")
                              : formatDate(item.endDate)
                          }
                        />
                      </FieldGrid>

                      {(item.responsibilities || item.achievements) && (
                        <>
                          <Divider sx={{ my: 2.5, borderColor: HAIRLINE }} />

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
                              label={t("fields.responsibilities")}
                              value={displayValue(item.responsibilities)}
                            />

                            <Field
                              label={t("fields.achievements")}
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
            <Section title={t("sections.skillsCareer")}>
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
                    {t("fields.skills")}
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
                  label={t("fields.careerSummary")}
                  value={displayValue(profile?.careerSummary)}
                />
              </Box>
            </Section>

            {/* APPLICATION CONTENT */}
            <Section
              title={t("sections.applicationContent")}
              description={t("descriptions.applicationContent")}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Field
                  label={t("fields.motivation")}
                  value={displayValue(profile?.motivation)}
                />

                <Field
                  label={t("fields.selfPr")}
                  value={displayValue(profile?.selfPR)}
                />

                <Field
                  label={t("fields.desiredConditions")}
                  value={displayValue(profile?.desiredConditions)}
                />
              </Box>
            </Section>

            {/* REMARKS / PROGRESS / PAYMENTS
                These components render their own content, so they get the
                same card shell as every other section. */}
            <Box sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}>
              <Remarks clientId={client.clientId} />
            </Box>

            <Box sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}>
              <Progress clientId={client.clientId} />
            </Box>

            <Box sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 3.5 } }}>
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
          aria-label={t("photo.close")}
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
          alt={client.fullName || t("photo.alt")}
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
