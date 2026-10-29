"use client";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import type { useAdminDashboard } from "../hook";
import type { DashboardCharts } from "../type";

type Props = {
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    "selectedMonth" | "overview" | "charts"
  > & {
    overview: NonNullable<ReturnType<typeof useAdminDashboard>["overview"]>;
  };
};

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const TRACK = "rgba(17, 24, 39, 0.05)";
const INK = "#0F172A";
const INK_BODY = "#334155";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;

const NUMERIC = { fontVariantNumeric: "tabular-nums" };

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

const softCard = {
  p: { xs: 2, sm: 2.5, md: 3 },
  borderRadius: `${RADIUS}px`,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
};

const amountFormatter = new Intl.NumberFormat("ja-JP");
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const PILL_TONES: Record<Tone, { bg: string; fg: string; line: string }> = {
  success: {
    bg: "rgba(16, 122, 100, 0.10)",
    fg: BRAND_DEEP,
    line: "rgba(16, 122, 100, 0.24)",
  },
  warning: {
    bg: "rgba(217, 119, 6, 0.10)",
    fg: "#92400E",
    line: "rgba(217, 119, 6, 0.26)",
  },
  danger: {
    bg: "rgba(190, 24, 60, 0.08)",
    fg: "#9F1239",
    line: "rgba(190, 24, 60, 0.22)",
  },
  info: {
    bg: "rgba(37, 99, 235, 0.08)",
    fg: "#1D4ED8",
    line: "rgba(37, 99, 235, 0.20)",
  },
  neutral: {
    bg: "rgba(15, 23, 42, 0.05)",
    fg: INK_MUTED,
    line: "rgba(15, 23, 42, 0.10)",
  },
};

function Pill({ label, tone }: { label: string; tone: Tone }) {
  const palette = PILL_TONES[tone] ?? PILL_TONES.neutral;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        bgcolor: palette.bg,
        color: palette.fg,
        border: "1px solid",
        borderColor: palette.line,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        ...NUMERIC,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "currentColor",
          flexShrink: 0,
        }}
      />
      {label}
    </Box>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
};

function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: { xs: 2, sm: 2.5, md: 3 },
        py: 2,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 34,
          height: 34,
          borderRadius: 2.5,
          bgcolor: BRAND_SOFT,
          color: BRAND,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2, color: INK }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ mt: 0.25, fontSize: 12, fontWeight: 400, color: INK_MUTED }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 400, color: INK_MUTED }}>
        {label}
      </Typography>
      <Typography
        component="div"
        sx={{
          mt: 0.25,
          fontSize: 15,
          fontWeight: 700,
          color: INK_BODY,
          overflowWrap: "anywhere",
          ...NUMERIC,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function EmptyNote({ message }: { message: string }) {
  return (
    <Box sx={{ display: "grid", justifyItems: "center", gap: 2, py: 5, px: 2 }}>
      <svg width="160" height="56" viewBox="0 0 160 56" aria-hidden>
        <path
          d="M4 48 C 36 48, 48 20, 80 28 S 128 8, 156 8"
          fill="none"
          stroke={TRACK}
          strokeWidth={8}
          strokeLinecap="round"
        />
      </svg>
      <Typography
        sx={{ fontSize: 14, fontWeight: 400, color: INK_MUTED, textAlign: "center" }}
      >
        {message}
      </Typography>
    </Box>
  );
}

type ChartsData = DashboardCharts;
type DailyPoint = DashboardCharts["dailyCollection"][number];

const EMPTY_CHARTS: ChartsData = {
  dailyCollection: [],
  staffPerformance: [],
  paymentsByMethod: [],
  paymentsByStatus: [],
};

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  month: "short",
  day: "numeric",
});
const formatCompact = (value: number) =>
  `¥${compactFormatter.format(Number(value || 0))}`;
