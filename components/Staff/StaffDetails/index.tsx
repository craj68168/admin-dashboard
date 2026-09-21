"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { useAuthStore } from "@/store/auth-store";
import { formatCreatedAt } from "@/utils/format-date";
import { useStaffDetails } from "./hook";
import Performance from "./Performance";
import PerformanceHistory from "./PerformanceHistory";

// =================================================
// THEME TOKENS (matches Staff list / Add-Edit Staff / dashboards / sidebar)
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG = "rgba(17, 24, 39, 0.16)";

const INK = "#111827";
const INK_MUTED = "#4B5563";
const INK_FAINT = "#6B7280";

const softCard = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const pageSx = {
  minHeight: "100vh",
  "@supports (height: 100dvh)": { minHeight: "100dvh" },
  bgcolor: "#F7F8F6",
};

const mainSx = {
  maxWidth: 1200,
  mx: "auto",
  px: { xs: 2, sm: 3, md: 4 },
  py: { xs: 2.5, md: 4 },
};

const cardPadding = { xs: 2.5, sm: 3.5 };

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

const visuallyHiddenSx = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

// =================================================
// AVATAR HELPERS (same as the Staff list)
// =================================================

const AVATAR_TONES = [
  { bg: "#E3F2EE", fg: "#0C5F4F" },
  { bg: "#E6EEFB", fg: "#1D4ED8" },
  { bg: "#FDF1DC", fg: "#92580A" },
  { bg: "#EFE8FA", fg: "#6D3FC0" },
  { bg: "#FBE8EC", fg: "#B4234A" },
];

function toneFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

function getInitials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

// =================================================
// PAGE
// =================================================

export default function StaffDetails() {
  const router = useRouter();
  const t = useTranslations("staffDetails");
  const tList = useTranslations("staffList");
  const role = useAuthStore((state) => state.user?.role);
  const { staff, isLoading, isError, staffId } = useStaffDetails();

  const goBack = () => router.push("/admin/staff");

  if (isLoading) {
    return <DetailsSkeleton message={t("loading")} />;
  }

  if (isError || !staff) {
    return <NotFoundScreen message={t("notFound")} backLabel={t("backToStaff")} onBack={goBack} />;
  }

  const isActive = staff.isActive !== false;
  const displayName = staff.name ?? t("staffMember");
  const tone = toneFor(String(staff.staffId ?? displayName));
  const fallback = t("notAvailable");

  return (
    <Box sx={pageSx}>
      <Box component="main" sx={mainSx}>
        {/* BACK LINK */}
        <Box
          component="button"
          type="button"
          onClick={goBack}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            minHeight: 40,
            mb: 1,
            ml: -0.5,
            px: 0.5,
            border: "none",
            borderRadius: 1.5,
            bgcolor: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
            color: INK_MUTED,
            transition: "color 200ms ease",
            "&:hover": { color: BRAND },
            ...focusRing,
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
          {t("backToStaff")}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
          {/* ================================= */}
          {/* PROFILE CARD */}
          {/* ================================= */}

          <Paper elevation={0} sx={{ ...softCard, p: cardPadding }}>
            {/* HEADER */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
                gap: { xs: 2.5, md: 3 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 2, sm: 2.5 },
                  minWidth: 0,
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    width: { xs: 56, sm: 72 },
                    height: { xs: 56, sm: 72 },
                    borderRadius: "50%",
                    bgcolor: tone.bg,
                    color: tone.fg,
                    fontSize: { xs: 20, sm: 26 },
                    fontWeight: 600,
                    letterSpacing: 0.3,
                  }}
                >
                  {getInitials(staff.name)}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: 22, md: 28 },
                      fontWeight: 600,
                      letterSpacing: -0.4,
                      lineHeight: 1.2,
                      color: INK,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {displayName}
                  </Typography>

                  <Box
                    sx={{
                      mt: 0.75,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      columnGap: 1.5,
                      rowGap: 0.75,
                    }}
                  >
                    <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
                      {t("staffId", { id: staff.staffId ?? fallback })}
                    </Typography>
                    <StatusPill
                      active={isActive}
                      label={isActive ? t("status.active") : t("status.inactive")}
                    />
                  </Box>
                </Box>
              </Box>

              {/* ACTIONS */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexShrink: 0,
                  "& > *": { flex: { xs: 1, md: "none" } },
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<PersonSearchIcon />}
                  onClick={() => router.push(`/admin/staff/${staff.staffId}/clients`)}
                  sx={{
                    minHeight: 42,
                    px: 2,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    color: INK,
                    borderColor: HAIRLINE_STRONG,
                    "&:hover": {
                      borderColor: BRAND,
                      bgcolor: BRAND_SOFT,
                      color: BRAND_DARK,
                    },
                    ...focusRing,
                  }}
                >
                  {tList("actions.viewClients")}
                </Button>

                {role === "superadmin" && (
                  <Button
                    variant="contained"
                    disableElevation
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => router.push(`/admin/staff/${staff.staffId}/edit`)}
                    sx={{
                      minHeight: 42,
                      px: 2.5,
                      borderRadius: 2.5,
                      bgcolor: BRAND,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "none",
                      "&:hover": { bgcolor: BRAND_DARK, boxShadow: "none" },
                      ...focusRing,
                    }}
                  >
                    {tList("actions.edit")}
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: { xs: 2.5, sm: 3.5 }, borderColor: HAIRLINE }} />

            {/* DETAILS */}
            <Box
              component="dl"
              sx={{
                m: 0,
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 2.5, sm: 3 },
              }}
            >
              <Detail
                icon={<EmailOutlinedIcon fontSize="small" />}
                label={t("details.email")}
                value={staff.email}
                fallback={fallback}
                href={staff.email ? `mailto:${staff.email}` : undefined}
              />
              <Detail
                icon={<PhoneOutlinedIcon fontSize="small" />}
                label={t("details.phone")}
                value={staff.phone}
                fallback={fallback}
                href={staff.phone ? `tel:${String(staff.phone).replace(/\s+/g, "")}` : undefined}
              />
              <Detail
                icon={<PlaceOutlinedIcon fontSize="small" />}
                label={t("details.location")}
                value={staff.location}
                fallback={fallback}
              />
              <Detail
                icon={<BadgeOutlinedIcon fontSize="small" />}
                label={t("details.role")}
                value={staff.role}
                fallback={fallback}
                capitalize
              />
              <Detail
                icon={<PeopleAltOutlinedIcon fontSize="small" />}
                label={t("details.assignedClients")}
                value={staff.totalClients}
                fallback={fallback}
              />
              <Detail
                icon={<CalendarTodayOutlinedIcon fontSize="small" />}
                label={t("details.createdAt")}
                value={formatCreatedAt(staff.createdAt)}
                fallback={fallback}
              />
            </Box>
          </Paper>

          {/* ================================= */}
          {/* PERFORMANCE */}
          {/* ================================= */}

          <Paper
            elevation={0}
            sx={{ ...softCard, p: cardPadding, minWidth: 0, overflowX: "auto" }}
          >
            <Performance staffId={staffId} />
          </Paper>

          <Paper
            elevation={0}
            sx={{ ...softCard, p: cardPadding, minWidth: 0, overflowX: "auto" }}
          >
            <PerformanceHistory staffId={staffId} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

