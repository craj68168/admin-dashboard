"use client";

import { useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { Controller } from "react-hook-form";

import type { PerformanceProps, PerformanceStatus } from "./type";

import { usePerformanceHook } from "./hook";

// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_GLOW = "rgba(16, 122, 100, 0.16)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG = "rgba(17, 24, 39, 0.16)";
const DIVIDER = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const INK_FAINT = "#6B7280";
const SURFACE_TINT = "#FAFAF9";
const DANGER = "#DC2626";
const DANGER_SOFT = "#FEF2F2";

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

const fieldSx = {
  "& .MuiInputLabel-root": { color: INK_MUTED, fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: BRAND },
  "& .MuiInputLabel-root.Mui-error": { color: DANGER },
  "& .MuiOutlinedInput-root": {
    bgcolor: "#ffffff",
    borderRadius: 2.5,
    color: INK,
    transition: "box-shadow 150ms ease",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: HAIRLINE_STRONG },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(17, 24, 39, 0.34)",
    },
    "&.Mui-focused": { boxShadow: `0 0 0 3px ${BRAND_GLOW}` },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: BRAND,
      borderWidth: 1,
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: DANGER },
    "&.Mui-error.Mui-focused": { boxShadow: "0 0 0 3px rgba(220,38,38,0.14)" },
  },
  // 16px on phones stops iOS Safari zooming into the field.
  "& .MuiInputBase-input": {
    fontSize: { xs: 16, sm: 14 },
    "&::placeholder": { color: INK_FAINT, opacity: 1 },
  },
  // Hide number spinners (they also make scroll-wheel edits easy to trigger by accident).
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    { WebkitAppearance: "none", margin: 0 },
  "& .MuiFormHelperText-root": {
    mx: 0,
    mt: 0.75,
    color: INK_MUTED,
    fontSize: 12.5,
  },
  "& .MuiFormHelperText-root.Mui-error": { color: DANGER },
};

const alertSx = {
  mb: 2.5,
  borderRadius: 2.5,
  border: `1px solid ${HAIRLINE}`,
  boxShadow: "none",
  fontSize: 14,
  alignItems: "center",
};

// =================================================
// FORMATTERS
// =================================================

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

const formatPercent = (value: number) => Number(value ?? 0).toLocaleString();

const clampPercent = (value: number) =>
  Math.min(Math.max(Number(value) || 0, 0), 100);

// =================================================
// STATUS TONES (same as the performance history table)
// =================================================

const STATUS_TONE: Record<
  PerformanceStatus,
  { fg: string; bg: string; dot: string; bar: string }
> = {
  Achieved: { fg: BRAND_HOVER, bg: BRAND_SOFT, dot: BRAND, bar: BRAND },
  "In Progress": {
    fg: "#92580A",
    bg: "#FFF6E0",
    dot: "#D69E2E",
    bar: "#D69E2E",
  },
  "No Target": {
    fg: INK_MUTED,
    bg: "rgba(17, 24, 39, 0.06)",
    dot: "#9CA3AF",
    bar: "#D1D5DB",
  },
  "Not Started": {
    fg: INK_MUTED,
    bg: "rgba(17, 24, 39, 0.04)",
    dot: "#D1D5DB",
    bar: "#D1D5DB",
  },
};

const toneFor = (status: PerformanceStatus) =>
  STATUS_TONE[status] ?? STATUS_TONE["Not Started"];

function StatusPill({
  status,
  label,
}: {
  status: PerformanceStatus;
  label: string;
}) {
  const tone = toneFor(status);

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.375,
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        color: tone.fg,
        bgcolor: tone.bg,
      }}
    >
      <Box
        component="span"
        sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: tone.dot }}
      />
      {label}
    </Box>
  );
}

// =================================================
// KPI CELL
// =================================================

