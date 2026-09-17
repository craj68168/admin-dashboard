"use client";

import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
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
const BRAND_BORDER = "rgba(16, 122, 100, 0.42)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const PAGE_BG = "#F7F8F6";
const CARD_BG = "#ffffff";
const DANGER = "#DC2626";
const DANGER_SOFT = "#FEF2F2";
const AMBER = "#B7791F";
const AMBER_SOFT = "#FFFBEB";
const TRANSITION = "200ms ease";
const LAYOUT_TRANSITION = "300ms ease";

const softCard = {
  bgcolor: CARD_BG,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: INK_MUTED,
    fontSize: 14,
    transition: `color ${TRANSITION}`,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: DANGER,
  },
  "& .MuiOutlinedInput-root": {
    bgcolor: CARD_BG,
    borderRadius: 2.5,
    color: INK,
    fontSize: 14,
    transition: `border-color ${TRANSITION}, background-color ${TRANSITION}`,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: HAIRLINE,
      borderWidth: "1px",
      transition: `border-color ${TRANSITION}`,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: BRAND_BORDER,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: BRAND,
      borderWidth: "1px",
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: DANGER,
      borderWidth: "1px",
    },
  },
  "& .MuiFormHelperText-root": {
    mx: 0,
    mt: 0.75,
    color: INK_MUTED,
    fontSize: 12,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: DANGER,
  },
};

const alertSx = {
  mb: 3,
  borderRadius: 2.5,
  border: `1px solid ${HAIRLINE}`,
  boxShadow: "none",
  fontSize: 14,
  alignItems: "center",
};

// =================================================
// AMOUNT
// =================================================

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

// =================================================
// STATUS COLOR
// =================================================

const getStatusColor = (
  status: PerformanceStatus,
): "default" | "info" | "warning" | "success" => {
  switch (status) {
    case "Not Started":
      return "default";

    case "In Progress":
      return "warning";

    case "Achieved":
      return "success";

    case "No Target":
    default:
      return "info";
  }
};

// =================================================
// SUMMARY CARD
// =================================================

type SummaryCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

