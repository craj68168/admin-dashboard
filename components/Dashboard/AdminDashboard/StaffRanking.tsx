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

// =================================================
// RESPONSIVE RULES
//
// The table answers to the width of its own card (a CSS container query), not
// the screen. Collapsing the sidebar changes the card's width without changing
// the screen's, so the screen width alone can't be trusted.
//
//   card width   columns shown
//   >= 880       Rank, Staff, Target, Collected, Remaining, Achievement,
//                Payments, Clients, Status
//   640 - 879    Rank, Staff (+ counts), Collected (+ target / remaining),
//                Achievement, Status
//   420 - 639    Rank, Staff (+ all details), Collected (+ % and bar), Status
//   < 420        Rank, Staff (+ all details), Collected (+ % and bar, status
//                pill underneath)
//
// Nothing scrolls sideways and there is nothing to tap to expand.
// =================================================

const BP = { status: 420, mid: 640, wide: 880 } as const;

const atLeast = (width: number) =>
  `@container ranking (min-width: ${width}px)`;

// A table cell that only appears from `width` up.
const cellFrom = (width: number) => ({
  display: "none",
  [atLeast(width)]: { display: "table-cell" },
});

const headCellSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.7,
  textTransform: "uppercase",
  color: INK_MUTED,
  bgcolor: "rgba(16, 122, 100, 0.04)",
  borderBottomColor: HAIRLINE,
  py: 1.5,
  px: 1.5,
  whiteSpace: "nowrap",
};

const bodyCellSx = {
  fontSize: 14,
  color: INK_BODY,
  borderBottomColor: "rgba(17, 24, 39, 0.05)",
  py: 1.75,
  px: 1.5,
  verticalAlign: "middle",
};

const edgeLeft = { pl: { xs: 2, sm: 2.5, md: 3 } };
const edgeRight = { pr: { xs: 2, sm: 2.5, md: 3 } };

// Collected is the last column on very narrow cards; Status is the last one
// from 420 up. Each takes the outer padding while it is the last.
const amountEdge = { pr: 2, [atLeast(BP.status)]: { pr: 1.5 } };
const statusEdge = { ...cellFrom(BP.status), ...edgeRight };

const rowSx = {
  transition: "background-color 200ms ease",
  "&:hover": {
    bgcolor: "rgba(16, 122, 100, 0.045)",
  },
  "&:last-of-type td": {
    borderBottom: 0,
  },
};

// Small text lines that stand in for a hidden column.
const smallLine = {
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.3,
  color: INK_MUTED,
  ...NUMERIC,
};

// Target / remaining / payments / clients as one tidy line under the staff
// name on narrow cards.
const detailsUnderStaff = {
  ...smallLine,
  display: "flex",
  flexWrap: "wrap",
  columnGap: 1.25,
  rowGap: 0.25,
  mt: 0.75,
  [atLeast(BP.mid)]: { display: "none" },
};

// Payments and clients under the staff name once there is a bit more room.
const countsUnderStaff = {
  ...smallLine,
  display: "none",
  flexWrap: "wrap",
  columnGap: 1.25,
  mt: 0.5,
  [atLeast(BP.mid)]: { display: "flex" },
  [atLeast(BP.wide)]: { display: "none" },
};

// Target and remaining under the collected amount while those columns are hidden
// but there is room.
const targetUnderAmount = {
  ...smallLine,
  display: "none",
  mt: 0.25,
  [atLeast(BP.mid)]: { display: "block" },
  [atLeast(BP.wide)]: { display: "none" },
};

// Achievement % and bar under the amount on narrow cards.
const achievementUnderAmount = {
  display: "block",
  mt: 0.5,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3,
  color: INK_BODY,
  ...NUMERIC,
  [atLeast(BP.mid)]: { display: "none" },
};

