"use client";

import { useState, type ReactNode } from "react";
import { createTranslator, useLocale } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { usePaymentsHook } from "./hook";

import type { PaymentsProps } from "./type";

const messages = {
  "en": {
    "title": "Payments",
    "description": "Payments are recorded automatically when a paid stage is completed.",
    "totalPayments": "Total Payments",
    "history": "Payment History",
    "empty": "No payments recorded yet.",
    "feeExpected": "Fee Expected: ¥{amount}",
    "noAvailableFees": "There are no active fees with an outstanding balance.",
    "fields": {
      "date": "Date",
      "method": "Method",
      "creditedStaff": "Credited Staff",
      "recordedBy": "Recorded By",
      "stageAtPayment": "Stage at Payment",
      "reference": "Reference",
      "receipt": "Receipt",
      "bank": "Bank",
      "stage": "Stage",
      "amount": "Amount",
      "status": "Status",
      "staff": "Staff"
    },
    "summary": {
      "expected": "Expected",
      "alreadyPaid": "Already Paid",
      "outstanding": "Outstanding",
      "status": "Status",
      "totalCollected": "Total collected",
      "completedPayments": "Completed payments"
    },
    "form": {
      "title": "Add Payment",
      "fee": "Fee",
      "selectFee": "Select fee",
      "feeOption": "{feeName} - Outstanding ¥{amount}",
      "amountPaying": "Amount Paying",
      "paymentMethod": "Payment Method",
      "selectPaymentMethod": "Select payment method",
      "paymentDate": "Payment Date",
      "referenceNumber": "Reference Number",
      "receiptNumber": "Receipt Number",
      "bankName": "Bank Name",
      "note": "Note"
    },
    "actions": {
      "saving": "Saving...",
      "savePayment": "Save Payment",
      "showLess": "Show less",
      "showAll": "Show all {count} payments"
    },
    "statuses": {
      "Completed": "Completed",
      "Cancelled": "Cancelled",
      "Refunded": "Refunded"
    },
    "paymentStatuses": {
      "Unpaid": "Unpaid",
      "Partial": "Partial",
      "Paid": "Paid",
      "Cancelled": "Cancelled"
    },
    "methods": {
      "Cash": "Cash",
      "Bank Transfer": "Bank Transfer",
      "Online Payment": "Online Payment",
      "Cheque": "Cheque",
      "Other": "Other"
    },
    "validation": {
      "feeRequired": "Please select a fee",
      "amountRequired": "Amount is required",
      "amountPositive": "Amount must be greater than 0",
      "paymentMethodRequired": "Payment method is required",
      "paymentDateRequired": "Payment date is required",
      "referenceNumberMax": "Reference number is too long",
      "receiptNumberMax": "Receipt number is too long",
      "bankNameMax": "Bank name is too long",
      "noteMax": "Note cannot exceed 3000 characters"
    },
    "messages": {
      "selectValidFee": "Please select a valid fee.",
      "feeInactive": "This fee is no longer active.",
      "amountExceeds": "Amount cannot exceed the outstanding balance of ¥{amount}.",
      "recorded": "Payment recorded successfully.",
      "recordedFullyPaid": "Payment recorded successfully. This fee is now fully paid.",
      "recordFailed": "Failed to record payment.",
      "loadFailed": "Failed to load payments.",
      "loadFeesFailed": "Failed to load client fees."
    },
    "stages": {
      "registeredPaid": "Registered / Paid",
      "vacancySearching": "Vacancy Searching",
      "interviewFixedPreparation": "Interview Fixed / Preparation",
      "interviewFailed": "Interview Failed",
      "jobOfferReceived": "Naitei / Job Offer Received",
      "jobOfferAccepted": "Job Offer Accepted",
      "jobOfferNotAccepted": "Job Offer Not Accepted",
      "visaDocumentsSubmitted": "Visa Documents Submitted",
      "visaAppliedResultWaiting": "Visa Applied / Result Waiting",
      "visaApproved": "Visa Approved",
      "visaRejected": "Visa Rejected",
      "companyJoining": "Waiting for Nyusha / Company Joining",
      "employmentStartedCompanyJoined": "Employment Started / Company Joined",
      "visaRenewal1Year": "Visa Renewal - 1 Year",
      "visaRenewal3Years": "Visa Renewal - 3 Years",
      "visaRenewal5Years": "Visa Renewal - 5 Years",
      "returnToNepal": "Return to Nepal",
      "new": "New",
      "documentCollection": "Document Collection",
      "processing": "Processing",
      "cOEApplied": "COE Applied",
      "cOEReceived": "COE Received",
      "visaApplied": "Visa Applied",
      "departed": "Departed",
      "arrivedInJapan": "Arrived in Japan",
      "registrationPending": "Registration Pending",
      "registeredVacancySearching": "Registered / Vacancy Searching",
      "legacyPayment": "Legacy Payment"
    },
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "Authenticated user ID was not found.",
      "authenticatedUserInformationIsMissing": "Authenticated user information is missing.",
      "authenticationRequired": "Authentication required",
      "clientIDIsRequired": "Client ID is required.",
      "clientNotFound": "Client not found.",
      "duplicateDataExists": "Duplicate data exists.",
      "failedToGetClientPayments": "Failed to get client payments.",
      "internalServerError": "Internal Server Error",
      "invalidOrExpiredToken": "Invalid or expired token",
      "invalidTokenFormat": "Invalid token format",
      "invalidUserRole": "Invalid user role",
      "serverError": "Server error",
      "tokenExpired": "Token expired",
      "tokenNotProvided": "Token not provided",
      "userAccountNoLongerExists": "User account no longer exists",
      "youAreNotAuthorizedToAccessThisResource": "You are not authorized to access this resource",
      "youAreNotAuthorizedToViewThisClientSPayments": "You are not authorized to view this client's payments.",
      "yourAccountHasBeenDisabled": "Your account has been disabled",
      "somethingWentWrong": "Something went wrong",
      "networkError": "Network Error",
      "failedToFetch": "Failed to fetch",
      "requestAborted": "Request aborted",
      "canceled": "canceled",
      "validationError": "Please check the submitted information."
    },
    "requestFailed": "Request failed with status code {status}.",
    "requestTimeout": "The request timed out. Please try again.",
    "unknownStaff": "Unknown"
  },
  "ja": {
    "title": "支払い",
    "description": "有料ステージが完了すると、支払いは自動的に記録されます。",
    "totalPayments": "支払総額",
    "history": "支払い履歴",
    "empty": "支払いはまだ記録されていません。",
    "feeExpected": "予定料金: ¥{amount}",
    "noAvailableFees": "未払い残高のある有効な料金はありません。",
    "fields": {
      "date": "日付",
      "method": "方法",
      "creditedStaff": "担当スタッフ",
      "recordedBy": "記録者",
      "stageAtPayment": "支払い時のステージ",
      "reference": "参照番号",
      "receipt": "領収書番号",
      "bank": "銀行",
      "stage": "ステージ",
      "amount": "金額",
      "status": "ステータス",
      "staff": "スタッフ"
    },
    "summary": {
      "expected": "予定額",
      "alreadyPaid": "支払済み",
      "outstanding": "未払い",
      "status": "ステータス",
      "totalCollected": "回収総額",
      "completedPayments": "完了済み支払い"
    },
    "form": {
      "title": "支払いを追加",
      "fee": "料金",
      "selectFee": "料金を選択",
      "feeOption": "{feeName} - 未払い ¥{amount}",
      "amountPaying": "支払金額",
      "paymentMethod": "支払い方法",
      "selectPaymentMethod": "支払い方法を選択",
      "paymentDate": "支払日",
      "referenceNumber": "参照番号",
      "receiptNumber": "領収書番号",
      "bankName": "銀行名",
      "note": "メモ"
    },
    "actions": {
      "saving": "保存中...",
      "savePayment": "支払いを保存",
      "showLess": "表示を減らす",
      "showAll": "すべての支払い {count} 件を表示"
    },
    "statuses": {
      "Completed": "完了",
      "Cancelled": "キャンセル済み",
      "Refunded": "返金済み"
    },
    "paymentStatuses": {
      "Unpaid": "未払い",
      "Partial": "一部支払い",
      "Paid": "支払済み",
      "Cancelled": "キャンセル済み"
    },
    "methods": {
      "Cash": "現金",
      "Bank Transfer": "銀行振込",
      "Online Payment": "オンライン決済",
      "Cheque": "小切手",
      "Other": "その他"
    },
    "validation": {
      "feeRequired": "料金を選択してください",
      "amountRequired": "金額は必須です",
      "amountPositive": "金額は0より大きい必要があります",
      "paymentMethodRequired": "支払い方法は必須です",
      "paymentDateRequired": "支払日は必須です",
      "referenceNumberMax": "参照番号が長すぎます",
      "receiptNumberMax": "領収書番号が長すぎます",
      "bankNameMax": "銀行名が長すぎます",
      "noteMax": "メモは3000文字以内で入力してください"
    },
    "messages": {
      "selectValidFee": "有効な料金を選択してください。",
      "feeInactive": "この料金は有効ではありません。",
      "amountExceeds": "金額は未払い残高 ¥{amount} を超えることはできません。",
      "recorded": "支払いを記録しました。",
      "recordedFullyPaid": "支払いを記録しました。この料金は全額支払い済みになりました。",
      "recordFailed": "支払いを記録できませんでした。",
      "loadFailed": "入金情報を読み込めませんでした。",
      "loadFeesFailed": "顧客料金を読み込めませんでした。"
    },
    "stages": {
      "registeredPaid": "登録済み / 支払済み",
      "vacancySearching": "求人検索中",
      "interviewFixedPreparation": "面接確定 / 準備中",
      "interviewFailed": "面接不合格",
      "jobOfferReceived": "内定 / オファー受領",
      "jobOfferAccepted": "内定承諾",
      "jobOfferNotAccepted": "内定未承諾",
      "visaDocumentsSubmitted": "ビザ書類提出済み",
      "visaAppliedResultWaiting": "ビザ申請済み / 結果待ち",
      "visaApproved": "ビザ承認",
      "visaRejected": "ビザ却下",
      "companyJoining": "入社待ち",
      "employmentStartedCompanyJoined": "勤務開始 / 入社済み",
      "visaRenewal1Year": "ビザ更新 - 1年",
      "visaRenewal3Years": "ビザ更新 - 3年",
      "visaRenewal5Years": "ビザ更新 - 5年",
      "returnToNepal": "ネパールへ帰国",
      "new": "新規",
      "documentCollection": "書類収集中",
      "processing": "処理中",
      "cOEApplied": "COE申請済み",
      "cOEReceived": "COE受領済み",
      "visaApplied": "ビザ申請済み",
      "departed": "出国済み",
      "arrivedInJapan": "日本到着",
      "registrationPending": "登録待ち",
      "registeredVacancySearching": "登録済み / 求人検索中",
      "legacyPayment": "過去の入金"
    },
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "認証済みユーザーのIDが見つかりません。",
      "authenticatedUserInformationIsMissing": "認証済みユーザーの情報がありません。",
      "authenticationRequired": "ログインが必要です。",
      "clientIDIsRequired": "顧客IDを指定してください。",
      "clientNotFound": "顧客が見つかりません。",
      "duplicateDataExists": "データが重複しています。",
      "failedToGetClientPayments": "顧客の入金情報を取得できませんでした。",
      "internalServerError": "サーバー内部でエラーが発生しました。",
      "invalidOrExpiredToken": "認証トークンが無効か、期限切れです。",
      "invalidTokenFormat": "認証トークンの形式が正しくありません。",
      "invalidUserRole": "ユーザー権限が正しくありません。",
      "serverError": "サーバーエラーが発生しました。",
      "tokenExpired": "認証トークンの有効期限が切れています。",
      "tokenNotProvided": "認証トークンが指定されていません。",
      "userAccountNoLongerExists": "ユーザーアカウントが存在しません。",
      "youAreNotAuthorizedToAccessThisResource": "この情報にアクセスする権限がありません。",
      "youAreNotAuthorizedToViewThisClientSPayments": "この顧客の入金情報を閲覧する権限がありません。",
      "yourAccountHasBeenDisabled": "アカウントは無効になっています。",
      "somethingWentWrong": "エラーが発生しました。もう一度お試しください。",
      "networkError": "ネットワークに接続できません。接続を確認してください。",
      "failedToFetch": "データを取得できませんでした。接続を確認してください。",
      "requestAborted": "リクエストが中断されました。",
      "canceled": "リクエストがキャンセルされました。",
      "validationError": "送信した情報に誤りがあります。入力内容を確認してください。"
    },
    "requestFailed": "リクエストに失敗しました（ステータスコード：{status}）。",
    "requestTimeout": "リクエストがタイムアウトしました。もう一度お試しください。",
    "unknownStaff": "不明"
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

  if (locale !== "ja" || /^[\u3040-\u30ff\u3400-\u9fff]/u.test(message)) return message;
  if (/validation failed|cast to .+ failed/i.test(message)) return t("serverMessages.validationError");
  if (/E11000|duplicate key/i.test(message)) return t("serverMessages.duplicateDataExists");
  return t(("messages." + fallback) as never);
}

