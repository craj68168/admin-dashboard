"use client";
import { useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import type { useAdminDashboard } from "../hook";
import type { DashboardCharts } from "../type";

type Props = {
  data: Pick<ReturnType<typeof useAdminDashboard>, "charts">;
};

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_TINT = "rgba(16, 122, 100, 0.30)";
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

function EmptyNote({ message }: { message: string }) {
  return (
    <Box sx={{ display: "grid", justifyItems: "center", gap: 2, py: 4, px: 2 }}>
      <Box sx={{ display: "grid", gap: 1.25, width: 160 }}>
        {[100, 68, 36].map((width) => (
          <Box
            key={width}
            sx={{
              height: 10,
              width: `${width}%`,
              borderRadius: 999,
              bgcolor: TRACK,
            }}
          />
        ))}
      </Box>
      <Typography
        sx={{ fontSize: 14, fontWeight: 400, color: INK_MUTED, textAlign: "center" }}
      >
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

// Always listed, even at zero, so the card keeps the same shape month to month.
const KNOWN_METHODS = [
  "Cash",
  "Bank Transfer",
  "Online Payment",
  "Cheque",
  "Other",
];

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
};

function MethodRows({ slices }: { slices: Slice[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Grow the bars when the card scrolls into view (the dashboard fades
  // sections in with whileInView, so mount-time animation would be unseen).
  const listRef = useRef<HTMLDivElement>(null);
  const grown = useInView(listRef, { once: true, amount: 0.3 });

  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);

  if (total <= 0) {
    return <EmptyNote message="No completed payments this month." />;
  }

  const maxAmount = Math.max(...slices.map((slice) => slice.amount), 1);
  const leaderKey = slices[0]?.key;

  return (
    <Box ref={listRef}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {slices.map((slice) => {
          const share = Math.round((slice.amount / total) * 100);
          const barWidth = (slice.amount / maxAmount) * 100;
          const active = activeKey === slice.key;
          const dimmed = activeKey !== null && !active;
          const emphasised =
            active || (activeKey === null && slice.key === leaderKey);

          return (
            <Box
              key={slice.key}
              tabIndex={0}
              role="group"
              aria-label={`${slice.label}: ${formatAmount(slice.amount)} yen from ${slice.count} ${slice.count === 1 ? "payment" : "payments"}, ${share}% of the total.`}
              onMouseEnter={() => setActiveKey(slice.key)}
              onMouseLeave={() => setActiveKey(null)}
              onFocus={() => setActiveKey(slice.key)}
              onBlur={() => setActiveKey(null)}
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2.5,
                bgcolor: active ? BRAND_SOFT : "transparent",
                opacity: dimmed ? 0.5 : 1,
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    noWrap
                    sx={{ fontSize: 14, fontWeight: 600, color: INK }}
                  >
                    {slice.label}
                  </Typography>
                  <Typography
                    sx={{
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 400,
                      color: INK_MUTED,
                      ...NUMERIC,
                    }}
                  >
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
                    height: 10,
                    borderRadius: 5,
                    bgcolor: TRACK,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: grown || reduceMotion ? `${barWidth}%` : 0,
                      borderRadius: 5,
                      bgcolor: emphasised ? BRAND : BRAND_TINT,
                      transition: reduceMotion
                        ? "none"
                        : "width 800ms cubic-bezier(0.22, 1, 0.36, 1), background-color 160ms ease",
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
                  {share}%
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          mt: 1.5,
          pt: 1.75,
          px: 1.5,
          borderTop: `1px solid ${HAIRLINE}`,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          sx={{ fontSize: 13, fontWeight: 500, color: INK_MUTED }}
        >
          Total collected
        </Typography>
        <Typography
          sx={{ fontSize: 16, fontWeight: 700, color: BRAND, ...NUMERIC }}
        >
          ¥{formatAmount(total)}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PaymentMethods({ data }: Props) {
  const { charts } = data;
  const chartData: ChartsData = charts ?? EMPTY_CHARTS;

  const methodNames = Array.from(
    new Set([
      ...KNOWN_METHODS,
      ...chartData.paymentsByMethod.map((item) => item.method),
    ]),
  );

  // Largest first, so the leader is always the top row. Array.sort is stable,
  // so methods with equal amounts keep their original order.
  const methodSlices: Slice[] = methodNames
    .map((method) => {
      const item = chartData.paymentsByMethod.find(
        (entry) => entry.method === method,
      );
      return {
        key: method,
        label: method,
        amount: item?.amount ?? 0,
        count: item?.count ?? 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <ChartCard
      title="Payment methods"
      subtitle="Completed payments by method"
      icon={<BarChartOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <MethodRows slices={methodSlices} />
    </ChartCard>
  );
}