// Status pill under the amount on the narrowest cards.
const pillUnderAmount = {
  display: "block",
  mt: 0.75,
  [atLeast(BP.status)]: { display: "none" },
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

export default function StaffRanking({ data }: Props) {
  const {
    rankings,
    rankingPagination,
    handleRankingPageChange,
    handleRankingLimitChange,
    handleStaffClick,
  } = data;
  const lang = useLocale();
  const ja = lang === "ja";

  const performanceStatusLabel: Record<DashboardPerformanceStatus, string> = {
    "No Target": ja ? "目標なし" : "No Target",
    "Not Started": ja ? "未開始" : "Not Started",
    "In Progress": ja ? "進行中" : "In Progress",
    Achieved: ja ? "達成" : "Achieved",
  };

  // Short labels for the lines that stand in for hidden columns.
  const targetLabel = ja ? "目標" : "Target";
  const remainingLabel = ja ? "残額" : "Remaining";
  const paymentsText = (n: number) =>
    ja ? `入金${n}件` : `${n} ${n === 1 ? "payment" : "payments"}`;
  const clientsText = (n: number) =>
    ja ? `顧客${n}` : `${n} ${n === 1 ? "client" : "clients"}`;

  const emptyText = ja
    ? "スタッフの実績データはありません。"
    : "No staff performance data found.";

  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        mt: 2,
        p: 0,
        overflow: "hidden",
        // Lets the table respond to this card's width (see RESPONSIVE RULES).
        containerType: "inline-size",
        containerName: "ranking",
      }}
    >
      <SectionHeader
        title={ja ? "スタッフランキング" : "Staff Ranking"}
        subtitle={
          ja ? "月間入金額順のランキングです。" : "Ranked by monthly collection amount."
        }
        icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />}
      />

      <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
        <Table size="small" sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, ...edgeLeft }}>
                {ja ? "順位" : "Rank"}
              </TableCell>

              <TableCell sx={headCellSx}>{ja ? "スタッフ" : "Staff"}</TableCell>

              <TableCell
                align="right"
                sx={{ ...headCellSx, ...cellFrom(BP.wide) }}
              >
                {targetLabel}
              </TableCell>

              <TableCell align="right" sx={{ ...headCellSx, ...amountEdge }}>
                {ja ? "入金額" : "Collected"}
              </TableCell>

              <TableCell
                align="right"
                sx={{ ...headCellSx, ...cellFrom(BP.wide) }}
              >
                {ja ? "目標までの残額" : "Target Remaining"}
              </TableCell>

              <TableCell
                align="right"
                sx={{ ...headCellSx, ...cellFrom(BP.mid) }}
              >
                {ja ? "達成率" : "Achievement"}
              </TableCell>

              <TableCell
                align="center"
                sx={{ ...headCellSx, ...cellFrom(BP.wide) }}
              >
                {ja ? "入金件数" : "Payments"}
              </TableCell>

              <TableCell
                align="center"
                sx={{ ...headCellSx, ...cellFrom(BP.wide) }}
              >
                {ja ? "顧客数" : "Clients"}
              </TableCell>

              <TableCell sx={{ ...headCellSx, ...statusEdge }}>
                {ja ? "ステータス" : "Status"}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rankings.map((staff) => {
              const label = performanceStatusLabel[staff.status];
              const tone = performanceTone(staff.status);

              return (
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
                  {/* RANK */}
                  <TableCell sx={{ ...bodyCellSx, ...edgeLeft }}>
                    <RankBadge rank={staff.rank} />
                  </TableCell>

                  {/* STAFF (carries the hidden columns on narrow cards) */}
                  <TableCell sx={bodyCellSx}>
                    <Typography
                      sx={{
                        overflowWrap: "anywhere",
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: INK,
                      }}
                    >
                      {staff.staffName}
                    </Typography>

                    <Typography
                      sx={{
                        overflowWrap: "anywhere",
                        mt: 0.25,
                        fontSize: 12,
                        lineHeight: 1.3,
                        color: INK_MUTED,
                      }}
                    >
                      {staff.staffId}
                    </Typography>

                    {/* under 640 */}
                    <Box sx={detailsUnderStaff}>
                      <span>
                        {targetLabel} ¥{formatAmount(staff.targetAmount)}
                      </span>
                      <span>
                        {remainingLabel} ¥{formatAmount(staff.remainingAmount)}
                      </span>
                      <span>{paymentsText(staff.paymentCount)}</span>
                      <span>{clientsText(staff.clientCount)}</span>
                    </Box>

                    {/* 640 - 879 */}
                    <Box sx={countsUnderStaff}>
                      <span>{paymentsText(staff.paymentCount)}</span>
                      <span>{clientsText(staff.clientCount)}</span>
                    </Box>
                  </TableCell>

                  {/* TARGET */}
                  <TableCell
                    align="right"
                    sx={{
                      ...bodyCellSx,
                      ...NUMERIC,
                      ...cellFrom(BP.wide),
                      color: INK_MUTED,
                    }}
                  >
                    ¥{formatAmount(staff.targetAmount)}
                  </TableCell>

                  {/* COLLECTED (target / achievement / status stack under it) */}
                  <TableCell
                    align="right"
                    sx={{ ...bodyCellSx, ...amountEdge, whiteSpace: "nowrap" }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: BRAND,
                        ...NUMERIC,
                      }}
                    >
                      ¥{formatAmount(staff.totalCollected)}
                    </Typography>

                    {/* 640 - 879 */}
                    <Box sx={targetUnderAmount}>
                      <div>
                        {targetLabel} ¥{formatAmount(staff.targetAmount)}
                      </div>
                      <div>
                        {remainingLabel} ¥{formatAmount(staff.remainingAmount)}
                      </div>
                    </Box>

                    {/* under 640 */}
                    <Box sx={achievementUnderAmount}>
                      {staff.achievementPercentage}%
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <MiniBar percentage={staff.achievementPercentage} />
                      </Box>
                    </Box>

                    {/* under 420 */}
                    <Box sx={pillUnderAmount}>
                      <Pill label={label} tone={tone} />
                    </Box>
                  </TableCell>

                  {/* REMAINING */}
                  <TableCell
                    align="right"
                    sx={{
                      ...bodyCellSx,
                      ...NUMERIC,
                      ...cellFrom(BP.wide),
                      color: INK_MUTED,
                    }}
                  >
                    ¥{formatAmount(staff.remainingAmount)}
                  </TableCell>

                  {/* ACHIEVEMENT */}
                  <TableCell
                    align="right"
                    sx={{
                      ...bodyCellSx,
                      ...NUMERIC,
                      ...cellFrom(BP.mid),
                      fontWeight: 700,
                    }}
                  >
                    {staff.achievementPercentage}%
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <MiniBar percentage={staff.achievementPercentage} />
                    </Box>
                  </TableCell>

                  {/* PAYMENTS */}
                  <TableCell
                    align="center"
                    sx={{ ...bodyCellSx, ...NUMERIC, ...cellFrom(BP.wide) }}
                  >
                    {staff.paymentCount}
                  </TableCell>

                  {/* CLIENTS */}
                  <TableCell
                    align="center"
                    sx={{ ...bodyCellSx, ...NUMERIC, ...cellFrom(BP.wide) }}
                  >
                    {staff.clientCount}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell sx={{ ...bodyCellSx, ...statusEdge }}>
                    <Pill label={label} tone={tone} />
                  </TableCell>
                </TableRow>
              );
            })}

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
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        labelRowsPerPage={ja ? "1ページの表示件数：" : "Rows per page:"}
        labelDisplayedRows={({ from, to, count }) =>
          ja
            ? `全${count !== -1 ? `${count}件` : `${to}件以上`}中 ${from}–${to}件`
            : `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
        getItemAriaLabel={(type) =>
          ja
            ? type === "first"
              ? "最初のページへ"
              : type === "last"
                ? "最後のページへ"
                : type === "next"
                  ? "次のページへ"
                  : "前のページへ"
            : `Go to ${type} page`
        }
        count={rankingPagination.total}
        page={Math.max(rankingPagination.currentPage - 1, 0)}
        rowsPerPage={rankingPagination.perPage}
        rowsPerPageOptions={[10, 25, 50]}
        slotProps={{
          select: {
            inputProps: {
              "aria-label": ja ? "1ページの表示件数" : "Rows per page",
            },
          },
        }}
        onPageChange={(_, page) => handleRankingPageChange(page + 1)}
        onRowsPerPageChange={(event) =>
          handleRankingLimitChange(Number(event.target.value))
        }
        sx={paginationSx}
      />
    </Paper>
  );
}