const stageMessageKeys: Readonly<Record<string, keyof typeof messages.en.stages>> = {
  "legacy payment": "legacyPayment",
  "registered/paid": "registeredPaid",
  "registeredpaid": "registeredPaid",
  "vacancy searching": "vacancySearching",
  "vacancysearching": "vacancySearching",
  "interview fixed/preparation": "interviewFixedPreparation",
  "interviewfixedpreparation": "interviewFixedPreparation",
  "interview failed": "interviewFailed",
  "interviewfailed": "interviewFailed",
  "naitei/job offer received": "jobOfferReceived",
  "jobofferreceived": "jobOfferReceived",
  "job offer accepted": "jobOfferAccepted",
  "jobofferaccepted": "jobOfferAccepted",
  "job offer rejected": "jobOfferNotAccepted",
  "joboffernotaccepted": "jobOfferNotAccepted",
  "visa documents submitted": "visaDocumentsSubmitted",
  "visadocumentssubmitted": "visaDocumentsSubmitted",
  "visa applied/result waiting": "visaAppliedResultWaiting",
  "visaappliedresultwaiting": "visaAppliedResultWaiting",
  "visa approved": "visaApproved",
  "visaapproved": "visaApproved",
  "visa rejected": "visaRejected",
  "visarejected": "visaRejected",
  "waiting for nyusha/company joining": "companyJoining",
  "companyjoining": "companyJoining",
  "employment started/company joined": "employmentStartedCompanyJoined",
  "employmentstartedcompanyjoined": "employmentStartedCompanyJoined",
  "visa renewal - 1 year": "visaRenewal1Year",
  "visarenewal1year": "visaRenewal1Year",
  "visa renewal - 3 years": "visaRenewal3Years",
  "visarenewal3years": "visaRenewal3Years",
  "visa renewal - 5 years": "visaRenewal5Years",
  "visarenewal5years": "visaRenewal5Years",
  "return to nepal": "returnToNepal",
  "returntonepal": "returnToNepal",
  "job offer not accepted": "jobOfferNotAccepted",
  "new": "new",
  "document collection": "documentCollection",
  "processing": "processing",
  "coe applied": "cOEApplied",
  "coe received": "cOEReceived",
  "visa applied": "visaApplied",
  "departed": "departed",
  "arrived in japan": "arrivedInJapan",
  "registration pending": "registrationPending",
  "registered/vacancy searching": "registeredVacancySearching"
};
function translateStage(value: string | null | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!value) return "-";
  const key = stageMessageKeys[value.trim().toLowerCase().replace(/\s*\/\s*/g, "/")];
  return key ? t(("stages." + key) as never) : value;
}


