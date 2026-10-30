"use client";
import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { createTranslator, useLocale } from "next-intl";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import type { useAdminDashboard } from "../hook";
import type { DashboardCharts } from "../type";

const messages = {
  en: {
    staffCollectionsAndTargets: "Staff collections and targets",
    noStaffCollectionsOrTargetsThisMonth: "No staff collections or targets this month.",
    target: "Target",
    targetMet: "Target met",
    inProgress: "In progress",
    collectedVsTargetByStaff: "Collected vs target by staff",
    staffSummary: "{staffName}: collected {collected} yen{hasTarget, select, true { of {target} yen target} other {}}",
    targetSummary: "{hasTarget, select, true { of {target}} other { no target}}",
    description: "Select a staff member to open their page",
    staffCount: "{total} staff"
  },
  ja: {
    staffCollectionsAndTargets: "スタッフ別の入金額と目標",
    noStaffCollectionsOrTargetsThisMonth: "今月のスタッフの入金額や目標はありません。",
    target: "目標",
    targetMet: "目標達成",
    inProgress: "進行中",
    collectedVsTargetByStaff: "スタッフ別の入金額と目標",
    staffSummary: "{staffName}：入金額{collected}円{hasTarget, select, true {、目標額{target}円} other {}}",
    targetSummary: "{hasTarget, select, true { / 目標 {target}} other { 目標なし}}",
    description: "スタッフを選択すると詳細ページが開きます",
    staffCount: "スタッフ{total}名"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
}

type Props = {
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    "handleStaffClick" | "charts"
  >;
};

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_PROGRESS = "rgba(16, 122, 100, 0.38)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const TRACK = "rgba(17, 24, 39, 0.06)";
const INK = "#0F172A";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;

const NUMERIC = { fontVariantNumeric: "tabular-nums" };

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: -2,
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
type StaffPoint = DashboardCharts["staffPerformance"][number];

const EMPTY_CHARTS: ChartsData = {
  dailyCollection: [],
  staffPerformance: [],
  paymentsByMethod: [],
  paymentsByStatus: [],
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
      sx={{
        ...softCard,
        p: 0,
        flex: 1,
        minWidth: 0,
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

function StaffBars({
  rows,
  total,
  onSelect,
}: {
  rows: StaffPoint[];
  total: number;
  onSelect: (staffId: string) => void;
}) {
  const t = useLocalTranslations();
  const lang = useLocale();
  const compactFormatter = new Intl.NumberFormat(lang === "ja" ? "ja" : "en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const formatCompact = (value: number) =>
    `¥${compactFormatter.format(Number(value || 0))}`;
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Grow the bars once, when the card scrolls into view (the dashboard
  // fades sections in with whileInView, so mount-time motion would be unseen).
  const listRef = useRef<HTMLDivElement>(null);
  const grown = useInView(listRef, { once: true, amount: 0.2 });

  const scaleMax = Math.max(
    ...rows.map((row) => Math.max(row.totalCollected, row.targetAmount)),
    1,
  );

  return (
    <Box
      ref={listRef}
      sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      <Box
        role="region"
        aria-label={t("staffCollectionsAndTargets")}
        tabIndex={0}
        sx={{
          flex: 1,
          minHeight: 0,
          height: { xs: 220, md: 240 },
          maxHeight: { xs: 220, md: 240 },
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarGutter: "stable",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 0.5,
          p: 0.5,
          ...focusRing,
        }}
      >
        {rows.length === 0 && (
          <EmptyNote message={t("noStaffCollectionsOrTargetsThisMonth")} />
        )}
        {rows.map((row) => {
          const fill = Math.max(
            (row.totalCollected / scaleMax) * 100,
            row.totalCollected > 0 ? 1.5 : 0,
          );
          const marker = (row.targetAmount / scaleMax) * 100;
          const hasTarget = row.targetAmount > 0;
          const achieved = hasTarget && row.totalCollected >= row.targetAmount;
          const percent = hasTarget
            ? Math.round((row.totalCollected / row.targetAmount) * 100)
            : null;

          return (
            <ButtonBase
              key={row.staffId}
              onClick={() => onSelect(row.staffId)}
              aria-label={t("staffSummary", {
                staffName: row.staffName,
                collected: formatAmount(row.totalCollected),
                hasTarget: String(Boolean(hasTarget)),
                target: formatAmount(row.targetAmount),
              })}
              sx={{
                display: "block",
                flexShrink: 0,
                width: "100%",
                textAlign: "left",
                borderRadius: 2.5,
                px: 1.5,
                py: 1.25,
                transition: "background-color 160ms ease",
                "&:hover": { bgcolor: BRAND_SOFT },
                ...focusRing,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Typography
                  component="span"
                  sx={{ minWidth: 0, overflowWrap: "anywhere", fontSize: 14, fontWeight: 600, color: INK }}
                >
                  {row.staffName}
                </Typography>

                <Typography
                  component="span"
                  sx={{
                    minWidth: 0,
                    overflowWrap: "anywhere",
                    fontSize: 12,
                    fontWeight: 400,
                    color: INK_MUTED,
                    ...NUMERIC,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ fontSize: 14, fontWeight: 700, color: INK }}
                  >
                    {formatCompact(row.totalCollected)}
                  </Box>

                  {t("targetSummary", {
                    hasTarget: String(Boolean(hasTarget)),
                    target: formatCompact(row.targetAmount),
                  })}
                </Typography>
              </Box>

              <Box
                component="span"
                sx={{
                  mt: 1,
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  alignItems: "center",
                  columnGap: 1.5,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    position: "relative",
                    height: 10,
                    borderRadius: 5,
                    bgcolor: TRACK,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      inset: "0 auto 0 0",
                      width: grown || reduceMotion ? `${fill}%` : 0,
                      borderRadius: 5,
                      bgcolor: achieved ? BRAND : BRAND_PROGRESS,
                      transition: reduceMotion
                        ? "none"
                        : "width 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />

                  {hasTarget && (
                    <Box
                      component="span"
                      sx={{
                        position: "absolute",
                        top: -3,
                        bottom: -3,
                        left: `calc(${marker}% - 1px)`,
                        width: 2,
                        borderRadius: 1,
                        bgcolor: INK,
                      }}
                    />
                  )}
                </Box>

                <Typography
                  component="span"
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "right",
                    color: achieved ? BRAND : INK_MUTED,
                    ...NUMERIC,
                  }}
                >
                  {percent !== null ? `${percent}%` : ""}
                </Typography>
              </Box>
            </ButtonBase>
          );
        })}
      </Box>

      <Box
        sx={{
          mt: 1.5,
          flexShrink: 0,
          pt: 1.75,
          px: 1.5,
          borderTop: `1px solid ${HAIRLINE}`,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          fontSize: 12,
          fontWeight: 400,
          color: INK_MUTED,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <Box
              component="span"
              sx={{ width: 2, height: 12, borderRadius: 1, bgcolor: INK }}
            />
            {t("target")}
          </Box>

          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <Box
              component="span"
              sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: BRAND }}
            />
            {t("targetMet")}
          </Box>

          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: BRAND_PROGRESS,
              }}
            />
            {t("inProgress")}
          </Box>
        </Box>

        <span>
          {t("staffCount", { total: total })}
        </span>
      </Box>
    </Box>
  );
}

export default function StaffPerformance({ data }: Props) {
  const t = useLocalTranslations();
  const { handleStaffClick, charts } = data;
  const chartData: ChartsData = charts ?? EMPTY_CHARTS;

  const staffChartAll = chartData.staffPerformance.filter(
    (staff) => staff.totalCollected > 0 || staff.targetAmount > 0,
  );

  return (
    <ChartCard
      title={t("collectedVsTargetByStaff")}
      subtitle={t("description")}
      icon={<BarChartOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <StaffBars
        rows={staffChartAll}
        total={staffChartAll.length}
        onSelect={handleStaffClick}
      />
    </ChartCard>
  );
}
