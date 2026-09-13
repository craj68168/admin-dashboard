"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { Controller } from "react-hook-form";

import { PAYMENT_METHODS } from "./type";

import type { PaymentsProps, PaymentStatus } from "./type";

import { usePaymentsHook } from "./hook";

// =================================================
// FORMAT AMOUNT
// =================================================

const formatAmount = (value: number) => {
  return new Intl.NumberFormat("ja-JP").format(Number(value || 0));
};

// =================================================
// FORMAT JAPAN DATE
// =================================================

const formatJapanDate = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(date);
};

// =================================================
// STATUS COLOR
// =================================================

const getStatusColor = (
  status: PaymentStatus,
): "success" | "error" | "warning" | "default" => {
  switch (status) {
    case "Completed":
      return "success";

    case "Cancelled":
      return "warning";

    case "Refunded":
      return "error";

    default:
      return "default";
  }
};

// =================================================
// COMPONENT
// =================================================

const Payments = ({ clientId }: PaymentsProps) => {
  const {
    payments,

    totalPaid,

    control,

    errors,

    handleSubmit,

    onSubmit,

    paymentMethod,

    isPaymentsLoading,

    isSubmitting,

    isCreatingPayment,

    serverError,

    successMessage,

    loadError,
  } = usePaymentsHook(clientId);

  const loading = isSubmitting || isCreatingPayment;

  return (
    <Box>
      {/* =================================================
          HEADER
      ================================================= */}

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

          gap: 2,

          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Payments
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Client payment and collection history.
          </Typography>
        </Box>

        {/* TOTAL PAID */}

        <Box
          sx={{
            border: "1px solid",

            borderColor: "divider",

            borderRadius: 2,

            px: 2.5,

            py: 1.5,

            minWidth: 180,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Total Paid
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            ¥{formatAmount(totalPaid)}
          </Typography>
        </Box>
      </Box>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.5fr 1fr",
          },

          gap: 4,
        }}
      >
        {/* =================================================
            PAYMENT HISTORY
        ================================================= */}

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mb: 2,
            }}
          >
            Payment History
          </Typography>

          {isPaymentsLoading && (
            <Box
              sx={{
                minHeight: 180,

                display: "flex",

                justifyContent: "center",

                alignItems: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}

          {loadError && <Alert severity="error">{loadError}</Alert>}

          {!isPaymentsLoading && !loadError && payments.length === 0 && (
            <Box
              sx={{
                border: "1px dashed",

                borderColor: "divider",

                borderRadius: 2,

                p: 5,

                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No payments recorded yet.
              </Typography>
            </Box>
          )}

          {!isPaymentsLoading && !loadError && payments.length > 0 && (
            <Box
              sx={{
                border: "1px solid",

                borderColor: "divider",

                borderRadius: 2,

                overflow: "hidden",
              }}
            >
              {payments.map((payment, index) => (
                <Box key={payment._id}>
                  <Box
                    sx={{
                      p: 2.5,
                    }}
                  >
                    {/* PAYMENT NAME + STATUS */}

                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",

                        justifyContent: "space-between",

                        gap: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {payment.paymentName}
                      </Typography>

                      <Chip
                        size="small"
                        label={payment.paymentStatus}
                        color={getStatusColor(payment.paymentStatus)}
                      />
                    </Box>

                    {/* AMOUNT */}

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Expected: ¥{formatAmount(payment.expectedAmount)}
                    </Typography>

                    {/* DETAILS */}

                    <Box
                      sx={{
                        display: "grid",

                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                        },

                        gap: 1,

                        mt: 2,
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Date:</strong>{" "}
                        {formatJapanDate(payment.paymentDate)}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Method:</strong> {payment.paymentMethod}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Credited Staff:</strong>{" "}
                        {payment.creditedStaffName} ({payment.creditedStaff})
                      </Typography>

                      <Typography variant="body2">
                        <strong>Recorded By:</strong> {payment.collectedByName}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          gridColumn: {
                            sm: "1 / -1",
                          },
                        }}
                      >
                        <strong>Stage:</strong> {payment.stageAtPayment}
                      </Typography>
                    </Box>

                    {/* OPTIONAL DETAILS */}

                    {(payment.referenceNumber ||
                      payment.receiptNumber ||
                      payment.bankName) && (
                      <Box
                        sx={{
                          mt: 2,

                          p: 1.5,

                          backgroundColor: "action.hover",

                          borderRadius: 1,
                        }}
                      >
                        {payment.referenceNumber && (
                          <Typography variant="body2">
                            Reference: {payment.referenceNumber}
                          </Typography>
                        )}

                        {payment.receiptNumber && (
                          <Typography variant="body2">
                            Receipt: {payment.receiptNumber}
                          </Typography>
                        )}

                        {payment.bankName && (
                          <Typography variant="body2">
                            Bank: {payment.bankName}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* NOTE */}

                    {payment.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,

                          whiteSpace: "pre-wrap",

                          wordBreak: "break-word",
                        }}
                      >
                        {payment.note}
                      </Typography>
                    )}
                  </Box>

                  {index < payments.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* =================================================
            ADD PAYMENT
        ================================================= */}

        <Box
          sx={{
            border: "1px solid",

            borderColor: "divider",

            borderRadius: 2,

            p: 3,

            height: "fit-content",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mb: 3,
            }}
          >
            Add Payment
          </Typography>

          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {serverError}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
              }}
            >
              {successMessage}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* PAYMENT NAME */}

            <Controller
              name="paymentName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label="Payment Name"
                  placeholder="e.g. Registration Fee"
                  error={Boolean(errors.paymentName)}
                  helperText={errors.paymentName?.message}
                  sx={{
                    mb: 2.5,
                  }}
                />
              )}
            />

            {/* EXPECTED AMOUNT */}

            <Controller
              name="expectedAmount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  type="number"
                  label="Expected Amount"
                  placeholder="300000"
                  error={Boolean(errors.expectedAmount)}
                  helperText={errors.expectedAmount?.message}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                  sx={{
                    mb: 2.5,
                  }}
                />
              )}
            />

            {/* AMOUNT PAID */}

            <Controller
              name="amountPaid"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  type="number"
                  label="Amount Paid"
                  placeholder="100000"
                  error={Boolean(errors.amountPaid)}
                  helperText={errors.amountPaid?.message}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                    },
                  }}
                  sx={{
                    mb: 2.5,
                  }}
                />
              )}
            />

            {/* PAYMENT METHOD */}

            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  required
                  label="Payment Method"
                  error={Boolean(errors.paymentMethod)}
                  helperText={errors.paymentMethod?.message}
                  sx={{
                    mb: 2.5,
                  }}
                >
                  <MenuItem value="">Select payment method</MenuItem>

                  {PAYMENT_METHODS.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* PAYMENT DATE */}

            <Controller
              name="paymentDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  type="date"
                  label="Payment Date"
                  error={Boolean(errors.paymentDate)}
                  helperText={errors.paymentDate?.message}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    mb: 2.5,
                  }}
                />
              )}
            />

            {/* REFERENCE NUMBER */}

            <Controller
              name="referenceNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reference Number"
                  placeholder="e.g. TXN-001"
                  error={Boolean(errors.referenceNumber)}
                  helperText={errors.referenceNumber?.message}
                  sx={{
                    mb: 2.5,
                  }}
                />
              )}
            />

            {/* RECEIPT NUMBER */}

            <Controller
              name="receiptNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Receipt Number"
                  placeholder="e.g. REC-001"
                  error={Boolean(errors.receiptNumber)}
                  helperText={errors.receiptNumber?.message}
                  sx={{
                    mb: 2.5,
                  }}
                />
              )}
            />

            {/* BANK NAME */}

            {paymentMethod === "Bank Transfer" && (
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Bank Name"
                    placeholder="Enter bank name"
                    error={Boolean(errors.bankName)}
                    helperText={errors.bankName?.message}
                    sx={{
                      mb: 2.5,
                    }}
                  />
                )}
              />
            )}

            {/* NOTE */}

            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={4}
                  label="Note"
                  placeholder="Optional payment note..."
                  error={Boolean(errors.note)}
                  helperText={errors.note?.message}
                />
              )}
            />

            {/* SAVE */}

            <Box
              sx={{
                display: "flex",

                justifyContent: "flex-end",

                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={17} color="inherit" />
                  ) : (
                    <PaymentsOutlinedIcon />
                  )
                }
              >
                {loading ? "Saving..." : "Save Payment"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Payments;
