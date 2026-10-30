"use client";

import { useId } from "react";
import { createTranslator, useLocale } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

import type { PerformanceHistoryProps, PerformanceHistoryStatus } from "./type";

import { usePerformanceHistoryHook } from "./hook";

const messages = {
  en: {
    title: "Performance History",
    description: "Monthly target and collection history for this staff member.",
    empty: "No performance history is available yet.",
    refreshing: "Refreshing...",
    loadFailed: "Failed to load performance history.",
    columns: {
      month: "Month",
      target: "Target",
      collected: "Collected",
      remaining: "Remaining",
      achievement: "Achievement",
      payments: "Payments",
      clients: "Clients",
      status: "Status"
    },
    status: {
      noTarget: "No Target",
      notStarted: "Not Started",
      inProgress: "In Progress",
      achieved: "Achieved"
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
    title: "実績履歴",
    description: "このスタッフの月間目標と入金履歴を確認できます。",
    empty: "実績履歴はまだありません。",
    refreshing: "更新中...",
    loadFailed: "実績履歴を読み込めませんでした。",
    columns: {
      month: "月",
      target: "目標",
      collected: "入金額",
      remaining: "残額",
      achievement: "達成率",
      payments: "入金件数",
      clients: "顧客数",
      status: "ステータス"
    },
    status: {
      noTarget: "目標なし",
      notStarted: "未開始",
      inProgress: "進行中",
      achieved: "達成"
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
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const INK_FAINT = "#6B7280";
const SURFACE_TINT = "#FAFAF9";

/** Below this width the table becomes a stack of month cards. */
const TABLE_BREAKPOINT = "lg" as const;

type HistoryItem = ReturnType<typeof usePerformanceHistoryHook>["history"][number];

// =================================================
// FORMATTERS
// =================================================

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount || 0));
};

// 2026-09 -> September 2026
const formatMonth = (month: string, locale: string) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return month;
  }

  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(date);
};

const clampPercent = (value: number) =>
  Math.min(Math.max(Number(value) || 0, 0), 100);

// =================================================
// STATUS TONES
// =================================================

const STATUS_TONE: Record<
  PerformanceHistoryStatus,
  { fg: string; bg: string; dot: string; bar: string }
> = {
  Achieved: { fg: BRAND_DARK, bg: BRAND_SOFT, dot: BRAND, bar: BRAND },
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

const toneFor = (status: PerformanceHistoryStatus) =>
  STATUS_TONE[status] ?? STATUS_TONE["Not Started"];

// =================================================
// SMALL PIECES
// =================================================

function StatusPill({
  status,
  label,
}: {
  status: PerformanceHistoryStatus;
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
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: tone.dot,
        }}
      />
      {label}
    </Box>
  );
}

