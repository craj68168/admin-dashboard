"use client";
import type { ReactNode } from "react";
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
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import type { useAdminDashboard } from "./hook";
import type { DashboardPaymentStatus } from "./type";

type Props = {
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    | "selectedMonth"
    | "payments"
    | "paymentPagination"
    | "handlePaymentPageChange"
    | "handlePaymentLimitChange"
    | "handleClientClick"
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

const NUMERIC = { fontVariantNumeric: "tabular-nums" };

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
    borderRadius: "6px",
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

// Theme body1/body2 are weight 500, so every cell sets its own weight.
const headCellSx = {
  fontSize: 12,
  fontWeight: 600,
  color: INK_MUTED,
  bgcolor: "rgba(16, 122, 100, 0.04)",
  borderBottomColor: HAIRLINE,
  py: 1.5,
  whiteSpace: "nowrap",
};

const bodyCellSx = {
  fontSize: 14,
  fontWeight: 400,
  color: INK_BODY,
  borderBottomColor: "rgba(17, 24, 39, 0.05)",
  py: 1.5,
};

const rowSx = {
  transition: "background-color 160ms ease",
  "&:hover": { bgcolor: "rgba(16, 122, 100, 0.045)" },
  "&:last-of-type td": { borderBottom: 0 },
};

const edgeLeft = { pl: { xs: 2.5, md: 3 } };
const edgeRight = { pr: { xs: 2.5, md: 3 } };

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
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
    {
      fontSize: 13,
      fontWeight: 400,
      color: INK_MUTED,
      ...NUMERIC,
    },
};

const showOnDesktop = { display: { xs: "none", md: "block" } };
const showOnMobile = {
  display: { xs: "flex", md: "none" },
  flexDirection: "column",
};

const amountFormatter = new Intl.NumberFormat("ja-JP");
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));

const formatJapanDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return dateFormatter.format(date);
};

const initialsOf = (name: string | undefined, fallbackId: string) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length > 0) {
    const first = Array.from(parts[0])[0] ?? "";
    const last =
      parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? "") : "";
    return `${first}${last}`.toUpperCase();
  }
  return fallbackId.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
};

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const paymentTone = (status: DashboardPaymentStatus): Tone => {
  if (status === "Completed") {
    return "success";
  }
  if (status === "Refunded") {
    return "warning";
  }
  if (status === "Cancelled") {
    return "danger";
  }
  return "neutral";
};

const PILL_TONES: Record<Tone, { bg: string; fg: string; line: string }> = {
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
  aside?: ReactNode;
};

function SectionHeader({ title, subtitle, icon, aside }: SectionHeaderProps) {
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

      <Box sx={{ minWidth: 0, flex: 1 }}>
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

      {aside}
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
      <Typography sx={{ fontSize: 12, fontWeight: 400, color: INK_MUTED }}>
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

function EmptyState() {
  return (
    <Box
      sx={{
        display: "grid",
        justifyItems: "center",
        gap: 1.5,
        py: 6,
        px: 2,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: BRAND_SOFT,
          color: BRAND,
        }}
      >
        <ReceiptLongOutlinedIcon sx={{ fontSize: 26 }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: INK }}>
          No payments found
        </Typography>
        <Typography
          sx={{ mt: 0.5, fontSize: 13, fontWeight: 400, color: INK_MUTED }}
        >
          Try another month or adjust the filters.
        </Typography>
      </Box>
    </Box>
  );
}

