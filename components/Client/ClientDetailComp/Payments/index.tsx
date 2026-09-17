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
import { useTranslations } from "next-intl";

import { PAYMENT_METHODS } from "./type";

import type { PaymentsProps, PaymentStatus } from "./type";

import { usePaymentsHook } from "./hook";

// =================================================
// DESIGN SYSTEM
// Styling only — no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: INK_MUTED,
    fontSize: 14,

    "&.Mui-focused": {
      color: BRAND,
    },

    "&.Mui-error": {
      color: "#DC2626",
    },
  },

  "& .MuiOutlinedInput-root": {
    bgcolor: "#ffffff",
    color: INK,
    borderRadius: 2.5,

    transition:
      "border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease",

    "& fieldset": {
      borderColor: HAIRLINE,
      transition: "border-color 200ms ease",
    },

    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: "1px",
    },

    "&.Mui-error fieldset": {
      borderColor: "#DC2626",
    },

    "&.Mui-disabled": {
      bgcolor: "#F9FAFB",

      "& fieldset": {
        borderColor: HAIRLINE,
      },
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,

    "&.Mui-disabled": {
      WebkitTextFillColor: INK_MUTED,
    },
  },

  "& .MuiSelect-select": {
    fontSize: 14,
  },

  "& .MuiFormHelperText-root": {
    ml: 0.25,
    mt: 0.75,
    color: INK_MUTED,
    fontSize: 11.5,

    "&.Mui-error": {
      color: "#DC2626",
    },
  },
};

