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

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useStaffDashboard } from "./hook";

import type { StaffDashboardStatus } from "./type";

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
// DASHBOARD
// =================================================

export default function StaffDashboard() {
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
          minHeight: 400,

          display: "grid",

          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const progressValue = Math.min(
    Math.max(overview.achievementPercentage, 0),
    100,
  );

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

          justifyContent: "space-between",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

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
            Welcome, {staff.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {staff.staffId} · Your clients, collections and monthly performance.
          </Typography>
        </Box>

        <TextField
          type="month"
          size="small"
          label="Performance Month"
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

      {/* =============================================
          SUMMARY CARDS
      ============================================== */}

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
          label="Assigned Clients"
          value={String(overview.totalAssignedClients)}
          subtitle="Currently assigned to you"
          icon={<GroupsOutlinedIcon />}
        />

        <SummaryCard
          label="Collected This Month"
          value={`¥${formatAmount(overview.totalCollected)}`}
          subtitle={`${overview.paymentCount} payments from ${overview.payingClientCount} clients`}
          icon={<PaymentsOutlinedIcon />}
        />

        <SummaryCard
          label="Outstanding Client Fees"
          value={`¥${formatAmount(overview.totalOutstanding)}`}
          subtitle={`${overview.outstandingFeeCount} fees still outstanding`}
          icon={<AccountBalanceWalletOutlinedIcon />}
        />

        <SummaryCard
          label="Monthly Target"
          value={`¥${formatAmount(overview.targetAmount)}`}
          subtitle={`${overview.achievementPercentage}% achieved`}
          icon={<TrackChangesOutlinedIcon />}
        />
      </Box>

      {/* =============================================
          PERFORMANCE
      ============================================== */}

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

            alignItems: "center",

            gap: 2,

            flexWrap: "wrap",

            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Monthly Performance
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {selectedMonth}
            </Typography>
          </Box>

          <Chip
            label={overview.performanceStatus}
            color={getStatusColor(overview.performanceStatus)}
          />
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(4, 1fr)",
            },

            gap: 2,

            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Target
            </Typography>

            <Typography fontWeight={700}>
              ¥{formatAmount(overview.targetAmount)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Collected
            </Typography>

            <Typography fontWeight={700}>
              ¥{formatAmount(overview.totalCollected)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Remaining
            </Typography>

            <Typography fontWeight={700}>
              ¥{formatAmount(overview.remainingAmount)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Achievement
            </Typography>

            <Typography fontWeight={700}>
              {overview.achievementPercentage}%
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressValue}
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
            Refreshing...
          </Typography>
        )}
      </Paper>

      {/* =============================================
          CLIENT FINANCIAL FOLLOW-UP
      ============================================== */}

      <Paper
        variant="outlined"
        sx={{
          p: 3,

          borderRadius: 2,

          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Client Fee Follow-up
        </Typography>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },

            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Expected
            </Typography>

            <Typography variant="h6" fontWeight={700}>
              ¥{formatAmount(overview.totalExpected)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Paid
            </Typography>

            <Typography variant="h6" fontWeight={700}>
              ¥{formatAmount(overview.totalPaidAgainstFees)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Outstanding
            </Typography>

            <Typography variant="h6" fontWeight={700}>
              ¥{formatAmount(overview.totalOutstanding)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* =============================================
          BOTTOM GRID
      ============================================== */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            xl: "1fr 2fr",
          },

          gap: 3,

          mb: 3,
        }}
      >
        {/* STAGES */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            My Client Progress
          </Typography>

          {stageBreakdown.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No assigned clients.
            </Typography>
          ) : (
            stageBreakdown.map((item) => (
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

                <Typography fontWeight={700} variant="body2">
                  {item.count}
                </Typography>
              </Box>
            ))
          )}
        </Paper>

        {/* CLIENTS */}

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              My Recent Clients
            </Typography>
          </Box>

          <TableContainer>
            <Table
              size="small"
              sx={{
                minWidth: 650,
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "action.hover",
                  }}
                >
                  <TableCell>Client</TableCell>

                  <TableCell>Name</TableCell>

                  <TableCell>Visa</TableCell>

                  <TableCell>Current Stage</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentClients.map((client) => (
                  <TableRow
                    key={client.clientId}
                    hover
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleClientClick(client.clientId)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {client.clientId}
                      </Typography>
                    </TableCell>

                    <TableCell>{client.fullName}</TableCell>

                    <TableCell>{client.visaType || "-"}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={client.currentStage}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {recentClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      No assigned clients.
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
        variant="outlined"
        sx={{
          borderRadius: 2,

          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            My Recent Collections
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Payments credited to your performance.
          </Typography>
        </Box>

        <TableContainer>
          <Table
            size="small"
            sx={{
              minWidth: 750,
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

                <TableCell>Method</TableCell>

                <TableCell>Stage</TableCell>

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
                    <strong>¥{formatAmount(payment.amountPaid)}</strong>
                  </TableCell>

                  <TableCell>{payment.paymentMethod}</TableCell>

                  <TableCell>{payment.stageAtPayment}</TableCell>

                  <TableCell>{formatJapanDate(payment.paymentDate)}</TableCell>
                </TableRow>
              ))}

              {recentPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No collections recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
