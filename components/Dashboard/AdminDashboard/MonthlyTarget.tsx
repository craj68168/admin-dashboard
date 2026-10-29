"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";
import { useLocale } from "next-intl";
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

const BRAND_DARKEST = "#063F33";
const BRAND_DEEP = "#0A5A49";
const BRAND_MID = "#0F7360";
const BRAND_BRIGHT = "#1E9A7C";
const MINT = "#CFF3E6";
const ON_BRAND = "#FFFFFF";
const ON_BRAND_MUTED = "rgba(255, 255, 255, 0.80)";
const TRACK = "rgba(255, 255, 255, 0.16)";
const INSET_FILL = "rgba(255, 255, 255, 0.07)";
const INSET_LINE = "rgba(255, 255, 255, 0.14)";

const NUMERIC = {
  fontVariantNumeric: "tabular-nums",
} as const;

const amountFormatter = new Intl.NumberFormat("ja-JP");
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));
const formatPercent = (value: number) => `${value}%`;

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BAR_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * One entrance for the whole panel, once on mount. It starts after the cards
 * above so the page settles top to bottom. Data updates never replay it
 * because the variant labels never change.
 */
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.3, ease: EASE_OUT },
  },
};

const SR_ONLY = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

// The currency sign sits a little smaller and higher than the digits, the way
// it is set in financial typography, so the amount reads first.
const YEN_SX = {
  display: "inline-block",
  mr: "0.14em",
  fontSize: "0.6em",
  fontWeight: 500,
  opacity: 0.85,
  transform: "translateY(-0.16em)",
} as const;

/** Splits the leading yen sign off a formatted amount so it can be styled */
function Money({ value }: { value: string }) {
  if (!value.startsWith("¥")) return <>{value}</>;
  return (
    <>
      <Box component="span" sx={YEN_SX}>
        ¥
      </Box>
      {value.slice(1)}
    </>
  );
}

/**
 * Figures count up once when the panel first lands, then ease to new values
 * when the data changes. Reduced motion shows the value immediately.
 */
function CountUp({
  value,
  format,
  delay = 0.45,
}: {
  value: number;
  format: (value: number) => string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(reduceMotion ? value : 0);
  const hasRun = useRef(false);

  // whole numbers while counting, the exact value once it lands
  const display = useTransform(motionValue, (n) =>
    format(n === value ? n : Math.round(n)),
  );

  useEffect(() => {
    if (reduceMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: hasRun.current ? 0.5 : 0.9,
      delay: hasRun.current ? 0 : delay,
      ease: EASE_OUT,
    });
    hasRun.current = true;
    return () => controls.stop();
  }, [value, reduceMotion, motionValue, delay]);

  return <motion.span>{display}</motion.span>;
}

type StatProps = {
  label: string;
  value: string;
  color?: string;
  /** The lead figure is larger and spans the full row */
  lead?: boolean;
  /** When set, the value counts up to this number (text stays identical at rest) */
  countTo?: number;
};

function Stat({ label, value, color, lead, countTo }: StatProps) {
  return (
    <Box
      sx={{
        minWidth: 0,
        gridColumn: lead ? "1 / -1" : undefined,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          lineHeight: 1.4,
          color: ON_BRAND_MUTED,
          overflowWrap: "anywhere",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: lead ? { xs: 24, md: 28 } : { xs: 16, md: 18 },
          fontWeight: lead ? 700 : 600,
          letterSpacing: lead ? -1 : -0.3,
          lineHeight: 1.15,
          color: color || ON_BRAND,
          overflowWrap: "anywhere",
          ...NUMERIC,
        }}
      >
        {countTo === undefined ? (
          <Money value={value} />
        ) : (
          <>
            {/* assistive tech and no-JS see the real value, never the mid-count */}
            <Box component="span" sx={SR_ONLY}>
              {value}
            </Box>
            <span aria-hidden="true">
              <Box component="span" sx={YEN_SX}>
                ¥
              </Box>
              <CountUp value={countTo} format={formatAmount} />
            </span>
          </>
        )}
      </Typography>
    </Box>
  );
}

