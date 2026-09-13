"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type { PerformanceHistoryProps, PerformanceHistoryStatus } from "./type";

import { usePerformanceHistoryHook } from "./hook";

// =================================================
// MONEY FORMAT
// =================================================

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount || 0));
};

// =================================================
// MONTH FORMAT
// 2026-09 -> September 2026
// =================================================

const formatMonth = (month: string) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return month;
  }

  const [year, monthNumber] = month.split("-");

  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
};

// =================================================
// STATUS COLOR
// =================================================

const getStatusColor = (
  status: PerformanceHistoryStatus,
): "default" | "info" | "warning" | "success" => {
  switch (status) {
    case "Achieved":
      return "success";

    case "In Progress":
      return "warning";

    case "No Target":
      return "info";

    case "Not Started":
    default:
      return "default";
  }
};

// =================================================
// COMPONENT
// =================================================

export default function PerformanceHistory({
  staffId,
}: PerformanceHistoryProps) {
  const {
    history,

    isLoading,

    isFetching,

    loadError,
  } = usePerformanceHistoryHook(staffId);

  return (
    <Box>
      {/* HEADER */}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Performance History
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Monthly target and collection history for this staff member.
        </Typography>
      </Box>

      {/* ERROR */}

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      {/* LOADING */}

      {isLoading ? (
        <Box
          sx={{
            minHeight: 180,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : history.length === 0 ? (
        /* EMPTY */

        <Box
          sx={{
            border: "1px dashed",

            borderColor: "divider",

            borderRadius: 2,

            py: 5,

            px: 2,

            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No performance history is available yet.
          </Typography>
        </Box>
      ) : (
        /* TABLE */

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 2,
          }}
        >
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
                <TableCell>
                  <strong>Month</strong>
                </TableCell>

                <TableCell align="right">
                  <strong>Target</strong>
                </TableCell>

                <TableCell align="right">
                  <strong>Collected</strong>
                </TableCell>

                <TableCell align="right">
                  <strong>Remaining</strong>
                </TableCell>

                <TableCell align="right">
                  <strong>Achievement</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Payments</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Clients</strong>
                </TableCell>

                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.map((item) => (
                <TableRow key={item.month} hover>
                  {/* MONTH */}

                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {formatMonth(item.month)}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {item.month}
                    </Typography>
                  </TableCell>

                  {/* TARGET */}

                  <TableCell align="right">
                    ¥{formatAmount(item.targetAmount)}
                  </TableCell>

                  {/* COLLECTED */}

                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ¥{formatAmount(item.totalCollected)}
                    </Typography>
                  </TableCell>

                  {/* REMAINING */}

                  <TableCell align="right">
                    ¥{formatAmount(item.remainingAmount)}
                  </TableCell>

                  {/* ACHIEVEMENT */}

                  <TableCell align="right">
                    {item.achievementPercentage.toLocaleString()}%
                  </TableCell>

                  {/* PAYMENTS */}

                  <TableCell align="center">{item.paymentCount}</TableCell>

                  {/* CLIENTS */}

                  <TableCell align="center">{item.clientCount}</TableCell>

                  {/* STATUS */}

                  <TableCell>
                    <Chip
                      size="small"
                      label={item.status}
                      color={getStatusColor(item.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* REFRESHING */}

      {isFetching && !isLoading && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 1,
            textAlign: "right",
          }}
        >
          Refreshing...
        </Typography>
      )}
    </Box>
  );
}
