"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import { formatCreatedAt } from "@/utils/format-date";
import { useStaffDetails } from "./hook";
import Performance from "./Performance";
import PerformanceHistory from "./PerformanceHistory";

// =================================================
// THEME TOKENS (matches Staff list / Add-Edit Staff / dashboards / sidebar)
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  borderRadius: 3,

  border: "1px solid",

  borderColor: HAIRLINE,

  bgcolor: "#ffffff",

  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

export default function StaffDetails() {
  const router = useRouter();
  const t = useTranslations("staffDetails");
  const { staff, isLoading, isError, staffId } = useStaffDetails();

  if (isLoading) {
    return <StatusScreen message={t("loading")} loading />;
  }

  if (isError || !staff) {
    return <StatusScreen message={t("notFound")} />;
  }

  const isActive = staff.isActive !== false;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F8F6" }}>
      <Box
        component="main"
        sx={{
          maxWidth: 1200,

          mx: "auto",

          px: { xs: 2, sm: 3, md: 4 },

          py: { xs: 3, md: 4 },
        }}
      >
        {/* BACK LINK */}

        <Box
          component="button"
          type="button"
          onClick={() => router.push("/admin/staff")}
          sx={{
            display: "inline-flex",

            alignItems: "center",

            gap: 0.75,

            mb: 2.5,

            border: "none",

            bgcolor: "transparent",

            cursor: "pointer",

            fontSize: 13,

            fontWeight: 600,

            color: INK_MUTED,

            transition: "color 200ms ease",

            "&:hover": {
              color: BRAND,
            },
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
          {t("backToStaff")}
        </Box>

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",

            alignItems: { xs: "flex-start", sm: "center" },

            justifyContent: "space-between",

            flexDirection: { xs: "column", sm: "row" },

            gap: 2,

            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "grid",

                placeItems: "center",

                flexShrink: 0,

                width: 48,

                height: 48,

                borderRadius: 2.5,

                bgcolor: BRAND_SOFT,

                color: BRAND,
              }}
            >
              <BadgeOutlinedIcon fontSize="small" />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 22, md: 26 },
                  fontWeight: 600,
                  letterSpacing: -0.4,
                  color: INK,
                }}
              >
                {staff.name ?? t("staffMember")}
              </Typography>

              <Typography sx={{ mt: 0.5, fontSize: 14, color: INK_MUTED }}>
                {t("staffId", { id: staff.staffId ?? t("notAvailable") })}
              </Typography>
            </Box>
          </Box>

          <Chip
            size="small"
            label={isActive ? t("status.active") : t("status.inactive")}
            variant="outlined"
            sx={{
              borderRadius: 999,

              fontWeight: 600,

              borderColor: isActive
                ? "rgba(16, 122, 100, 0.35)"
                : "rgba(220, 38, 38, 0.3)",

              color: isActive ? BRAND : "#DC2626",

              bgcolor: isActive ? BRAND_SOFT : "#FEF2F2",
            }}
          />
        </Box>

        {/* DETAILS CARD */}

        <Paper elevation={0} sx={{ ...softCard, p: { xs: 2.5, sm: 4 } }}>
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },

              gap: 2.5,
            }}
          >
            <Detail
              label={t("details.email")}
              value={staff.email}
              fallback={t("notAvailable")}
            />
            <Detail
              label={t("details.phone")}
              value={staff.phone}
              fallback={t("notAvailable")}
            />
            <Detail
              label={t("details.location")}
              value={staff.location}
              fallback={t("notAvailable")}
            />
            <Detail
              label={t("details.role")}
              value={staff.role}
              fallback={t("notAvailable")}
            />
            <Detail
              label={t("details.assignedClients")}
              value={staff.totalClients}
              fallback={t("notAvailable")}
            />
            <Detail
              label={t("details.createdAt")}
              value={formatCreatedAt(staff.createdAt)}
              fallback={t("notAvailable")}
            />
          </Box>

          <Divider sx={{ my: 3.5, borderColor: HAIRLINE }} />

          <Performance staffId={staffId} />

          <Divider sx={{ my: 3.5, borderColor: HAIRLINE }} />

          <PerformanceHistory staffId={staffId} />
        </Paper>
      </Box>
    </Box>
  );
}

// =================================================
// DETAIL
// =================================================

function Detail({
  label,
  value,
  fallback = "N/A",
}: {
  label: string;
  value?: string | number;
  fallback?: string;
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 12, color: INK_MUTED }}>
        {label}
      </Typography>

      <Typography sx={{ mt: 0.5, fontSize: 15, fontWeight: 600, color: INK }}>
        {value || fallback}
      </Typography>
    </Box>
  );
}

// =================================================
// LOADING / ERROR STATE
// =================================================

function StatusScreen({
  message,
  loading,
}: {
  message: string;
  loading?: boolean;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#F7F8F6",

        display: "grid",

        placeItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        {loading && (
          <CircularProgress size={24} sx={{ color: BRAND, mb: 1.5 }} />
        )}

        <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
