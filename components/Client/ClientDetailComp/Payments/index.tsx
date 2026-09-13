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

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

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

const Payments = ({ clientId }: PaymentsProps) => {
  const {
    payments,
    totalPaid,

    availableFees,
    selectedFee,

    control,
    errors,

    handleSubmit,
    onSubmit,

    paymentMethod,

    isPaymentsLoading,
    isFeesLoading,

    isSubmitting,
    isCreatingPayment,

    serverError,
    successMessage,
    loadError,
  } = usePaymentsHook(clientId);

  const loading = isSubmitting || isCreatingPayment;

  return (
    <Box>
      {/* HEADER */}

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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Payments
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Payment collection history and installments.
          </Typography>
        </Box>

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
            Total Payments
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ¥{formatAmount(totalPaid)}
          </Typography>
        </Box>
      </Box>

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
        {/* ===============================================
            HISTORY
        =============================================== */}

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
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
                  <Box sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {payment.paymentName}
                      </Typography>

                      <Chip
                        size="small"
                        label={payment.paymentStatus}
                        color={getStatusColor(payment.paymentStatus)}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                      ¥{formatAmount(payment.amountPaid)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Fee Expected: ¥{formatAmount(payment.expectedAmount)}
                    </Typography>

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
                        <strong>Stage at Payment:</strong>{" "}
                        {payment.stageAtPayment}
                      </Typography>
                    </Box>

                    {(payment.referenceNumber ||
                      payment.receiptNumber ||
                      payment.bankName) && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1.5,
                          bgcolor: "action.hover",
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

        {/* ===============================================
            ADD PAYMENT
        =============================================== */}

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            height: "fit-content",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
            Add Payment
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {!isFeesLoading && availableFees.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              There are no active fees with an outstanding balance.
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* FEE */}

            <Controller
              name="feeId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  disabled={isFeesLoading}
                  label="Fee"
                  error={Boolean(errors.feeId)}
                  helperText={errors.feeId?.message}
                  sx={{ mb: 2.5 }}
                >
                  <MenuItem value="">Select fee</MenuItem>

                  {availableFees.map((fee) => (
                    <MenuItem key={fee._id} value={fee._id}>
                      {fee.feeName} - Outstanding ¥
                      {formatAmount(fee.outstandingAmount)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* SELECTED FEE SUMMARY */}

            {selectedFee && (
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  mb: 2.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1.5 }}
                >
                  {selectedFee.feeName}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Expected
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      ¥{formatAmount(selectedFee.expectedAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Already Paid
                    </Typography>

                    <Typography sx={{ fontWeight: 600 }}>
                      ¥{formatAmount(selectedFee.paidAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Outstanding
                    </Typography>

                    <Typography sx={{ fontWeight: 700 }}>
                      ¥{formatAmount(selectedFee.outstandingAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>

                    <Box sx={{ mt: 0.25 }}>
                      <Chip
                        size="small"
                        label={selectedFee.paymentProgressStatus}
                        color={
                          selectedFee.paymentProgressStatus === "Partial"
                            ? "warning"
                            : selectedFee.paymentProgressStatus === "Paid"
                              ? "success"
                              : "info"
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* AMOUNT */}

            <Controller
              name="amountPaid"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  type="number"
                  disabled={!selectedFee}
                  label="Amount Paying"
                  error={Boolean(errors.amountPaid)}
                  helperText={errors.amountPaid?.message}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      max: selectedFee?.outstandingAmount,
                    },
                  }}
                  sx={{ mb: 2.5 }}
                />
              )}
            />

            {/* METHOD */}

            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  label="Payment Method"
                  error={Boolean(errors.paymentMethod)}
                  helperText={errors.paymentMethod?.message}
                  sx={{ mb: 2.5 }}
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

            {/* DATE */}

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
                  sx={{ mb: 2.5 }}
                />
              )}
            />

            <Controller
              name="referenceNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reference Number"
                  sx={{ mb: 2.5 }}
                />
              )}
            />

            <Controller
              name="receiptNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Receipt Number"
                  sx={{ mb: 2.5 }}
                />
              )}
            />

            {paymentMethod === "Bank Transfer" && (
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Bank Name"
                    sx={{
                      mb: 2.5,
                    }}
                  />
                )}
              />
            )}

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
                />
              )}
            />

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
                disabled={loading || !selectedFee}
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