// =================================================
// DESIGN TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#6B7280";

// How many payments show before "Show all"
const PAYMENTS_PREVIEW_COUNT = 5;

// =================================================
// FORMATTERS
// =================================================

const formatAmount = (amount?: number | null) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount ?? 0));
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getStatusStyle = (status: string) => {
  if (status === "Completed") {
    return { bgcolor: BRAND_SOFT, color: BRAND };
  }

  if (status === "Refunded") {
    return { bgcolor: "#EFF6FF", color: "#1D4ED8" };
  }

  return { bgcolor: "#FEF2F2", color: "#DC2626" };
};

// =================================================
// SMALL PIECES
// =================================================

const StatusBadge = ({
  status,
  label,
}: {
  status: string;
  label: string;
}) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: 1.1,
      py: 0.3,
      borderRadius: 999,
      fontSize: 11.5,
      fontWeight: 700,
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      ...getStatusStyle(status),
    }}
  >
    {label}
  </Box>
);

const StatTile = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) => (
  <Box
    sx={{
      px: 2,
      py: 1.5,
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 2.5,
      bgcolor: accent ? BRAND_SOFT : SURFACE_ALT,
    }}
  >
    <Typography sx={{ color: INK_MUTED, fontSize: 12, fontWeight: 500 }}>
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 0.25,
        color: accent ? BRAND : INK,
        fontSize: { xs: 22, sm: 24 },
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const Fact = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ color: INK_MUTED, fontSize: 11, lineHeight: 1.4 }}>
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 0.15,
        color: INK,
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

