"use client";

import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { PAYMENT_METHOD_OPTIONS } from "./validation";

import { useProgressHook } from "./hook";

import AddStageModal from "./AddStageModal";

import type { ProgressProps } from "./type";

// =================================================
// DESIGN TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";

const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";

const INK = "#111827";
const MUTED = "#6B7280";

const BORDER = "rgba(17, 24, 39, 0.08)";

const SUCCESS = "#15803D";
const SUCCESS_SOFT = "#F0FDF4";

const WARNING = "#B45309";
const WARNING_DARK = "#92400E";
const WARNING_SOFT = "#FFFBEB";
const WARNING_BORDER = "rgba(180, 83, 9, 0.2)";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: SURFACE,

    "& fieldset": {
      borderColor: BORDER,
    },

    "&:hover fieldset": {
      borderColor: "rgba(16,122,100,0.4)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },

  "& .MuiFormHelperText-root": {
    mx: 0.5,
    mt: 0.5,
    fontSize: 11.5,
  },
};

// =================================================
// HISTORY
// =================================================

const HISTORY_PREVIEW_COUNT = 3;

const fieldGridSx = {
  display: "grid",

  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",

  gap: 1.5,
};

// =================================================
// FORMATTERS
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

const formatCurrency = (value?: number | null) => {
  return `¥${Number(value || 0).toLocaleString()}`;
};

// =================================================
// PANEL TITLE
// =================================================

