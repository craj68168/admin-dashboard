"use client";

import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { createTranslator, useLocale } from "next-intl";

import { createStageSchema } from "./validation";

import type {
  CreateStageFormValues,
  CreateStageModalProps,
} from "./type";

const messages = {
  "en": {
    "title": "Add Current Stage",
    "fields": {
      "name": {
        "label": "Stage Name",
        "placeholder": "e.g. Document Collection"
      },
      "amount": {
        "label": "Amount (¥)",
        "helper": "Use 0 when this stage has no charge."
      }
    },
    "actions": {
      "cancel": "Cancel",
      "create": "Create Stage",
      "creating": "Creating..."
    },
    "validation": {
      "nameRequired": "Stage name is required.",
      "amountWhole": "Amount must be 0 or a positive whole number",
      "invalid": "Please check this field."
    },
    "messages": {
      "saveFailed": "Failed to create stage."
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
    "requestTimeout": "The request timed out. Please try again.",
    "staffNotFound": "Staff {id} not found."
  },
  "ja": {
    "title": "現在のステージを追加",
    "fields": {
      "name": {
        "label": "ステージ名",
        "placeholder": "例：書類収集"
      },
      "amount": {
        "label": "金額（¥）",
        "helper": "料金が発生しないステージの場合は0を入力してください。"
      }
    },
    "actions": {
      "cancel": "キャンセル",
      "create": "ステージを作成",
      "creating": "作成中..."
    },
    "validation": {
      "nameRequired": "ステージ名を入力してください。",
      "amountWhole": "金額は0以上の整数で入力してください。",
      "invalid": "入力内容を確認してください。"
    },
    "messages": {
      "saveFailed": "ステージを作成できませんでした。"
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
    "requestTimeout": "リクエストがタイムアウトしました。もう一度お試しください。",
    "staffNotFound": "スタッフ{id}が見つかりません。"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({locale, messages: messages[locale === "ja" ? "ja" : "en"]});
}

const normalizeMessage = (value: string) => value.trim().replace(/\.+$/, "").toLowerCase();
const serverMessageKeys = new Map(Object.entries(messages.en.serverMessages).map(([key, value]) => [normalizeMessage(value), key]));

function translateServerMessage(message: string | null | undefined, locale: string, t: ReturnType<typeof useLocalTranslations>, fallback: keyof typeof messages.en.messages) {
  if (typeof message !== "string" || !message.trim()) return t(("messages." + fallback) as never);
  if (message.startsWith("messages.") && t.has(message as never)) return t(message as never);
  const key = serverMessageKeys.get(normalizeMessage(message));
  if (key) return t(("serverMessages." + key) as never);
  const httpError = /^Request failed with status code (\d+)\.?$/i.exec(message.trim());
  if (httpError) return t("requestFailed", {status: httpError[1]});
  if (/^timeout of \d+ms exceeded/i.test(message)) return t("requestTimeout");
  const staffError = /^Staff (.+) not found\.?$/i.exec(message.trim());
  if (staffError) return t("staffNotFound", {id: staffError[1]});
  if (locale !== "ja" || /^[\u3040-\u30ff\u3400-\u9fff]/u.test(message)) return message;
  if (/validation failed|cast to .+ failed/i.test(message)) return t("serverMessages.validationError");
  if (/E11000|duplicate key/i.test(message)) return t("serverMessages.duplicateDataExists");
  return t(("messages." + fallback) as never);
}

function translateValidationError(message: string | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!message) return undefined;
  return t.has(message as never) ? t(message as never) : t("validation.invalid");
}


const BRAND = "#107A64";

export default function CreateStageModal({
  open,
  isLoading,
  errorMessage,
  onClose,
  onSubmit,
}: CreateStageModalProps) {
  const locale = useLocale();
  const t = useLocalTranslations();

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<CreateStageFormValues>({
    resolver: zodResolver(createStageSchema),

    defaultValues: {
      name: "",
      amount: "0",
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        amount: "0",
      });
    }
  }, [open, reset]);

  const submit = async (
    values: CreateStageFormValues,
  ) => {
    await onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onClose={
        isLoading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      {/* TITLE */}

      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        {t("title")}
      </DialogTitle>

      {/* CONTENT */}

      <DialogContent>
        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
          >
            {translateServerMessage(errorMessage, locale, t, "saveFailed")}
          </Alert>
        )}

        <form
          id="create-client-stage-form"
          onSubmit={handleSubmit(submit)}
        >
          {/* STAGE NAME */}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label={t("fields.name.label")}
                placeholder={t(
                  "fields.name.placeholder",
                )}
                error={Boolean(
                  errors.name,
                )}
                helperText={translateValidationError(errors.name?.message, t)}
                sx={{
                  mt: 1,
                  mb: 2,
                }}
              />
            )}
          />

          {/* AMOUNT */}

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type="number"
                label={t(
                  "fields.amount.label",
                )}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
                error={Boolean(
                  errors.amount,
                )}
                helperText={
                  translateValidationError(errors.amount?.message, t) ||
                  t(
                    "fields.amount.helper",
                  )
                }
              />
            )}
          />
        </form>
      </DialogContent>

      {/* ACTIONS */}

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={isLoading}
        >
          {t("actions.cancel")}
        </Button>

        <Button
          type="submit"
          form="create-client-stage-form"
          variant="contained"
          disableElevation
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress
                size={15}
                color="inherit"
              />
            ) : undefined
          }
          sx={{
            bgcolor: BRAND,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {isLoading
            ? t("actions.creating")
            : t("actions.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}