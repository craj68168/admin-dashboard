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
import { createTranslator, useLocale } from "next-intl";

import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useClientFeesHook } from "./hook";

import type { ClientFeesProps, PaymentProgressStatus } from "./type";

const messages = {
  "en": {
    "title": "Client Fees",
    "description": "Required fees, payments and outstanding balances.",
    "feeRequirements": "Fee Requirements",
    "empty": "No fee requirements have been created.",
    "due": "Due: {date}",
    "createdBy": "Created By",
    "summary": {
      "totalExpected": "Total Expected",
      "totalPaid": "Total Paid",
      "outstanding": "Outstanding",
      "expected": "Expected",
      "paid": "Paid"
    },
    "form": {
      "addTitle": "Add Fee",
      "editTitle": "Edit Fee",
      "feeName": "Fee Name",
      "expectedAmount": "Expected Amount",
      "dueDate": "Due Date",
      "note": "Note"
    },
    "actions": {
      "edit": "Edit",
      "cancel": "Cancel",
      "cancelEdit": "Cancel Edit",
      "saving": "Saving...",
      "addFee": "Add Fee",
      "updateFee": "Update Fee"
    },
    "dialog": {
      "title": "Cancel Fee",
      "description": "Are you sure you want to cancel {feeName}? The fee will remain in the financial history.",
      "confirm": "Cancel Fee",
      "keep": "Keep Fee"
    },
    "statuses": {
      "Active": "Active",
      "Cancelled": "Cancelled"
    },
    "paymentStatuses": {
      "Unpaid": "Unpaid",
      "Partial": "Partial",
      "Paid": "Paid",
      "Cancelled": "Cancelled"
    },
    "validation": {
      "feeNameRequired": "Fee name is required",
      "feeNameMax": "Fee name cannot exceed 150 characters",
      "expectedAmountRequired": "Expected amount is required",
      "expectedAmountPositive": "Expected amount must be greater than 0",
      "noteMax": "Note cannot exceed 3000 characters",
      "invalid": "Please check this field."
    },
    "messages": {
      "created": "Fee created successfully.",
      "updated": "Fee updated successfully.",
      "cancelled": "Fee cancelled successfully.",
      "saveFailed": "Failed to save fee.",
      "cancelFailed": "Failed to cancel fee.",
      "loadFailed": "Failed to load client fees."
    },
    "showLess": "Show less",
    "showAll": "Show all {count} fees",
    "minimumExpectedAmount": "Expected amount cannot be less than the already paid amount of {amount}.",
    "serverMessages": {
      "aCancelledFeeCannotBeEdited": "A cancelled fee cannot be edited.",
      "anActiveFeeWithThisNameAlreadyExistsForThisClient": "An active fee with this name already exists for this client.",
      "authenticatedUserIDWasNotFound": "Authenticated user ID was not found.",
      "authenticatedUserInformationIsMissing": "Authenticated user information is missing.",
      "authenticationRequired": "Authentication required",
      "clientIDIsRequired": "Client ID is required.",
      "clientFeeRequirementCancelledSuccessfully": "Client fee requirement cancelled successfully.",
      "clientFeeRequirementCreatedSuccessfully": "Client fee requirement created successfully.",
      "clientFeeRequirementUpdatedSuccessfully": "Client fee requirement updated successfully.",
      "clientNotFound": "Client not found.",
      "duplicateDataExists": "Duplicate data exists.",
      "expectedAmountMustBeGreaterThan0": "Expected amount must be greater than 0.",
      "failedToCancelClientFeeRequirement": "Failed to cancel client fee requirement.",
      "failedToCreateClientFeeRequirement": "Failed to create client fee requirement.",
      "failedToGetClientFees": "Failed to get client fees.",
      "failedToUpdateClientFeeRequirement": "Failed to update client fee requirement.",
      "feeIsAlreadyCancelled": "Fee is already cancelled.",
      "feeNameCannotBeEmpty": "Fee name cannot be empty.",
      "feeNameCannotExceed150Characters": "Fee name cannot exceed 150 characters.",
      "feeNameIsRequired": "Fee name is required.",
      "feeRequirementNotFound": "Fee requirement not found.",
      "internalServerError": "Internal Server Error",
      "invalidDueDate": "Invalid due date.",
      "invalidFeeID": "Invalid fee ID.",
      "invalidOrExpiredToken": "Invalid or expired token",
      "invalidTokenFormat": "Invalid token format",
      "invalidUserRole": "Invalid user role",
      "noteCannotExceed3000Characters": "Note cannot exceed 3000 characters.",
      "serverError": "Server error",
      "tokenExpired": "Token expired",
      "tokenNotProvided": "Token not provided",
      "userAccountNoLongerExists": "User account no longer exists",
      "youAreNotAuthorizedToAccessThisResource": "You are not authorized to access this resource",
      "youAreNotAuthorizedToViewThisClientSFees": "You are not authorized to view this client's fees.",
      "yourAccountHasBeenDisabled": "Your account has been disabled",
      "somethingWentWrong": "Something went wrong",
      "networkError": "Network Error",
      "failedToFetch": "Failed to fetch",
      "requestAborted": "Request aborted",
      "canceled": "canceled",
      "validationError": "Please check the submitted information."
    },
    "requestFailed": "Request failed with status code {status}.",
    "requestTimeout": "The request timed out. Please try again."
  },
  "ja": {
    "title": "顧客料金",
    "description": "必要な料金、支払い、未払い残高を管理します。",
    "feeRequirements": "料金項目",
    "empty": "料金項目はまだ作成されていません。",
    "due": "期日: {date}",
    "createdBy": "作成者",
    "summary": {
      "totalExpected": "予定総額",
      "totalPaid": "支払総額",
      "outstanding": "未払い",
      "expected": "予定額",
      "paid": "支払済み"
    },
    "form": {
      "addTitle": "料金を追加",
      "editTitle": "料金を編集",
      "feeName": "料金名",
      "expectedAmount": "予定金額",
      "dueDate": "期日",
      "note": "メモ"
    },
    "actions": {
      "edit": "編集",
      "cancel": "キャンセル",
      "cancelEdit": "編集をキャンセル",
      "saving": "保存中...",
      "addFee": "料金を追加",
      "updateFee": "料金を更新"
    },
    "dialog": {
      "title": "料金をキャンセル",
      "description": "「{feeName}」をキャンセルしてもよろしいですか？この料金は財務履歴に残ります。",
      "confirm": "料金をキャンセル",
      "keep": "料金を保持"
    },
    "statuses": {
      "Active": "有効",
      "Cancelled": "キャンセル済み"
    },
    "paymentStatuses": {
      "Unpaid": "未払い",
      "Partial": "一部支払い",
      "Paid": "支払済み",
      "Cancelled": "キャンセル済み"
    },
    "validation": {
      "feeNameRequired": "料金名は必須です",
      "feeNameMax": "料金名は150文字以内で入力してください",
      "expectedAmountRequired": "予定金額は必須です",
      "expectedAmountPositive": "予定金額は0より大きい必要があります",
      "noteMax": "メモは3000文字以内で入力してください",
      "invalid": "入力内容を確認してください。"
    },
    "messages": {
      "created": "料金を作成しました。",
      "updated": "料金を更新しました。",
      "cancelled": "料金をキャンセルしました。",
      "saveFailed": "料金を保存できませんでした。",
      "cancelFailed": "料金をキャンセルできませんでした。",
      "loadFailed": "顧客料金を読み込めませんでした。"
    },
    "showLess": "表示を減らす",
    "showAll": "料金をすべて表示（{count}件）",
    "minimumExpectedAmount": "予定額は入金済みの金額{amount}以上にしてください。",
    "serverMessages": {
      "aCancelledFeeCannotBeEdited": "キャンセル済みの料金は編集できません。",
      "anActiveFeeWithThisNameAlreadyExistsForThisClient": "この顧客には同じ名前の有効な料金がすでに存在します。",
      "authenticatedUserIDWasNotFound": "認証済みユーザーのIDが見つかりません。",
      "authenticatedUserInformationIsMissing": "認証済みユーザーの情報がありません。",
      "authenticationRequired": "ログインが必要です。",
      "clientIDIsRequired": "顧客IDを指定してください。",
      "clientFeeRequirementCancelledSuccessfully": "顧客の料金設定をキャンセルしました。",
      "clientFeeRequirementCreatedSuccessfully": "顧客の料金設定を作成しました。",
      "clientFeeRequirementUpdatedSuccessfully": "顧客の料金設定を更新しました。",
      "clientNotFound": "顧客が見つかりません。",
      "duplicateDataExists": "データが重複しています。",
      "expectedAmountMustBeGreaterThan0": "予定額は0より大きい金額で入力してください。",
      "failedToCancelClientFeeRequirement": "顧客の料金設定をキャンセルできませんでした。",
      "failedToCreateClientFeeRequirement": "顧客の料金設定を作成できませんでした。",
      "failedToGetClientFees": "顧客の料金を取得できませんでした。",
      "failedToUpdateClientFeeRequirement": "顧客の料金設定を更新できませんでした。",
      "feeIsAlreadyCancelled": "この料金はすでにキャンセルされています。",
      "feeNameCannotBeEmpty": "料金名を入力してください。",
      "feeNameCannotExceed150Characters": "料金名は150文字以内で入力してください。",
      "feeNameIsRequired": "料金名を入力してください。",
      "feeRequirementNotFound": "料金設定が見つかりません。",
      "internalServerError": "サーバー内部でエラーが発生しました。",
      "invalidDueDate": "支払期限が正しくありません。",
      "invalidFeeID": "料金IDが正しくありません。",
      "invalidOrExpiredToken": "認証トークンが無効か、期限切れです。",
      "invalidTokenFormat": "認証トークンの形式が正しくありません。",
      "invalidUserRole": "ユーザー権限が正しくありません。",
      "noteCannotExceed3000Characters": "メモは3000文字以内で入力してください。",
      "serverError": "サーバーエラーが発生しました。",
      "tokenExpired": "認証トークンの有効期限が切れています。",
      "tokenNotProvided": "認証トークンが指定されていません。",
      "userAccountNoLongerExists": "ユーザーアカウントが存在しません。",
      "youAreNotAuthorizedToAccessThisResource": "この情報にアクセスする権限がありません。",
      "youAreNotAuthorizedToViewThisClientSFees": "この顧客の料金を閲覧する権限がありません。",
      "yourAccountHasBeenDisabled": "アカウントは無効になっています。",
      "somethingWentWrong": "エラーが発生しました。もう一度お試しください。",
      "networkError": "ネットワークに接続できません。接続を確認してください。",
      "failedToFetch": "データを取得できませんでした。接続を確認してください。",
      "requestAborted": "リクエストが中断されました。",
      "canceled": "リクエストがキャンセルされました。",
      "validationError": "送信した情報に誤りがあります。入力内容を確認してください。"
    },
    "requestFailed": "リクエストに失敗しました（ステータスコード：{status}）。",
    "requestTimeout": "リクエストがタイムアウトしました。もう一度お試しください。"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({locale, messages: messages[locale === "ja" ? "ja" : "en"]});
}

const normalizeMessage = (value: string) => value.trim().replace(/\.+$/, "").toLowerCase();
const serverMessageKeys = new Map(
  Object.entries(messages.en.serverMessages).map(([key, value]) => [normalizeMessage(value), key]),
);

// Resolve stored message keys and known API messages when rendering so locale changes
// also update messages already on screen.
function translateServerMessage(
  message: string | null | undefined,
  locale: string,
  t: ReturnType<typeof useLocalTranslations>,
  fallback: keyof typeof messages.en.messages,
) {
  if (typeof message !== "string" || !message.trim()) return t(("messages." + fallback) as never);
  if (message.startsWith("messages.") && t.has(message as never)) return t(message as never);
  const key = serverMessageKeys.get(normalizeMessage(message));
  if (key) return t(("serverMessages." + key) as never);
  const httpError = /^Request failed with status code (\d+)\.?$/i.exec(message.trim());
  if (httpError) return t("requestFailed", {status: httpError[1]});
  if (/^timeout of \d+ms exceeded/i.test(message)) return t("requestTimeout");
  const minimum = /^Expected amount cannot be less than the already paid amount of (.+?)\.?$/i.exec(message.trim());
  if (minimum) return t("minimumExpectedAmount", {amount: minimum[1]});
  if (locale !== "ja" || /^[\u3040-\u30ff\u3400-\u9fff]/u.test(message)) return message;
  if (/validation failed|cast to .+ failed/i.test(message)) return t("serverMessages.validationError");
  if (/E11000|duplicate key/i.test(message)) return t("serverMessages.duplicateDataExists");
  return t(("messages." + fallback) as never);
}

function translateValidationError(message: string | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!message) return undefined;
  return t.has(message as never) ? t(message as never) : t("validation.invalid");
}


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

const formatTokyoDate = (value: string | null | undefined, locale: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-CA", {
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
  const locale = useLocale();
  const t = useLocalTranslations();

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
          {translateServerMessage(serverError, locale, t, "saveFailed")}
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
          {translateServerMessage(successMessage, locale, t, "created")}
        </Alert>
      )}

      {loadError && (
        <Alert severity="error" sx={{ ...errorAlertSx, mb: 1.5 }}>
          {translateServerMessage(loadError, locale, t, "loadFailed")}
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
                            {t("due", { date: formatTokyoDate(fee.dueDate, locale) })}
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
                      ? t("showLess")
                      : t("showAll", {count: fees.length})}
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
                    helperText={translateValidationError(errors.feeName?.message, t)}
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
                      helperText={translateValidationError(errors.expectedAmount?.message, t)}
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
                    helperText={translateValidationError(errors.note?.message, t)}
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