function ProgressBar({
  percent,
  status,
  label,
  width = "100%",
}: {
  percent: number;
  status: PerformanceHistoryStatus;
  label: string;
  width?: number | string;
}) {
  const value = clampPercent(percent);

  return (
    <Box
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      sx={{
        width,
        height: 6,
        borderRadius: 999,
        bgcolor: "rgba(17, 24, 39, 0.07)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${value}%`,
          height: "100%",
          borderRadius: 999,
          bgcolor: toneFor(status).bar,
          transition: "width 400ms ease",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      />
    </Box>
  );
}

function MetaItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="dt"
        sx={{ fontSize: 12.5, fontWeight: 500, color: INK_FAINT, mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography
        component="dd"
        sx={{
          m: 0,
          fontSize: 14.5,
          fontWeight: 600,
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

export default function PerformanceHistory({
  staffId,
}: PerformanceHistoryProps) {
  const t = useLocalTranslations();
  const locale = useLocale();
  const headingId = useId();

  const { history, isLoading, isFetching, loadError } =
    usePerformanceHistoryHook(staffId);

  const performanceStatusLabel: Record<PerformanceHistoryStatus, string> = {
    "No Target": t("status.noTarget"),
    "Not Started": t("status.notStarted"),
    "In Progress": t("status.inProgress"),
    Achieved: t("status.achieved"),
  };

  const headCellSx = {
    py: 1.5,
    px: 2,
    fontSize: 12.5,
    fontWeight: 600,
    color: INK_MUTED,
    whiteSpace: "nowrap",
    bgcolor: SURFACE_TINT,
    borderBottom: `1px solid ${HAIRLINE}`,
    "&:first-of-type": { pl: 2.5 },
    "&:last-of-type": { pr: 2.5 },
  } as const;

  const bodyCellSx = {
    py: 1.75,
    px: 2,
    fontSize: 14,
    color: INK,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    "&:first-of-type": { pl: 2.5 },
    "&:last-of-type": { pr: 2.5 },
  } as const;

  const renderTable = (rows: HistoryItem[]) => (
    <TableContainer
      sx={{
        display: { xs: "none", [TABLE_BREAKPOINT]: "block" },
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 2.5,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Table
        sx={{
          minWidth: 860,
          "& .MuiTableCell-root": { borderColor: HAIRLINE },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={headCellSx}>{t("columns.month")}</TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("columns.target")}
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("columns.collected")}
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("columns.remaining")}
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("columns.achievement")}
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("columns.payments")}
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("columns.clients")}
            </TableCell>
            <TableCell sx={headCellSx}>{t("columns.status")}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((item) => (
            <TableRow
              key={item.month}
              hover
              sx={{
                transition: "background-color 200ms ease",
                "&:last-of-type td": { borderBottom: 0 },
                "&.MuiTableRow-hover:hover": {
                  bgcolor: "rgba(16, 122, 100, 0.04)",
                },
              }}
            >
              <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>
                {formatMonth(item.month, locale)}
              </TableCell>

              <TableCell align="right" sx={bodyCellSx}>
                ¥{formatAmount(item.targetAmount)}
              </TableCell>

              <TableCell
                align="right"
                sx={{ ...bodyCellSx, color: BRAND, fontWeight: 600 }}
              >
                ¥{formatAmount(item.totalCollected)}
              </TableCell>

              <TableCell align="right" sx={bodyCellSx}>
                ¥{formatAmount(item.remainingAmount)}
              </TableCell>

              <TableCell align="right" sx={bodyCellSx}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 0.75,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {Number(item.achievementPercentage ?? 0).toLocaleString()}%
                  </Typography>
                  <ProgressBar
                    percent={item.achievementPercentage}
                    status={item.status}
                    label={t("columns.achievement")}
                    width={96}
                  />
                </Box>
              </TableCell>

              <TableCell align="right" sx={bodyCellSx}>
                {item.paymentCount}
              </TableCell>

              <TableCell align="right" sx={bodyCellSx}>
                {item.clientCount}
              </TableCell>

              <TableCell sx={bodyCellSx}>
                <StatusPill
                  status={item.status}
                  label={performanceStatusLabel[item.status]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCards = (rows: HistoryItem[]) => (
    <Box
      component="ul"
      sx={{
        display: { xs: "flex", [TABLE_BREAKPOINT]: "none" },
        flexDirection: "column",
        gap: 1.5,
        m: 0,
        p: 0,
        listStyle: "none",
      }}
    >
      {rows.map((item) => (
        <Box
          component="li"
          key={item.month}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: { xs: 2, sm: 2.5 },
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 2.5,
            bgcolor: "#ffffff",
          }}
        >
          {/* MONTH + STATUS */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Typography
              component="h3"
              sx={{ fontSize: 15.5, fontWeight: 600, color: INK }}
            >
              {formatMonth(item.month, locale)}
            </Typography>
            <StatusPill
              status={item.status}
              label={performanceStatusLabel[item.status]}
            />
          </Box>

          {/* ACHIEVEMENT */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                mb: 0.75,
              }}
            >
              <Typography
                sx={{ fontSize: 12.5, fontWeight: 500, color: INK_FAINT }}
              >
                {t("columns.achievement")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: INK,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Number(item.achievementPercentage ?? 0).toLocaleString()}%
              </Typography>
            </Box>
            <ProgressBar
              percent={item.achievementPercentage}
              status={item.status}
              label={t("columns.achievement")}
            />
          </Box>

          {/* NUMBERS */}
          <Box
            component="dl"
            sx={{
              m: 0,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <MetaItem
              label={t("columns.target")}
              value={`¥${formatAmount(item.targetAmount)}`}
            />
            <MetaItem
              label={t("columns.collected")}
              value={`¥${formatAmount(item.totalCollected)}`}
              accent
            />
            <MetaItem
              label={t("columns.remaining")}
              value={`¥${formatAmount(item.remainingAmount)}`}
            />
            <MetaItem label={t("columns.payments")} value={item.paymentCount} />
            <MetaItem label={t("columns.clients")} value={item.clientCount} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      sx={{ width: "100%", minWidth: 0 }}
    >
      {/* HEADER */}
      <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
        <Typography
          component="h2"
          id={headingId}
          sx={{
            color: INK,
            fontSize: { xs: 18, md: 20 },
            lineHeight: 1.3,
            fontWeight: 600,
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

      {/* ERROR */}
      {loadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: 2.5,
            border: "1px solid rgba(220, 38, 38, 0.12)",
            bgcolor: "#FEF2F2",
            color: "#991B1B",
            boxShadow: "none",
            "& .MuiAlert-icon": { color: "#DC2626" },
          }}
        >
          {translateServerMessage(loadError, locale, t, "loadFailed")}
        </Alert>
      )}

      {/* CONTENT */}
      {isLoading ? (
        <Box
          aria-busy="true"
          sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}
        >
          <Skeleton variant="rounded" height={44} />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={56} />
          ))}
        </Box>
      ) : history.length === 0 ? (
        <Box
          sx={{
            border: "1px dashed rgba(16, 122, 100, 0.28)",
            borderRadius: 2.5,
            bgcolor: SURFACE_TINT,
            py: { xs: 5, sm: 6 },
            px: 2,
            textAlign: "center",
          }}
        >
          <Box
            aria-hidden
            sx={{
              display: "grid",
              placeItems: "center",
              width: 44,
              height: 44,
              mx: "auto",
              mb: 1.5,
              borderRadius: 2.5,
              bgcolor: BRAND_SOFT,
              color: BRAND,
            }}
          >
            <BarChartRoundedIcon fontSize="small" />
          </Box>

          <Typography
            sx={{
              color: INK_MUTED,
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 380,
              mx: "auto",
            }}
          >
            {t("empty")}
          </Typography>
        </Box>
      ) : (
        <>
          {renderTable(history)}
          {renderCards(history)}
        </>
      )}

      {/* REFRESHING */}
      {isFetching && !isLoading && (
        <Box
          role="status"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 0.75,
            mt: 1.25,
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
            sx={{ color: INK_MUTED, fontSize: 12.5, fontWeight: 500 }}
          >
            {t("refreshing")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
type LocalTranslator = ReturnType<typeof useLocalTranslations>;

function translateServerMessage(message: string, locale: string, t: LocalTranslator, fallback: "loadFailed") {
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