const formatDayLabel = (key: string) => {
  const date = new Date(`${key}T00:00:00+09:00`);
  return Number.isNaN(date.getTime()) ? key : dayLabelFormatter.format(date);
};
const niceCeil = (value: number) => {
  if (value <= 0) {
    return 1;
  }
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const fraction = value / magnitude;
  const step = [1, 2, 4, 6, 8, 10].find((item) => fraction <= item) ?? 10;
  return step * magnitude;
};

const visuallyHiddenSx = {
  position: "absolute",
  width: 1,
  height: 1,
  m: -1,
  p: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }
    setWidth(Math.floor(node.clientWidth));
    setHeight(Math.floor(node.clientHeight));
    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
      setHeight(Math.floor(entry.contentRect.height));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width, height] as const;
}

function ChartCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        p: 0,
        height: "calc(100% - 90px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        "& > :first-child": { flexShrink: 0 },
      }}
    >
      <SectionHeader title={title} subtitle={subtitle} icon={icon} />
      <Box
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

function LegendDot({
  color,
  dashed = false,
}: {
  color: string;
  dashed?: boolean;
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        flexShrink: 0,
        width: dashed ? 16 : 10,
        height: dashed ? 0 : 10,
        borderRadius: dashed ? 0 : "50%",
        bgcolor: dashed ? "transparent" : color,
        borderTop: dashed ? `2px dashed ${color}` : 0,
      }}
    />
  );
}

