"use client";

import { useEffect, useRef, type ReactNode } from "react";
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
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { useAdminDashboard } from "./hook";

type Props = {
  data: Pick<ReturnType<typeof useAdminDashboard>, "overview"> & {
    overview: NonNullable<ReturnType<typeof useAdminDashboard>["overview"]>;
  };
};

const BRAND_DEEP = "#0A5A49";
const BORDER = "#E6E8EC";
const INK = "#0F172A";
const INK_MUTED = "#5B6472";

const amountFormatter = new Intl.NumberFormat("ja-JP");
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));
const formatYen = (value: number) => `¥${formatAmount(value)}`;

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Entrance runs once on mount: the row itself stays put and each card fades in
 * while rising 8px, 50ms after the previous one. The variant labels never
 * change, so data updates do not replay it.
 */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.08, staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
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

/**
 * Money figures count up once when the cards first appear, so the eye lands on
 * the numbers that matter. When the data changes afterwards the figure eases
 * to its new value instead. Reduced motion shows the value immediately.
 */
function CountUp({
  value,
  format,
}: {
  value: number;
  format: (value: number) => string;
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
      delay: hasRun.current ? 0 : 0.25,
      ease: EASE_OUT,
    });
    hasRun.current = true;
    return () => controls.stop();
  }, [value, reduceMotion, motionValue]);

  return <motion.span>{display}</motion.span>;
}

/** The figure a number in a supporting line is carried by */
function Num({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{ fontWeight: 600, color: INK, fontVariantNumeric: "tabular-nums" }}
    >
      {children}
    </Box>
  );
}

/**
 * primary: the headline figure (this month's collections)
 * default: supporting money figure
 * quiet:   counts, intentionally secondary
 */
type Tone = "primary" | "default" | "quiet";

const TONE_STYLES: Record<
  Tone,
  {
    background: string;
    borderColor: string;
    shadow: string;
    valueColor: string;
    valueSize: { xs: number; md: number };
    valueWeight: number;
    labelColor: string;
  }
> = {
  primary: {
    background: "linear-gradient(160deg, #F4FBF8 0%, #E3F3ED 100%)",
    borderColor: "rgba(16, 122, 100, 0.28)",
    shadow:
      "0 1px 2px rgba(16, 122, 100, 0.08), 0 14px 30px -18px rgba(16, 122, 100, 0.50)",
    valueColor: BRAND_DEEP,
    valueSize: { xs: 26, md: 30 },
    valueWeight: 700,
    labelColor: "#2F5F54",
  },
  default: {
    background: "#ffffff",
    borderColor: BORDER,
    shadow:
      "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 18px -14px rgba(16, 24, 40, 0.16)",
    valueColor: INK,
    valueSize: { xs: 24, md: 26 },
    valueWeight: 700,
    labelColor: INK_MUTED,
  },
  quiet: {
    background: "#ffffff",
    borderColor: BORDER,
    shadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
    valueColor: INK,
    valueSize: { xs: 22, md: 24 },
    valueWeight: 600,
    labelColor: INK_MUTED,
  },
};

type SummaryCardProps = {
  label: string;
  value: string;
  subtitle?: ReactNode;
  tone?: Tone;
  /** When set, the value counts up to this number (text stays identical at rest) */
  countTo?: number;
};

function SummaryCard({
  label,
  value,
  subtitle,
  tone = "default",
  countTo,
}: SummaryCardProps) {
  const style = TONE_STYLES[tone];
  const isMoney = countTo !== undefined;

  return (
    <Paper
      component={motion.div}
      variants={itemVariants}
      variant="outlined"
      sx={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        minWidth: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1,
        p: { xs: 1.75, md: 2 },
        borderRadius: "12px",
        borderColor: style.borderColor,
        background: style.background,
        boxShadow: style.shadow,

        // a soft brand glow in the corner of the headline card only
        ...(tone === "primary" && {
          "&::before": {
            content: '""',
            position: "absolute",
            zIndex: 0,
            top: -70,
            right: -70,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(30, 154, 124, 0.24) 0%, rgba(30, 154, 124, 0) 68%)",
            pointerEvents: "none",
          },
        }),
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: tone === "quiet" ? 400 : 500,
            lineHeight: 1.4,
            color: style.labelColor,
            overflowWrap: "anywhere",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            fontSize: style.valueSize,
            fontWeight: style.valueWeight,
            letterSpacing: tone === "primary" ? -0.8 : -0.5,
            lineHeight: 1.1,
            color: style.valueColor,
            overflowWrap: "anywhere",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isMoney ? (
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
          ) : (
            value
          )}
        </Typography>
      </Box>

      {subtitle && (
        <Typography
          sx={{
            position: "relative",
            zIndex: 1,
            fontSize: 12,
            lineHeight: 1.4,
            color: INK_MUTED,
            overflowWrap: "anywhere",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}

export default function OverviewCards({ data }: Props) {
  const { overview } = data;
  const lang = useLocale();
  const reduceMotion = useReducedMotion();

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      sx={{
        mt: 2,
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          // the two collection cards get more room than the two count cards
          xl: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1.3fr)",
        },
      }}
    >
      <SummaryCard
        tone="quiet"
        label={lang === "ja" ? "総顧客数" : "Total Clients"}
        value={String(overview.totalClients)}
        subtitle={
          <>
            <Num>{overview.monthlyClientCount}</Num>
            {lang === "ja" ? "名が今月入金" : " paying this month"}
          </>
        }
      />

      <SummaryCard
        tone="quiet"
        label={lang === "ja" ? "稼働中スタッフ" : "Active Staff"}
        value={String(overview.activeStaff)}
        subtitle={
          <>
            {lang === "ja" ? "スタッフ総数 " : "of "}
            <Num>{overview.totalStaff}</Num>
            {lang === "ja" ? "名" : " total staff"}
          </>
        }
      />

      <SummaryCard
        tone="primary"
        label={lang === "ja" ? "今月の入金額" : "Collected this month"}
        value={formatYen(overview.monthlyCollected)}
        countTo={overview.monthlyCollected}
        subtitle={
          <>
            <Num>{overview.monthlyPaymentCount}</Num>
            {lang === "ja" ? "件の完了済み入金" : overview.monthlyPaymentCount === 1 ? " completed payment" : " completed payments"}
          </>
        }
      />

      <SummaryCard
        label={lang === "ja" ? "入金総額" : "Total collected"}
        value={formatYen(overview.totalCollectedAllTime)}
        countTo={overview.totalCollectedAllTime}
        subtitle={
          <>
            {lang === "ja" ? (
              <>
                <Num>{overview.totalPayingClients}</Num>名から
                <Num>{overview.totalCompletedPayments}</Num>件の入金
              </>
            ) : (
              <>
                <Num>{overview.totalCompletedPayments}</Num>
                {overview.totalCompletedPayments === 1 ? " payment from " : " payments from "}
                <Num>{overview.totalPayingClients}</Num>
                {overview.totalPayingClients === 1 ? " client" : " clients"}
              </>
            )}
          </>
        }
      />
    </Box>
  );
}
