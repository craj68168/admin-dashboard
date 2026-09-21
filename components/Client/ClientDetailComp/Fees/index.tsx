"use client";

import { useState, type ReactNode } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useClientFeesHook } from "./hook";

import type { ClientFeesProps, PaymentProgressStatus } from "./type";

// =================================================
// DESIGN TOKENS
// Styling only, no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const MUTED = "#6B7280";
const AMBER = "#B7791F";
const DANGER = "#DC2626";

// How many fees show before "Show all"
const FEES_PREVIEW_COUNT = 4;

const errorAlertSx = {
  borderRadius: 2.5,
  border: "1px solid rgba(220, 38, 38, 0.14)",
  bgcolor: "#FEF2F2",
  color: "#991B1B",
  "& .MuiAlert-icon": { color: DANGER },
};

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: INK_MUTED,
    fontSize: 14,
    "&.Mui-focused": { color: BRAND },
    "&.Mui-error": { color: DANGER },
  },

  "& .MuiOutlinedInput-root": {
    bgcolor: SURFACE,
    color: INK,
    borderRadius: 2,
    transition: "border-color 200ms ease",

    "& fieldset": { borderColor: HAIRLINE },
    "&:hover fieldset": { borderColor: "rgba(16, 122, 100, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: "1px" },
    "&.Mui-error fieldset": { borderColor: DANGER },
  },

  "& .MuiInputBase-input": { fontSize: 14 },

  "& .MuiFormHelperText-root": {
    mx: 0.5,
    mt: 0.5,
    color: INK_MUTED,
    fontSize: 11.5,
    "&.Mui-error": { color: DANGER },
  },
};

const chipSx = {
  height: 24,
  borderRadius: 999,
  fontSize: 11.5,
  fontWeight: 600,

  "& .MuiChip-label": { px: 1.1 },

  "&.MuiChip-colorSuccess": {
    color: BRAND,
    bgcolor: BRAND_SOFT,
    borderColor: "rgba(16, 122, 100, 0.16)",
  },

  "&.MuiChip-colorWarning": {
    color: AMBER,
    bgcolor: "#FFFBEB",
    borderColor: "rgba(183, 121, 31, 0.2)",
  },

  "&.MuiChip-colorInfo": {
    color: INK_MUTED,
    bgcolor: "#F3F4F6",
    borderColor: HAIRLINE,
  },

  "&.MuiChip-colorDefault": {
    color: INK_MUTED,
    bgcolor: SURFACE_ALT,
    borderColor: HAIRLINE,
  },
};

// =================================================
// HELPERS
// =================================================

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

const formatTokyoDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getProgressColor = (
  status: PaymentProgressStatus,
): "default" | "warning" | "info" | "success" => {
  switch (status) {
    case "Partial":
      return "warning";

    case "Paid":
      return "success";

    case "Unpaid":
      return "info";

    default:
      return "default";
  }
};

const getPaidPercent = (paid: number, expected: number) => {
  const total = Number(expected || 0);

  if (total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (Number(paid || 0) / total) * 100));
};

// =================================================
// SMALL PIECES
// =================================================