const SummaryCard = ({ label, value, icon }: SummaryCardProps) => {
  return (
    <Box
      sx={{
        ...softCard,
        p: { xs: 2, sm: 2.5 },
        minWidth: 0,
        transition: `transform ${TRANSITION}, border-color ${TRANSITION}, box-shadow ${TRANSITION}`,
        "&:hover": {
          borderColor: BRAND_BORDER,
          transform: "translateY(-1px)",
          boxShadow:
            "0 1px 2px rgba(17,24,39,0.04), 0 16px 36px -24px rgba(17,24,39,0.34)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: INK_MUTED,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 0.75,
              color: INK,
              fontSize: { xs: 20, sm: 22 },
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: 2.5,
            bgcolor: BRAND_SOFT,
            color: BRAND,
            "& svg": {
              fontSize: 21,
            },
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
};

// =================================================
// COMPONENT
// =================================================

const Performance = ({ staffId }: PerformanceProps) => {
  const t = useTranslations("staffPerformance");

  const {
    isAdmin,

    selectedMonth,
    handleMonthChange,

    target,
    performance,

    staff,

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

  const progressValue = Math.min(
    Math.max(performance.achievementPercentage, 0),
    100,
  );

  const performanceStatusLabel: Record<PerformanceStatus, string> = {
    "No Target": t("status.noTarget"),
    "Not Started": t("status.notStarted"),
    "In Progress": t("status.inProgress"),
    Achieved: t("status.achieved"),
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: PAGE_BG,
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1320,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          transition: `padding ${LAYOUT_TRANSITION}`,
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: { xs: 2, md: 3 },
            mb: { xs: 2.5, sm: 3 },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                color: INK,
                fontSize: { xs: 22, sm: 24, md: 26 },
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
              }}
            >
              {t("title")}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.75,
                color: INK_MUTED,
                fontSize: { xs: 14, sm: 15 },
                lineHeight: 1.6,
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
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{
              ...fieldSx,
              width: {
                xs: "100%",
                sm: 220,
              },
              flexShrink: 0,
            }}
          />
        </Box>

        {loadError && (
          <Alert
            severity="error"
            sx={{
              ...alertSx,
              color: DANGER,
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
              color: DANGER,
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
              color: BRAND,
              bgcolor: BRAND_SOFT,
              "& .MuiAlert-icon": { color: BRAND },
            }}
          >
            {successMessage}
          </Alert>
        )}

        {isPerformanceLoading ? (
          <Box
            sx={{
              ...softCard,
              minHeight: 220,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={30} sx={{ color: BRAND }} />
          </Box>
        ) : (
          <>
            {/* STAFF / STATUS */}

            <Box
              sx={{
                ...softCard,
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                p: { xs: 2, sm: 2.5 },
                mb: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: INK,
                    fontSize: 17,
                    fontWeight: 600,
                    lineHeight: 1.35,
                  }}
                >
                  {staff?.name || staffId}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.35,
                    color: INK_MUTED,
                    fontSize: 13,
                    lineHeight: 1.5,
                    overflowWrap: "anywhere",
                  }}
                >
                  {staffId}
                </Typography>
              </Box>

              <Chip
                label={performanceStatusLabel[performance.status]}
                color={getStatusColor(performance.status)}
                sx={{
                  height: 30,
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  border: "1px solid transparent",
                  transition: `background-color ${TRANSITION}, color ${TRANSITION}, border-color ${TRANSITION}`,
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                  "&.MuiChip-colorSuccess": {
                    color: BRAND,
                    bgcolor: BRAND_SOFT,
                    borderColor: HAIRLINE,
                  },
                  "&.MuiChip-colorWarning": {
                    color: AMBER,
                    bgcolor: AMBER_SOFT,
                    borderColor: HAIRLINE,
                  },
                  "&.MuiChip-colorInfo": {
                    color: BRAND,
                    bgcolor: BRAND_SOFT,
                    borderColor: HAIRLINE,
                  },
                  "&.MuiChip-colorDefault": {
                    color: DANGER,
                    bgcolor: DANGER_SOFT,
                    borderColor: HAIRLINE,
                  },
                }}
              />
            </Box>

            {/* SUMMARY CARDS */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
                mb: 2,
                transition: `grid-template-columns ${LAYOUT_TRANSITION}`,
              }}
            >
              <SummaryCard
                label={t("summary.target")}
                value={`¥${formatAmount(performance.targetAmount)}`}
                icon={<TrackChangesOutlinedIcon />}
              />

              <SummaryCard
                label={t("summary.collected")}
                value={`¥${formatAmount(performance.totalCollected)}`}
                icon={<PaymentsOutlinedIcon />}
              />

              <SummaryCard
                label={t("summary.remaining")}
                value={`¥${formatAmount(performance.remainingAmount)}`}
                icon={<AccountBalanceWalletOutlinedIcon />}
              />

              <SummaryCard
                label={t("summary.achievement")}
                value={`${performance.achievementPercentage}%`}
                icon={<PercentOutlinedIcon />}
              />
            </Box>

            {/* PROGRESS BAR */}

            <Box
              sx={{
                ...softCard,
                p: { xs: 2, sm: 2.5, md: 3 },
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: INK,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {t("monthlyProgress")}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: BRAND,
                    fontSize: 15,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {performance.achievementPercentage}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: BRAND_SOFT,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    bgcolor: BRAND,
                    transition: `transform ${LAYOUT_TRANSITION}`,
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2.5, sm: 4 },
                  flexWrap: "wrap",
                  mt: 2.25,
                  pt: 2,
                  borderTop: `1px solid ${HAIRLINE}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: INK_MUTED, fontSize: 14 }}
                >
                  <Box component="strong" sx={{ color: INK, fontWeight: 600 }}>
                    {t("payments")}:
                  </Box>{" "}
                  {performance.paymentCount}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: INK_MUTED, fontSize: 14 }}
                >
                  <Box component="strong" sx={{ color: INK, fontWeight: 600 }}>
                    {t("clients")}:
                  </Box>{" "}
                  {performance.clientCount}
                </Typography>
              </Box>

              {isPerformanceFetching && !isPerformanceLoading && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1.25,
                    color: INK_MUTED,
                    fontSize: 12,
                  }}
                >
                  {t("refreshing")}
                </Typography>
              )}
            </Box>

            {/* ADMIN TARGET FORM */}

            {isAdmin && (
              <Box
                sx={{
                  ...softCard,
                  width: "100%",
                  maxWidth: 900,
                  p: { xs: 2, sm: 2.5, md: 3 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 0.5,
                    color: INK,
                    fontSize: 17,
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {target ? t("updateTarget") : t("setMonthlyTarget")}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 3,
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
                          htmlInput: {
                            min: 1,
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
                        minHeight: 42,
                        px: 2.5,
                        bgcolor: BRAND,
                        color: CARD_BG,
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        boxShadow: "none",
                        transition: `background-color ${TRANSITION}, transform ${TRANSITION}, box-shadow ${TRANSITION}`,
                        "&:hover": {
                          bgcolor: BRAND_HOVER,
                          boxShadow: "none",
                        },
                        "&:focus-visible": {
                          outline: `2px solid ${BRAND}`,
                          outlineOffset: 2,
                        },
                        "&.Mui-disabled": {
                          bgcolor: BRAND_BORDER,
                          color: CARD_BG,
                        },
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
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Performance;