const chipSx = {
  height: 27,

  borderRadius: 999,

  fontSize: 11.5,

  fontWeight: 600,

  transition:
    "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

  "& .MuiChip-label": {
    px: 1.25,
  },

  "&.MuiChip-colorSuccess": {
    color: BRAND,
    bgcolor: BRAND_SOFT,
    borderColor: "rgba(16, 122, 100, 0.14)",
  },

  "&.MuiChip-colorError": {
    color: "#DC2626",
    bgcolor: "#FEF2F2",
    borderColor: "rgba(220, 38, 38, 0.14)",
  },

  "&.MuiChip-colorWarning": {
    color: "#B7791F",
    bgcolor: "#FFFBEB",
    borderColor: "rgba(183, 121, 31, 0.14)",
  },

  "&.MuiChip-colorInfo": {
    color: INK_MUTED,
    bgcolor: "#F3F4F6",
    borderColor: HAIRLINE,
  },

  "&.MuiChip-colorDefault": {
    color: INK_MUTED,
    bgcolor: "#F9FAFB",
    borderColor: HAIRLINE,
  },
};

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
  const t = useTranslations("clientPayments");

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
          <Typography
            sx={{
              color: INK,
              fontSize: 17,
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
            }}
          >
            {t("title")}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: INK_MUTED,
              fontSize: 13.5,
              lineHeight: 1.6,
            }}
          >
            {t("description")}
          </Typography>
        </Box>

        <Box
          sx={{
            ...softCard,

            px: 2.5,

            py: 1.75,

            minWidth: {
              xs: "100%",
              sm: 190,
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: INK_MUTED,
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            {t("totalPayments")}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,

              color: BRAND,

              fontSize: 20,

              lineHeight: 1.3,

              fontWeight: 600,

              fontVariantNumeric: "tabular-nums",
            }}
          >
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

          gap: {
            xs: 3,
            lg: 4,
          },
        }}
      >
        {/* ===============================================
            HISTORY
        =============================================== */}

        <Box>
          <Typography
            sx={{
              mb: 2,

              color: INK,

              fontSize: 15,

              fontWeight: 600,
            }}
          >
            {t("history")}
          </Typography>

          {isPaymentsLoading && (
            <Box
              sx={{
                ...softCard,

                minHeight: 180,

                display: "flex",

                justifyContent: "center",

                alignItems: "center",
              }}
            >
              <CircularProgress
                size={28}
                sx={{
                  color: BRAND,
                }}
              />
            </Box>
          )}

          {loadError && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2.5,

                border: "1px solid rgba(220, 38, 38, 0.12)",

                bgcolor: "#FEF2F2",

                color: "#991B1B",

                "& .MuiAlert-icon": {
                  color: "#DC2626",
                },
              }}
            >
              {loadError}
            </Alert>
          )}

          {!isPaymentsLoading && !loadError && payments.length === 0 && (
            <Box
              sx={{
                bgcolor: "#ffffff",

                border: "1px dashed rgba(16, 122, 100, 0.25)",

                borderRadius: 3,

                p: {
                  xs: 4,
                  sm: 5,
                },

                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: INK_MUTED,

                  fontSize: 14,
                }}
              >
                {t("empty")}
              </Typography>
            </Box>
          )}

          {!isPaymentsLoading && !loadError && payments.length > 0 && (
            <Box
              sx={{
                ...softCard,

                overflow: "hidden",
              }}
            >
              {payments.map((payment, index) => (
                <Box key={payment._id}>
                  <Box
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },

                      transition: "background-color 200ms ease",

                      "&:hover": {
                        bgcolor: "rgba(16, 122, 100, 0.025)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },

                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },

                        gap: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: INK,

                          fontSize: 15,

                          fontWeight: 600,

                          lineHeight: 1.4,
                        }}
                      >
                        {payment.paymentName}
                      </Typography>

                      <Chip
                        size="small"
                        label={t(`statuses.${payment.paymentStatus}`)}
                        color={getStatusColor(payment.paymentStatus)}
                        variant="outlined"
                        sx={chipSx}
                      />
                    </Box>

                    <Typography
                      sx={{
                        mt: 1.25,

                        color: BRAND,

                        fontSize: 20,

                        fontWeight: 600,

                        lineHeight: 1.3,

                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.3,

                        color: INK_MUTED,

                        fontSize: 12.5,
                      }}
                    >
                      {t("feeExpected", { amount: formatAmount(payment.expectedAmount) })}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",

                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                        },

                        gap: {
                          xs: 1.25,
                          sm: 1.5,
                        },

                        mt: 2.5,

                        p: 2,

                        bgcolor: "#F9FAFB",

                        border: `1px solid ${HAIRLINE}`,

                        borderRadius: 2.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: INK_MUTED,

                          fontSize: 13,
                        }}
                      >
                        <Box
                          component="strong"
                          sx={{
                            color: INK,
                            fontWeight: 600,
                          }}
                        >
                          {t("fields.date")}:
                        </Box>{" "}
                        {formatJapanDate(payment.paymentDate)}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: INK_MUTED,

                          fontSize: 13,
                        }}
                      >
                        <Box
                          component="strong"
                          sx={{
                            color: INK,
                            fontWeight: 600,
                          }}
                        >
                          {t("fields.method")}:
                        </Box>{" "}
                        {t(`methods.${payment.paymentMethod}`)}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: INK_MUTED,

                          fontSize: 13,
                        }}
                      >
                        <Box
                          component="strong"
                          sx={{
                            color: INK,
                            fontWeight: 600,
                          }}
                        >
                          {t("fields.creditedStaff")}:
                        </Box>{" "}
                        {payment.creditedStaffName} ({payment.creditedStaff})
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: INK_MUTED,

                          fontSize: 13,
                        }}
                      >
                        <Box
                          component="strong"
                          sx={{
                            color: INK,
                            fontWeight: 600,
                          }}
                        >
                          {t("fields.recordedBy")}:
                        </Box>{" "}
                        {payment.collectedByName}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: INK_MUTED,

                          fontSize: 13,

                          gridColumn: {
                            sm: "1 / -1",
                          },
                        }}
                      >
                        <Box
                          component="strong"
                          sx={{
                            color: INK,
                            fontWeight: 600,
                          }}
                        >
                          {t("fields.stageAtPayment")}:
                        </Box>{" "}
                        {t(`stages.${payment.stageAtPayment}`)}
                      </Typography>
                    </Box>

                    {(payment.referenceNumber ||
                      payment.receiptNumber ||
                      payment.bankName) && (
                      <Box
                        sx={{
                          mt: 2,

                          p: 1.75,

                          bgcolor: BRAND_SOFT,

                          border: "1px solid rgba(16, 122, 100, 0.08)",

                          borderRadius: 2.5,
                        }}
                      >
                        {payment.referenceNumber && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: INK_MUTED,
                              fontSize: 13,
                              lineHeight: 1.6,
                            }}
                          >
                            {t("fields.reference")}: {payment.referenceNumber}
                          </Typography>
                        )}

                        {payment.receiptNumber && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: INK_MUTED,
                              fontSize: 13,
                              lineHeight: 1.6,
                            }}
                          >
                            {t("fields.receipt")}: {payment.receiptNumber}
                          </Typography>
                        )}

                        {payment.bankName && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: INK_MUTED,
                              fontSize: 13,
                              lineHeight: 1.6,
                            }}
                          >
                            {t("fields.bank")}: {payment.bankName}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {payment.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,

                          color: INK_MUTED,

                          fontSize: 13.5,

                          lineHeight: 1.6,

                          whiteSpace: "pre-wrap",

                          wordBreak: "break-word",
                        }}
                      >
                        {payment.note}
                      </Typography>
                    )}
                  </Box>

                  {index < payments.length - 1 && (
                    <Divider
                      sx={{
                        borderColor: HAIRLINE,
                      }}
                    />
                  )}
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
            ...softCard,

            p: {
              xs: 2,
              sm: 3,
            },

            height: "fit-content",
          }}
        >
          <Typography
            sx={{
              mb: 3,

              color: INK,

              fontSize: 17,

              fontWeight: 600,

              lineHeight: 1.35,
            }}
          >
            {t("form.title")}
          </Typography>

          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,

                borderRadius: 2.5,

                border: "1px solid rgba(220, 38, 38, 0.12)",

                bgcolor: "#FEF2F2",

                color: "#991B1B",

                "& .MuiAlert-icon": {
                  color: "#DC2626",
                },
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

                borderRadius: 2.5,

                border: "1px solid rgba(16, 122, 100, 0.12)",

                bgcolor: BRAND_SOFT,

                color: BRAND,

                "& .MuiAlert-icon": {
                  color: BRAND,
                },
              }}
            >
              {successMessage}
            </Alert>
          )}

          {!isFeesLoading && availableFees.length === 0 && (
            <Alert
              severity="info"
              sx={{
                mb: 2,

                borderRadius: 2.5,

                border: `1px solid ${HAIRLINE}`,

                bgcolor: "#F9FAFB",

                color: INK_MUTED,
              }}
            >
              {t("noAvailableFees")}
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
                  label={t("form.fee")}
                  error={Boolean(errors.feeId)}
                  helperText={errors.feeId?.message}
                  sx={{
                    ...fieldSx,

                    mb: 2.5,
                  }}
                >
                  <MenuItem value="">{t("form.selectFee")}</MenuItem>

                  {availableFees.map((fee) => (
                    <MenuItem key={fee._id} value={fee._id}>
                      {t("form.feeOption", {
                        feeName: fee.feeName,
                        amount: formatAmount(fee.outstandingAmount),
                      })}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* SELECTED FEE SUMMARY */}

            {selectedFee && (
              <Box
                sx={{
                  bgcolor: "#F9FAFB",

                  border: `1px solid ${HAIRLINE}`,

                  borderRadius: 2.5,

                  p: 2,

                  mb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    mb: 1.75,

                    color: INK,

                    fontSize: 14,

                    fontWeight: 600,
                  }}
                >
                  {selectedFee.feeName}
                </Typography>

                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      lg: "1fr 1fr",
                    },

                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: INK_MUTED,

                        fontSize: 11.5,
                      }}
                    >
                      {t("summary.expected")}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,

                        color: INK,

                        fontSize: 14,

                        fontWeight: 600,

                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ¥{formatAmount(selectedFee.expectedAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: INK_MUTED,

                        fontSize: 11.5,
                      }}
                    >
                      {t("summary.alreadyPaid")}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,

                        color: BRAND,

                        fontSize: 14,

                        fontWeight: 600,

                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ¥{formatAmount(selectedFee.paidAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: INK_MUTED,

                        fontSize: 11.5,
                      }}
                    >
                      {t("summary.outstanding")}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,

                        color: "#B7791F",

                        fontSize: 14,

                        fontWeight: 600,

                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ¥{formatAmount(selectedFee.outstandingAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: INK_MUTED,

                        fontSize: 11.5,
                      }}
                    >
                      {t("summary.status")}
                    </Typography>

                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        size="small"
                        label={t(`paymentStatuses.${selectedFee.paymentProgressStatus}`)}
                        color={
                          selectedFee.paymentProgressStatus === "Partial"
                            ? "warning"
                            : selectedFee.paymentProgressStatus === "Paid"
                              ? "success"
                              : "info"
                        }
                        variant="outlined"
                        sx={chipSx}
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
                  label={t("form.amountPaying")}
                  error={Boolean(errors.amountPaid)}
                  helperText={errors.amountPaid?.message}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      max: selectedFee?.outstandingAmount,
                    },
                  }}
                  sx={{
                    ...fieldSx,

                    mb: 2.5,
                  }}
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
                  label={t("form.paymentMethod")}
                  error={Boolean(errors.paymentMethod)}
                  helperText={errors.paymentMethod?.message}
                  sx={{
                    ...fieldSx,

                    mb: 2.5,
                  }}
                >
                  <MenuItem value="">{t("form.selectPaymentMethod")}</MenuItem>

                  {PAYMENT_METHODS.map((method) => (
                    <MenuItem key={method} value={method}>
                      {t(`methods.${method}`)}
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
                  label={t("form.paymentDate")}
                  error={Boolean(errors.paymentDate)}
                  helperText={errors.paymentDate?.message}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    ...fieldSx,

                    mb: 2.5,
                  }}
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
                  label={t("form.referenceNumber")}
                  sx={{
                    ...fieldSx,

                    mb: 2.5,
                  }}
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
                  label={t("form.receiptNumber")}
                  sx={{
                    ...fieldSx,

                    mb: 2.5,
                  }}
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
                    label={t("form.bankName")}
                    sx={{
                      ...fieldSx,

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
                  label={t("form.note")}
                  sx={fieldSx}
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
                disableElevation
                disabled={loading || !selectedFee}
                startIcon={
                  loading ? (
                    <CircularProgress size={17} color="inherit" />
                  ) : (
                    <PaymentsOutlinedIcon />
                  )
                }
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  minHeight: 42,

                  px: 2.5,

                  bgcolor: BRAND,

                  color: "#ffffff",

                  borderRadius: 2.5,

                  fontSize: 14,

                  fontWeight: 600,

                  textTransform: "none",

                  boxShadow: "none",

                  transition: "background-color 200ms ease",

                  "&:hover": {
                    bgcolor: BRAND_HOVER,

                    boxShadow: "none",
                  },

                  "&.Mui-disabled": {
                    bgcolor: "rgba(16, 122, 100, 0.45)",

                    color: "#ffffff",
                  },
                }}
              >
                {loading ? t("actions.saving") : t("actions.savePayment")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Payments;
