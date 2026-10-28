"use client";
import { useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import type { useAdminDashboard } from "../hook";
import type { DashboardCharts } from "../type";

type Props = {
  data: Pick<ReturnType<typeof useAdminDashboard>, "charts">;
};

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const TRACK = "rgba(17, 24, 39, 0.05)";
const INK = "#0F172A";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;

const NUMERIC = { fontVariantNumeric: "tabular-nums" };

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
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));

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
          <Typography sx={{ mt: 0.25, fontSize: 12, fontWeight: 400, color: INK_MUTED }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function EmptyNote({ message }: { message: string }) {
  return (
    <Box
      sx={{
        display: "grid",
        justifyItems: "center",
        gap: 1.5,
        py: 5,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          border: `12px solid ${TRACK}`,
        }}
      />
      <Typography sx={{ fontSize: 14, fontWeight: 400, color: INK_MUTED, textAlign: "center" }}>
        {message}
      </Typography>
    </Box>
  );
}

type ChartsData = DashboardCharts;

const EMPTY_CHARTS: ChartsData = {
  dailyCollection: [],
  staffPerformance: [],
  paymentsByMethod: [],
  paymentsByStatus: [],
};

const STATUS_COLORS: Record<string, string> = {
  Completed: BRAND,
  Refunded: "#D9922B",
  Cancelled: "#D6455D",
};

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
      sx={{ ...softCard, p: 0, height: "100%", overflow: "hidden" }}
    >
      <SectionHeader title={title} subtitle={subtitle} icon={icon} />
      <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>{children}</Box>
    </Paper>
  );
}

type Slice = {
  key: string;
  label: string;
  amount: number;
  count: number;
  color: string;
};

type SliceLegendProps = {
  slices: Slice[];
  total: number;
  activeKey: string | null;
  onActive: (key: string | null) => void;
};

function SliceLegend({ slices, total, activeKey, onActive }: SliceLegendProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
      {slices.map((slice) => {
        const percent = total > 0 ? Math.round((slice.count / total) * 100) : 0;
        const dimmed = activeKey !== null && activeKey !== slice.key;
        const active = activeKey === slice.key;

        return (
          <Box
            key={slice.key}
            tabIndex={0}
            onMouseEnter={() => onActive(slice.key)}
            onMouseLeave={() => onActive(null)}
            onFocus={() => onActive(slice.key)}
            onBlur={() => onActive(null)}
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 2.5,
              bgcolor: active ? BRAND_SOFT : "transparent",
              opacity: dimmed ? 0.45 : 1,
              outline: "none",
              transition: "background-color 160ms ease, opacity 160ms ease",
              "&:focus-visible": { boxShadow: `inset 0 0 0 2px ${BRAND}` },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                alignItems: "baseline",
                columnGap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <Box
                  component="span"
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: slice.color,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  noWrap
                  sx={{ fontSize: 14, fontWeight: 600, color: INK }}
                >
                  {slice.label}
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 400, color: INK_MUTED, ...NUMERIC }}>
                  {slice.count} {slice.count === 1 ? "payment" : "payments"}
                </Typography>
              </Box>

              <Typography
                sx={{ fontSize: 14, fontWeight: 700, color: INK, ...NUMERIC }}
              >
                ¥{formatAmount(slice.amount)}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 1,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 36px",
                alignItems: "center",
                columnGap: 1.5,
              }}
            >
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: TRACK,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${percent}%`,
                    borderRadius: 3,
                    bgcolor: slice.color,
                    transition: "width 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: INK_MUTED,
                  textAlign: "right",
                  ...NUMERIC,
                }}
              >
                {percent}%
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

const SIZE = 120;
const CENTER = SIZE / 2;
const RING_RADIUS = 46;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function DonutChart({ slices }: { slices: Slice[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Draw the ring when it scrolls into view, not on mount. The dashboard
  // fades sections in with whileInView, so a mount-time animation would
  // finish before the card is visible.
  const ringRef = useRef<HTMLDivElement>(null);
  const drawn = useInView(ringRef, { once: true, amount: 0.4 });

  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  if (total <= 0) {
    return <EmptyNote message="No payments recorded this month." />;
  }

  const visible = slices.filter((slice) => slice.count > 0);
  // Rounded caps extend by half the stroke on each end, so the gap must cover that too.
  const rounded = visible.length > 1;
  const gap = rounded ? STROKE + 3 : 0;

  let cursor = 0;
  const segments = visible.map((slice) => {
    const length = (slice.count / total) * CIRCUMFERENCE;
    const start = cursor;
    cursor += length;
    return {
      slice,
      dash: rounded ? Math.max(length - gap, 0.01) : length,
      offset: start + (rounded ? gap / 2 : 0),
    };
  });

  const active = slices.find((slice) => slice.key === activeKey) ?? null;
  const centerValue = active ? active.count : total;
  const centerLabel = active ? active.label : "total payments";

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 2.5, sm: 4 },
      }}
    >
      <Box
        ref={ringRef}
        sx={{ position: "relative", width: 184, height: 184, flexShrink: 0 }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          height="100%"
          role="img"
          aria-label={`${total} payments by status: ${slices
            .map((slice) => `${slice.label} ${slice.count}`)
            .join(", ")}.`}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke={TRACK}
            strokeWidth={STROKE}
          />

          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {segments.map(({ slice, dash, offset }) => {
              const isActive = activeKey === slice.key;
              const dimmed = activeKey !== null && !isActive;
              const shown = drawn || reduceMotion ? dash : 0.01;

              return (
                <circle
                  key={slice.key}
                  cx={CENTER}
                  cy={CENTER}
                  r={RING_RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={isActive ? STROKE + 3 : STROKE}
                  strokeLinecap={rounded ? "round" : "butt"}
                  strokeDasharray={`${shown} ${CIRCUMFERENCE - shown}`}
                  strokeDashoffset={-offset}
                  opacity={dimmed ? 0.35 : 1}
                  onMouseEnter={() => setActiveKey(slice.key)}
                  onMouseLeave={() => setActiveKey(null)}
                  style={{
                    cursor: "pointer",
                    transition: reduceMotion
                      ? "none"
                      : "stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1), stroke-width 160ms ease, opacity 160ms ease",
                  }}
                />
              );
            })}
          </g>
        </svg>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeContent: "center",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: 32,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: -1,
              color: active ? active.color : INK,
              transition: "color 160ms ease",
              ...NUMERIC,
            }}
          >
            {formatAmount(centerValue)}
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 12, fontWeight: 400, color: INK_MUTED }}>
            {centerLabel}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: "1 1 280px", minWidth: 0 }}>
        <SliceLegend
          slices={slices}
          total={total}
          activeKey={activeKey}
          onActive={setActiveKey}
        />
      </Box>
    </Box>
  );
}

export default function PaymentStatus({ data }: Props) {
  const { charts } = data;
  const chartData: ChartsData = charts ?? EMPTY_CHARTS;

  return (
    <ChartCard
      title="Payment status"
      subtitle="Payment counts by status in the selected month"
      icon={<DonutLargeOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <DonutChart
        slices={chartData.paymentsByStatus.map((item) => ({
          key: item.status,
          label: item.status,
          amount: item.amount,
          count: item.count,
          color: STATUS_COLORS[item.status] ?? INK_MUTED,
        }))}
      />
    </ChartCard>
  );
}