const PanelTitle = ({
  children,
  count,
}: {
  children: string;
  count?: number;
}) => (
  <Box
    sx={{
      mb: 1.5,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Typography
      component="h3"
      sx={{
        color: INK,
        fontSize: 14.5,
        fontWeight: 700,
      }}
    >
      {children}
    </Typography>

    {typeof count === "number" && count > 0 && (
      <Box
        component="span"
        sx={{
          minWidth: 22,
          height: 22,
          px: 0.75,

          display: "inline-flex",

          alignItems: "center",

          justifyContent: "center",

          borderRadius: 999,

          bgcolor: BRAND_SOFT,

          color: BRAND,

          fontSize: 12,

          fontWeight: 700,
        }}
      >
        {count}
      </Box>
    )}
  </Box>
);

// =================================================
// FACT
// =================================================

const Fact = ({
  label,
  value,
  color = INK,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <Box
    sx={{
      minWidth: 0,
    }}
  >
    <Typography
      sx={{
        color: MUTED,
        fontSize: 11,
        lineHeight: 1.4,
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 0.15,
        color,
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.4,
        wordBreak: "break-word",
      }}
    >
      {value}
    </Typography>
  </Box>
);

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

    // Stage Master

    canManageStages,

    isAddStageOpen,

    addStageValues,

    addStageErrors,

    addStageSubmitError,

    isCreatingStage,

    updateAddStageValue,

    openAddStageModal,

    closeAddStageModal,

    handleCreateStage,
  } = useProgressHook(clientId);

  const [showAllHistory, setShowAllHistory] = useState(false);

  const canCollapseHistory = history.length > HISTORY_PREVIEW_COUNT;

  const visibleHistory =
    showAllHistory || !canCollapseHistory
      ? history
      : history.slice(0, HISTORY_PREVIEW_COUNT);

  return (
    <Box>
      {/* =================================================
      ADD STAGE MODAL
      ================================================= */}

      <AddStageModal
        open={isAddStageOpen}
        values={addStageValues}
        errors={addStageErrors}
        submitError={addStageSubmitError}
        isSubmitting={isCreatingStage}
        onChange={updateAddStageValue}
        onClose={closeAddStageModal}
        onSubmit={handleCreateStage}
      />

      {/* =================================================
      TITLE + CURRENT STAGE
      ================================================= */}

      <Box
        sx={{
          pb: 1.75,
          mb: 2,

          borderBottom: `1px solid ${BORDER}`,

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

          gap: 1.25,
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: INK,

            fontSize: {
              xs: 16,

              md: 17,
            },

            fontWeight: 700,

            lineHeight: 1.35,

            letterSpacing: "-0.01em",
          }}
        >
          Progress
        </Typography>

        {!isLoading && (
          <Box
            sx={{
              display: "inline-flex",

              alignItems: "center",

              gap: 1,

              pl: 1.5,

              pr: 0.6,

              py: 0.6,

              maxWidth: "100%",

              border: `1px solid ${BORDER}`,

              borderRadius: 999,

              bgcolor: SURFACE_ALT,
            }}
          >
            <Typography
              sx={{
                color: MUTED,

                fontSize: 12,

                flexShrink: 0,
              }}
            >
              Current stage
            </Typography>

            <Typography
              sx={{
                color: INK,

                fontSize: 13,

                fontWeight: 700,

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              {currentStageName}
            </Typography>

            <Box
              component="span"
              sx={{
                px: 1,

                py: 0.25,

                borderRadius: 999,

                bgcolor: BRAND_SOFT,

                color: BRAND,

                fontSize: 12,

                fontWeight: 700,

                flexShrink: 0,
              }}
            >
              {formatCurrency(currentStageAmount)}
            </Box>
          </Box>
        )}
      </Box>

      {loadError && (
        <Alert
          severity="error"
          sx={{
            mb: 1.5,

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
            mb: 1.5,

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
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",

              lg: "minmax(0, 1.1fr) minmax(0, 1fr)",
            },

            gap: {
              xs: 2.5,

              lg: 3,
            },

            alignItems: "start",
          }}
        >
          {/* =================================================
          CHANGE STAGE
          ================================================= */}

          <Box
            sx={{
              p: {
                xs: 1.75,

                sm: 2.25,
              },

              border: `1px solid ${BORDER}`,

              borderRadius: 3,

              bgcolor: SURFACE_ALT,
            }}
          >
            <Box
              sx={{
                mb: 1.5,

                display: "flex",

                alignItems: "center",

                justifyContent: "space-between",

                gap: 1.5,

                flexWrap: "wrap",
              }}
            >
              <PanelTitle>Change stage</PanelTitle>

              {canManageStages && (
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  startIcon={<AddRoundedIcon />}
                  onClick={openAddStageModal}
                  sx={{
                    mt: -1.5,

                    minHeight: 34,

                    borderRadius: 2,

                    borderColor: "rgba(16,122,100,0.35)",

                    color: BRAND,

                    fontWeight: 700,

                    textTransform: "none",

                    "&:hover": {
                      borderColor: BRAND,

                      bgcolor: BRAND_SOFT,
                    },
                  }}
                >
                  Add stage
                </Button>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",

                flexDirection: "column",

                gap: 1.5,
              }}
            >
              {/* NEXT STAGE */}
              <Autocomplete
                disablePortal
                fullWidth
                autoHighlight
                clearOnEscape
                options={stageOptions}
                value={
                  stageOptions.find((stage) => stage.key === values.stage) ??
                  null
                }
                getOptionLabel={(stage) =>
                  `${stage.name} — ${formatCurrency(stage.amount)}`
                }
                isOptionEqualToValue={(option, value) =>
                  option.key === value.key
                }
                onChange={(_event, stage) =>
                  updateValue("stage", stage?.key ?? "")
                }
                noOptionsText="No stages found"
                renderOption={(props, stage) => (
                  <Box
                    component="li"
                    {...props}
                    key={stage._id}
                    sx={{
                      display: "flex !important",
                      alignItems: "center",
                      justifyContent: "space-between !important",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: INK,
                        }}
                      >
                        {stage.name}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.15,
                          fontSize: 11.5,
                          color: MUTED,
                        }}
                      >
                        {stage.key}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        color: stage.amount > 0 ? WARNING : BRAND,
                      }}
                    >
                      {formatCurrency(stage.amount)}
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Next stage"
                    placeholder="Search and select stage"
                    error={Boolean(formErrors.stage)}
                    helperText={formErrors.stage}
                    sx={fieldSx}
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-inputRoot": {
                    bgcolor: SURFACE,
                  },
                }}
              />

              {/* SELECTED STAGE */}

              {selectedStageDetails && (
                <Box
                  sx={{
                    px: 1.75,

                    py: 1.25,

                    border: `1px solid ${
                      requiresPayment ? WARNING_BORDER : "rgba(21,128,61,0.2)"
                    }`,

                    borderRadius: 2.5,

                    bgcolor: requiresPayment ? WARNING_SOFT : SUCCESS_SOFT,

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: requiresPayment ? WARNING : SUCCESS,

                        fontSize: 12,

                        fontWeight: 700,
                      }}
                    >
                      {requiresPayment
                        ? "Payment required"
                        : "No payment required"}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,

                        color: INK,

                        fontSize: 13.5,

                        fontWeight: 600,

                        wordBreak: "break-word",
                      }}
                    >
                      {selectedStageDetails.name}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      flexShrink: 0,

                      color: requiresPayment ? WARNING : SUCCESS,

                      fontSize: {
                        xs: 18,

                        sm: 20,
                      },

                      fontWeight: 800,
                    }}
                  >
                    {formatCurrency(selectedStageAmount)}
                  </Typography>
                </Box>
              )}

              {/* PAYMENT DETAILS */}

              {requiresPayment && (
                <Box
                  sx={{
                    p: {
                      xs: 1.5,

                      sm: 1.75,
                    },

                    border: `1px solid ${WARNING_BORDER}`,

                    borderRadius: 2.5,

                    bgcolor: "#FFFDF8",
                  }}
                >
                  <Box
                    sx={{
                      mb: 1.5,

                      display: "flex",

                      alignItems: "flex-start",

                      gap: 1,
                    }}
                  >
                    <PaymentsOutlinedIcon
                      sx={{
                        mt: 0.15,

                        color: WARNING,

                        fontSize: 20,
                      }}
                    />

                    <Box>
                      <Typography
                        sx={{
                          color: INK,

                          fontSize: 13.5,

                          fontWeight: 700,
                        }}
                      >
                        Full payment required
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.15,

                          color: MUTED,

                          fontSize: 12,

                          lineHeight: 1.5,
                        }}
                      >
                        The full stage amount must be received before the stage
                        can be updated. The amount comes from the Stage Master
                        and can&apos;t be edited here.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={fieldGridSx}>
                    <TextField
                      select
                      required
                      fullWidth
                      size="small"
                      label="Payment method"
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

                    <TextField
                      required
                      fullWidth
                      size="small"
                      type="date"
                      label="Payment date"
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

                    <TextField
                      fullWidth
                      size="small"
                      label="Bank name"
                      value={values.bankName}
                      disabled={values.paymentMethod === "Cash"}
                      onChange={(event) =>
                        updateValue("bankName", event.target.value)
                      }
                      error={Boolean(formErrors.bankName)}
                      helperText={formErrors.bankName}
                      sx={fieldSx}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Reference number"
                      value={values.referenceNumber}
                      onChange={(event) =>
                        updateValue("referenceNumber", event.target.value)
                      }
                      error={Boolean(formErrors.referenceNumber)}
                      helperText={formErrors.referenceNumber}
                      sx={fieldSx}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="Receipt number"
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
                size="small"
                label="Note"
                value={values.note}
                onChange={(event) => updateValue("note", event.target.value)}
                error={Boolean(formErrors.note)}
                helperText={formErrors.note}
                sx={fieldSx}
              />

              {/* UPDATE BUTTON */}

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
                  alignSelf: {
                    xs: "stretch",

                    sm: "flex-end",
                  },

                  minHeight: 42,

                  px: 2.5,

                  borderRadius: 2,

                  bgcolor: requiresPayment ? WARNING : BRAND,

                  color: "#ffffff",

                  fontWeight: 700,

                  lineHeight: 1.25,

                  textTransform: "none",

                  "&:hover": {
                    bgcolor: requiresPayment ? WARNING_DARK : BRAND_DARK,
                  },

                  "&.Mui-disabled": {
                    bgcolor: requiresPayment
                      ? "rgba(180, 83, 9, 0.4)"
                      : "rgba(16, 122, 100, 0.4)",

                    color: "#ffffff",
                  },
                }}
              >
                {isUpdating
                  ? "Processing..."
                  : requiresPayment
                    ? `Pay ${formatCurrency(
                        selectedStageAmount,
                      )} & update stage`
                    : "Update stage"}
              </Button>
            </Box>
          </Box>

          {/* =================================================
          STAGE HISTORY
          ================================================= */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <PanelTitle count={history.length}>Stage history</PanelTitle>

            {history.length === 0 ? (
              <Box
                sx={{
                  py: 3.5,

                  px: 2,

                  border: "1px dashed rgba(16, 122, 100, 0.3)",

                  borderRadius: 3,

                  bgcolor: SURFACE_ALT,

                  color: MUTED,

                  fontSize: 13.5,

                  textAlign: "center",
                }}
              >
                No stage history found.
              </Box>
            ) : (
              <Box>
                <Box
                  sx={{
                    maxHeight: showAllHistory
                      ? {
                          xs: 460,

                          lg: 560,
                        }
                      : "none",

                    overflowY: showAllHistory ? "auto" : "visible",

                    pr: showAllHistory ? 1 : 0,

                    mr: showAllHistory ? -1 : 0,

                    scrollbarWidth: "thin",

                    scrollbarColor: "rgba(17,24,39,0.18) transparent",
                  }}
                >
                  {visibleHistory.map((item, index) => {
                    const payment = item.paymentRef;

                    const hasPayment = Boolean(
                      payment && Number(payment.amountPaid || 0) > 0,
                    );

                    const isLast = index === visibleHistory.length - 1;

                    const isPaidStage = Number(item.toStageAmount || 0) > 0;

                    return (
                      <Box
                        key={item._id}
                        sx={{
                          position: "relative",

                          pl: {
                            xs: 4.5,

                            sm: 5,
                          },

                          pb: isLast ? 0 : 1.75,

                          "&::before": isLast
                            ? undefined
                            : {
                                content: '""',

                                position: "absolute",

                                left: 11,

                                top: 26,

                                bottom: 2,

                                width: 2,

                                borderRadius: 1,

                                bgcolor: BORDER,
                              },
                        }}
                      >
                        {/* DOT */}

                        <Box
                          aria-hidden
                          sx={{
                            position: "absolute",

                            left: 0,

                            top: 1,

                            width: 24,

                            height: 24,

                            display: "grid",

                            placeItems: "center",

                            borderRadius: "50%",

                            bgcolor: isPaidStage ? WARNING_SOFT : BRAND_SOFT,

                            color: isPaidStage ? WARNING : BRAND,

                            border: "2px solid #ffffff",

                            boxShadow: `0 0 0 1px ${BORDER}`,
                          }}
                        >
                          <CheckRoundedIcon
                            sx={{
                              fontSize: 14,
                            }}
                          />
                        </Box>

                        {/* CARD */}

                        <Box
                          sx={{
                            p: {
                              xs: 1.5,

                              sm: 1.75,
                            },

                            border: `1px solid ${BORDER}`,

                            borderRadius: 2.5,

                            bgcolor: SURFACE,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",

                              justifyContent: "space-between",

                              alignItems: "flex-start",

                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: 0,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",

                                  flexWrap: "wrap",

                                  alignItems: "center",

                                  columnGap: 0.75,

                                  rowGap: 0.25,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: MUTED,

                                    fontSize: 13,

                                    fontWeight: 500,
                                  }}
                                >
                                  {item.fromStageName || "Initial"}
                                </Typography>

                                <ArrowForwardRoundedIcon
                                  sx={{
                                    color: MUTED,

                                    fontSize: 15,
                                  }}
                                />

                                <Typography
                                  sx={{
                                    color: INK,

                                    fontSize: 14,

                                    fontWeight: 700,
                                  }}
                                >
                                  {item.toStageName}
                                </Typography>
                              </Box>

                              <Typography
                                sx={{
                                  mt: 0.3,

                                  color: MUTED,

                                  fontSize: 12,

                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {formatDateTime(item.createdAt)}
                              </Typography>
                            </Box>

                            <Box
                              component="span"
                              sx={{
                                flexShrink: 0,

                                px: 1.1,

                                py: 0.35,

                                borderRadius: 999,

                                bgcolor: isPaidStage
                                  ? WARNING_SOFT
                                  : BRAND_SOFT,

                                color: isPaidStage ? WARNING : BRAND,

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

                                px: 1.25,

                                py: 1,

                                borderRadius: 2,

                                bgcolor: SURFACE_ALT,

                                color: INK,

                                fontSize: 13,

                                lineHeight: 1.6,

                                whiteSpace: "pre-wrap",

                                wordBreak: "break-word",
                              }}
                            >
                              {item.note}
                            </Typography>
                          )}

                          {hasPayment && (
                            <Box
                              sx={{
                                mt: 1.25,

                                px: 1.5,

                                py: 1.25,

                                border: "1px solid rgba(21,128,61,0.16)",

                                borderRadius: 2,

                                bgcolor: SUCCESS_SOFT,

                                display: "grid",

                                gridTemplateColumns: {
                                  xs: "repeat(2, minmax(0, 1fr))",

                                  xl: "repeat(4, minmax(0, 1fr))",
                                },

                                gap: 1.25,
                              }}
                            >
                              <Fact
                                label="Payment"
                                value={formatCurrency(payment?.amountPaid)}
                                color={SUCCESS}
                              />

                              <Fact
                                label="Method"
                                value={payment?.paymentMethod || "-"}
                              />

                              <Fact
                                label="Status"
                                value={payment?.paymentStatus || "Completed"}
                                color={SUCCESS}
                              />

                              <Fact
                                label="Collected by"
                                value={
                                  payment?.creditedStaffName ||
                                  item.changedByName ||
                                  "-"
                                }
                              />
                            </Box>
                          )}

                          <Typography
                            sx={{
                              mt: 1.1,

                              color: MUTED,

                              fontSize: 11.5,
                            }}
                          >
                            Changed by{" "}
                            {item.changedByName ||
                              item.staffId ||
                              item.changedByRole ||
                              "-"}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {canCollapseHistory && (
                  <Button
                    type="button"
                    size="small"
                    onClick={() => setShowAllHistory((previous) => !previous)}
                    endIcon={
                      showAllHistory ? (
                        <ExpandLessRoundedIcon />
                      ) : (
                        <ExpandMoreRoundedIcon />
                      )
                    }
                    sx={{
                      mt: 1.5,

                      ml: {
                        xs: 4.5,

                        sm: 5,
                      },

                      color: BRAND,

                      fontSize: 13,

                      fontWeight: 600,

                      textTransform: "none",

                      "&:hover": {
                        bgcolor: BRAND_SOFT,
                      },
                    }}
                  >
                    {showAllHistory
                      ? "Show less"
                      : `Show all ${history.length} changes`}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Progress;
