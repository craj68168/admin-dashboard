"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { formatNpr, getBalance } from "@/data/sales-demo";
import { useRevenueData } from "./hook";
import type {
  RevenueMetricProps,
  RevenueMetricTone,
  RevenueStatusStyles,
} from "./type";

const statusStyles: RevenueStatusStyles = {
  Paid: { background: "#ECFDF5", color: "#047857" },
  Partial: { background: "#FFFBEB", color: "#B45309" },
  Unpaid: { background: "#FFF1F2", color: "#BE123C" },
};

export default function RevenuePage() {
  const { data, isLoading } = useRevenueData();
  const summary = data?.summary ?? {
    totalBilled: 0,
    totalCollected: 0,
    totalOutstanding: 0,
  };
  const milestones = data?.milestones ?? [];

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 72px)",
        bgcolor: "#F8FAFC",
        px: { xs: 2, sm: 3, lg: 4 },
        py: 3,
      }}
    >
      <Box sx={{ maxWidth: 1500, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 4,
            justifyContent: "space-between",
            alignItems: { sm: "flex-end" },
          }}
        >
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#2563EB",
              }}
            >
              Finance workspace
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 28, sm: 36 },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#0F172A",
              }}
            >
              Billing &amp; collections
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 14, color: "#64748B" }}>
              Separate what is due from what has actually been collected.
            </Typography>
          </Box>
          <Chip
            label="September 2026"
            sx={{ bgcolor: "#EFF6FF", color: "#1D4ED8", fontWeight: 700 }}
          />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 4,
          }}
        >
          <MetricCard
            label="Total billed"
            value={formatNpr(summary.totalBilled)}
            detail="Milestones currently due"
            icon={<ReceiptLongRoundedIcon />}
            tone="blue"
          />
          <MetricCard
            label="Collected revenue"
            value={formatNpr(summary.totalCollected)}
            detail="Actual payments received"
            icon={<TrendingUpRoundedIcon />}
            tone="green"
          />
          <MetricCard
            label="Outstanding balance"
            value={formatNpr(summary.totalOutstanding)}
            detail="Still expected from clients"
            icon={<TrendingDownRoundedIcon />}
            tone="amber"
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            borderRadius: 2,
            boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
          }}
        >
          <Stack
            direction="row"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderBottom: "1px solid #F1F5F9",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                component="h2"
                sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}
              >
                Billing milestones
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 14, color: "#64748B" }}>
                Each charge and its payment state are tracked independently.
              </Typography>
            </Box>
            <PaymentsRoundedIcon sx={{ color: "#2563EB" }} />
          </Stack>
          <TableContainer>
            <Table sx={{ minWidth: 850 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                  {[
                    "Client",
                    "Milestone",
                    "Total charge",
                    "Paid",
                    "Balance",
                    "Payment details",
                    "Status",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        py: 2,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "#64748B",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ py: 6, textAlign: "center", color: "#94A3B8" }}
                    >
                      Loading billing data...
                    </TableCell>
                  </TableRow>
                ) : (
                  milestones.map((item) => {
                    const status = statusStyles[item.status];
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ py: 2 }}>
                          <Link
                            href={`/admin/client/clientDetailPage?clientId=${item.clientId}`}
                          >
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#1E293B",
                                "&:hover": { color: "#2563EB" },
                              }}
                            >
                              {item.clientName}
                            </Typography>
                          </Link>
                          <Typography
                            sx={{ mt: 0.5, fontSize: 12, color: "#94A3B8" }}
                          >
                            {item.clientId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: 14, color: "#475569" }}>
                          {item.milestone}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1E293B",
                          }}
                        >
                          {formatNpr(item.totalCharge)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#047857",
                          }}
                        >
                          {formatNpr(item.amountPaid)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#B45309",
                          }}
                        >
                          {formatNpr(getBalance(item))}
                        </TableCell>
                        <TableCell sx={{ fontSize: 13, color: "#64748B" }}>
                          {item.paymentDate ? (
                            <>
                              <Typography sx={{ fontSize: 13 }}>
                                {item.paymentDate} · {item.paymentMethod}
                              </Typography>
                              <Typography sx={{ mt: 0.5, fontSize: 12 }}>
                                Received by {item.receivedBy}
                              </Typography>
                            </>
                          ) : (
                            "No payment recorded"
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            sx={{
                              bgcolor: status.background,
                              color: status.color,
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}

function MetricCard({ label, value, detail, icon, tone }: RevenueMetricProps) {
  const styles: Record<
    RevenueMetricTone,
    { background: string; color: string }
  > = {
    blue: { background: "#EFF6FF", color: "#2563EB" },
    green: { background: "#ECFDF5", color: "#059669" },
    amber: { background: "#FFFBEB", color: "#D97706" },
  };
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid #E2E8F0",
        borderRadius: 2,
        boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <Box>
          <Typography sx={{ fontSize: 14, color: "#64748B" }}>
            {label}
          </Typography>
          <Typography
            sx={{ mt: 1.5, fontSize: 26, fontWeight: 700, color: "#0F172A" }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: styles[tone].background,
            color: styles[tone].color,
          }}
        >
          {icon}
        </Box>
      </Stack>
      <Typography sx={{ mt: 1.5, fontSize: 12, color: "#94A3B8" }}>
        {detail}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={tone === "green" ? 70 : tone === "amber" ? 45 : 85}
        sx={{
          mt: 2,
          height: 5,
          borderRadius: 5,
          bgcolor: "#F1F5F9",
          "& .MuiLinearProgress-bar": {
            bgcolor: styles[tone].color,
            borderRadius: 5,
          },
        }}
      />
    </Paper>
  );
}
