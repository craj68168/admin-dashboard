"use client";

import { useId, type ReactNode } from "react";
import { createTranslator, useLocale } from "next-intl";
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

const messages = {
  en: {
    title: "Collection Performance",
    description: "Monthly payment collection performance for this staff member.",
    month: "Month",
    monthlyProgress: "Monthly Progress",
    payments: "Payments",
    clients: "Clients",
    refreshing: "Refreshing...",
    updateTarget: "Update Target",
    setMonthlyTarget: "Set Monthly Target",
    setTarget: "Set Target",
    targetMonth: "Target month: {month}",
    saving: "Saving...",
    summary: {
      target: "Target",
      collected: "Collected",
      remaining: "Remaining",
      achievement: "Achievement"
    },
    form: {
      targetAmount: "Target Amount",
      targetAmountPlaceholder: "1000000",
      note: "Note",
      notePlaceholder: "Optional target note..."
    },
    status: {
      noTarget: "No Target",
      notStarted: "Not Started",
      inProgress: "In Progress",
      achieved: "Achieved"
    },
    validation: {
      targetAmountRequired: "Target amount is required",
      targetAmountPositive: "Target amount must be greater than 0",
      noteMax: "Note cannot exceed 2000 characters",
      invalid: "Please check this field."
    },
    messages: {
      targetUpdated: "Staff target updated successfully.",
      targetCreated: "Staff target created successfully.",
      saveFailed: "Failed to save staff target.",
      loadFailed: "Failed to load staff performance."
    },
    serverMessages: {
      aTargetAlreadyExistsForThisStaffMemberAndMonth: "A target already exists for this staff member and month.",
      authenticationRequired: "Authentication required",
      cannotAssignATargetToAnInactiveStaffMember: "Cannot assign a target to an inactive staff member.",
      failedToCreateStaffTarget: "Failed to create staff target.",
      failedToGetStaffPerformanceHistory: "Failed to get staff performance history.",
      failedToGetStaffTarget: "Failed to get staff target.",
      failedToUpdateStaffTarget: "Failed to update staff target.",
      internalServerError: "Internal Server Error",
      invalidOrExpiredToken: "Invalid or expired token",
      invalidTargetID: "Invalid target ID.",
      invalidTokenFormat: "Invalid token format",
      invalidUserRole: "Invalid user role",
      monthMustBeInYYYYMMFormat: "Month must be in YYYY-MM format.",
      noteCannotExceed2000Characters: "Note cannot exceed 2000 characters.",
      serverError: "Server error",
      staffIDIsRequired: "Staff ID is required.",
      staffNotFound: "Staff not found.",
      staffTargetCreatedSuccessfully: "Staff target created successfully.",
      staffTargetNotFound: "Staff target not found.",
      staffTargetUpdatedSuccessfully: "Staff target updated successfully.",
      targetAmountMustBeGreaterThan0: "Target amount must be greater than 0.",
      targetMonthMustBeInYYYYMMFormat: "Target month must be in YYYY-MM format.",
      tokenExpired: "Token expired",
      tokenNotProvided: "Token not provided",
      userAccountNoLongerExists: "User account no longer exists",
      youAreNotAuthorizedToAccessThisResource: "You are not authorized to access this resource",
      youAreNotAuthorizedToViewAnotherStaffMemberSPerformance: "You are not authorized to view another staff member's performance.",
      youAreNotAuthorizedToViewAnotherStaffMemberSTarget: "You are not authorized to view another staff member's target.",
      yourAccountHasBeenDisabled: "Your account has been disabled",
      networkError: "Network Error",
      failedToFetch: "Failed to fetch",
      requestAborted: "Request aborted",
      canceled: "canceled"
    },
    requestFailed: "Request failed with status code {status}.",
    requestTimeout: "The request timed out. Please try again."
  },
  ja: {
    title: "入金実績",
    description: "このスタッフの月間入金実績を確認できます。",
    month: "月",
    monthlyProgress: "月間進捗",
    payments: "入金件数",
    clients: "顧客数",
    refreshing: "更新中...",
    updateTarget: "目標を更新",
    setMonthlyTarget: "月間目標を設定",
    setTarget: "目標を設定",
    targetMonth: "対象月: {month}",
    saving: "保存中...",
    summary: {
      target: "目標",
      collected: "入金額",
      remaining: "残額",
      achievement: "達成率"
    },
    form: {
      targetAmount: "目標金額",
      targetAmountPlaceholder: "1000000",
      note: "メモ",
      notePlaceholder: "任意の目標メモ..."
    },
    status: {
      noTarget: "目標なし",
      notStarted: "未開始",
      inProgress: "進行中",
      achieved: "達成"
    },
    validation: {
      targetAmountRequired: "目標金額は必須です",
      targetAmountPositive: "目標金額は0より大きい値を入力してください",
      noteMax: "メモは2000文字以内で入力してください",
      invalid: "入力内容を確認してください。"
    },
    messages: {
      targetUpdated: "スタッフ目標を更新しました。",
      targetCreated: "スタッフ目標を作成しました。",
      saveFailed: "スタッフ目標を保存できませんでした。",
      loadFailed: "スタッフ実績を読み込めませんでした。"
    },
    serverMessages: {
      aTargetAlreadyExistsForThisStaffMemberAndMonth: "このスタッフの対象月の目標はすでに存在します。",
      authenticationRequired: "ログインが必要です。",
      cannotAssignATargetToAnInactiveStaffMember: "無効なスタッフに目標を設定することはできません。",
      failedToCreateStaffTarget: "スタッフの目標を作成できませんでした。",
      failedToGetStaffPerformanceHistory: "スタッフの実績履歴を取得できませんでした。",
      failedToGetStaffTarget: "スタッフの目標を取得できませんでした。",
      failedToUpdateStaffTarget: "スタッフの目標を更新できませんでした。",
      internalServerError: "サーバー内部でエラーが発生しました。",
      invalidOrExpiredToken: "認証トークンが無効か、期限切れです。",
      invalidTargetID: "目標IDが正しくありません。",
      invalidTokenFormat: "認証トークンの形式が正しくありません。",
      invalidUserRole: "ユーザー権限が正しくありません。",
      monthMustBeInYYYYMMFormat: "月はYYYY-MM形式で入力してください。",
      noteCannotExceed2000Characters: "メモは2000文字以内で入力してください。",
      serverError: "サーバーエラーが発生しました。",
      staffIDIsRequired: "スタッフIDを指定してください。",
      staffNotFound: "スタッフが見つかりません。",
      staffTargetCreatedSuccessfully: "スタッフの目標を作成しました。",
      staffTargetNotFound: "スタッフの目標が見つかりません。",
      staffTargetUpdatedSuccessfully: "スタッフの目標を更新しました。",
      targetAmountMustBeGreaterThan0: "目標額は0より大きい金額で入力してください。",
      targetMonthMustBeInYYYYMMFormat: "目標月はYYYY-MM形式で入力してください。",
      tokenExpired: "認証トークンの有効期限が切れています。",
      tokenNotProvided: "認証トークンが指定されていません。",
      userAccountNoLongerExists: "ユーザーアカウントが存在しません。",
      youAreNotAuthorizedToAccessThisResource: "この情報にアクセスする権限がありません。",
      youAreNotAuthorizedToViewAnotherStaffMemberSPerformance: "他のスタッフの実績を閲覧する権限がありません。",
      youAreNotAuthorizedToViewAnotherStaffMemberSTarget: "他のスタッフの目標を閲覧する権限がありません。",
      yourAccountHasBeenDisabled: "アカウントは無効になっています。",
      networkError: "ネットワークに接続できません。接続を確認してください。",
      failedToFetch: "データを取得できませんでした。接続を確認してください。",
      requestAborted: "リクエストが中断されました。",
      canceled: "リクエストがキャンセルされました。"
    },
    requestFailed: "リクエストに失敗しました（ステータスコード：{status}）。",
    requestTimeout: "リクエストがタイムアウトしました。もう一度お試しください。"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
}


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
  const locale = useLocale();
  const t = useLocalTranslations();
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
          {translateServerMessage(loadError, locale, t, "messages.loadFailed")}
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
          {translateServerMessage(serverError, locale, t, "messages.saveFailed")}
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
          {translateServerMessage(successMessage.message, locale, t, successMessage.fallback)}
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
                  {t("targetMonth", { month: formatMonth(selectedMonth, locale) })}
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
                        helperText={translateValidationError(errors.targetAmount?.message, t)}
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
                        helperText={translateValidationError(errors.note?.message, t)}
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
type LocalTranslator = ReturnType<typeof useLocalTranslations>;

function translateServerMessage(message: string, locale: string, t: LocalTranslator, fallback: "messages.loadFailed" | "messages.saveFailed" | "messages.targetCreated" | "messages.targetUpdated") {
  if (!message || message === "Something went wrong") return t(fallback);
  const normalize = (value: string) => value.trim().replace(/[.!]+$/, "").toLowerCase();
  const key = (Object.keys(messages.en.serverMessages) as Array<keyof typeof messages.en.serverMessages>)
    .find((key) => normalize(messages.en.serverMessages[key]) === normalize(message));
  if (key) return t(`serverMessages.${key}`);
  const status = /^Request failed with status code (\d+)\.?$/i.exec(message);
  if (status) return t("requestFailed", { status: status[1] });
  if (/^timeout of \d+ms exceeded$/i.test(message)) return t("requestTimeout");
  return locale === "ja" ? t(fallback) : message;
}

function formatMonth(month: string, locale: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return month;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    timeZone: "Asia/Tokyo",
  }).format(new Date(`${month}-01T00:00:00+09:00`));
}

function translateValidationError(message: string | undefined, t: LocalTranslator) {
  if (!message) return undefined;
  const key = (Object.keys(messages.en.validation) as Array<keyof typeof messages.en.validation>)
    .find((key) => `validation.${key}` === message);
  return t(key ? `validation.${key}` : "validation.invalid");
}
