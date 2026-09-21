"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { PAYMENT_METHOD_OPTIONS } from "./validation";

import { useProgressHook } from "./hook";

import type { ProgressProps } from "./type";

// =================================================
// DESIGN
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.07)";

const INK = "#111827";
const MUTED = "#6B7280";

const BORDER = "rgba(17, 24, 39, 0.10)";

const SUCCESS = "#15803D";
const SUCCESS_SOFT = "#F0FDF4";

const WARNING = "#B45309";
const WARNING_SOFT = "#FFFBEB";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,

    "& fieldset": {
      borderColor: BORDER,
    },

    "&:hover fieldset": {
      borderColor: "rgba(16,122,100,0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
};

// =================================================
// DATE
// =================================================

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// =================================================
// CURRENCY
// =================================================

const formatCurrency = (value?: number | null) => {
  return `¥${Number(value || 0).toLocaleString()}`;
};

// =================================================
// COMPONENT
// =================================================

const Progress = ({ clientId }: ProgressProps) => {
  const {
    values,
    updateValue,

    formErrors,
    submitError,

    history,

    currentStageName,
    currentStageAmount,

    stageOptions,

    selectedStageDetails,
    selectedStageAmount,

    requiresPayment,

    isLoading,
    isUpdating,
    isSubmitDisabled,

    loadError,

    handleUpdateStage,
  } = useProgressHook(clientId);

  return (
    <Box>
      {/* =================================================
      TITLE
      ================================================= */}

      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <RefreshRoundedIcon
          sx={{
            color: BRAND,
            fontSize: 22,
          }}
        />

        <Typography
          sx={{
            color: INK,
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          Progress
        </Typography>
      </Box>

      {loadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {loadError}
        </Alert>
      )}

      {submitError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {submitError}
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            py: 5,
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress
            size={26}
            sx={{
              color: BRAND,
            }}
          />
        </Box>
      ) : (
        <>
          {/* =================================================
            CURRENT STAGE
            ================================================= */}

          <Box
            sx={{
              mb: 2,
              p: 2,
              border: `1px solid ${BORDER}`,
              borderRadius: 2.5,
              bgcolor: "#FAFBFA",

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
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: MUTED,
                  fontSize: 11.5,
                  fontWeight: 600,
                }}
              >
                Current Stage
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: INK,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {currentStageName}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                bgcolor: BRAND_SOFT,
                color: BRAND,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {formatCurrency(currentStageAmount)}
            </Box>
          </Box>

          {/* =================================================
            CHANGE STAGE
            ================================================= */}

          <Box
            sx={{
              p: {
                xs: 2,
                md: 2.5,
              },
              border: `1px solid ${BORDER}`,
              borderRadius: 2.5,
            }}
          >
            <Typography
              sx={{
                mb: 2,
                color: INK,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Change Stage
            </Typography>

            {/* NEXT STAGE */}

            <TextField
              select
              fullWidth
              size="small"
              label="Next Stage"
              value={values.stage}
              onChange={(event) => updateValue("stage", event.target.value)}
              error={Boolean(formErrors.stage)}
              helperText={formErrors.stage}
              sx={{
                ...fieldSx,
                mb: 2,
              }}
            >
              <MenuItem value="">Select next stage</MenuItem>

              {stageOptions.map((stage) => (
                <MenuItem key={stage._id} value={stage.key}>
                  {stage.name}
                  {" — "}
                  {formatCurrency(stage.amount)}
                </MenuItem>
              ))}
            </TextField>

            {/* =================================================
              SELECTED STAGE SUMMARY
              ================================================= */}

            {selectedStageDetails && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.75,

                  border: `1px solid ${
                    requiresPayment
                      ? "rgba(180,83,9,0.18)"
                      : "rgba(21,128,61,0.18)"
                  }`,

                  borderRadius: 2,

                  bgcolor: requiresPayment ? WARNING_SOFT : SUCCESS_SOFT,

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

                  gap: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: requiresPayment ? WARNING : SUCCESS,

                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {requiresPayment
                      ? "Payment Required"
                      : "No Payment Required"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      color: INK,
                      fontSize: 13.5,
                      fontWeight: 600,
                    }}
                  >
                    {selectedStageDetails.name}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: requiresPayment ? WARNING : SUCCESS,

                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  {formatCurrency(selectedStageAmount)}
                </Typography>
              </Box>
            )}

            {/* =================================================
              PAYMENT DETAILS
              ================================================= */}

            {requiresPayment && (
              <Box
                sx={{
                  mb: 2.5,
                  p: {
                    xs: 2,
                    md: 2.5,
                  },

                  border: "1px solid rgba(180,83,9,0.18)",

                  borderRadius: 2.5,

                  bgcolor: "#FFFDF8",
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PaymentsOutlinedIcon
                    sx={{
                      color: WARNING,
                      fontSize: 21,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        color: INK,
                        fontSize: 14.5,
                        fontWeight: 700,
                      }}
                    >
                      Full Payment Required
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,
                        color: MUTED,
                        fontSize: 12,
                      }}
                    >
                      The full stage amount must be received before the stage
                      can be updated.
                    </Typography>
                  </Box>
                </Box>

                {/* AMOUNT */}

                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: MUTED,
                      fontSize: 11.5,
                      fontWeight: 600,
                    }}
                  >
                    Amount to Collect
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      color: INK,
                      fontSize: 22,
                      fontWeight: 800,
                    }}
                  >
                    {formatCurrency(selectedStageAmount)}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.35,
                      color: MUTED,
                      fontSize: 11.5,
                    }}
                  >
                    Amount is controlled by the Stage Master and cannot be
                    edited here.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0,1fr))",
                    },

                    gap: 2,
                  }}
                >
                  {/* METHOD */}

                  <TextField
                    select
                    required
                    fullWidth
                    size="small"
                    label="Payment Method"
                    value={values.paymentMethod}
                    onChange={(event) =>
                      updateValue(
                        "paymentMethod",
                        event.target.value as "" | "Bank Transfer" | "Cash",
                      )
                    }
                    error={Boolean(formErrors.paymentMethod)}
                    helperText={formErrors.paymentMethod}
                    sx={fieldSx}
                  >
                    <MenuItem value="">Select payment method</MenuItem>

                    {PAYMENT_METHOD_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* DATE */}

                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="date"
                    label="Payment Date"
                    value={values.paymentDate}
                    onChange={(event) =>
                      updateValue("paymentDate", event.target.value)
                    }
                    error={Boolean(formErrors.paymentDate)}
                    helperText={formErrors.paymentDate}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    sx={fieldSx}
                  />

                  {/* BANK */}

                  <TextField
                    fullWidth
                    size="small"
                    label="Bank Name"
                    value={values.bankName}
                    disabled={values.paymentMethod === "Cash"}
                    onChange={(event) =>
                      updateValue("bankName", event.target.value)
                    }
                    error={Boolean(formErrors.bankName)}
                    helperText={formErrors.bankName}
                    sx={fieldSx}
                  />

                  {/* REFERENCE */}

                  <TextField
                    fullWidth
                    size="small"
                    label="Reference Number"
                    value={values.referenceNumber}
                    onChange={(event) =>
                      updateValue("referenceNumber", event.target.value)
                    }
                    error={Boolean(formErrors.referenceNumber)}
                    helperText={formErrors.referenceNumber}
                    sx={fieldSx}
                  />

                  {/* RECEIPT */}

                  <TextField
                    fullWidth
                    size="small"
                    label="Receipt Number"
                    value={values.receiptNumber}
                    onChange={(event) =>
                      updateValue("receiptNumber", event.target.value)
                    }
                    error={Boolean(formErrors.receiptNumber)}
                    helperText={formErrors.receiptNumber}
                    sx={fieldSx}
                  />
                </Box>
              </Box>
            )}

            {/* NOTE */}

            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={5}
              label="Note"
              value={values.note}
              onChange={(event) => updateValue("note", event.target.value)}
              error={Boolean(formErrors.note)}
              helperText={formErrors.note}
              sx={{
                ...fieldSx,
                mb: 2,
              }}
            />

            {/* =================================================
              BUTTON
              ================================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                disableElevation
                disabled={isSubmitDisabled}
                onClick={handleUpdateStage}
                startIcon={
                  isUpdating ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : requiresPayment ? (
                    <PaymentsOutlinedIcon />
                  ) : (
                    <RefreshRoundedIcon />
                  )
                }
                sx={{
                  minHeight: 44,
                  px: 2.5,
                  borderRadius: 2.5,

                  bgcolor: requiresPayment ? WARNING : BRAND,

                  color: "#ffffff",

                  fontWeight: 700,
                  textTransform: "none",

                  "&:hover": {
                    bgcolor: requiresPayment ? "#92400E" : BRAND_DARK,
                  },
                }}
              >
                {isUpdating
                  ? "Processing..."
                  : requiresPayment
                    ? `Pay ${formatCurrency(selectedStageAmount)} & Update Stage`
                    : "Update Stage"}
              </Button>
            </Box>
          </Box>

          {/* =================================================
            HISTORY
            ================================================= */}

          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <HistoryRoundedIcon
                sx={{
                  color: BRAND,
                  fontSize: 21,
                }}
              />

              <Typography
                sx={{
                  color: INK,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                Stage History
              </Typography>
            </Box>

            {history.length === 0 ? (
              <Box
                sx={{
                  p: 2,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 2,
                  color: MUTED,
                  fontSize: 13.5,
                }}
              >
                No stage history found.
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {history.map((item) => {
                  const payment = item.paymentRef;

                  const hasPayment = Boolean(
                    payment && Number(payment.amountPaid || 0) > 0,
                  );

                  return (
                    <Box
                      key={item._id}
                      sx={{
                        p: 2,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 2.5,
                        bgcolor: "#ffffff",
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
                          gap: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: INK,
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {item.fromStageName || "Initial"}
                            {" → "}
                            {item.toStageName}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.35,
                              color: MUTED,
                              fontSize: 11.5,
                            }}
                          >
                            {formatDateTime(item.createdAt)}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 1.25,
                            py: 0.6,
                            borderRadius: 999,
                            bgcolor:
                              Number(item.toStageAmount || 0) > 0
                                ? WARNING_SOFT
                                : BRAND_SOFT,
                            color:
                              Number(item.toStageAmount || 0) > 0
                                ? WARNING
                                : BRAND,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {formatCurrency(item.toStageAmount)}
                        </Box>
                      </Box>

                      {item.note && (
                        <Typography
                          sx={{
                            mt: 1.25,
                            color: INK,
                            fontSize: 13,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {item.note}
                        </Typography>
                      )}

                      {hasPayment && (
                        <>
                          <Divider
                            sx={{
                              my: 1.5,
                              borderColor: BORDER,
                            }}
                          />

                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: SUCCESS_SOFT,

                              display: "grid",

                              gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, minmax(0,1fr))",
                                lg: "repeat(4, minmax(0,1fr))",
                              },

                              gap: 1.5,
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  color: MUTED,
                                  fontSize: 10.5,
                                }}
                              >
                                Payment
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.2,
                                  color: SUCCESS,
                                  fontSize: 13,
                                  fontWeight: 700,
                                }}
                              >
                                {formatCurrency(payment?.amountPaid)}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  color: MUTED,
                                  fontSize: 10.5,
                                }}
                              >
                                Method
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.2,
                                  color: INK,
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                {payment?.paymentMethod || "-"}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  color: MUTED,
                                  fontSize: 10.5,
                                }}
                              >
                                Status
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.2,
                                  color: SUCCESS,
                                  fontSize: 13,
                                  fontWeight: 700,
                                }}
                              >
                                {payment?.paymentStatus || "Completed"}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                sx={{
                                  color: MUTED,
                                  fontSize: 10.5,
                                }}
                              >
                                Collected By
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.2,
                                  color: INK,
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                {payment?.creditedStaffName ||
                                  item.changedByName ||
                                  "-"}
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      )}

                      <Typography
                        sx={{
                          mt: 1.25,
                          color: MUTED,
                          fontSize: 11,
                        }}
                      >
                        Changed by:{" "}
                        {item.changedByName ||
                          item.staffId ||
                          item.changedByRole ||
                          "-"}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Progress;
