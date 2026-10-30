"use client";

import { useState } from "react";
import { createTranslator, useLocale } from "next-intl";
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

const messages = {
  "en": {
    "title": "Progress",
    "description": "Client recruitment and visa progress history.",
    "history": "Stage History",
    "empty": "No stage changes recorded yet.",
    "currentStage": "Current Stage",
    "admin": "Admin",
    "form": {
      "changeStage": "Change Stage",
      "selectStage": "Select stage",
      "note": "Note",
      "notePlaceholder": "Optional progress note...",
      "nextStage": "Next stage",
      "searchStage": "Search and select stage",
      "noStages": "No stages found"
    },
    "actions": {
      "updating": "Updating...",
      "updateStage": "Update Stage",
      "addStage": "Add stage",
      "processing": "Processing...",
      "payAndUpdate": "Pay {amount} & update stage",
      "showLess": "Show less",
      "showAllChanges": "Show all {count} changes"
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
    "validation": {
      "stageRequired": "Please select the next stage.",
      "noteMax": "Note must be 2000 characters or less.",
      "referenceMax": "Reference number must be 200 characters or less.",
      "receiptMax": "Receipt number must be 200 characters or less.",
      "bankMax": "Bank name must be 200 characters or less.",
      "paymentMethodRequired": "Payment method is required.",
      "paymentDateRequired": "Payment date is required.",
      "differentStage": "Please select a different stage.",
      "invalid": "Please check this field."
    },
    "messages": {
      "selectDifferentStage": "Please select a different stage.",
      "updateFailed": "Failed to update client stage.",
      "loadFailed": "Failed to load stage history.",
      "saveFailed": "Failed to update client stage.",
      "stagesLoadFailed": "Failed to load stages."
    },
    "payment": {
      "required": "Payment required",
      "notRequired": "No payment required",
      "fullRequired": "Full payment required",
      "fullRequiredDescription": "The full stage amount must be received before the stage can be updated. The amount comes from the Stage Master and cannot be edited here.",
      "method": "Payment method",
      "selectMethod": "Select payment method",
      "date": "Payment date",
      "bankName": "Bank name",
      "referenceNumber": "Reference number",
      "receiptNumber": "Receipt number"
    },
    "historyLabels": {
      "initial": "Initial",
      "payment": "Payment",
      "status": "Status",
      "collectedBy": "Collected by",
      "changedBy": "Changed by"
    },
    "autocomplete": {
      "clear": "Clear",
      "open": "Open",
      "close": "Close"
    },
    "serverMessages": {
      "aStageWithTheSameKeyOrStageIDAlreadyExists": "A stage with the same key or stage ID already exists.",
      "aStageWithTheSameNameAlreadyExists": "A stage with the same name already exists.",
      "aStageWithTheSameValueAlreadyExists": "A stage with the same value already exists.",
      "aValidPaymentDateIsRequired": "A valid payment date is required.",
      "aValidPaymentMethodIsRequiredBeforeEnteringThisStage": "A valid payment method is required before entering this stage.",
      "aValidStageNameIsRequiredToGenerateTheStageKey": "A valid stage name is required to generate the stage key.",
      "assignedStaffCouldNotBeFound": "Assigned staff could not be found.",
      "authenticatedUserIDWasNotFound": "Authenticated user ID was not found.",
      "authenticatedUserInformationIsMissing": "Authenticated user information is missing.",
      "authenticationRequired": "Authentication required",
      "clientIDIsRequired": "Client ID is required.",
      "clientNotFound": "Client not found.",
      "clientStageUpdatedSuccessfully": "Client stage updated successfully.",
      "deactivateItInstead": "Deactivate it instead.",
      "duplicateDataExists": "Duplicate data exists.",
      "failedToCreateStage": "Failed to create stage.",
      "failedToDeleteStage": "Failed to delete stage.",
      "failedToGetClientStageHistory": "Failed to get client stage history.",
      "failedToGetStage": "Failed to get stage.",
      "failedToGetStages": "Failed to get stages.",
      "failedToUpdateClientStage": "Failed to update client stage.",
      "failedToUpdateStageStatus": "Failed to update stage status.",
      "failedToUpdateStage": "Failed to update stage.",
      "internalServerError": "Internal Server Error",
      "invalidOrExpiredToken": "Invalid or expired token",
      "invalidTokenFormat": "Invalid token format",
      "invalidUserRole": "Invalid user role",
      "noteCannotExceed3000Characters": "Note cannot exceed 3000 characters.",
      "paymentRecordedAndClientStageUpdatedSuccessfully": "Payment recorded and client stage updated successfully.",
      "serverError": "Server error",
      "stageIDCannotBeChanged": "Stage ID cannot be changed.",
      "stageIDIsRequired": "Stage ID is required.",
      "stageActivatedSuccessfully": "Stage activated successfully.",
      "stageAmountMustBeAWholeNumberGreaterThanOrEqualTo0": "Stage amount must be a whole number greater than or equal to 0.",
      "stageCreatedSuccessfully": "Stage created successfully.",
      "stageDeactivatedSuccessfully": "Stage deactivated successfully.",
      "stageDeletedSuccessfully": "Stage deleted successfully.",
      "stageIsRequired": "Stage is required.",
      "stageKeyCannotBeChanged": "Stage key cannot be changed.",
      "stageNameCannotBeEmpty": "Stage name cannot be empty.",
      "stageNameIsRequired": "Stage name is required.",
      "stageNotFound": "Stage not found.",
      "stageUpdatedSuccessfully": "Stage updated successfully.",
      "theClientIsAlreadyInThisStage": "The client is already in this stage.",
      "theGeneratedStageKeyIsInvalid": "The generated stage key is invalid.",
      "theSelectedStageDoesNotExistOrIsInactive": "The selected stage does not exist or is inactive.",
      "tokenExpired": "Token expired",
      "tokenNotProvided": "Token not provided",
      "userAccountNoLongerExists": "User account no longer exists",
      "youAreNotAuthorizedToAccessThisClient": "You are not authorized to access this client.",
      "youAreNotAuthorizedToAccessThisResource": "You are not authorized to access this resource",
      "youAreNotAuthorizedToUpdateThisClient": "You are not authorized to update this client.",
      "yourAccountHasBeenDisabled": "Your account has been disabled",
      "displayOrderMustBeAPositiveWholeNumber2": "displayOrder must be a positive whole number.",
      "isActiveMustBeTrueOrFalse": "isActive must be true or false.",
      "somethingWentWrong": "Something went wrong",
      "networkError": "Network Error",
      "failedToFetch": "Failed to fetch",
      "requestAborted": "Request aborted",
      "canceled": "canceled",
      "validationError": "Please check the submitted information."
    },
    "requestFailed": "Request failed with status code {status}.",
    "requestTimeout": "The request timed out. Please try again.",
    "payments": {
      "methods": {
        "Cash": "Cash",
        "Bank Transfer": "Bank Transfer",
        "Online Payment": "Online Payment",
        "Cheque": "Cheque",
        "Other": "Other"
      },
      "statuses": {
        "Completed": "Completed",
        "Cancelled": "Cancelled",
        "Refunded": "Refunded"
      }
    },
    "unknownStaff": "Unknown",
    "roles": {"staff": "Staff", "admin": "Admin", "superadmin": "Super Admin"}
  },
  "ja": {
    "title": "進捗",
    "description": "顧客の採用およびビザ進捗履歴です。",
    "history": "ステージ履歴",
    "empty": "ステージ変更はまだ記録されていません。",
    "currentStage": "現在のステージ",
    "admin": "管理者",
    "form": {
      "changeStage": "ステージ変更",
      "selectStage": "ステージを選択",
      "note": "メモ",
      "notePlaceholder": "任意の進捗メモ...",
      "nextStage": "次のステージ",
      "searchStage": "ステージを検索して選択",
      "noStages": "ステージが見つかりません"
    },
    "actions": {
      "updating": "更新中...",
      "updateStage": "ステージを更新",
      "addStage": "ステージを追加",
      "processing": "処理中...",
      "payAndUpdate": "{amount} を支払ってステージを更新",
      "showLess": "表示を減らす",
      "showAllChanges": "すべての変更 {count} 件を表示"
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
    "validation": {
      "stageRequired": "次のステージを選択してください。",
      "noteMax": "メモは2000文字以内で入力してください。",
      "referenceMax": "参照番号は200文字以内で入力してください。",
      "receiptMax": "領収書番号は200文字以内で入力してください。",
      "bankMax": "銀行名は200文字以内で入力してください。",
      "paymentMethodRequired": "支払方法を選択してください。",
      "paymentDateRequired": "支払日を入力してください。",
      "differentStage": "現在とは異なるステージを選択してください。",
      "invalid": "入力内容を確認してください。"
    },
    "messages": {
      "selectDifferentStage": "別のステージを選択してください。",
      "updateFailed": "顧客ステージを更新できませんでした。",
      "loadFailed": "ステージ履歴を読み込めませんでした。",
      "saveFailed": "顧客のステージを更新できませんでした。",
      "stagesLoadFailed": "ステージを読み込めませんでした。"
    },
    "payment": {
      "required": "支払いが必要です",
      "notRequired": "支払いは不要です",
      "fullRequired": "全額支払いが必要です",
      "fullRequiredDescription": "ステージを更新するには、ステージ金額の全額を受領する必要があります。金額はステージマスターから取得され、この画面では編集できません。",
      "method": "支払い方法",
      "selectMethod": "支払い方法を選択",
      "date": "支払日",
      "bankName": "銀行名",
      "referenceNumber": "参照番号",
      "receiptNumber": "領収書番号"
    },
    "historyLabels": {
      "initial": "初期",
      "payment": "支払い",
      "status": "ステータス",
      "collectedBy": "回収担当",
      "changedBy": "変更者"
    },
    "autocomplete": {
      "clear": "クリア",
      "open": "開く",
      "close": "閉じる"
    },
    "serverMessages": {
      "aStageWithTheSameKeyOrStageIDAlreadyExists": "同じキーまたはステージIDのステージがすでに存在します。",
      "aStageWithTheSameNameAlreadyExists": "同じ名前のステージがすでに存在します。",
      "aStageWithTheSameValueAlreadyExists": "同じ値のステージがすでに存在します。",
      "aValidPaymentDateIsRequired": "有効な入金日を入力してください。",
      "aValidPaymentMethodIsRequiredBeforeEnteringThisStage": "このステージに進む前に、有効な支払方法を選択してください。",
      "aValidStageNameIsRequiredToGenerateTheStageKey": "ステージキーの生成には有効なステージ名が必要です。",
      "assignedStaffCouldNotBeFound": "担当スタッフが見つかりません。",
      "authenticatedUserIDWasNotFound": "認証済みユーザーのIDが見つかりません。",
      "authenticatedUserInformationIsMissing": "認証済みユーザーの情報がありません。",
      "authenticationRequired": "ログインが必要です。",
      "clientIDIsRequired": "顧客IDを指定してください。",
      "clientNotFound": "顧客が見つかりません。",
      "clientStageUpdatedSuccessfully": "顧客のステージを更新しました。",
      "deactivateItInstead": "代わりに無効にしてください。",
      "duplicateDataExists": "データが重複しています。",
      "failedToCreateStage": "ステージを作成できませんでした。",
      "failedToDeleteStage": "ステージを削除できませんでした。",
      "failedToGetClientStageHistory": "顧客のステージ履歴を取得できませんでした。",
      "failedToGetStage": "ステージを取得できませんでした。",
      "failedToGetStages": "ステージ一覧を取得できませんでした。",
      "failedToUpdateClientStage": "顧客のステージを更新できませんでした。",
      "failedToUpdateStageStatus": "ステージのステータスを更新できませんでした。",
      "failedToUpdateStage": "ステージを更新できませんでした。",
      "internalServerError": "サーバー内部でエラーが発生しました。",
      "invalidOrExpiredToken": "認証トークンが無効か、期限切れです。",
      "invalidTokenFormat": "認証トークンの形式が正しくありません。",
      "invalidUserRole": "ユーザー権限が正しくありません。",
      "noteCannotExceed3000Characters": "メモは3000文字以内で入力してください。",
      "paymentRecordedAndClientStageUpdatedSuccessfully": "入金を記録し、顧客のステージを更新しました。",
      "serverError": "サーバーエラーが発生しました。",
      "stageIDCannotBeChanged": "ステージIDは変更できません。",
      "stageIDIsRequired": "ステージIDを指定してください。",
      "stageActivatedSuccessfully": "ステージを有効にしました。",
      "stageAmountMustBeAWholeNumberGreaterThanOrEqualTo0": "ステージの金額は0以上の整数で入力してください。",
      "stageCreatedSuccessfully": "ステージを作成しました。",
      "stageDeactivatedSuccessfully": "ステージを無効にしました。",
      "stageDeletedSuccessfully": "ステージを削除しました。",
      "stageIsRequired": "ステージを選択してください。",
      "stageKeyCannotBeChanged": "ステージキーは変更できません。",
      "stageNameCannotBeEmpty": "ステージ名を入力してください。",
      "stageNameIsRequired": "ステージ名を入力してください。",
      "stageNotFound": "ステージが見つかりません。",
      "stageUpdatedSuccessfully": "ステージを更新しました。",
      "theClientIsAlreadyInThisStage": "顧客はすでにこのステージにいます。",
      "theGeneratedStageKeyIsInvalid": "生成されたステージキーが正しくありません。",
      "theSelectedStageDoesNotExistOrIsInactive": "選択したステージが存在しないか、無効になっています。",
      "tokenExpired": "認証トークンの有効期限が切れています。",
      "tokenNotProvided": "認証トークンが指定されていません。",
      "userAccountNoLongerExists": "ユーザーアカウントが存在しません。",
      "youAreNotAuthorizedToAccessThisClient": "この顧客にアクセスする権限がありません。",
      "youAreNotAuthorizedToAccessThisResource": "この情報にアクセスする権限がありません。",
      "youAreNotAuthorizedToUpdateThisClient": "この顧客を更新する権限がありません。",
      "yourAccountHasBeenDisabled": "アカウントは無効になっています。",
      "displayOrderMustBeAPositiveWholeNumber2": "表示順は正の整数で入力してください。",
      "isActiveMustBeTrueOrFalse": "有効状態はtrueまたはfalseで指定してください。",
      "somethingWentWrong": "エラーが発生しました。もう一度お試しください。",
      "networkError": "ネットワークに接続できません。接続を確認してください。",
      "failedToFetch": "データを取得できませんでした。接続を確認してください。",
      "requestAborted": "リクエストが中断されました。",
      "canceled": "リクエストがキャンセルされました。",
      "validationError": "送信した情報に誤りがあります。入力内容を確認してください。"
    },
    "requestFailed": "リクエストに失敗しました（ステータスコード：{status}）。",
    "requestTimeout": "リクエストがタイムアウトしました。もう一度お試しください。",
    "payments": {
      "methods": {
        "Cash": "現金",
        "Bank Transfer": "銀行振込",
        "Online Payment": "オンライン決済",
        "Cheque": "小切手",
        "Other": "その他"
      },
      "statuses": {
        "Completed": "完了",
        "Cancelled": "キャンセル済み",
        "Refunded": "返金済み"
      }
    },
    "unknownStaff": "不明",
    "roles": {"staff": "スタッフ", "admin": "管理者", "superadmin": "最高管理者"}
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

function translateValidationError(message: string | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!message) return undefined;
  return t.has(message as never) ? t(message as never) : t("validation.invalid");
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

const formatDateTime = (value: string | null | undefined, locale: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-GB", {
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
  const locale = useLocale();
  const t = useLocalTranslations();
  const paymentT = createTranslator({locale, messages: messages[locale === "ja" ? "ja" : "en"].payments});

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

  const getPaymentMethodLabel = (method?: string | null) => {
    if (!method) {
      return "-";
    }

    return paymentT(`methods.${method}` as never);
  };

  const getStaffNameLabel = (value?: string | null) => value === "Unknown" ? t("unknownStaff") : value || "-";

  const getRoleLabel = (role?: string | null) => {
    if (role === "staff" || role === "admin" || role === "superadmin") return t(`roles.${role}`);
    return role || "-";
  };

  const getPaymentStatusLabel = (status?: string | null) => {
    if (!status) {
      return "-";
    }

    return paymentT(`statuses.${status}` as never);
  };

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
          {t("title")}
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
              {t("currentStage")}
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
              {translateStage(currentStageName, t)}
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
          {translateServerMessage(loadError, locale, t, "loadFailed")}
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
          {translateServerMessage(submitError, locale, t, "saveFailed")}
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
              <PanelTitle>{t("form.changeStage")}</PanelTitle>

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
                  {t("actions.addStage")}
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
                  `${translateStage(stage.name, t)} — ${formatCurrency(stage.amount)}`
                }
                isOptionEqualToValue={(option, value) =>
                  option.key === value.key
                }
                onChange={(_event, stage) =>
                  updateValue("stage", stage?.key ?? "")
                }
                noOptionsText={t("form.noStages")}
                clearText={t("autocomplete.clear")}
                openText={t("autocomplete.open")}
                closeText={t("autocomplete.close")}
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
                        {translateStage(stage.name, t)}
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
                    label={t("form.nextStage")}
                    placeholder={t("form.searchStage")}
                    error={Boolean(formErrors.stage)}
                    helperText={translateValidationError(formErrors.stage, t)}
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
                        ? t("payment.required")
                        : t("payment.notRequired")}
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
                      {translateStage(selectedStageDetails.name, t)}
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
                        {t("payment.fullRequired")}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.15,

                          color: MUTED,

                          fontSize: 12,

                          lineHeight: 1.5,
                        }}
                      >
                        {t("payment.fullRequiredDescription")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={fieldGridSx}>
                    <TextField
                      select
                      required
                      fullWidth
                      size="small"
                      label={t("payment.method")}
                      value={values.paymentMethod}
                      onChange={(event) =>
                        updateValue(
                          "paymentMethod",
                          event.target.value as "" | "Bank Transfer" | "Cash",
                        )
                      }
                      error={Boolean(formErrors.paymentMethod)}
                      helperText={translateValidationError(formErrors.paymentMethod, t)}
                      sx={fieldSx}
                    >
                      <MenuItem value="">{t("payment.selectMethod")}</MenuItem>

                      {PAYMENT_METHOD_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {getPaymentMethodLabel(option.value)}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      required
                      fullWidth
                      size="small"
                      type="date"
                      label={t("payment.date")}
                      value={values.paymentDate}
                      onChange={(event) =>
                        updateValue("paymentDate", event.target.value)
                      }
                      error={Boolean(formErrors.paymentDate)}
                      helperText={translateValidationError(formErrors.paymentDate, t)}
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
                      label={t("payment.bankName")}
                      value={values.bankName}
                      disabled={values.paymentMethod === "Cash"}
                      onChange={(event) =>
                        updateValue("bankName", event.target.value)
                      }
                      error={Boolean(formErrors.bankName)}
                      helperText={translateValidationError(formErrors.bankName, t)}
                      sx={fieldSx}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label={t("payment.referenceNumber")}
                      value={values.referenceNumber}
                      onChange={(event) =>
                        updateValue("referenceNumber", event.target.value)
                      }
                      error={Boolean(formErrors.referenceNumber)}
                      helperText={translateValidationError(formErrors.referenceNumber, t)}
                      sx={fieldSx}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label={t("payment.receiptNumber")}
                      value={values.receiptNumber}
                      onChange={(event) =>
                        updateValue("receiptNumber", event.target.value)
                      }
                      error={Boolean(formErrors.receiptNumber)}
                      helperText={translateValidationError(formErrors.receiptNumber, t)}
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
                label={t("form.note")}
                value={values.note}
                onChange={(event) => updateValue("note", event.target.value)}
                error={Boolean(formErrors.note)}
                helperText={translateValidationError(formErrors.note, t)}
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
                  ? t("actions.processing")
                  : requiresPayment
                    ? t("actions.payAndUpdate", {
                        amount: formatCurrency(selectedStageAmount),
                      })
                    : t("actions.updateStage")}
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
            <PanelTitle count={history.length}>{t("history")}</PanelTitle>

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
                {t("empty")}
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
                                  {item.fromStageName ? translateStage(item.fromStageName, t) : t("historyLabels.initial")}
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
                                  {translateStage(item.toStageName, t)}
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
                                {formatDateTime(item.createdAt, locale)}
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
                                label={t("historyLabels.payment")}
                                value={formatCurrency(payment?.amountPaid)}
                                color={SUCCESS}
                              />

                              <Fact
                                label={t("payment.method")}
                                value={getPaymentMethodLabel(payment?.paymentMethod)}
                              />

                              <Fact
                                label={t("historyLabels.status")}
                                value={getPaymentStatusLabel(
                                  payment?.paymentStatus || "Completed",
                                )}
                                color={SUCCESS}
                              />

                              <Fact
                                label={t("historyLabels.collectedBy")}
                                value={
                                  getStaffNameLabel(payment?.creditedStaffName || item.changedByName)
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
                            {t("historyLabels.changedBy")}{" "}
                            {item.changedByName
                              ? getStaffNameLabel(item.changedByName)
                              : item.staffId || getRoleLabel(item.changedByRole)}
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
                      ? t("actions.showLess")
                      : t("actions.showAllChanges", { count: history.length })}
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
