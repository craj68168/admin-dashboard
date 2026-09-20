"use client";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import type { ProgressProps } from "./type";

import { useProgressHook } from "./hook";

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#6B7280";

const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Online Payment",
  "Cheque",
  "Other",
];

const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: 13.5,

    "&.Mui-focused": {
      color: BRAND,
    },
  },

  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#ffffff",

    "& fieldset": {
      borderColor: HAIRLINE,
    },

    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 13.5,
  },

  "& .MuiSelect-select": {
    fontSize: 13.5,
  },
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatAmount = (amount?: number | null) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount ?? 0));
};

const Progress = ({ clientId }: ProgressProps) => {
  const {
    history,

    currentStage,
    currentStageName,
    currentStageAmount,

    stageOptions,

    selectedStageValue,
    selectedStageDetails,

    requiresPayment,

    note,
    setNote,

    paymentMethod,
    setPaymentMethod,

    paymentDate,
    setPaymentDate,

    referenceNumber,
    setReferenceNumber,

    receiptNumber,
    setReceiptNumber,

    bankName,
    setBankName,

    handleStageChange,
    handleUpdateStage,

    isHistoryLoading,
    isHistoryFetching,

    isStageLoading,
    isStageFetching,

    isUpdatingStage,

    historyLoadError,
    stageLoadError,
    formError,
    successMessage,
  } = useProgressHook(clientId);

  const loading = isHistoryLoading || isStageLoading;

  const refreshing = isHistoryFetching || isStageFetching;

  const sameStage =
    Boolean(currentStage) && selectedStageValue === currentStage;

  const getStageName = (
    stageKey?: string | null,
    storedName?: string | null,
  ) => {
    if (storedName) {
      return storedName;
    }

    if (!stageKey) {
      return "-";
    }

    return (
      stageOptions.find((stage) => stage.key === stageKey)?.name || stageKey
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }

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
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TrendingUpRoundedIcon
              sx={{
                fontSize: 21,
                color: BRAND,
              }}
            />

            <Typography
              sx={{
                color: INK,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Progress
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 0.5,
              color: INK_MUTED,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Payment is required in full before entering a paid stage.
          </Typography>
        </Box>

        {refreshing && !loading && (
          <CircularProgress
            size={18}
            sx={{
              color: BRAND,
            }}
          />
        )}
      </Box>

      {historyLoadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {historyLoadError}
        </Alert>
      )}

      {stageLoadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {stageLoadError}
        </Alert>
      )}

      {formError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {formError}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* CURRENT STAGE */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
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
            Current Stage
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={currentStageName}
              size="small"
              sx={{
                bgcolor: BRAND_SOFT,
                color: BRAND,
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 2,
            bgcolor: "#FAFBFA",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <PaymentsOutlinedIcon
              sx={{
                fontSize: 18,
                color: BRAND,
              }}
            />

            <Typography
              sx={{
                color: INK_MUTED,
                fontSize: 11.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Current Stage Amount
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 1,
              color: INK,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ¥{formatAmount(currentStageAmount)}
          </Typography>
        </Box>
      </Box>

      {/* CHANGE STAGE */}
      <Box
        sx={{
          p: {
            xs: 1.75,
            sm: 2.25,
          },
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 2,
          bgcolor: "#ffffff",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: 2,
          }}
        >
          <UpdateRoundedIcon
            sx={{
              fontSize: 19,
              color: BRAND,
            }}
          />

          <Typography
            sx={{
              color: INK,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Change Stage
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          fullWidth
          label="Next Stage"
          value={selectedStageValue}
          disabled={
            isStageLoading || isUpdatingStage || Boolean(stageLoadError)
          }
          onChange={(event) => {
            handleStageChange(event.target.value);
          }}
          sx={fieldSx}
        >
          {stageOptions.map((stage) => (
            <MenuItem key={stage._id} value={stage.key}>
              {stage.name} — ¥{formatAmount(stage.amount)}
            </MenuItem>
          ))}
        </TextField>

        {selectedStageDetails && selectedStageDetails.key !== currentStage && (
          <Box
            sx={{
              mt: 2,
              p: 1.75,
              borderRadius: 2,
              bgcolor: requiresPayment ? "#FFF7ED" : BRAND_SOFT,
              border: requiresPayment
                ? "1px solid rgba(234, 88, 12, 0.15)"
                : "1px solid rgba(16, 122, 100, 0.12)",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: requiresPayment ? "#C2410C" : BRAND,
              }}
            >
              {selectedStageDetails.name}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 20,
                fontWeight: 700,
                color: INK,
              }}
            >
              ¥{formatAmount(selectedStageDetails.amount)}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12.5,
                color: INK_MUTED,
              }}
            >
              {requiresPayment
                ? "Full payment is required before this stage can be applied."
                : "No payment is required for this stage."}
            </Typography>
          </Box>
        )}

        {/* PAYMENT FORM */}
        {requiresPayment && (
          <Box
            sx={{
              mt: 2,
              p: {
                xs: 1.5,
                sm: 2,
              },
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 2,
              bgcolor: "#FAFBFA",
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontSize: 14,
                fontWeight: 700,
                color: INK,
              }}
            >
              Full Payment Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <TextField
                select
                size="small"
                fullWidth
                label="Payment Method"
                value={paymentMethod}
                disabled={isUpdatingStage}
                onChange={(event) => {
                  setPaymentMethod(event.target.value);
                }}
                sx={fieldSx}
              >
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                size="small"
                fullWidth
                type="date"
                label="Payment Date"
                value={paymentDate}
                disabled={isUpdatingStage}
                onChange={(event) => {
                  setPaymentDate(event.target.value);
                }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldSx}
              />

              <TextField
                size="small"
                fullWidth
                label="Reference Number"
                value={referenceNumber}
                disabled={isUpdatingStage}
                onChange={(event) => {
                  setReferenceNumber(event.target.value);
                }}
                sx={fieldSx}
              />

              <TextField
                size="small"
                fullWidth
                label="Receipt Number"
                value={receiptNumber}
                disabled={isUpdatingStage}
                onChange={(event) => {
                  setReceiptNumber(event.target.value);
                }}
                sx={fieldSx}
              />

              {paymentMethod === "Bank Transfer" && (
                <TextField
                  size="small"
                  fullWidth
                  label="Bank Name"
                  value={bankName}
                  disabled={isUpdatingStage}
                  onChange={(event) => {
                    setBankName(event.target.value);
                  }}
                  sx={fieldSx}
                />
              )}
            </Box>
          </Box>
        )}

        <TextField
          size="small"
          fullWidth
          multiline
          minRows={2}
          maxRows={5}
          label="Note"
          placeholder="Optional note about this stage change"
          value={note}
          disabled={isUpdatingStage}
          onChange={(event) => {
            setNote(event.target.value);
          }}
          sx={{
            ...fieldSx,
            mt: 2,
          }}
        />

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="button"
            variant="contained"
            disableElevation
            disabled={
              isUpdatingStage ||
              sameStage ||
              !selectedStageValue ||
              Boolean(stageLoadError)
            }
            onClick={handleUpdateStage}
            startIcon={
              isUpdatingStage ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                <UpdateRoundedIcon />
              )
            }
            sx={{
              minHeight: 42,
              px: 2.25,
              borderRadius: 2,
              bgcolor: BRAND,
              fontSize: 13.5,
              fontWeight: 700,
              textTransform: "none",

              "&:hover": {
                bgcolor: BRAND_HOVER,
              },
            }}
          >
            {isUpdatingStage
              ? "Processing..."
              : requiresPayment
                ? `Pay ¥${formatAmount(
                    selectedStageDetails?.amount,
                  )} & Update Stage`
                : "Update Stage"}
          </Button>
        </Box>
      </Box>

      {/* HISTORY */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: 2,
          }}
        >
          <HistoryRoundedIcon
            sx={{
              fontSize: 19,
              color: BRAND,
            }}
          />

          <Typography
            sx={{
              color: INK,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Stage History
          </Typography>
        </Box>

        {history.length === 0 ? (
          <Box
            sx={{
              p: 3,
              border: `1px dashed ${HAIRLINE}`,
              borderRadius: 2,
              textAlign: "center",
              bgcolor: "#FAFBFA",
            }}
          >
            <Typography
              sx={{
                color: INK_MUTED,
                fontSize: 13.5,
              }}
            >
              No stage history found.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {history.map((item, index) => {
              const fromName = item.fromStage
                ? getStageName(item.fromStage, item.fromStageName)
                : "Initial";

              const toName = getStageName(item.toStage, item.toStageName);

              return (
                <Box
                  key={item._id}
                  sx={{
                    p: 2,
                    border: `1px solid ${HAIRLINE}`,
                    borderRadius: 2,
                    bgcolor: index === 0 ? "rgba(16,122,100,0.035)" : "#ffffff",
                  }}
                >
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
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.75,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          color: INK_MUTED,
                          fontSize: 13,
                        }}
                      >
                        {fromName}
                      </Typography>

                      <Typography
                        sx={{
                          color: INK_MUTED,
                        }}
                      >
                        →
                      </Typography>

                      <Typography
                        sx={{
                          color: BRAND,
                          fontSize: 13.5,
                          fontWeight: 700,
                        }}
                      >
                        {toName}
                      </Typography>

                      {index === 0 && (
                        <Chip
                          size="small"
                          label="Latest"
                          sx={{
                            height: 22,
                            bgcolor: BRAND_SOFT,
                            color: BRAND,
                            fontSize: 10.5,
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11.5,
                      }}
                    >
                      {formatDateTime(item.createdAt)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 1.25,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: INK_MUTED,
                        fontSize: 12,
                      }}
                    >
                      Stage amount:{" "}
                      <Box
                        component="span"
                        sx={{
                          color: INK,
                          fontWeight: 700,
                        }}
                      >
                        ¥{formatAmount(item.toStageAmount)}
                      </Box>
                    </Typography>

                    {item.paymentRef && (
                      <>
                        <Typography
                          sx={{
                            color: INK_MUTED,
                            fontSize: 12,
                          }}
                        >
                          Payment:{" "}
                          <Box
                            component="span"
                            sx={{
                              color: BRAND,
                              fontWeight: 700,
                            }}
                          >
                            ¥{formatAmount(item.paymentRef.amountPaid)}
                          </Box>
                        </Typography>

                        <Typography
                          sx={{
                            color: INK_MUTED,
                            fontSize: 12,
                          }}
                        >
                          Method:{" "}
                          <Box
                            component="span"
                            sx={{
                              color: INK,
                              fontWeight: 600,
                            }}
                          >
                            {item.paymentRef.paymentMethod}
                          </Box>
                        </Typography>
                      </>
                    )}

                    {item.changedByName && (
                      <Typography
                        sx={{
                          color: INK_MUTED,
                          fontSize: 12,
                        }}
                      >
                        Changed by:{" "}
                        <Box
                          component="span"
                          sx={{
                            color: INK,
                            fontWeight: 600,
                          }}
                        >
                          {item.changedByName}
                        </Box>
                      </Typography>
                    )}
                  </Box>

                  {item.note && (
                    <Box
                      sx={{
                        mt: 1.25,
                        px: 1.25,
                        py: 1,
                        borderRadius: 1.5,
                        bgcolor: "#F9FAFB",
                      }}
                    >
                      <Typography
                        sx={{
                          color: INK_MUTED,
                          fontSize: 12.5,
                          lineHeight: 1.55,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {item.note}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Progress;
