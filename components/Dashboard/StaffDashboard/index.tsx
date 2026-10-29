"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import Breadcrumb from "@/components/Breadcrumb";

import { useStaffDashboard } from "./hook";

import type { StaffDashboardStatus } from "./type";

// =================================================
// THEME
// =================================================

const BRAND = "#107A64";
const BRAND_DEEP = "#0B5546";
const BRAND_LIGHT = "#7FD1B5";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const PAGE_BG = "#F4F6F3";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";

const INK = "#0F172A";
const INK_BODY = "#1F2937";
const INK_MUTED = "#64748B";

const card = {
  borderRadius: 4,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
};

const sectionTitleSx = {
  fontSize: 16,
  fontWeight: 700,
  color: INK,
  letterSpacing: -0.2,
};

const headCellSx = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.7,
  textTransform: "uppercase",
  color: INK_MUTED,
  bgcolor: "#FAFBFA",
  borderBottomColor: HAIRLINE,
  py: 1.25,
  whiteSpace: "nowrap",
};

const bodyCellSx = {
  fontSize: 14,
  color: INK_BODY,
  borderBottomColor: "rgba(15, 23, 42, 0.05)",
  py: 1.5,
};

const edgePl = { pl: { xs: 2.5, md: 3 } };
const edgePr = { pr: { xs: 2.5, md: 3 } };

const rowSx = {
  transition: "background-color 160ms ease",
  "&:hover": { bgcolor: "rgba(16, 122, 100, 0.035)" },
  "&:last-of-type td": { borderBottom: 0 },
};

// =================================================
// HELPERS
// =================================================

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

const yen = (value: number) => `¥${formatAmount(value)}`;

const formatJapanDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const initials = (name?: string) =>
  (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const STATUS_STYLE: Record<StaffDashboardStatus, { bg: string; fg: string; dot: string }> = {
  Achieved: { bg: "rgba(127,209,181,0.22)", fg: "#E8FFF6", dot: BRAND_LIGHT },
  "In Progress": { bg: "rgba(251,191,36,0.20)", fg: "#FFF4D6", dot: "#FBBF24" },
  "No Target": { bg: "rgba(147,197,253,0.20)", fg: "#E6F0FF", dot: "#93C5FD" },
  "Not Started": { bg: "rgba(255,255,255,0.14)", fg: "#F1F5F9", dot: "#CBD5E1" },
};

// =================================================
// PIECES
// =================================================

function SectionHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <Box
      sx={{
        px: { xs: 2.5, md: 3 },
        py: 2,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <Typography sx={sectionTitleSx}>{title}</Typography>
      {aside && (
        <Typography sx={{ fontSize: 12, color: INK_MUTED }}>{aside}</Typography>
      )}
    </Box>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
};

function SummaryCard({ label, value, subtitle, icon }: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...card,
        p: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "border-color 200ms ease, transform 200ms ease",
        "&:hover": {
          borderColor: "rgba(16,122,100,0.30)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: BRAND_SOFT,
            color: BRAND,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK_MUTED }}>
          {label}
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 26,
            fontWeight: 700,
            color: INK,
            letterSpacing: -0.6,
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.75, fontSize: 12, color: INK_MUTED }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

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

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Box
      sx={{
        flex: "1 1 140px",
        p: 2,
        borderRadius: 3,
        bgcolor: accent ? BRAND_SOFT : "#F8FAF9",
      }}
    >
      <Typography sx={{ fontSize: 12, color: INK_MUTED }}>{label}</Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 20,
          fontWeight: 700,
          color: accent ? BRAND : INK,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// =================================================
// DASHBOARD
// =================================================

export default function StaffDashboard() {
  const t = useTranslations("staffDashboard");

  const {
    selectedMonth,
    handleMonthChange,
    staff,
    overview,
    stageBreakdown,
    recentClients,
    recentPayments,
    isLoading,
    isFetching,
    loadError,
    handleClientClick,
  } = useStaffDashboard();

  if (isLoading || !staff || !overview) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center", bgcolor: PAGE_BG }}>
        <CircularProgress size={28} sx={{ color: BRAND }} />
      </Box>
    );
  }

  const progressValue = Math.min(Math.max(overview.achievementPercentage, 0), 100);

  const performanceStatusLabel: Record<StaffDashboardStatus, string> = {
    "No Target": t("status.noTarget"),
    "Not Started": t("status.notStarted"),
    "In Progress": t("status.inProgress"),
    Achieved: t("status.achieved"),
  };

  const status = STATUS_STYLE[overview.performanceStatus] ?? STATUS_STYLE["Not Started"];
  const stageMax = Math.max(1, ...stageBreakdown.map((s) => s.count));

  return (
    <Box
      sx={{
        bgcolor: PAGE_BG,
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto" }}>
        <Box sx={{ mb: 2 }}>
          <Breadcrumb items={[{ label: t("dashboard"), current: true }]} />
        </Box>

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: BRAND,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {initials(staff.name)}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 22, md: 28 },
                  fontWeight: 700,
                  letterSpacing: -0.6,
                  color: INK,
                  lineHeight: 1.2,
                }}
              >
                {t("welcome", { name: staff.name })}
              </Typography>
              <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  label={staff.staffId}
                  sx={{
                    height: 22,
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: BRAND_SOFT,
                    color: BRAND,
                    borderRadius: 1.5,
                  }}
                />
                <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
                  {t("description")}
                </Typography>
              </Box>
            </Box>
          </Box>

          <TextField
            type="month"
            size="small"
            label={t("performanceMonth")}
            value={selectedMonth}
            onChange={(event) => handleMonthChange(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{
              width: { xs: "100%", sm: 220 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#ffffff",
                "& fieldset": { borderColor: "rgba(15, 23, 42, 0.12)" },
                "&:hover fieldset": { borderColor: "rgba(16, 122, 100, 0.4)" },
                "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 1 },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: BRAND },
            }}
          />
        </Box>

        {loadError && (
          <Alert severity="error" sx={{ mt: 2.5, borderRadius: 3 }}>
            {loadError}
          </Alert>
        )}

        {/* PERFORMANCE HERO */}
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
                variant="determinate"
                value={100}
                size={132}
                thickness={4}
                sx={{ color: "rgba(255,255,255,0.15)", position: "absolute" }}
              />
              <CircularProgress
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
                <HeroStat label="Target Remaining" value={yen(overview.remainingAmount)} />
              </Box>

              {isFetching && (
                <Typography sx={{ mt: 1.5, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                  {t("refreshing")}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* SUMMARY */}
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          }}
        >
          <SummaryCard
            label={t("assignedClients")}
            value={String(overview.totalAssignedClients)}
            subtitle={t("currentlyAssigned")}
            icon={<GroupsOutlinedIcon fontSize="small" />}
          />
          <SummaryCard
            label="Collected This Month"
            value={yen(overview.totalCollected)}
            subtitle={`${overview.payingClientCount} paying clients`}
            icon={<PaymentsOutlinedIcon fontSize="small" />}
          />
          <SummaryCard
            label="Completed Payments"
            value={String(overview.paymentCount)}
            subtitle={`${overview.allTimePaymentCount} completed all time`}
            icon={<ReceiptLongOutlinedIcon fontSize="small" />}
          />
          <SummaryCard
            label={t("monthlyTarget")}
            value={yen(overview.targetAmount)}
            subtitle={t("achieved", { percentage: overview.achievementPercentage })}
            icon={<TrackChangesOutlinedIcon fontSize="small" />}
          />
        </Box>

        {/* STAGES + COLLECTION SUMMARY */}
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            alignItems: "stretch",
          }}
        >
          <Paper elevation={0} sx={{ ...card, p: { xs: 2.5, md: 3 } }}>
            <Typography sx={sectionTitleSx}>{t("myClientProgress")}</Typography>

            {stageBreakdown.length === 0 ? (
              <Typography sx={{ mt: 2, fontSize: 14, color: INK_MUTED }}>
                {t("noAssignedClients")}
              </Typography>
            ) : (
              <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 1.75 }}>
                {stageBreakdown.map((item) => (
                  <Box key={item.stage || item.stageName}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, mb: 0.75 }}>
                      <Typography sx={{ fontSize: 13, color: INK_BODY }}>{item.stageName}</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: BRAND }}>
                        {item.count}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 6, borderRadius: 999, bgcolor: "rgba(15,23,42,0.06)", overflow: "hidden" }}>
                      <Box
                        sx={{
                          height: "100%",
                          width: `${(item.count / stageMax) * 100}%`,
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${BRAND_LIGHT}, ${BRAND})`,
                          transition: "width 600ms ease",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          <Paper elevation={0} sx={{ ...card, p: { xs: 2.5, md: 3 } }}>
            <Typography sx={sectionTitleSx}>Collection Summary</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 12, color: INK_MUTED }}>All time</Typography>
            <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <MiniStat label="All-Time Collected" value={yen(overview.allTimeCollected)} accent />
              <MiniStat label="Completed Payments" value={String(overview.allTimePaymentCount)} />
              <MiniStat label="Paying Clients" value={String(overview.allTimePayingClientCount)} />
            </Box>
          </Paper>
        </Box>

        {/* RECENT CLIENTS */}
        <Paper elevation={0} sx={{ ...card, mt: 2, overflow: "hidden" }}>
          <SectionHeader title={t("myRecentClients")} />
          <TableContainer>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, ...edgePl }}>{t("name")}</TableCell>
                  <TableCell sx={headCellSx}>{t("client")}</TableCell>
                  <TableCell sx={headCellSx}>Visa Status</TableCell>
                  <TableCell sx={headCellSx}>{t("currentStage")}</TableCell>
                  <TableCell sx={{ ...headCellSx, ...edgePr, width: 40 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {recentClients.map((client) => (
                  <TableRow
                    key={client.clientId}
                    hover={false}
                    sx={{ ...rowSx, cursor: "pointer", "&:hover .row-arrow": { color: BRAND, transform: "translateX(2px)" } }}
                    onClick={() => handleClientClick(client.clientId)}
                  >
                    <TableCell sx={{ ...bodyCellSx, ...edgePl }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            fontWeight: 700,
                            bgcolor: BRAND_SOFT,
                            color: BRAND,
                          }}
                        >
                          {initials(client.fullName)}
                        </Avatar>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: INK }}>
                          {client.fullName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, color: INK_MUTED, fontVariantNumeric: "tabular-nums" }}>
                      {client.clientId}
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, color: INK_MUTED }}>
                      {client.currentVisaStatus || "-"}
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Chip
                        size="small"
                        label={client.currentStageName}
                        sx={{
                          borderRadius: 1.5,
                          fontWeight: 600,
                          fontSize: 12,
                          bgcolor: BRAND_SOFT,
                          color: BRAND_DEEP,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, ...edgePr }}>
                      <ChevronRightRoundedIcon
                        className="row-arrow"
                        fontSize="small"
                        sx={{ color: "rgba(15,23,42,0.25)", transition: "all 160ms ease", display: "block" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {recentClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ ...bodyCellSx, py: 6, color: INK_MUTED, borderBottom: 0 }}>
                      {t("noAssignedClients")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* RECENT PAYMENTS */}
        <Paper elevation={0} sx={{ ...card, mt: 2, overflow: "hidden" }}>
          <SectionHeader title={t("myRecentCollections")} aside="Full stage payments credited to you" />
          <TableContainer>
            <Table size="small" sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, ...edgePl }}>{t("date")}</TableCell>
                  <TableCell sx={headCellSx}>{t("client")}</TableCell>
                  <TableCell sx={headCellSx}>Stage</TableCell>
                  <TableCell sx={headCellSx}>{t("method")}</TableCell>
                  <TableCell sx={{ ...headCellSx, ...edgePr }} align="right">
                    {t("amount")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment._id} hover={false} sx={rowSx}>
                    <TableCell sx={{ ...bodyCellSx, ...edgePl, color: INK_MUTED, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                      {formatJapanDate(payment.paymentDate)}
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Typography
                        component="span"
                        onClick={() => handleClientClick(payment.clientId)}
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: BRAND,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {payment.clientId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={bodyCellSx}>{payment.stageName}</TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={payment.paymentMethod}
                        sx={{ borderRadius: 1.5, fontSize: 12, color: INK_MUTED, borderColor: HAIRLINE }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...bodyCellSx, ...edgePr, fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums" }}
                    >
                      {yen(payment.amountPaid)}
                    </TableCell>
                  </TableRow>
                ))}

                {recentPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ ...bodyCellSx, py: 6, color: INK_MUTED, borderBottom: 0 }}>
                      {t("noCollections")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}