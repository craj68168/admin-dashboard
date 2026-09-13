"use client";

import type { ReactNode } from "react";

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

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useAdminDashboard } from "./hook";

import type { DashboardPerformanceStatus } from "./type";

// =================================================
// MONEY
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
// STATUS
// =================================================

const getStatusColor = (
  status: DashboardPerformanceStatus,
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
// SUMMARY CARD
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
      variant="outlined"
      sx={{
        p: 2.5,

        borderRadius: 2,

        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",

          gap: 2,
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>

          <Typography variant="h5" fontWeight={700} sx={{ mt: 0.75 }}>
            {value}
          </Typography>

          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",

                mt: 0.75,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            color: "text.secondary",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

// =================================================
// COMPONENT
// =================================================

export default function AdminDashboard() {
  const {
    selectedMonth,

    handleMonthChange,

    overview,

    rankings,

    stageBreakdown,

    recentPayments,

    isLoading,

    isFetching,

    loadError,

    handleStaffClick,

    handleClientClick,
  } = useAdminDashboard();

  if (isLoading || !overview) {
    return (
      <Box
        sx={{
          minHeight: 400,

          display: "grid",

          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const targetProgress = Math.min(Math.max(overview.targetAchievement, 0), 100);

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#f3f4f6",

        px: {
          xs: 2,
          md: 4,
        },

        py: 2,
      }}
    >
      {/* BREADCRUMB */}

      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              current: true,
            },
          ]}
        />
      </Box>

      {/* HEADER */}

      <Box
        sx={{
          display: "flex",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

          justifyContent: "space-between",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          gap: 2,

          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Admin Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Recruitment, collections and staff performance overview.
          </Typography>
        </Box>

        <TextField
          type="month"
          label="Performance Month"
          size="small"
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
          }}
        />
      </Box>

      {loadError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loadError}
        </Alert>
      )}

      {/* =================================================
          MAIN SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            sm: "repeat(2, 1fr)",

            xl: "repeat(4, 1fr)",
          },

          gap: 2,

          mb: 3,
        }}
      >
        <SummaryCard
          label="Total Clients"
          value={String(overview.totalClients)}
          subtitle={`${overview.monthlyClientCount} paying clients this month`}
          icon={<PeopleAltOutlinedIcon />}
        />

        <SummaryCard
          label="Active Staff"
          value={String(overview.activeStaff)}
          subtitle={`${overview.totalStaff} total staff`}
          icon={<BadgeOutlinedIcon />}
        />

        <SummaryCard
          label="Collected This Month"
          value={`¥${formatAmount(overview.monthlyCollected)}`}
          subtitle={`${overview.monthlyPaymentCount} payments`}
          icon={<PaymentsOutlinedIcon />}
        />

        <SummaryCard
          label="Outstanding Fees"
          value={`¥${formatAmount(overview.totalOutstanding)}`}
          subtitle={`Expected ¥${formatAmount(overview.totalExpected)}`}
          icon={<AccountBalanceWalletOutlinedIcon />}
        />
      </Box>

      {/* =================================================
          MONTHLY TARGET
      ================================================= */}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",

            justifyContent: "space-between",

            gap: 2,

            flexWrap: "wrap",

            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Monthly Collection Target
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {selectedMonth}
            </Typography>
          </Box>

          <TrackChangesOutlinedIcon color="action" />
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(3, 1fr)",
            },

            gap: 2,

            mb: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Target
            </Typography>

            <Typography fontWeight={700}>
              ¥{formatAmount(overview.totalTarget)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Collected
            </Typography>

            <Typography fontWeight={700}>
              ¥{formatAmount(overview.monthlyCollected)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Achievement
            </Typography>

            <Typography fontWeight={700}>
              {overview.targetAchievement}%
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={targetProgress}
          sx={{
            height: 10,

            borderRadius: 10,
          }}
        />

        {isFetching && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1,
            }}
          >
            Refreshing dashboard...
          </Typography>
        )}
      </Paper>

      {/* =================================================
          STAFF RANKING
      ================================================= */}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,

          mb: 3,

          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            pb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Staff Ranking
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Ranked by monthly collection amount.
          </Typography>
        </Box>

        <TableContainer>
          <Table
            sx={{
              minWidth: 900,
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "action.hover",
                }}
              >
                <TableCell>Rank</TableCell>

                <TableCell>Staff</TableCell>

                <TableCell align="right">Target</TableCell>

                <TableCell align="right">Collected</TableCell>

                <TableCell align="right">Remaining</TableCell>

                <TableCell align="right">Achievement</TableCell>

                <TableCell align="center">Payments</TableCell>

                <TableCell align="center">Clients</TableCell>

                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rankings.map((staff) => (
                <TableRow
                  key={staff.staffId}
                  hover
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleStaffClick(staff.staffId)}
                >
                  <TableCell>
                    <strong>#{staff.rank}</strong>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {staff.staffName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {staff.staffId}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    ¥{formatAmount(staff.targetAmount)}
                  </TableCell>

                  <TableCell align="right">
                    <strong>¥{formatAmount(staff.totalCollected)}</strong>
                  </TableCell>

                  <TableCell align="right">
                    ¥{formatAmount(staff.remainingAmount)}
                  </TableCell>

                  <TableCell align="right">
                    {staff.achievementPercentage}%
                  </TableCell>

                  <TableCell align="center">{staff.paymentCount}</TableCell>

                  <TableCell align="center">{staff.clientCount}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={staff.status}
                      color={getStatusColor(staff.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* =================================================
          BOTTOM
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            xl: "1fr 1.6fr",
          },

          gap: 3,
        }}
      >
        {/* STAGES */}

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Client Progress
          </Typography>

          {stageBreakdown.map((item) => (
            <Box
              key={item.stage}
              sx={{
                display: "flex",

                justifyContent: "space-between",

                gap: 2,

                py: 1.25,

                borderBottom: "1px solid",

                borderColor: "divider",

                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <Typography variant="body2">{item.stage}</Typography>

              <Typography variant="body2" fontWeight={700}>
                {item.count}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* RECENT PAYMENTS */}

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,

            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Recent Payments
            </Typography>
          </Box>

          <TableContainer>
            <Table
              size="small"
              sx={{
                minWidth: 700,
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "action.hover",
                  }}
                >
                  <TableCell>Client</TableCell>

                  <TableCell>Fee</TableCell>

                  <TableCell align="right">Amount</TableCell>

                  <TableCell>Staff</TableCell>

                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment._id} hover>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          cursor: "pointer",

                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() => handleClientClick(payment.clientId)}
                      >
                        {payment.clientId}
                      </Typography>
                    </TableCell>

                    <TableCell>{payment.paymentName}</TableCell>

                    <TableCell align="right">
                      ¥{formatAmount(payment.amountPaid)}
                    </TableCell>

                    <TableCell>{payment.creditedStaffName}</TableCell>

                    <TableCell>
                      {formatJapanDate(payment.paymentDate)}
                    </TableCell>
                  </TableRow>
                ))}

                {recentPayments.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        py: 4,
                      }}
                    >
                      No payments yet.
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
