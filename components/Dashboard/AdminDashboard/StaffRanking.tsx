"use client";
import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import type { useAdminDashboard } from "./hook";
import type { DashboardPerformanceStatus } from "./type";
type Props = {
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    | "rankings"
    | "rankingPagination"
    | "handleRankingPageChange"
    | "handleRankingLimitChange"
    | "handleStaffClick"
  >;
};
const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#0F172A";
const INK_BODY = "#334155";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;
const NUMERIC = {
  fontVariantNumeric: "tabular-nums",
};
const softCard = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },
  borderRadius: `${RADIUS}px`,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
};
const headCellSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.7,
  textTransform: "uppercase",
  color: INK_MUTED,
  bgcolor: "rgba(16, 122, 100, 0.04)",
  borderBottomColor: HAIRLINE,
  py: 1.5,
  whiteSpace: "nowrap",
};
const bodyCellSx = {
  fontSize: 14,
  color: INK_BODY,
  borderBottomColor: "rgba(17, 24, 39, 0.05)",
  py: 1.75,
};
const rowSx = {
  transition: "background-color 200ms ease",
  "&:hover": {
    bgcolor: "rgba(16, 122, 100, 0.045)",
  },
  "&:last-of-type td": {
    borderBottom: 0,
  },
};
const paginationSx = {
  borderTop: `1px solid ${HAIRLINE}`,
  "& .MuiTablePagination-toolbar": {
    flexWrap: "wrap",
    justifyContent: { xs: "center", sm: "flex-end" },
    px: { xs: 1, sm: 2 },
  },
  "& .MuiTablePagination-spacer": {
    display: { xs: "none", sm: "block" },
  },
  "& .MuiTablePagination-selectLabel": {
    display: { xs: "none", sm: "block" },
  },
};
const showOnDesktop = { display: { xs: "none", lg: "block" }, maxWidth: "100%", overflowX: "auto" };
const showOnMobile = {
  display: { xs: "grid", lg: "none" },
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
};
const amountFormatter = new Intl.NumberFormat("ja-JP");
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));
type Tone = "success" | "warning" | "danger" | "info" | "neutral";
const performanceTone = (status: DashboardPerformanceStatus): Tone => {
  if (status === "Achieved") {
    return "success";
  }
  if (status === "In Progress") {
    return "warning";
  }
  if (status === "No Target") {
    return "info";
  }
  return "neutral";
};
const PILL_TONES: Record<
  Tone,
  {
    bg: string;
    fg: string;
    line: string;
  }
> = {
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
          sx={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: -0.2,
            color: INK,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              mt: 0.25,
              fontSize: 12,
              color: INK_MUTED,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
function MiniBar({
  percentage,
  size = 74,
}: {
  percentage: number;
  size?: number | string;
}) {
  const width = Math.min(Math.max(Number(percentage) || 0, 0), 100);
  return (
    <Box
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{
        mt: 0.75,
        width: size,
        height: 5,
        borderRadius: 999,
        bgcolor: "rgba(17, 24, 39, 0.08)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${width}%`,
          height: "100%",
          borderRadius: 999,
          bgcolor: width >= 100 ? BRAND_DEEP : BRAND,
          transition: "width 800ms cubic-bezier(0.22, 1, 0.36, 1)",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        }}
      />
    </Box>
  );
}
function RankBadge({ rank }: { rank: number }) {
  const isPodium = rank <= 3;
  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        width: 30,
        height: 30,
        borderRadius: 2,
        fontSize: 13,
        fontWeight: 700,
        ...(isPodium
          ? {
              bgcolor: BRAND,
              color: "#ffffff",
              boxShadow: "0 6px 14px -8px rgba(16,122,100,0.9)",
            }
          : {
              bgcolor: "rgba(15, 23, 42, 0.04)",
              color: INK_MUTED,
              border: "1px solid",
              borderColor: HAIRLINE,
            }),
      }}
    >
      {rank}
    </Box>
  );
}
function CardField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.4,
          color: INK_MUTED,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          mt: 0.25,
          fontSize: 13,
          fontWeight: 600,
          color: INK_BODY,
          overflowWrap: "anywhere",
          ...NUMERIC,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