function InitialsAvatar({ text }: { text: string }) {
  return (
    <Box
      aria-hidden
      sx={{
        display: "grid",
        placeItems: "center",
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: "50%",
        bgcolor: BRAND_SOFT,
        color: BRAND_DEEP,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {text}
    </Box>
  );
}

type ClientLinkProps = {
  clientId: string;
  clientName?: string;
  onOpen: (clientId: string) => void;
};

// Name first (that is what people recognise), ID underneath. The whole block
// is one button that opens the client.
function ClientLink({ clientId, clientName, onOpen }: ClientLinkProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <InitialsAvatar text={initialsOf(clientName, clientId)} />

      <Box
        component="button"
        type="button"
        onClick={() => onOpen(clientId)}
        aria-label={`Open client ${clientName ? `${clientName}, ` : ""}${clientId}`}
        sx={{
          p: 0,
          border: 0,
          bgcolor: "transparent",
          font: "inherit",
          textAlign: "left",
          cursor: "pointer",
          minWidth: 0,
          "&:hover .client-primary": {
            color: BRAND,
            textDecoration: "underline",
          },
          ...focusRing,
        }}
      >
        <Typography
          className="client-primary"
          component="span"
          noWrap
          sx={{
            display: "block",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.3,
            color: INK,
            transition: "color 160ms ease",
          }}
        >
          {clientName || clientId}
        </Typography>

        {clientName && (
          <Typography
            component="span"
            noWrap
            sx={{
              display: "block",
              mt: 0.25,
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 1.3,
              color: INK_MUTED,
              ...NUMERIC,
            }}
          >
            {clientId}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

const amountSx = (status: DashboardPaymentStatus) => ({
  fontWeight: 700,
  color: status === "Cancelled" ? INK_MUTED : INK,
  textDecoration: status === "Cancelled" ? "line-through" : "none",
  textDecorationColor: "rgba(91, 106, 126, 0.6)",
  ...NUMERIC,
});

const mobileCardSx = {
  px: 2,
  py: 2,
  borderBottom: `1px solid ${HAIRLINE}`,
  "&:last-of-type": { borderBottom: 0 },
};

export default function PaymentsTable({ data }: Props) {
  const {
    selectedMonth,
    payments,
    paymentPagination,
    handlePaymentPageChange,
    handlePaymentLimitChange,
    handleClientClick,
  } = data;

  return (
    <Paper
      elevation={0}
      sx={{ ...softCard, mt: 2, p: 0, overflow: "hidden" }}
    >
      <SectionHeader
        title="Payments"
        subtitle={`Payments for ${selectedMonth}`}
        icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />}
        aside={
          <Typography
            sx={{
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 600,
              color: INK_MUTED,
              ...NUMERIC,
            }}
          >
            {formatAmount(paymentPagination.total)}{" "}
            {paymentPagination.total === 1 ? "payment" : "payments"}
          </Typography>
        }
      />

      {/* ---------- Desktop table ---------- */}

      <TableContainer sx={showOnDesktop}>
        <Table size="small" sx={{ minWidth: 820 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, ...edgeLeft }}>Client</TableCell>
              <TableCell sx={headCellSx}>Stage</TableCell>
              <TableCell sx={headCellSx} align="right">
                Amount
              </TableCell>
              <TableCell sx={headCellSx}>Method</TableCell>
              <TableCell sx={headCellSx}>Status</TableCell>
              <TableCell sx={headCellSx}>Staff</TableCell>
              <TableCell sx={{ ...headCellSx, ...edgeRight }}>Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment._id} hover={false} sx={rowSx}>
                <TableCell sx={{ ...bodyCellSx, ...edgeLeft }}>
                  <ClientLink
                    clientId={payment.clientId}
                    clientName={payment.clientName}
                    onOpen={handleClientClick}
                  />
                </TableCell>

                <TableCell sx={bodyCellSx}>{payment.stageName}</TableCell>

                <TableCell
                  align="right"
                  sx={{ ...bodyCellSx, ...amountSx(payment.paymentStatus) }}
                >
                  ¥{formatAmount(payment.amountPaid)}
                </TableCell>

                <TableCell sx={bodyCellSx}>{payment.paymentMethod}</TableCell>

                <TableCell sx={bodyCellSx}>
                  <Pill
                    label={payment.paymentStatus}
                    tone={paymentTone(payment.paymentStatus)}
                  />
                </TableCell>

                <TableCell sx={bodyCellSx}>
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.3,
                      color: INK_BODY,
                    }}
                  >
                    {payment.creditedStaffName}
                  </Typography>

                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      mt: 0.25,
                      fontSize: 12,
                      fontWeight: 400,
                      lineHeight: 1.3,
                      color: INK_MUTED,
                    }}
                  >
                    {payment.creditedStaff}
                  </Typography>
                </TableCell>

                <TableCell
                  sx={{
                    ...bodyCellSx,
                    ...edgeRight,
                    ...NUMERIC,
                    color: INK_MUTED,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatJapanDate(payment.paymentDate)}
                </TableCell>
              </TableRow>
            ))}

            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ borderBottom: 0, p: 0 }}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ---------- Mobile cards ---------- */}

      <Box sx={showOnMobile}>
        {payments.map((payment) => (
          <Box key={payment._id} sx={mobileCardSx}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <ClientLink
                  clientId={payment.clientId}
                  clientName={payment.clientName}
                  onOpen={handleClientClick}
                />
              </Box>

              <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontSize: 16,
                    lineHeight: 1.3,
                    ...amountSx(payment.paymentStatus),
                  }}
                >
                  ¥{formatAmount(payment.amountPaid)}
                </Typography>

                <Box sx={{ mt: 0.75 }}>
                  <Pill
                    label={payment.paymentStatus}
                    tone={paymentTone(payment.paymentStatus)}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 1.75,
                pt: 1.5,
                borderTop: `1px dashed ${HAIRLINE}`,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1.5,
              }}
            >
              <CardField label="Stage">{payment.stageName}</CardField>
              <CardField label="Method">{payment.paymentMethod}</CardField>
              <CardField label="Staff">
                {payment.creditedStaffName} ({payment.creditedStaff})
              </CardField>
              <CardField label="Date">
                {formatJapanDate(payment.paymentDate)}
              </CardField>
            </Box>
          </Box>
        ))}

        {payments.length === 0 && <EmptyState />}
      </Box>

      <TablePagination
        component="div"
        count={paymentPagination.total}
        page={Math.max(paymentPagination.currentPage - 1, 0)}
        rowsPerPage={paymentPagination.perPage}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, page) => handlePaymentPageChange(page + 1)}
        onRowsPerPageChange={(event) =>
          handlePaymentLimitChange(Number(event.target.value))
        }
        sx={paginationSx}
      />
    </Paper>
  );
}