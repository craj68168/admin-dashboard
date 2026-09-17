"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
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
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useStaffDashboard } from "./hook";

import type { StaffDashboardStatus } from "./type";

// =================================================
// THEME TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";

// Text colours. MUI's default text.secondary is rgba(0,0,0,0.6),
// which reads washed out on the off-white background.
const INK = "#111827"; // headings, values, primary cells
const INK_BODY = "#1F2937"; // regular table body text
const INK_MUTED = "#4B5563"; // labels, captions, secondary cells

const softCard = {
  p: { xs: 2.5, md: 3 },

  borderRadius: 3,

  border: "1px solid",

  borderColor: HAIRLINE,

  bgcolor: "#ffffff",

  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const labelSx = {
  fontSize: 12,
  fontWeight: 600,
  color: INK_MUTED,
  letterSpacing: 0.2,
};

const valueSx = {
  mt: 0.75,
  fontSize: 20,
  fontWeight: 600,
  color: INK,
  lineHeight: 1.25,
};

const headCellSx = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  color: INK_MUTED,
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
    bgcolor: "rgba(16, 122, 100, 0.04)",
  },

  "&:last-of-type td": {
    borderBottom: 0,
  },
};

// =================================================
// AMOUNT
// =================================================

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

// =================================================
// JAPAN DATE
// =================================================

const formatJapanDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",

    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

// =================================================
// PERFORMANCE STATUS
// =================================================

const getStatusColor = (
  status: StaffDashboardStatus,
): "default" | "info" | "warning" | "success" => {
  switch (status) {
    case "Achieved":
      return "success";

    case "In Progress":
      return "warning";

    case "No Target":
      return "info";

    default:
      return "default";
  }
};

