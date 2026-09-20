"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { usePaymentsHook } from "./hook";

import type { PaymentsProps } from "./type";

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#6B7280";

const formatAmount = (amount?: number | null) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount ?? 0));
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getStatusStyle = (status: string) => {
  if (status === "Completed") {
    return {
      bgcolor: BRAND_SOFT,
      color: BRAND,
    };
  }

  if (status === "Refunded") {
    return {
      bgcolor: "#EFF6FF",
      color: "#1D4ED8",
    };
  }

  return {
    bgcolor: "#FEF2F2",
    color: "#DC2626",
  };
};

const Payments = ({ clientId }: PaymentsProps) => {
  const { payments, summary, isLoading, isFetching, isError, errorMessage } =
    usePaymentsHook(clientId);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={26}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            <PaymentsOutlinedIcon
              sx={{
                color: BRAND,
                fontSize: 21,
              }}
            />

            <Typography
              sx={{
                color: INK,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Payments
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 0.5,
              color: INK_MUTED,
              fontSize: 13,
            }}
          >
            Payments are recorded automatically when a paid stage is completed.
          </Typography>
        </Box>

        {isFetching && !isLoading && (
          <CircularProgress
            size={18}
            sx={{
              color: BRAND,
            }}
          />
        )}
      </Box>

      {isError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* SUMMARY */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            p: 2,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 2,
            bgcolor: "#FAFBFA",
          }}
        >
          <Typography
            sx={{
              color: INK_MUTED,
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Total Collected
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              color: BRAND,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            ¥{formatAmount(summary.totalCollected)}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 2,
            bgcolor: "#FAFBFA",
          }}
        >
          <Typography
            sx={{
              color: INK_MUTED,
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Completed Payments
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              color: INK,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {summary.completedCount}
          </Typography>
        </Box>
      </Box>

      {/* HISTORY */}
      {payments.length === 0 ? (
        <Box
          sx={{
            p: 3,
            border: `1px dashed ${HAIRLINE}`,
            borderRadius: 2,
            bgcolor: "#FAFBFA",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: INK_MUTED,
              fontSize: 13.5,
            }}
          >
            No payments recorded yet.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 2,
          }}
        >
          <Box
            component="table"
            sx={{
              width: "100%",
              minWidth: 950,
              borderCollapse: "collapse",

              "& th": {
                px: 1.75,
                py: 1.4,
                bgcolor: "#F9FAFB",
                borderBottom: `1px solid ${HAIRLINE}`,
                color: INK_MUTED,
                textAlign: "left",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },

              "& td": {
                px: 1.75,
                py: 1.5,
                borderBottom: `1px solid ${HAIRLINE}`,
                color: INK,
                fontSize: 13,
                verticalAlign: "top",
              },

              "& tr:last-of-type td": {
                borderBottom: 0,
              },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box component="th">Date</Box>

                <Box component="th">Stage</Box>

                <Box component="th">Amount</Box>

                <Box component="th">Method</Box>

                <Box component="th">Status</Box>

                <Box component="th">Staff</Box>

                <Box component="th">Reference</Box>

                <Box component="th">Recorded By</Box>
              </Box>
            </Box>

            <Box component="tbody">
              {payments.map((payment) => (
                <Box component="tr" key={payment._id}>
                  <Box component="td">{formatDate(payment.paymentDate)}</Box>

                  <Box component="td">
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: INK,
                      }}
                    >
                      {payment.stageName || "-"}
                    </Typography>
                  </Box>

                  <Box component="td">
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: BRAND,
                      }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </Typography>
                  </Box>

                  <Box component="td">{payment.paymentMethod}</Box>

                  <Box component="td">
                    <Chip
                      size="small"
                      label={payment.paymentStatus}
                      sx={{
                        height: 24,
                        fontSize: 11,
                        fontWeight: 700,
                        ...getStatusStyle(payment.paymentStatus),
                      }}
                    />
                  </Box>

                  <Box component="td">
                    {payment.creditedStaffName || payment.creditedStaff || "-"}
                  </Box>

                  <Box component="td">
                    {payment.referenceNumber || payment.receiptNumber || "-"}
                  </Box>

                  <Box component="td">{payment.collectedByName || "-"}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Payments;