const PanelTitle = ({
  children,
  count,
}: {
  children: ReactNode;
  count?: number;
}) => (
  <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
    <Typography
      component="h3"
      sx={{ color: INK, fontSize: 14.5, fontWeight: 700 }}
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

const StatTile = ({
  label,
  value,
  color = INK,
  tint,
}: {
  label: string;
  value: string;
  color?: string;
  tint?: string;
}) => (
  <Box
    sx={{
      px: 2,
      py: 1.5,
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 2.5,
      bgcolor: tint || SURFACE_ALT,
      minWidth: 0,
    }}
  >
    <Typography sx={{ color: INK_MUTED, fontSize: 12, fontWeight: 500 }}>
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 0.25,
        color,
        fontSize: { xs: 20, sm: 22 },
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
        fontVariantNumeric: "tabular-nums",
        wordBreak: "break-word",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const Money = ({
  label,
  value,
  color = INK,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ color: MUTED, fontSize: 11.5, lineHeight: 1.4 }}>
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 0.15,
        color,
        fontSize: 14,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </Typography>
  </Box>
);

// =================================================
// COMPONENT
// =================================================

const ClientFees = ({ clientId }: ClientFeesProps) => {
  const t = useTranslations("clientFees");

  const {
    isAdmin,

    fees,

    totalExpected,
    totalPaid,
    totalOutstanding,

    control,
    errors,

    handleSubmit,
    onSubmit,

    editingFeeId,

    handleEdit,
    handleCancelEdit,

    feeToCancel,

    handleOpenCancelFee,
    handleCloseCancelFee,
    handleConfirmCancelFee,

    isFeesLoading,

    isSubmitting,
    isCreatingFee,
    isUpdatingFee,
    isCancellingFee,

    serverError,
    successMessage,
    loadError,
  } = useClientFeesHook(clientId);

  const saving = isSubmitting || isCreatingFee || isUpdatingFee;

  const [showAllFees, setShowAllFees] = useState(false);

  const canCollapseFees = fees.length > FEES_PREVIEW_COUNT;

  const visibleFees =
    showAllFees || !canCollapseFees ? fees : fees.slice(0, FEES_PREVIEW_COUNT);

  return (
    <Box>
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          pb: 1.75,
          mb: 2,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: INK,
            fontSize: { xs: 16, md: 17 },
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {t("title")}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: INK_MUTED,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          {t("description")}
        </Typography>
      </Box>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        <StatTile
          label={t("summary.totalExpected")}
          value={`¥${formatAmount(totalExpected)}`}
        />

        <StatTile
          label={t("summary.totalPaid")}
          value={`¥${formatAmount(totalPaid)}`}
          color={BRAND}
          tint={BRAND_SOFT}
        />

        <StatTile
          label={t("summary.outstanding")}
          value={`¥${formatAmount(totalOutstanding)}`}
          color={AMBER}
          tint="#FFFBEB"
        />
      </Box>

      {/* =================================================
          ALERTS
      ================================================= */}

      {serverError && (
        <Alert severity="error" sx={{ ...errorAlertSx, mb: 1.5 }}>
          {serverError}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 1.5,
            borderRadius: 2.5,
            border: "1px solid rgba(16, 122, 100, 0.16)",
            bgcolor: BRAND_SOFT,
            color: BRAND,
            "& .MuiAlert-icon": { color: BRAND },
          }}
        >
          {successMessage}
        </Alert>
      )}

      {loadError && (
        <Alert severity="error" sx={{ ...errorAlertSx, mb: 1.5 }}>
          {loadError}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: isAdmin
              ? "minmax(0, 1.45fr) minmax(0, 1fr)"
              : "minmax(0, 1fr)",
          },
          gap: { xs: 2.5, lg: 3 },
          alignItems: "start",
        }}
      >
        {/* =================================================
            FEE LIST
        ================================================= */}

        <Box sx={{ minWidth: 0 }}>
          <PanelTitle count={fees.length}>{t("feeRequirements")}</PanelTitle>

          {isFeesLoading && (
            <Box
              sx={{
                py: 5,
                display: "grid",
                placeItems: "center",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 3,
                bgcolor: SURFACE_ALT,
              }}
            >
              <CircularProgress size={26} sx={{ color: BRAND }} />
            </Box>
          )}

          {!isFeesLoading && !loadError && fees.length === 0 && (
            <Box
              sx={{
                py: 4,
                px: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                border: "1px dashed rgba(16, 122, 100, 0.3)",
                borderRadius: 3,
                bgcolor: SURFACE_ALT,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  bgcolor: BRAND_SOFT,
                  color: BRAND,
                }}
              >
                <ReceiptLongOutlinedIcon fontSize="small" />
              </Box>

              <Typography sx={{ color: INK_MUTED, fontSize: 13.5 }}>
                {t("empty")}
              </Typography>
            </Box>
          )}

          {!isFeesLoading && !loadError && fees.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                  // Collapsed: a few fees. Expanded: scrolls inside a fixed
                  // height so the section never keeps growing.
                  maxHeight: showAllFees ? { xs: 520, lg: 620 } : "none",
                  overflowY: showAllFees ? "auto" : "visible",
                  pr: showAllFees ? 0.5 : 0,
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(17,24,39,0.18) transparent",
                }}
              >
                {visibleFees.map((fee) => {
                  const isActive = fee.status === "Active";
                  const isEditing = editingFeeId === fee._id;

                  const percent = getPaidPercent(
                    fee.paidAmount,
                    fee.expectedAmount,
                  );

                  return (
                    <Box
                      key={fee._id}
                      sx={{
                        p: { xs: 1.5, sm: 1.75 },
                        border: `1px solid ${
                          isEditing ? BRAND : HAIRLINE
                        }`,
                        borderRadius: 2.5,
                        bgcolor: SURFACE,
                        boxShadow: isEditing
                          ? `0 0 0 3px ${BRAND_SOFT}`
                          : "none",
                        opacity: isActive ? 1 : 0.78,
                        transition:
                          "border-color 200ms ease, box-shadow 200ms ease",
                      }}
                    >
                      {/* TOP ROW */}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 1,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: INK,
                              fontSize: 14.5,
                              fontWeight: 700,
                              lineHeight: 1.4,
                              wordBreak: "break-word",
                            }}
                          >
                            {fee.feeName}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.25,
                              color: MUTED,
                              fontSize: 12,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {t("due", { date: formatTokyoDate(fee.dueDate) })}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.75,
                            flexWrap: "wrap",
                            flexShrink: 0,
                          }}
                        >
                          <Chip
                            size="small"
                            label={t(`statuses.${fee.status}`)}
                            color={isActive ? "success" : "default"}
                            variant="outlined"
                            sx={chipSx}
                          />

                          <Chip
                            size="small"
                            variant="outlined"
                            label={t(
                              `paymentStatuses.${fee.paymentProgressStatus}`,
                            )}
                            color={getProgressColor(fee.paymentProgressStatus)}
                            sx={chipSx}
                          />
                        </Box>
                      </Box>

                      {/* MONEY + PROGRESS */}

                      <Box
                        sx={{
                          mt: 1.5,
                          px: 1.5,
                          py: 1.25,
                          borderRadius: 2,
                          bgcolor: SURFACE_ALT,
                          border: `1px solid ${HAIRLINE}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: 1.25,
                          }}
                        >
                          <Money
                            label={t("summary.expected")}
                            value={`¥${formatAmount(fee.expectedAmount)}`}
                          />

                          <Money
                            label={t("summary.paid")}
                            value={`¥${formatAmount(fee.paidAmount)}`}
                            color={BRAND}
                          />

                          <Money
                            label={t("summary.outstanding")}
                            value={`¥${formatAmount(fee.outstandingAmount)}`}
                            color={
                              Number(fee.outstandingAmount || 0) > 0
                                ? AMBER
                                : INK
                            }
                          />
                        </Box>

                        <Box
                          role="progressbar"
                          aria-valuenow={Math.round(percent)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          sx={{
                            mt: 1.25,
                            height: 5,
                            borderRadius: 999,
                            bgcolor: "rgba(17,24,39,0.07)",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${percent}%`,
                              height: "100%",
                              borderRadius: 999,
                              bgcolor: percent >= 100 ? BRAND : "#34A48C",
                              transition: "width 300ms ease",
                            }}
                          />
                        </Box>
                      </Box>

                      {/* NOTE */}

                      {fee.note && (
                        <Typography
                          sx={{
                            mt: 1.25,
                            color: INK_MUTED,
                            fontSize: 13,
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {fee.note}
                        </Typography>
                      )}

                      {/* FOOTER */}

                      <Box
                        sx={{
                          mt: 1.25,
                          display: "flex",
                          alignItems: { xs: "flex-start", sm: "center" },
                          justifyContent: "space-between",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ color: MUTED, fontSize: 12 }}>
                          {t("createdBy")}{" "}
                          <Box
                            component="span"
                            sx={{ color: INK, fontWeight: 600 }}
                          >
                            {fee.createdByName}
                          </Box>
                        </Typography>

                        {isAdmin && isActive && (
                          <Box sx={{ display: "flex", gap: 0.75 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditOutlinedIcon />}
                              onClick={() => handleEdit(fee)}
                              sx={{
                                minHeight: 32,
                                px: 1.5,
                                borderRadius: 2,
                                borderColor: HAIRLINE,
                                color: INK_MUTED,
                                bgcolor: SURFACE,
                                fontSize: 12.5,
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: BRAND_SOFT,
                                  color: BRAND,
                                  borderColor: "rgba(16, 122, 100, 0.3)",
                                },
                              }}
                            >
                              {t("actions.edit")}
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<CancelOutlinedIcon />}
                              onClick={() => handleOpenCancelFee(fee)}
                              sx={{
                                minHeight: 32,
                                px: 1.5,
                                borderRadius: 2,
                                borderColor: "rgba(220, 38, 38, 0.2)",
                                color: DANGER,
                                bgcolor: SURFACE,
                                fontSize: 12.5,
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "#FEF2F2",
                                  borderColor: "rgba(220, 38, 38, 0.4)",
                                },
                              }}
                            >
                              {t("actions.cancel")}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {canCollapseFees && (
                <Box
                  sx={{ mt: 1.25, display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="button"
                    size="small"
                    onClick={() => setShowAllFees((prev) => !prev)}
                    endIcon={
                      showAllFees ? (
                        <ExpandLessRoundedIcon />
                      ) : (
                        <ExpandMoreRoundedIcon />
                      )
                    }
                    sx={{
                      color: BRAND,
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: BRAND_SOFT },
                    }}
                  >
                    {showAllFees
                      ? "Show less"
                      : `Show all ${fees.length} fees`}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* =================================================
            ADMIN FORM
        ================================================= */}

        {isAdmin && (
          <Box
            sx={{
              p: { xs: 1.75, sm: 2.25 },
              border: `1px solid ${editingFeeId ? BRAND : HAIRLINE}`,
              borderRadius: 3,
              bgcolor: SURFACE_ALT,
              boxShadow: editingFeeId ? `0 0 0 3px ${BRAND_SOFT}` : "none",
              transition: "border-color 200ms ease, box-shadow 200ms ease",
              position: { lg: "sticky" },
              top: { lg: 16 },
            }}
          >
            <Typography
              component="h3"
              sx={{
                mb: 1.75,
                color: INK,
                fontSize: 14.5,
                fontWeight: 700,
              }}
            >
              {editingFeeId ? t("form.editTitle") : t("form.addTitle")}
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Controller
                name="feeName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    size="small"
                    label={t("form.feeName")}
                    error={Boolean(errors.feeName)}
                    helperText={errors.feeName?.message}
                    sx={fieldSx}
                  />
                )}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "minmax(0, 1fr)",
                    xl: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                <Controller
                  name="expectedAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      size="small"
                      type="number"
                      label={t("form.expectedAmount")}
                      error={Boolean(errors.expectedAmount)}
                      helperText={errors.expectedAmount?.message}
                      sx={fieldSx}
                    />
                  )}
                />

                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      label={t("form.dueDate")}
                      slotProps={{ inputLabel: { shrink: true } }}
                      sx={fieldSx}
                    />
                  )}
                />
              </Box>

              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    label={t("form.note")}
                    error={Boolean(errors.note)}
                    helperText={errors.note?.message}
                    sx={fieldSx}
                  />
                )}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column-reverse", sm: "row" },
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                {editingFeeId && (
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={saving}
                    onClick={handleCancelEdit}
                    sx={{
                      minHeight: 40,
                      px: 2,
                      borderRadius: 2,
                      borderColor: HAIRLINE,
                      color: INK_MUTED,
                      bgcolor: SURFACE,
                      fontSize: 13.5,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: BRAND_SOFT,
                        borderColor: "rgba(16, 122, 100, 0.3)",
                        color: BRAND,
                      },
                    }}
                  >
                    {t("actions.cancelEdit")}
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={saving}
                  startIcon={
                    saving ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : editingFeeId ? (
                      <EditOutlinedIcon />
                    ) : (
                      <AddCardOutlinedIcon />
                    )
                  }
                  sx={{
                    minHeight: 40,
                    px: 2.25,
                    bgcolor: BRAND,
                    color: "#ffffff",
                    borderRadius: 2,
                    fontSize: 13.5,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: BRAND_HOVER },
                    "&.Mui-disabled": {
                      bgcolor: "rgba(16, 122, 100, 0.45)",
                      color: "#ffffff",
                    },
                  }}
                >
                  {saving
                    ? t("actions.saving")
                    : editingFeeId
                      ? t("actions.updateFee")
                      : t("actions.addFee")}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <ConfirmActionDialog
        open={Boolean(feeToCancel)}
        title={t("dialog.title")}
        description={
          feeToCancel
            ? t("dialog.description", { feeName: feeToCancel.feeName })
            : ""
        }
        confirmText={t("dialog.confirm")}
        cancelText={t("dialog.keep")}
        confirmColor="error"
        isLoading={isCancellingFee}
        onConfirm={handleConfirmCancelFee}
        onClose={handleCloseCancelFee}
      />
    </Box>
  );
};

export default ClientFees;