// =================================================
// CARD
// =================================================

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
        ...softCard,

        height: "100%",

        transition: "transform 400ms ease, box-shadow 400ms ease",

        "&:hover": {
          transform: "translateY(-2px)",

          boxShadow:
            "0 1px 2px rgba(17,24,39,0.04), 0 18px 40px -24px rgba(17,24,39,0.38)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",

          alignItems: "flex-start",

          justifyContent: "space-between",

          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={labelSx}>{label}</Typography>

          <Typography sx={valueSx}>{value}</Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                color: INK_MUTED,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",

            placeItems: "center",

            flexShrink: 0,

            width: 42,

            height: 42,

            borderRadius: 2.5,

            bgcolor: BRAND_SOFT,

            color: BRAND,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

// =================================================
// STAT
// =================================================

type StatProps = {
  label: string;

  value: string;

  color?: string;
};

function Stat({ label, value, color }: StatProps) {
  return (
    <Box sx={{ flex: "1 1 160px", minWidth: 140 }}>
      <Typography sx={{ fontSize: 12, color: INK_MUTED }}>{label}</Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 18,
          fontWeight: 600,
          color: color || INK,
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
      <Box
        sx={{
          minHeight: "60vh",

          display: "grid",

          placeItems: "center",

          bgcolor: "#F7F8F6",
        }}
      >
        <CircularProgress size={28} sx={{ color: BRAND }} />
      </Box>
    );
  }

  const progressValue = Math.min(
    Math.max(overview.achievementPercentage, 0),
    100,
  );

  const performanceStatusLabel: Record<StaffDashboardStatus, string> = {
    "No Target": t("status.noTarget"),
    "Not Started": t("status.notStarted"),
    "In Progress": t("status.inProgress"),
    Achieved: t("status.achieved"),
  };

  return (
    <Box
      sx={{
        bgcolor: "#F7F8F6",

        minHeight: "100vh",

        px: { xs: 2, sm: 3, md: 4 },

        py: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto" }}>
        {/* BREADCRUMB */}

        <Box sx={{ mb: 2 }}>
          <Breadcrumb
            items={[
              {
                label: t("dashboard"),
                current: true,
              },
            ]}
          />
        </Box>

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",

            flexWrap: "wrap",

            alignItems: "flex-end",

            justifyContent: "space-between",

            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 24, md: 30 },
                fontWeight: 600,
                letterSpacing: -0.4,
              }}
            >
              {t("welcome", { name: staff.name })}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 14,
                color: INK_MUTED,
              }}
            >
              {staff.staffId} - {t("description")}
            </Typography>
          </Box>

          <TextField
            type="month"
            size="small"
            label={t("performanceMonth")}
            value={selectedMonth}
            onChange={(event) => handleMonthChange(event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{
              width: {
                xs: "100%",
                sm: 220,
              },

              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,

                bgcolor: "#ffffff",

                "& fieldset": {
                  borderColor: "rgba(17, 24, 39, 0.10)",
                },

                "&:hover fieldset": {
                  borderColor: "rgba(16, 122, 100, 0.35)",
                },

                "&.Mui-focused fieldset": {
                  borderColor: BRAND,
                  borderWidth: 1,
                },
              },
            }}
          />
        </Box>

        {loadError && (
          <Alert
            severity="error"
            sx={{
              mt: 2.5,
              borderRadius: 2.5,
              border: "1px solid rgba(211,47,47,0.14)",
            }}
          >
            {loadError}
          </Alert>
        )}

        {/* =============================================
            SUMMARY CARDS
        ============================================== */}

        <Box
          sx={{
            mt: 3,

            display: "grid",

            gap: 2,

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(2, 1fr)",

              lg: "repeat(4, 1fr)",
            },
          }}
        >
          <SummaryCard
            label={t("assignedClients")}
            value={formatAmount(overview.totalAssignedClients)}
            subtitle={t("currentlyAssigned")}
            icon={<GroupsOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label={t("collectedThisMonth")}
            value={`¥${formatAmount(overview.totalCollected)}`}
            subtitle={t("paymentsFromClients", {
              payments: overview.paymentCount,
              clients: overview.payingClientCount,
            })}
            icon={<PaymentsOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label={t("outstandingClientFees")}
            value={`¥${formatAmount(overview.totalOutstanding)}`}
            subtitle={t("feesOutstanding", {
              count: overview.outstandingFeeCount,
            })}
            icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label={t("monthlyTarget")}
            value={`¥${formatAmount(overview.targetAmount)}`}
            subtitle={t("achieved", {
              percentage: overview.achievementPercentage,
            })}
            icon={<TrackChangesOutlinedIcon fontSize="small" />}
          />
        </Box>

        {/* =============================================
            PERFORMANCE
        ============================================== */}

        <Paper elevation={0} sx={{ ...softCard, mt: 2 }}>
          <Box
            sx={{
              display: "flex",

              flexWrap: "wrap",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
                {t("monthlyPerformance")}
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: 12,
                  color: INK_MUTED,
                }}
              >
                {selectedMonth}
              </Typography>
            </Box>

            <Chip
              size="small"
              label={performanceStatusLabel[overview.performanceStatus]}
              color={getStatusColor(overview.performanceStatus)}
              variant="outlined"
              sx={{
                borderRadius: 999,
                fontWeight: 500,
                bgcolor: "rgba(17,24,39,0.02)",
              }}
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
            }}
          >
            <Stat
              label={t("target")}
              value={`¥${formatAmount(overview.targetAmount)}`}
            />

            <Stat
              label={t("collected")}
              value={`¥${formatAmount(overview.totalCollected)}`}
              color={BRAND}
            />

            <Stat
              label={t("remaining")}
              value={`¥${formatAmount(overview.remainingAmount)}`}
            />

            <Stat
              label={t("achievement")}
              value={`${overview.achievementPercentage}%`}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              mt: 3,

              height: 10,

              borderRadius: 999,

              bgcolor: "rgba(17, 24, 39, 0.06)",

              "& .MuiLinearProgress-bar": {
                borderRadius: 999,

                backgroundImage: `linear-gradient(90deg, #6FBFA6, ${BRAND})`,

                transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
              },
            }}
          />

          {isFetching && (
            <Typography
              sx={{
                mt: 1.5,
                fontSize: 12,
                color: INK_MUTED,
              }}
            >
              {t("refreshing")}
            </Typography>
          )}
        </Paper>

        {/* =============================================
            CLIENT FINANCIAL FOLLOW-UP
        ============================================== */}

        <Paper elevation={0} sx={{ ...softCard, mt: 2 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
            {t("clientFeeFollowUp")}
          </Typography>

          <Box
            sx={{
              mt: 2.5,
              display: "flex",
              flexWrap: "wrap",
              gap: 2.5,
            }}
          >
            <Stat
              label={t("totalExpected")}
              value={`¥${formatAmount(overview.totalExpected)}`}
            />

            <Stat
              label={t("paid")}
              value={`¥${formatAmount(overview.totalPaidAgainstFees)}`}
              color={BRAND}
            />

            <Stat
              label={t("outstanding")}
              value={`¥${formatAmount(overview.totalOutstanding)}`}
              color="#B7791F"
            />
          </Box>
        </Paper>

        {/* =============================================
            BOTTOM GRID
        ============================================== */}

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gap: 2,

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 2fr",
            },

            alignItems: "start",
          }}
        >
          {/* STAGES */}

          <Paper elevation={0} sx={softCard}>
            <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
              {t("myClientProgress")}
            </Typography>

            {stageBreakdown.length === 0 ? (
              <Typography
                sx={{
                  mt: 2,
                  fontSize: 14,
                  color: INK_MUTED,
                }}
              >
                {t("noAssignedClients")}
              </Typography>
            ) : (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                }}
              >
                {stageBreakdown.map((item) => (
                  <Box
                    key={item.stage}
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      justifyContent: "space-between",

                      gap: 1.5,

                      px: 2,

                      py: 1.25,

                      borderRadius: 2,

                      bgcolor: "rgba(16, 122, 100, 0.05)",
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>{item.stage}</Typography>

                    <Typography
                      sx={{
                        px: 1.25,

                        py: 0.25,

                        borderRadius: 999,

                        bgcolor: "#ffffff",

                        fontSize: 13,

                        fontWeight: 600,

                        color: BRAND,
                      }}
                    >
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* CLIENTS */}

          <Paper
            elevation={0}
            sx={{
              ...softCard,
              p: 0,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: { xs: 2.5, md: 3 },

                py: 2,

                borderBottom: `1px solid ${HAIRLINE}`,
              }}
            >
              <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
                {t("myRecentClients")}
              </Typography>
            </Box>

            <TableContainer>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headCellSx, pl: { xs: 2.5, md: 3 } }}>
                      {t("client")}
                    </TableCell>

                    <TableCell sx={headCellSx}>{t("name")}</TableCell>

                    <TableCell sx={headCellSx}>{t("visa")}</TableCell>

                    <TableCell sx={{ ...headCellSx, pr: { xs: 2.5, md: 3 } }}>
                      {t("currentStage")}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recentClients.map((client) => (
                    <TableRow
                      key={client.clientId}
                      hover={false}
                      sx={{ ...rowSx, cursor: "pointer" }}
                      onClick={() => handleClientClick(client.clientId)}
                    >
                      <TableCell sx={{ ...bodyCellSx, pl: { xs: 2.5, md: 3 } }}>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: BRAND,
                          }}
                        >
                          {client.clientId}
                        </Typography>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>{client.fullName}</TableCell>

                      <TableCell sx={{ ...bodyCellSx, color: INK_MUTED }}>
                        {client.visaType || "-"}
                      </TableCell>

                      <TableCell sx={{ ...bodyCellSx, pr: { xs: 2.5, md: 3 } }}>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={client.currentStage}
                          sx={{ borderRadius: 999, fontWeight: 500 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {recentClients.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{
                          ...bodyCellSx,
                          py: 5,
                          color: INK_MUTED,
                          borderBottom: 0,
                        }}
                      >
                        {t("noAssignedClients")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* =============================================
            RECENT PAYMENTS
        ============================================== */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,
            mt: 2,
            p: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: { xs: 2.5, md: 3 },

              py: 2,

              borderBottom: `1px solid ${HAIRLINE}`,

              display: "flex",

              flexWrap: "wrap",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
              {t("myRecentCollections")}
            </Typography>

            <Typography sx={{ fontSize: 12, color: INK_MUTED }}>
              {t("collectionsDescription")}
            </Typography>
          </Box>

          <TableContainer>
            <Table size="small" sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, pl: { xs: 2.5, md: 3 } }}>
                    {t("client")}
                  </TableCell>

                  <TableCell sx={headCellSx}>{t("fee")}</TableCell>

                  <TableCell sx={headCellSx} align="right">
                    {t("amount")}
                  </TableCell>

                  <TableCell sx={headCellSx}>{t("method")}</TableCell>

                  <TableCell sx={headCellSx}>{t("stage")}</TableCell>

                  <TableCell sx={{ ...headCellSx, pr: { xs: 2.5, md: 3 } }}>
                    {t("date")}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment._id} hover={false} sx={rowSx}>
                    <TableCell sx={{ ...bodyCellSx, pl: { xs: 2.5, md: 3 } }}>
                      <Typography
                        component="span"
                        onClick={() => handleClientClick(payment.clientId)}
                        sx={{
                          fontSize: 14,

                          fontWeight: 600,

                          color: BRAND,

                          cursor: "pointer",

                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {payment.clientId}
                      </Typography>
                    </TableCell>

                    <TableCell sx={bodyCellSx}>{payment.paymentName}</TableCell>

                    <TableCell
                      align="right"
                      sx={{ ...bodyCellSx, fontWeight: 600 }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, color: INK_MUTED }}>
                      {payment.paymentMethod}
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, color: INK_MUTED }}>
                      {payment.stageAtPayment}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,
                        pr: { xs: 2.5, md: 3 },
                        color: INK_MUTED,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatJapanDate(payment.paymentDate)}
                    </TableCell>
                  </TableRow>
                ))}

                {recentPayments.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{
                        ...bodyCellSx,
                        py: 5,
                        color: INK_MUTED,
                        borderBottom: 0,
                      }}
                    >
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
