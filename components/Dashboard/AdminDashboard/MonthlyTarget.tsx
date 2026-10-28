"use client";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import type { useAdminDashboard } from "./hook";
type Props = {
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    "selectedMonth" | "overview"
  > & {
    overview: NonNullable<ReturnType<typeof useAdminDashboard>["overview"]>;
  };
};
const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_BRIGHT = "#1E9A7C";
const RADIUS = 20;
const NUMERIC = {
  fontVariantNumeric: "tabular-nums",
};
const amountFormatter = new Intl.NumberFormat("ja-JP");
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));
type StatProps = {
  label: string;
  value: string;
  color?: string;
};
function Stat({ label, value, color }: StatProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.84)",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: { xs: 18, md: 20 },
          fontWeight: 700,
          letterSpacing: -0.3,
          color: color || "#ffffff",
          overflowWrap: "anywhere",
          ...NUMERIC,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
export default function MonthlyTarget({ data }: Props) {
  const { selectedMonth, overview } = data;
  const t = useTranslations("adminDashboard");
  const targetProgress = Math.min(Math.max(overview.targetAchievement, 0), 100);
  const targetRemaining = Math.max(
    overview.totalTarget - overview.monthlyCollected,
    0,
  );
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: `${RADIUS}px`,
        border: "1px solid",
        borderColor: "rgba(10, 90, 73, 0.30)",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${BRAND_DEEP} 0%, ${BRAND} 52%, ${BRAND_BRIGHT} 100%)`,
        boxShadow: "0 26px 60px -34px rgba(10, 90, 73, 0.70)",
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, md: 3.5 },
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: {
            xs: 3,
            md: 5,
          },
          alignItems: {
            md: "center",
          },
        }}
      >
        {/* =================================================
        PROGRESS SIDE
        ================================================= */}

        <Box
          sx={{
            flex: {
              md: "0 0 320px",
            },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: 2.5,
                bgcolor: "rgba(255,255,255,0.14)",
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.22)",
                color: "#ffffff",
              }}
            >
              <TrackChangesOutlinedIcon sx={{ fontSize: 18 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: -0.2,
                  color: "#ffffff",
                }}
              >
                {t("monthlyCollectionTarget")}
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.80)",
                }}
              >
                {selectedMonth}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "flex-end",
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 40, md: 46 },
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1,
                color: "#ffffff",
                ...NUMERIC,
              }}
            >
              {overview.targetAchievement}%
            </Typography>

            <Typography
              sx={{
                pb: 0.75,
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {t("achievement")}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={targetProgress}
            aria-label={t("monthlyCollectionTarget")}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: 999,
              bgcolor: "rgba(255, 255, 255, 0.20)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                backgroundImage: "linear-gradient(90deg, #FFFFFF, #CFF3E6)",
                transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              },
            }}
          />
        </Box>

        {/* =================================================
        STATS SIDE
        ================================================= */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 3,
            borderTop: {
              xs: `1px solid rgba(255,255,255,0.18)`,
              md: "0",
            },
            pt: {
              xs: 2.5,
              md: 0,
            },
          }}
        >
          <Stat
            label={t("totalTarget")}
            value={`¥${formatAmount(overview.totalTarget)}`}
          />

          <Stat
            label={t("collected")}
            value={`¥${formatAmount(overview.monthlyCollected)}`}
            color="#CFF3E6"
          />

          <Stat label="Remaining" value={`¥${formatAmount(targetRemaining)}`} />
        </Box>
      </Box>
    </Paper>
  );
}
