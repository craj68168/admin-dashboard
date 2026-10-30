"use client";

import { createTranslator, useLocale } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { AddStageModalProps } from "../type";

const messages = {
  "en": {
    "title": "Add Client Stage",
    "description": "Create a new Stage Master entry. The new stage will immediately become available in the Next stage list.",
    "name": "Stage name",
    "namePlaceholder": "Example: Interview Preparation",
    "amount": "Stage amount",
    "amountHint": "Enter 0 if this stage does not require payment.",
    "cancel": "Cancel",
    "adding": "Adding...",
    "add": "Add Stage",
    "messages": {
      "saveFailed": "Failed to create client stage."
    },
    "validation": {
      "nameRequired": "Stage name is required.",
      "nameMax": "Stage name must be 150 characters or less.",
      "amountRequired": "Stage amount is required.",
      "amountWhole": "Amount must be a whole number of yen.",
      "invalid": "Please check this field."
    },
    "serverMessages": {
      "aStageWithTheSameKeyOrStageIDAlreadyExists": "A stage with the same key or stage ID already exists.",
      "aStageWithTheSameNameAlreadyExists": "A stage with the same name already exists.",
      "aStageWithTheSameValueAlreadyExists": "A stage with the same value already exists.",
      "aValidStageNameIsRequiredToGenerateTheStageKey": "A valid stage name is required to generate the stage key.",
      "authenticatedUserIDWasNotFound": "Authenticated user ID was not found.",
      "authenticatedUserInformationIsMissing": "Authenticated user information is missing.",
      "authenticationRequired": "Authentication required",
      "deactivateItInstead": "Deactivate it instead.",
      "duplicateDataExists": "Duplicate data exists.",
      "failedToCreateStage": "Failed to create stage.",
      "failedToDeleteStage": "Failed to delete stage.",
      "failedToGetStage": "Failed to get stage.",
      "failedToGetStages": "Failed to get stages.",
      "failedToUpdateStageStatus": "Failed to update stage status.",
      "failedToUpdateStage": "Failed to update stage.",
      "internalServerError": "Internal Server Error",
      "invalidOrExpiredToken": "Invalid or expired token",
      "invalidTokenFormat": "Invalid token format",
      "invalidUserRole": "Invalid user role",
      "serverError": "Server error",
      "stageIDCannotBeChanged": "Stage ID cannot be changed.",
      "stageIDIsRequired": "Stage ID is required.",
      "stageActivatedSuccessfully": "Stage activated successfully.",
      "stageAmountMustBeAWholeNumberGreaterThanOrEqualTo0": "Stage amount must be a whole number greater than or equal to 0.",
      "stageCreatedSuccessfully": "Stage created successfully.",
      "stageDeactivatedSuccessfully": "Stage deactivated successfully.",
      "stageDeletedSuccessfully": "Stage deleted successfully.",
      "stageKeyCannotBeChanged": "Stage key cannot be changed.",
      "stageNameCannotBeEmpty": "Stage name cannot be empty.",
      "stageNameIsRequired": "Stage name is required.",
      "stageNotFound": "Stage not found.",
      "stageUpdatedSuccessfully": "Stage updated successfully.",
      "theGeneratedStageKeyIsInvalid": "The generated stage key is invalid.",
      "tokenExpired": "Token expired",
      "tokenNotProvided": "Token not provided",
      "userAccountNoLongerExists": "User account no longer exists",
      "youAreNotAuthorizedToAccessThisResource": "You are not authorized to access this resource",
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
    "requestTimeout": "The request timed out. Please try again."
  },
  "ja": {
    "title": "顧客ステージを追加",
    "description": "ステージマスターに新しいステージを作成します。作成後、次のステージの候補にすぐに表示されます。",
    "name": "ステージ名",
    "namePlaceholder": "例：面接準備",
    "amount": "ステージ金額",
    "amountHint": "支払いが不要なステージは0を入力してください。",
    "cancel": "キャンセル",
    "adding": "追加中...",
    "add": "ステージを追加",
    "messages": {
      "saveFailed": "顧客ステージを作成できませんでした。"
    },
    "validation": {
      "nameRequired": "ステージ名を入力してください。",
      "nameMax": "ステージ名は150文字以内で入力してください。",
      "amountRequired": "ステージ金額を入力してください。",
      "amountWhole": "金額は円単位の整数で入力してください。",
      "invalid": "入力内容を確認してください。"
    },
    "serverMessages": {
      "aStageWithTheSameKeyOrStageIDAlreadyExists": "同じキーまたはステージIDのステージがすでに存在します。",
      "aStageWithTheSameNameAlreadyExists": "同じ名前のステージがすでに存在します。",
      "aStageWithTheSameValueAlreadyExists": "同じ値のステージがすでに存在します。",
      "aValidStageNameIsRequiredToGenerateTheStageKey": "ステージキーの生成には有効なステージ名が必要です。",
      "authenticatedUserIDWasNotFound": "認証済みユーザーのIDが見つかりません。",
      "authenticatedUserInformationIsMissing": "認証済みユーザーの情報がありません。",
      "authenticationRequired": "ログインが必要です。",
      "deactivateItInstead": "代わりに無効にしてください。",
      "duplicateDataExists": "データが重複しています。",
      "failedToCreateStage": "ステージを作成できませんでした。",
      "failedToDeleteStage": "ステージを削除できませんでした。",
      "failedToGetStage": "ステージを取得できませんでした。",
      "failedToGetStages": "ステージ一覧を取得できませんでした。",
      "failedToUpdateStageStatus": "ステージのステータスを更新できませんでした。",
      "failedToUpdateStage": "ステージを更新できませんでした。",
      "internalServerError": "サーバー内部でエラーが発生しました。",
      "invalidOrExpiredToken": "認証トークンが無効か、期限切れです。",
      "invalidTokenFormat": "認証トークンの形式が正しくありません。",
      "invalidUserRole": "ユーザー権限が正しくありません。",
      "serverError": "サーバーエラーが発生しました。",
      "stageIDCannotBeChanged": "ステージIDは変更できません。",
      "stageIDIsRequired": "ステージIDを指定してください。",
      "stageActivatedSuccessfully": "ステージを有効にしました。",
      "stageAmountMustBeAWholeNumberGreaterThanOrEqualTo0": "ステージの金額は0以上の整数で入力してください。",
      "stageCreatedSuccessfully": "ステージを作成しました。",
      "stageDeactivatedSuccessfully": "ステージを無効にしました。",
      "stageDeletedSuccessfully": "ステージを削除しました。",
      "stageKeyCannotBeChanged": "ステージキーは変更できません。",
      "stageNameCannotBeEmpty": "ステージ名を入力してください。",
      "stageNameIsRequired": "ステージ名を入力してください。",
      "stageNotFound": "ステージが見つかりません。",
      "stageUpdatedSuccessfully": "ステージを更新しました。",
      "theGeneratedStageKeyIsInvalid": "生成されたステージキーが正しくありません。",
      "tokenExpired": "認証トークンの有効期限が切れています。",
      "tokenNotProvided": "認証トークンが指定されていません。",
      "userAccountNoLongerExists": "ユーザーアカウントが存在しません。",
      "youAreNotAuthorizedToAccessThisResource": "この情報にアクセスする権限がありません。",
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
// DESIGN
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BORDER = "rgba(17, 24, 39, 0.10)";
const INK = "#111827";
const MUTED = "#6B7280";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,

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
// COMPONENT
// =================================================

const AddStageModal = ({
  open,
  values,
  errors,
  submitError,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: AddStageModalProps) => {
  const locale = useLocale();
  const t = useLocalTranslations();
  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: INK,
          }}
        >
          {t("title")}
        </Typography>

        <Typography
          component="div"
          sx={{
            mt: 0.5,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: MUTED,
          }}
        >
          {t("description")}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: "16px !important",
        }}
      >
        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {translateServerMessage(submitError, locale, t, "saveFailed")}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            autoFocus
            required
            fullWidth
            size="small"
            label={t("name")}
            placeholder={t("namePlaceholder")}
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            error={Boolean(errors.name)}
            helperText={translateValidationError(errors.name, t)}
            disabled={isSubmitting}
            sx={fieldSx}
          />

          <TextField
            required
            fullWidth
            size="small"
            type="number"
            label={t("amount")}
            value={values.amount}
            onChange={(event) => onChange("amount", event.target.value)}
            error={Boolean(errors.amount)}
            helperText={
              translateValidationError(errors.amount, t) || t("amountHint")
            }
            disabled={isSubmitting}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },

              input: {
                startAdornment: (
                  <InputAdornment position="start">¥</InputAdornment>
                ),
              },
            }}
            sx={fieldSx}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1.5,
        }}
      >
        <Button
          type="button"
          startIcon={<CloseRoundedIcon />}
          disabled={isSubmitting}
          onClick={handleClose}
          sx={{
            color: MUTED,
            textTransform: "none",
          }}
        >
          {t("cancel")}
        </Button>

        <Button
          type="button"
          variant="contained"
          disableElevation
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AddRoundedIcon />
            )
          }
          onClick={onSubmit}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            bgcolor: BRAND,
            fontWeight: 700,
            textTransform: "none",

            "&:hover": {
              bgcolor: BRAND_DARK,
            },
          }}
        >
          {isSubmitting ? t("adding") : t("add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStageModal;