// =================================================
// STATUS PILL (same look as the Staff list)
// =================================================

function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.375,
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        color: active ? BRAND_DARK : INK_MUTED,
        bgcolor: active ? BRAND_SOFT : "rgba(17, 24, 39, 0.06)",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: active ? BRAND : "#9CA3AF",
        }}
      />
      {label}
    </Box>
  );
}

// =================================================
// DETAIL
// =================================================

function Detail({
  icon,
  label,
  value,
  fallback = "N/A",
  href,
  capitalize,
}: {
  icon: ReactNode;
  label: string;
  value?: string | number | null;
  fallback?: string;
  href?: string;
  capitalize?: boolean;
}) {
  // A value of 0 (e.g. no assigned clients) is real data, not "missing".
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
      <Box
        aria-hidden
        sx={{
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: BRAND_SOFT,
          color: BRAND,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="dt"
          sx={{ fontSize: 13, fontWeight: 500, color: INK_FAINT, lineHeight: 1.4 }}
        >
          {label}
        </Typography>

        <Typography
          component="dd"
          sx={{
            m: 0,
            mt: 0.25,
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.45,
            color: hasValue ? INK : INK_FAINT,
            overflowWrap: "anywhere",
            textTransform: capitalize && hasValue ? "capitalize" : "none",
          }}
        >
          {hasValue && href ? (
            <Box
              component="a"
              href={href}
              sx={{
                color: "inherit",
                textDecoration: "none",
                borderRadius: 0.5,
                "&:hover": { color: BRAND, textDecoration: "underline" },
                ...focusRing,
              }}
            >
              {value}
            </Box>
          ) : hasValue ? (
            value
          ) : (
            fallback
          )}
        </Typography>
      </Box>
    </Box>
  );
}

// =================================================
// LOADING STATE (keeps the layout stable instead of a lone spinner)
// =================================================

function DetailsSkeleton({ message }: { message: string }) {
  return (
    <Box sx={pageSx}>
      <Box component="main" role="status" aria-busy="true" sx={mainSx}>
        <Typography sx={visuallyHiddenSx}>{message}</Typography>

        <Skeleton width={120} height={28} sx={{ mb: 1 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
          <Paper elevation={0} sx={{ ...softCard, p: cardPadding }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="50%" height={32} />
                <Skeleton width="30%" height={22} />
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: HAIRLINE }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1.5 }}>
                  <Skeleton variant="rounded" width={36} height={36} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="40%" height={18} />
                    <Skeleton width="70%" height={24} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ ...softCard, p: cardPadding }}>
            <Skeleton variant="rounded" height={180} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

// =================================================
// NOT FOUND / ERROR STATE
// =================================================

function NotFoundScreen({
  message,
  backLabel,
  onBack,
}: {
  message: string;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <Box sx={{ ...pageSx, display: "grid", placeItems: "center", px: 2 }}>
      <Paper
        elevation={0}
        role="alert"
        sx={{
          ...softCard,
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: "grid",
            placeItems: "center",
            width: 48,
            height: 48,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            bgcolor: "#FEF2F2",
            color: "#DC2626",
          }}
        >
          <ErrorOutlineRoundedIcon />
        </Box>

        <Typography sx={{ fontSize: 15, color: INK, fontWeight: 500 }}>
          {message}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={onBack}
          sx={{
            mt: 2.5,
            minHeight: 42,
            px: 2.5,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 600,
            color: INK,
            borderColor: HAIRLINE_STRONG,
            "&:hover": {
              borderColor: BRAND,
              bgcolor: BRAND_SOFT,
              color: BRAND_DARK,
            },
            ...focusRing,
          }}
        >
          {backLabel}
        </Button>
      </Paper>
    </Box>
  );
}