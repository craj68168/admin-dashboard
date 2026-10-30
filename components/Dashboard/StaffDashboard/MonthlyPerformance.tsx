"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { StaffDashboardOverview, StaffDashboardStatus } from "./type";
import { BRAND, BRAND_DEEP, BRAND_LIGHT, yen } from "./shared";

type Props = {
  overview: StaffDashboardOverview;
  selectedMonth: string;
  isFetching: boolean;
};

const STATUS_STYLE: Record<StaffDashboardStatus, { bg: string; fg: string; dot: string }> = {
  Achieved: { bg: "rgba(127,209,181,0.22)", fg: "#E8FFF6", dot: BRAND_LIGHT },
  "In Progress": { bg: "rgba(251,191,36,0.20)", fg: "#FFF4D6", dot: "#FBBF24" },
  "No Target": { bg: "rgba(147,197,253,0.20)", fg: "#E6F0FF", dot: "#93C5FD" },
  "Not Started": { bg: "rgba(255,255,255,0.14)", fg: "#F1F5F9", dot: "#CBD5E1" },
};

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 18,
          fontWeight: 700,
          color: "#ffffff",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function MonthlyPerformance({ overview, selectedMonth, isFetching }: Props) {
  const t = useTranslations("staffDashboard");
  const progressValue = Math.min(Math.max(overview.achievementPercentage, 0), 100);
  const performanceStatusLabel: Record<StaffDashboardStatus, string> = {
    "No Target": t("status.noTarget"),
    "Not Started": t("status.notStarted"),
    "In Progress": t("status.inProgress"),
    Achieved: t("status.achieved"),
  };
  const status = STATUS_STYLE[overview.performanceStatus] ?? STATUS_STYLE["Not Started"];
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 5,
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${BRAND_DEEP} 0%, ${BRAND} 60%, #1A9A7E 100%)`,
        boxShadow: "0 24px 48px -28px rgba(11,85,70,0.65)",
        "&::after": {
          content: '""',
          position: "absolute",
          right: -80,
          top: -80,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: { xs: 3, md: 4 },
          gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Ring */}
        <Box sx={{ position: "relative", width: 132, height: 132, mx: { xs: "auto", md: 0 } }}>
          <CircularProgress
            aria-hidden="true"
            variant="determinate"
            value={100}
            size={132}
            thickness={4}
            sx={{ color: "rgba(255,255,255,0.15)", position: "absolute" }}
          />
          <CircularProgress
            aria-label={t("achievement")}
            variant="determinate"
            value={progressValue}
            size={132}
            thickness={4}
            sx={{
              color: BRAND_LIGHT,
              position: "absolute",
              "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
            }}
          />
          <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <Box>
              <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: -0.8 }}>
                {overview.achievementPercentage}%
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                {t("achievement")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Details */}
        <Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
              {t("monthlyPerformance")} · {selectedMonth}
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.35,
                borderRadius: 999,
                bgcolor: status.bg,
                color: status.fg,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: status.dot }} />
              {performanceStatusLabel[overview.performanceStatus]}
            </Box>
          </Box>

          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: 30, md: 38 },
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {yen(overview.totalCollected)}
            <Box component="span" sx={{ ml: 1, fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>
              / {yen(overview.targetAmount)}
            </Box>
          </Typography>

          <LinearProgress
            aria-label={t("achievement")}
            variant="determinate"
            value={progressValue}
            sx={{
              mt: 2,
              height: 8,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.15)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: BRAND_LIGHT,
                transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
              },
            }}
          />

          <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", gap: { xs: 2.5, md: 4 } }}>
            <HeroStat label={t("target")} value={yen(overview.targetAmount)} />
            <HeroStat label={t("collected")} value={yen(overview.totalCollected)} />
            <HeroStat label={t("targetRemaining")} value={yen(overview.remainingAmount)} />
          </Box>

          {isFetching && (
            <Typography sx={{ mt: 1.5, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              {t("refreshing")}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