const Payments = ({ clientId }: PaymentsProps) => {
  const locale = useLocale();
  const t = useLocalTranslations();

  const { payments, summary, isLoading, isFetching, isError, errorMessage } =
    usePaymentsHook(clientId);

  // Hooks must run before the early return below
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={26} sx={{ color: BRAND }} />
      </Box>
    );
  }

  const canCollapse = payments.length > PAYMENTS_PREVIEW_COUNT;

  const visiblePayments =
    showAll || !canCollapse
      ? payments
      : payments.slice(0, PAYMENTS_PREVIEW_COUNT);

  const getStaffNameLabel = (value?: string | null) => value === "Unknown" ? t("unknownStaff") : value || "-";

  const getPaymentStatusLabel = (status?: string | null) => {
    if (!status) {
      return "-";
    }

    return t(`statuses.${status}` as never);
  };

  const getPaymentMethodLabel = (method?: string | null) => {
    if (!method) {
      return "-";
    }

    return t(`methods.${method}` as never);
  };

  return (
    <Box>
      {/* =================================================
      TITLE
      ================================================= */}

      <Box
        sx={{
          pb: 1.75,
          mb: 2,
          borderBottom: `1px solid ${HAIRLINE}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

            {payments.length > 0 && (
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
                {payments.length}
              </Box>
            )}
          </Box>

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

        {isFetching && !isLoading && (
          <CircularProgress size={18} sx={{ mt: 0.5, color: BRAND }} />
        )}
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>
          {translateServerMessage(errorMessage, locale, t, "loadFailed")}
        </Alert>
      )}

      {/* =================================================
      SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.5,
          mb: 2,
        }}
      >
        <StatTile
          accent
          label={t("summary.totalCollected")}
          value={`¥${formatAmount(summary.totalCollected)}`}
        />

        <StatTile
          label={t("summary.completedPayments")}
          value={summary.completedCount}
        />
      </Box>

      {/* =================================================
      HISTORY
      ================================================= */}

      {payments.length === 0 ? (
        <Box
          sx={{
            py: 3.5,
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
      ) : (
        <>
          {/* -------------------------------------------------
          DESKTOP TABLE
          ------------------------------------------------- */}

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              overflow: "auto",
              // Expanded lists scroll inside a fixed height
              maxHeight: showAll ? 460 : "none",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 2.5,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(17,24,39,0.18) transparent",
            }}
          >
            <Box
              component="table"
              sx={{
                width: "100%",
                minWidth: 760,
                borderCollapse: "separate",
                borderSpacing: 0,

                "& th": {
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  px: 1.75,
                  py: 1.1,
                  bgcolor: SURFACE_ALT,
                  borderBottom: `1px solid ${HAIRLINE}`,
                  color: INK_MUTED,
                  textAlign: "left",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                },

                "& td": {
                  px: 1.75,
                  py: 1.25,
                  borderBottom: `1px solid ${HAIRLINE}`,
                  color: INK,
                  fontSize: 13,
                  verticalAlign: "middle",
                },

                "& tbody tr:last-of-type td": { borderBottom: 0 },
                "& tbody tr:hover td": { bgcolor: "rgba(16,122,100,0.03)" },
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  <Box component="th">{t("fields.date")}</Box>
                  <Box component="th">{t("fields.stage")}</Box>
                  <Box component="th" sx={{ textAlign: "right !important" }}>
                    {t("fields.amount")}
                  </Box>
                  <Box component="th">{t("fields.method")}</Box>
                  <Box component="th">{t("fields.status")}</Box>
                  <Box component="th">{t("fields.reference")}</Box>
                  <Box component="th">{t("fields.staff")}</Box>
                </Box>
              </Box>

              <Box component="tbody">
                {visiblePayments.map((payment) => (
                  <Box component="tr" key={payment._id}>
                    <Box
                      component="td"
                      sx={{
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(payment.paymentDate, locale)}
                    </Box>

                    <Box component="td" sx={{ fontWeight: 600 }}>
                      {translateStage(payment.stageName, t)}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        textAlign: "right",
                        color: BRAND,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </Box>

                    <Box component="td">
                      {getPaymentMethodLabel(payment.paymentMethod)}
                    </Box>

                    <Box component="td">
                      <StatusBadge
                        status={payment.paymentStatus}
                        label={getPaymentStatusLabel(payment.paymentStatus)}
                      />
                    </Box>

                    <Box component="td" sx={{ wordBreak: "break-word" }}>
                      {payment.referenceNumber || payment.receiptNumber || "-"}
                    </Box>

                    <Box component="td">
                      <Typography
                        sx={{ fontSize: 13, fontWeight: 600, color: INK }}
                      >
                        {getStaffNameLabel(payment.creditedStaffName || payment.creditedStaff)}
                      </Typography>

                      {payment.collectedByName && (
                        <Typography
                          sx={{ mt: 0.15, fontSize: 11.5, color: INK_MUTED }}
                        >
                          {t("fields.recordedBy")} {getStaffNameLabel(payment.collectedByName)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* -------------------------------------------------
          MOBILE / TABLET CARDS
          ------------------------------------------------- */}

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              gap: 1.25,
              maxHeight: showAll ? 480 : "none",
              overflowY: showAll ? "auto" : "visible",
              pr: showAll ? 0.5 : 0,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(17,24,39,0.18) transparent",
            }}
          >
            {visiblePayments.map((payment) => (
              <Box
                key={payment._id}
                sx={{
                  p: 1.75,
                  border: `1px solid ${HAIRLINE}`,
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
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: INK,
                        fontSize: 14,
                        fontWeight: 700,
                        wordBreak: "break-word",
                      }}
                    >
                      {translateStage(payment.stageName, t)}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,
                        color: INK_MUTED,
                        fontSize: 12,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(payment.paymentDate, locale)}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      flexShrink: 0,
                      color: BRAND,
                      fontSize: 16,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    ¥{formatAmount(payment.amountPaid)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 1.25,
                    pt: 1.25,
                    borderTop: `1px solid ${HAIRLINE}`,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 1.25,
                  }}
                >
                  <Fact
                    label={t("fields.method")}
                    value={getPaymentMethodLabel(payment.paymentMethod)}
                  />

                  <Box>
                    <Typography
                      sx={{ color: INK_MUTED, fontSize: 11, lineHeight: 1.4 }}
                    >
                      {t("fields.status")}
                    </Typography>

                    <Box sx={{ mt: 0.3 }}>
                      <StatusBadge
                        status={payment.paymentStatus}
                        label={getPaymentStatusLabel(payment.paymentStatus)}
                      />
                    </Box>
                  </Box>

                  <Fact
                    label={t("fields.reference")}
                    value={
                      payment.referenceNumber || payment.receiptNumber || "-"
                    }
                  />

                  <Fact
                    label={t("fields.staff")}
                    value={
                      getStaffNameLabel(payment.creditedStaffName || payment.creditedStaff)
                    }
                  />
                </Box>

                {payment.collectedByName && (
                  <Typography sx={{ mt: 1.25, color: INK_MUTED, fontSize: 11.5 }}>
                    {t("fields.recordedBy")} {getStaffNameLabel(payment.collectedByName)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* -------------------------------------------------
          SHOW ALL / LESS
          ------------------------------------------------- */}

          {canCollapse && (
            <Box sx={{ mt: 1.25, display: "flex", justifyContent: "center" }}>
              <Button
                type="button"
                size="small"
                onClick={() => setShowAll((prev) => !prev)}
                endIcon={
                  showAll ? (
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
                {showAll
                  ? t("actions.showLess")
                  : t("actions.showAll", { count: payments.length })}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Payments;