function TrendChart({
  days,
  totalTarget,
  selectedMonth,
  todayKey,
}: {
  days: DailyPoint[];
  totalTarget: number;
  selectedMonth: string;
  todayKey: string;
}) {
  const [wrapRef, width, plotHeight] = useElementSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Draw the line once, when the chart scrolls into view. The dashboard
  // fades sections in with whileInView, so a mount-time animation would be
  // finished before anyone sees it.
  const viewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewRef, { once: true, amount: 0.3 });
  const drawn = inView || reduceMotion;

  if (days.length === 0) {
    return <EmptyNote message="No collection data for this month." />;
  }

  const count = days.length;

  // Days after today have no data yet, so the line stops at today.
  let lastIndex = count - 1;
  if (todayKey < `${selectedMonth}-01`) {
    lastIndex = -1;
  } else if (todayKey.startsWith(selectedMonth)) {
    lastIndex = Math.min(Number(todayKey.slice(8, 10)) - 1, count - 1);
  }

  const cumulative: number[] = [];
  let running = 0;
  days.forEach((day, index) => {
    if (index <= lastIndex) {
      running += Number(day.amount || 0);
    }
    cumulative.push(running);
  });

  const collected = lastIndex >= 0 ? cumulative[lastIndex] : 0;
  const hasTarget = totalTarget > 0;
  const paceAt = (index: number) =>
    hasTarget ? (totalTarget * (index + 1)) / count : 0;
  const paceNow = lastIndex >= 0 ? paceAt(lastIndex) : 0;
  const difference = collected - paceNow;
  const bestDay = days.reduce(
    (best, day) => (day.amount > best.amount ? day : best),
    days[0],
  );
  const showBestDay = bestDay && bestDay.amount > 0;

  // Geometry
  const height = plotHeight || (width < 480 ? 200 : 240);
  const pad = { top: 12, right: 12, bottom: 26, left: 52 };
  const innerW = Math.max(width - pad.left - pad.right, 1);
  const innerH = height - pad.top - pad.bottom;
  const yMax = niceCeil(Math.max(collected, hasTarget ? totalTarget : 0, 1));
  const x = (index: number) =>
    pad.left + (count > 1 ? (index / (count - 1)) * innerW : innerW / 2);
  const y = (value: number) => pad.top + innerH * (1 - value / yMax);

  const points = cumulative
    .slice(0, lastIndex + 1)
    .map((value, index) => `${x(index)},${y(value)}`);
  const linePath = points.length > 0 ? `M${points.join(" L")}` : "";
  const areaPath =
    points.length > 0
      ? `${linePath} L${x(lastIndex)},${y(0)} L${x(0)},${y(0)} Z`
      : "";
  const ticks = [0, 1, 2, 3, 4].map((step) => (yMax * step) / 4);

  const active =
    hover !== null && lastIndex >= 0 ? Math.min(hover, lastIndex) : null;
  const activeDay = active !== null ? days[active] : null;
  const tooltipWidth = 176;
  const tooltipLeft =
    active !== null
      ? Math.min(
          Math.max(x(active) - tooltipWidth / 2, 0),
          Math.max(width - tooltipWidth, 0),
        )
      : 0;

  const liveText =
    activeDay && active !== null
      ? `${formatDayLabel(activeDay.date)}: ${formatAmount(activeDay.amount)} yen collected that day, ${formatAmount(cumulative[active])} yen in total${hasTarget ? `, target pace ${formatAmount(Math.round(paceAt(active)))} yen` : ""}.`
      : "";

  const handlePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (lastIndex < 0) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left - pad.left) / innerW;
    const index = Math.round(ratio * (count - 1));
    setHover(Math.min(Math.max(index, 0), lastIndex));
  };

  return (
    <Box
      ref={viewRef}
      sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      {/* =================================================
          SUMMARY: one headline number, then supporting figures
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          flexShrink: 0,
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 400, color: INK_MUTED }}>
            Collected so far
          </Typography>
          <Typography
            sx={{
              mt: 0.25,
              fontSize: { xs: 26, sm: 30 },
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -0.8,
              color: BRAND,
              ...NUMERIC,
            }}
          >
            ¥{formatAmount(collected)}
          </Typography>
        </Box>

        {hasTarget && lastIndex >= 0 && (
          <Pill
            tone={difference >= 0 ? "success" : "warning"}
            label={`${difference >= 0 ? "Ahead of pace by" : "Behind pace by"} ¥${formatAmount(Math.round(Math.abs(difference)))}`}
          />
        )}
      </Box>

      {(hasTarget || showBestDay) && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            flexShrink: 0,
            borderTop: `1px solid ${HAIRLINE}`,
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}
        >
          {hasTarget && (
            <Stat label="Target pace today">
              ¥{formatAmount(Math.round(paceNow))}
            </Stat>
          )}

          {hasTarget && (
            <Stat label="Monthly target">¥{formatAmount(totalTarget)}</Stat>
          )}

          {showBestDay && (
            <Stat label="Best day">
              {formatDayLabel(bestDay.date)}, ¥{formatAmount(bestDay.amount)}
            </Stat>
          )}
        </Box>
      )}

      {/* =================================================
          CHART
      ================================================= */}

      <Box
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-label="Collection trend chart. Use the left and right arrow keys to inspect each day."
        onBlur={() => setHover(null)}
        onKeyDown={(event) => {
          if (lastIndex < 0) {
            return;
          }
          const current = hover ?? lastIndex;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setHover(Math.max(current - 1, 0));
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            setHover(Math.min(current + 1, lastIndex));
          } else if (event.key === "Home") {
            event.preventDefault();
            setHover(0);
          } else if (event.key === "End") {
            event.preventDefault();
            setHover(lastIndex);
          } else if (event.key === "Escape") {
            setHover(null);
          }
        }}
        sx={{
          position: "relative",
          mt: 2.5,
          height: width < 480 ? 200 : 240,
          flex: "1 1 auto",
          minHeight: 80,
          borderRadius: 2,
          ...focusRing,
        }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`Cumulative collections reached ${formatCompact(collected)}${hasTarget ? ` against a target pace of ${formatCompact(paceNow)}` : ""}.`}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => setHover(null)}
            style={{
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              touchAction: "pan-y",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke={tick === 0 ? "rgba(17,24,39,0.14)" : "rgba(17,24,39,0.06)"}
                />

                <text
                  x={pad.left - 10}
                  y={y(tick)}
                  dy={4}
                  textAnchor="end"
                  fontSize={11}
                  fill={INK_MUTED}
                >
                  {formatCompact(tick)}
                </text>
              </g>
            ))}

            {days.map((day, index) => {
              const showLabel =
                index % 7 === 0 ||
                (index === count - 1 && (count - 1) % 7 >= 3);
              return showLabel ? (
                <text
                  key={day.date}
                  x={x(index)}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fill={INK_MUTED}
                >
                  {index + 1}
                </text>
              ) : null;
            })}

            {areaPath && (
              <path
                d={areaPath}
                fill={BRAND}
                style={{
                  opacity: drawn ? 0.08 : 0,
                  transition: reduceMotion ? "none" : "opacity 900ms ease 300ms",
                }}
              />
            )}

            {hasTarget && (
              <line
                x1={x(0)}
                y1={y(paceAt(0))}
                x2={x(count - 1)}
                y2={y(totalTarget)}
                stroke={INK_MUTED}
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
            )}

            {linePath && (
              <path
                d={linePath}
                pathLength={1}
                fill="none"
                stroke={BRAND}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray="1 1"
                strokeDashoffset={drawn ? 0 : 1}
                style={{
                  opacity: drawn ? 1 : 0,
                  transition: reduceMotion
                    ? "none"
                    : "stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 150ms ease",
                }}
              />
            )}

            {lastIndex >= 0 && active === null && (
              <circle
                cx={x(lastIndex)}
                cy={y(collected)}
                r={4.5}
                fill="#ffffff"
                stroke={BRAND}
                strokeWidth={2.5}
                style={{
                  opacity: drawn ? 1 : 0,
                  transition: reduceMotion ? "none" : "opacity 200ms ease 1000ms",
                }}
              />
            )}

            {active !== null && (
              <g>
                <line
                  x1={x(active)}
                  x2={x(active)}
                  y1={pad.top}
                  y2={y(0)}
                  stroke="rgba(17,24,39,0.22)"
                />

                <circle
                  cx={x(active)}
                  cy={y(cumulative[active])}
                  r={5}
                  fill="#ffffff"
                  stroke={BRAND}
                  strokeWidth={2.5}
                />
              </g>
            )}
          </svg>
        )}

        {activeDay && active !== null && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: pad.top,
              left: tooltipLeft,
              width: tooltipWidth,
              pointerEvents: "none",
              px: 1.5,
              py: 1.25,
              borderRadius: 2.5,
              bgcolor: INK,
              color: "#ffffff",
              boxShadow: "0 12px 28px -12px rgba(15,23,42,0.55)",
              fontSize: 12,
              lineHeight: 1.6,
              ...NUMERIC,
            }}
          >
            <Box sx={{ fontWeight: 700 }}>{formatDayLabel(activeDay.date)}</Box>

            <Box sx={{ fontWeight: 400 }}>
              That day: ¥{formatAmount(activeDay.amount)}
            </Box>

            <Box sx={{ fontWeight: 600 }}>
              Total: ¥{formatAmount(cumulative[active])}
            </Box>

            {hasTarget && (
              <Box sx={{ fontWeight: 400, color: "rgba(255,255,255,0.72)" }}>
                Pace: ¥{formatAmount(Math.round(paceAt(active)))}
              </Box>
            )}
          </Box>
        )}

        <Box aria-live="polite" sx={visuallyHiddenSx}>
          {liveText}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.5,
          flexShrink: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: 2.5,
          fontSize: 12,
          fontWeight: 400,
          color: INK_MUTED,
        }}
      >
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <LegendDot color={BRAND} />
          Collected
        </Box>

        {hasTarget && (
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <LegendDot color={INK_MUTED} dashed />
            Target pace
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function CollectionTrend({ data }: Props) {
  const { selectedMonth, overview, charts } = data;
  const chartData: ChartsData = charts ?? EMPTY_CHARTS;
  const todayKey = dateFormatter.format(new Date());

  return (
    <ChartCard
      title="Collection trend"
      subtitle="Cumulative collections against the target pace"
      icon={<ShowChartOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <TrendChart
        days={chartData.dailyCollection}
        totalTarget={overview.totalTarget}
        selectedMonth={selectedMonth}
        todayKey={todayKey}
      />
    </ChartCard>
  );
}