function EmptyNote({ message }: { message: string }) {
  return (
    <Typography
      sx={{
        py: 4,
        px: 2,
        textAlign: "center",
        fontSize: 14,
        color: INK_MUTED,
      }}
    >
      {message}
    </Typography>
  );
}
const mobileCardSx = {
  px: 2,
  py: 2,
  borderBottom: `1px solid ${HAIRLINE}`,
  "&:last-of-type": { borderBottom: 0 },
};
export default function StaffRanking({ data }: Props) {
  const {
    rankings,
    rankingPagination,
    handleRankingPageChange,
    handleRankingLimitChange,
    handleStaffClick,
  } = data;
  const lang = useLocale();
  const performanceStatusLabel: Record<DashboardPerformanceStatus, string> = {
    "No Target": lang === "ja" ? "目標なし" : "No Target",
    "Not Started": lang === "ja" ? "未開始" : "Not Started",
    "In Progress": lang === "ja" ? "進行中" : "In Progress",
    Achieved: lang === "ja" ? "達成" : "Achieved",
  };
  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        mt: 2,
        p: 0,
        overflow: "hidden",
      }}
    >
      <SectionHeader
        title={lang === "ja" ? "スタッフランキング" : "Staff Ranking"}
        subtitle={lang === "ja" ? "月間入金額順のランキングです。" : "Ranked by monthly collection amount."}
        icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />}
      />

      {/* ---------- Desktop table ---------- */}

      <TableContainer sx={showOnDesktop}>
        <Table
          sx={{
            minWidth: 900,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...headCellSx,
                  pl: {
                    xs: 2.5,
                    md: 3,
                  },
                }}
              >
                {lang === "ja" ? "順位" : "Rank"}
              </TableCell>

              <TableCell sx={headCellSx}>{lang === "ja" ? "スタッフ" : "Staff"}</TableCell>

              <TableCell sx={headCellSx} align="right">
                {lang === "ja" ? "目標" : "Target"}
              </TableCell>

              <TableCell sx={headCellSx} align="right">
                {lang === "ja" ? "入金額" : "Collected"}
              </TableCell>

              <TableCell sx={headCellSx} align="right">
                {lang === "ja" ? "目標までの残額" : "Target Remaining"}
              </TableCell>

              <TableCell sx={headCellSx} align="right">
                {lang === "ja" ? "達成率" : "Achievement"}
              </TableCell>

              <TableCell sx={headCellSx} align="center">
                {lang === "ja" ? "入金件数" : "Payments"}
              </TableCell>

              <TableCell sx={headCellSx} align="center">
                {lang === "ja" ? "顧客数" : "Clients"}
              </TableCell>

              <TableCell
                sx={{
                  ...headCellSx,
                  pr: {
                    xs: 2.5,
                    md: 3,
                  },
                }}
              >
                {lang === "ja" ? "ステータス" : "Status"}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rankings.map((staff) => (
              <TableRow
                key={staff.staffId}
                hover={false}
                tabIndex={0}
                sx={{
                  ...rowSx,
                  cursor: "pointer",
                  "&:focus-visible": {
                    outline: `2px solid ${BRAND}`,
                    outlineOffset: -2,
                  },
                }}
                onClick={() => handleStaffClick(staff.staffId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleStaffClick(staff.staffId);
                  }
                }}
              >
                <TableCell
                  sx={{
                    ...bodyCellSx,
                    pl: {
                      xs: 2.5,
                      md: 3,
                    },
                  }}
                >
                  <RankBadge rank={staff.rank} />
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: INK,
                    }}
                  >
                    {staff.staffName}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: INK_MUTED,
                    }}
                  >
                    {staff.staffId}
                  </Typography>
                </TableCell>

                <TableCell
                  sx={{
                    ...bodyCellSx,
                    ...NUMERIC,
                    color: INK_MUTED,
                  }}
                  align="right"
                >
                  ¥{formatAmount(staff.targetAmount)}
                </TableCell>

                <TableCell
                  sx={{
                    ...bodyCellSx,
                    ...NUMERIC,
                    fontWeight: 700,
                    color: BRAND,
                  }}
                  align="right"
                >
                  ¥{formatAmount(staff.totalCollected)}
                </TableCell>

                <TableCell
                  sx={{
                    ...bodyCellSx,
                    ...NUMERIC,
                    color: INK_MUTED,
                  }}
                  align="right"
                >
                  ¥{formatAmount(staff.remainingAmount)}
                </TableCell>

                <TableCell
                  sx={{
                    ...bodyCellSx,
                    ...NUMERIC,
                    fontWeight: 700,
                  }}
                  align="right"
                >
                  {staff.achievementPercentage}%
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <MiniBar percentage={staff.achievementPercentage} />
                  </Box>
                </TableCell>

                <TableCell sx={{ ...bodyCellSx, ...NUMERIC }} align="center">
                  {staff.paymentCount}
                </TableCell>

                <TableCell sx={{ ...bodyCellSx, ...NUMERIC }} align="center">
                  {staff.clientCount}
                </TableCell>

                <TableCell
                  sx={{
                    ...bodyCellSx,
                    pr: {
                      xs: 2.5,
                      md: 3,
                    },
                  }}
                >
                  <Pill
                    label={performanceStatusLabel[staff.status]}
                    tone={performanceTone(staff.status)}
                  />
                </TableCell>
              </TableRow>
            ))}

            {rankings.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{
                    ...bodyCellSx,
                    py: 5,
                    color: INK_MUTED,
                    borderBottom: 0,
                  }}
                >
                  {lang === "ja" ? "スタッフの実績データはありません。" : "No staff performance data found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ---------- Mobile cards ---------- */}

      <Box sx={showOnMobile}>
        {rankings.map((staff) => (
          <Box
            key={staff.staffId}
            role="button"
            tabIndex={0}
            onClick={() => handleStaffClick(staff.staffId)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleStaffClick(staff.staffId);
              }
            }}
            sx={{
              ...mobileCardSx,
              cursor: "pointer",
              "&:active": {
                bgcolor: "rgba(16, 122, 100, 0.05)",
              },
              "&:focus-visible": {
                outline: `2px solid ${BRAND}`,
                outlineOffset: -2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <RankBadge rank={staff.rank} />

              <Box sx={{ flex: "1 1 120px", minWidth: 0, overflowWrap: "anywhere" }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: INK,
                  }}
                >
                  {staff.staffName}
                </Typography>

                <Typography sx={{ fontSize: 12, color: INK_MUTED }}>
                  {staff.staffId}
                </Typography>
              </Box>

              <Pill
                label={performanceStatusLabel[staff.status]}
                tone={performanceTone(staff.status)}
              />
            </Box>

            <Box
              sx={{
                mt: 1.75,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  minWidth: 0,
                  overflowWrap: "anywhere",
                  fontWeight: 700,
                  letterSpacing: -0.4,
                  color: BRAND,
                  ...NUMERIC,
                }}
              >
                ¥{formatAmount(staff.totalCollected)}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: INK_MUTED,
                  minWidth: 0,
                  overflowWrap: "anywhere",
                  ...NUMERIC,
                }}
              >
                {lang === "ja" ? "目標" : "Target"} ¥{formatAmount(staff.targetAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <MiniBar percentage={staff.achievementPercentage} size="100%" />
              </Box>

              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: 12,
                  fontWeight: 700,
                  color: INK_BODY,
                  ...NUMERIC,
                }}
              >
                {staff.achievementPercentage}%
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 1.75,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 100px), 1fr))",
                gap: 1.5,
              }}
            >
              <CardField label={lang === "ja" ? "残額" : "Remaining"}>
                ¥{formatAmount(staff.remainingAmount)}
              </CardField>

              <CardField label={lang === "ja" ? "入金件数" : "Payments"}>
                {staff.paymentCount}
              </CardField>

              <CardField label={lang === "ja" ? "顧客数" : "Clients"}>{staff.clientCount}</CardField>
            </Box>
          </Box>
        ))}

        {rankings.length === 0 && (
          <EmptyNote message={lang === "ja" ? "スタッフの実績データはありません。" : "No staff performance data found."} />
        )}
      </Box>

      <TablePagination
        component="div"
        labelRowsPerPage={lang === "ja" ? "1ページの表示件数：" : "Rows per page:"}
        labelDisplayedRows={({ from, to, count }) => lang === "ja"
          ? `全${count !== -1 ? `${count}件` : `${to}件以上`}中 ${from}–${to}件`
          : `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
        getItemAriaLabel={(type) => lang === "ja"
          ? type === "first" ? "最初のページへ"
            : type === "last" ? "最後のページへ"
            : type === "next" ? "次のページへ" : "前のページへ"
          : `Go to ${type} page`}
        count={rankingPagination.total}
        page={Math.max(rankingPagination.currentPage - 1, 0)}
        rowsPerPage={rankingPagination.perPage}
        rowsPerPageOptions={[10, 25, 50]}
        slotProps={{ select: { inputProps: { "aria-label": lang === "ja" ? "1ページの表示件数" : "Rows per page" } } }}
        onPageChange={(_, page) => handleRankingPageChange(page + 1)}
        onRowsPerPageChange={(event) =>
          handleRankingLimitChange(Number(event.target.value))
        }
        sx={paginationSx}
      />
    </Paper>
  );
}