export default function MonthlyTarget({ data }: Props) {
  const { selectedMonth, overview } = data;
  const lang = useLocale();
  const reduceMotion = useReducedMotion();

  const targetProgress = Math.min(Math.max(overview.targetAchievement, 0), 100);
  const targetRemaining = Math.max(
    overview.totalTarget - overview.monthlyCollected,
    0,
  );

  // The bar fills from 0 once the panel has landed, then eases between values
  // when the selected month changes. Reduced motion jumps straight to the value.
  const [animatedProgress, setAnimatedProgress] = useState(
    reduceMotion ? targetProgress : 0,
  );
  const shownProgress = reduceMotion ? targetProgress : animatedProgress;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const timer = window.setTimeout(() => setAnimatedProgress(targetProgress), 450);
    return () => window.clearTimeout(timer);
  }, [targetProgress, reduceMotion]);

  return (
    <Paper
      component={motion.div}
      variants={panelVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      elevation={0}
      sx={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        mt: 2,
        p: { xs: 2, md: 2.5 },
        borderRadius: "14px",
        color: ON_BRAND,
        background: `linear-gradient(135deg, ${BRAND_DARKEST} 0%, ${BRAND_DEEP} 42%, ${BRAND_MID} 100%)`,
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 1px 2px rgba(6, 63, 51, 0.30), 0 24px 48px -28px rgba(10, 90, 73, 0.75)",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: { lg: "center" },
        gap: { xs: 2, md: 3 },

        // two soft glows give the surface depth without adding any lines
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: 0,
          top: -120,
          right: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0) 65%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          zIndex: 0,
          bottom: -160,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND_BRIGHT}59 0%, ${BRAND_BRIGHT}00 66%)`,
          pointerEvents: "none",
        },
      }}
    >
      {/* Achievement: the focal point */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: { lg: "0 1 280px" },
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <TrackChangesOutlinedIcon
            aria-hidden="true"
            sx={{ fontSize: 16, mt: "2px", color: MINT, flexShrink: 0 }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.35,
                color: ON_BRAND,
                overflowWrap: "anywhere",
              }}
            >
              {lang === "ja" ? "月間入金目標" : "Monthly Collection Target"}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: 12,
                lineHeight: 1.4,
                color: ON_BRAND_MUTED,
                ...NUMERIC,
              }}
            >
              {selectedMonth}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
            columnGap: 1.5,
          }}
        >
          <Typography
            sx={{
              position: "relative",
              fontSize: { xs: 36, md: 44 },
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1,
              color: ON_BRAND,
              ...NUMERIC,
            }}
          >
            {/* assistive tech and no-JS see the real value, never the mid-count */}
            <Box component="span" sx={SR_ONLY}>
              {overview.targetAchievement}%
            </Box>
            <span aria-hidden="true">
              <CountUp
                value={overview.targetAchievement}
                format={formatPercent}
                delay={0.4}
              />
            </span>
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              lineHeight: 1.4,
              color: ON_BRAND_MUTED,
            }}
          >
            {lang === "ja" ? "達成率" : "Achievement"}
          </Typography>
        </Box>

        <Box sx={{ position: "relative", mt: 1.75 }}>
          <LinearProgress
            variant="determinate"
            value={shownProgress}
            aria-label={lang === "ja" ? "月間入金目標" : "Monthly Collection Target"}
            aria-valuenow={Math.round(targetProgress)}
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: TRACK,
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                backgroundImage: `linear-gradient(90deg, ${BRAND_BRIGHT}, ${MINT})`,
                transition: `transform 800ms ${BAR_EASE}`,
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              },
            }}
          />

          {/* a bright head marks exactly where the bar ends */}
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: "50%",
              left: `${shownProgress}%`,
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#ffffff",
              boxShadow: `0 0 0 3px rgba(207, 243, 230, 0.28), 0 0 14px 2px rgba(207, 243, 230, 0.55)`,
              transform: "translate(-100%, -50%)",
              opacity: shownProgress > 0 ? 1 : 0,
              pointerEvents: "none",
              transition: `left 800ms ${BAR_EASE}, opacity 200ms ease`,
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
              },
            }}
          />
        </Box>
      </Box>

      {/* Amounts: collected leads, target and remaining support it */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
          columnGap: 2,
          rowGap: 1.5,
          alignContent: "center",
          p: { xs: 1.5, md: 2 },
          borderRadius: "10px",
          overflow: "hidden",
          bgcolor: INSET_FILL,
          border: "1px solid",
          borderColor: INSET_LINE,
        }}
      >
        <Stat
          lead
          label={lang === "ja" ? "入金額" : "Collected"}
          value={`¥${formatAmount(overview.monthlyCollected)}`}
          countTo={overview.monthlyCollected}
          color={MINT}
        />

        <Box
          aria-hidden="true"
          sx={{
            gridColumn: "1 / -1",
            height: "1px",
            bgcolor: INSET_LINE,
          }}
        />

        <Stat
          label={lang === "ja" ? "目標総額" : "Total Target"}
          value={`¥${formatAmount(overview.totalTarget)}`}
        />

        <Stat label={lang === "ja" ? "残額" : "Remaining"} value={`¥${formatAmount(targetRemaining)}`} />
      </Box>
    </Paper>
  );
}