function KpiCell({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Box sx={{ bgcolor: "#ffffff", p: { xs: 1.75, sm: 2.25 }, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <Box
          aria-hidden
          sx={{
            display: "grid",
            placeItems: "center",
            color: BRAND,
            "& svg": { fontSize: 18 },
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: INK_MUTED }}>
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          mt: 1,
          fontSize: { xs: 18, sm: 22 },
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: -0.3,
          color: accent ? BRAND : INK,
          fontVariantNumeric: "tabular-nums",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// =================================================
// COMPONENT
// =================================================

const Performance = ({ staffId }: PerformanceProps) => {
  const t = useTranslations("staffPerformance");
  const headingId = useId();
  const formHeadingId = useId();

  const {
    isAdmin,

    selectedMonth,
    handleMonthChange,

    target,
    performance,

    control,
    errors,

    handleSubmit,
    onSubmit,

    isPerformanceLoading,
    isPerformanceFetching,

    isSubmitting,
    isCreatingTarget,
    isUpdatingTarget,

    serverError,
    successMessage,
    loadError,
  } = usePerformanceHook(staffId);

  const saving = isSubmitting || isCreatingTarget || isUpdatingTarget;
  const tone = toneFor(performance.status);

  const performanceStatusLabel: Record<PerformanceStatus, string> = {
    "No Target": t("status.noTarget"),
    "Not Started": t("status.notStarted"),
    "In Progress": t("status.inProgress"),
    Achieved: t("status.achieved"),
  };

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      sx={{ width: "100%", minWidth: 0 }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "flex-end" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
          mb: { xs: 2.5, md: 3 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            id={headingId}
            sx={{
              color: INK,
              fontSize: { xs: 18, md: 20 },
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: -0.2,
            }}
          >
            {t("title")}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: INK_MUTED,
              fontSize: { xs: 13.5, sm: 14 },
              lineHeight: 1.6,
              maxWidth: 640,
            }}
          >
            {t("description")}
          </Typography>
        </Box>

        <TextField
          type="month"
          size="small"
          label={t("month")}
          value={selectedMonth}
          onChange={(event) => handleMonthChange(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{
            ...fieldSx,
            width: { xs: "100%", sm: 210 },
            flexShrink: 0,
          }}
        />
      </Box>

      {/* ALERTS */}
      {loadError && (
        <Alert
          severity="error"
          sx={{
            ...alertSx,
            color: "#991B1B",
            bgcolor: DANGER_SOFT,
            "& .MuiAlert-icon": { color: DANGER },
          }}
        >
          {loadError}
        </Alert>
      )}

      {serverError && (
        <Alert
          severity="error"
          sx={{
            ...alertSx,
            color: "#991B1B",
            bgcolor: DANGER_SOFT,
            "& .MuiAlert-icon": { color: DANGER },
          }}
        >
          {serverError}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          sx={{
            ...alertSx,
            color: BRAND_HOVER,
            bgcolor: BRAND_SOFT,
            "& .MuiAlert-icon": { color: BRAND },
          }}
        >
          {successMessage}
        </Alert>
      )}

      {isPerformanceLoading ? (
        <Box aria-busy="true">
          <Skeleton variant="rounded" height={104} />
          <Skeleton variant="rounded" height={128} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <>
          {/* KPI STRIP */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: "1px",
              bgcolor: DIVIDER,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 2.5,
              overflow: "hidden",
            }}
          >
            <KpiCell
              icon={<TrackChangesOutlinedIcon />}
              label={t("summary.target")}
              value={`¥${formatAmount(performance.targetAmount)}`}
            />
            <KpiCell
              icon={<PaymentsOutlinedIcon />}
              label={t("summary.collected")}
              value={`¥${formatAmount(performance.totalCollected)}`}
              accent
            />
            <KpiCell
              icon={<AccountBalanceWalletOutlinedIcon />}
              label={t("summary.remaining")}
              value={`¥${formatAmount(performance.remainingAmount)}`}
            />
            <KpiCell
              icon={<PercentOutlinedIcon />}
              label={t("summary.achievement")}
              value={`${formatPercent(performance.achievementPercentage)}%`}
            />
          </Box>

          {/* PROGRESS */}
          <Box
            sx={{
              mt: 2,
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2.5,
              border: `1px solid ${HAIRLINE}`,
              bgcolor: SURFACE_TINT,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.25,
                }}
              >
                <Typography
                  component="h3"
                  sx={{ fontSize: 15, fontWeight: 600, color: INK }}
                >
                  {t("monthlyProgress")}
                </Typography>
                <StatusPill
                  status={performance.status}
                  label={performanceStatusLabel[performance.status]}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: tone.fg,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatPercent(performance.achievementPercentage)}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={clampPercent(performance.achievementPercentage)}
              aria-label={t("monthlyProgress")}
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: "rgba(17, 24, 39, 0.07)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: tone.bar,
                },
                "@media (prefers-reduced-motion: reduce)": {
                  "& .MuiLinearProgress-bar": { transition: "none" },
                },
              }}
            />

            <Box
              component="dl"
              sx={{
                m: 0,
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${HAIRLINE}`,
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 3, sm: 5 },
              }}
            >
              <Box>
                <Typography
                  component="dt"
                  sx={{ fontSize: 12.5, fontWeight: 500, color: INK_FAINT }}
                >
                  {t("payments")}
                </Typography>
                <Typography
                  component="dd"
                  sx={{
                    m: 0,
                    mt: 0.25,
                    fontSize: 16,
                    fontWeight: 600,
                    color: INK,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {performance.paymentCount}
                </Typography>
              </Box>

              <Box>
                <Typography
                  component="dt"
                  sx={{ fontSize: 12.5, fontWeight: 500, color: INK_FAINT }}
                >
                  {t("clients")}
                </Typography>
                <Typography
                  component="dd"
                  sx={{
                    m: 0,
                    mt: 0.25,
                    fontSize: 16,
                    fontWeight: 600,
                    color: INK,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {performance.clientCount}
                </Typography>
              </Box>
            </Box>

            {isPerformanceFetching && !isPerformanceLoading && (
              <Box
                role="status"
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 0.75,
                  mt: 1.5,
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: BRAND,
                  }}
                />
                <Typography
                  sx={{ fontSize: 12.5, fontWeight: 500, color: INK_MUTED }}
                >
                  {t("refreshing")}
                </Typography>
              </Box>
            )}
          </Box>

          {/* ADMIN TARGET FORM */}
          {isAdmin && (
            <>
              <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: HAIRLINE }} />

              <Box
                component="section"
                aria-labelledby={formHeadingId}
                sx={{ maxWidth: 720 }}
              >
                <Typography
                  component="h3"
                  id={formHeadingId}
                  sx={{
                    color: INK,
                    fontSize: 17,
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {target ? t("updateTarget") : t("setMonthlyTarget")}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    mb: 2.5,
                    color: INK_MUTED,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {t("targetMonth", { month: selectedMonth })}
                </Typography>

                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    name="targetAmount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required
                        type="number"
                        label={t("form.targetAmount")}
                        placeholder={t("form.targetAmountPlaceholder")}
                        error={Boolean(errors.targetAmount)}
                        helperText={errors.targetAmount?.message}
                        slotProps={{
                          htmlInput: { min: 1, inputMode: "numeric" },
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box
                                  component="span"
                                  sx={{ color: INK_MUTED, fontWeight: 600 }}
                                >
                                  ¥
                                </Box>
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{ ...fieldSx, mb: 2.5 }}
                      />
                    )}
                  />

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
                        placeholder={t("form.notePlaceholder")}
                        error={Boolean(errors.note)}
                        helperText={errors.note?.message}
                        sx={fieldSx}
                      />
                    )}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "stretch", sm: "flex-end" },
                      mt: 3,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      disableElevation
                      startIcon={
                        saving ? (
                          <CircularProgress size={17} color="inherit" />
                        ) : (
                          <SaveOutlinedIcon />
                        )
                      }
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        minHeight: 44,
                        px: 2.75,
                        bgcolor: BRAND,
                        color: "#ffffff",
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": { bgcolor: BRAND_HOVER, boxShadow: "none" },
                        "&.Mui-disabled": {
                          bgcolor: BRAND,
                          color: "#ffffff",
                          opacity: 0.65,
                        },
                        ...focusRing,
                      }}
                    >
                      {saving
                        ? t("saving")
                        : target
                          ? t("updateTarget")
                          : t("setTarget")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Performance;