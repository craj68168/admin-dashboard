"use client";

import { useState } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { Controller } from "react-hook-form";
import { createTranslator, useLocale } from "next-intl";

import { REMARK_MEDIUMS } from "./type";

import type { RemarksProps } from "./type";

import { useRemarksHook } from "./hook";

const messages = {
  "en": {
    "title": "Remarks",
    "description": "Communication and follow-up history for this client.",
    "history": "Remark History",
    "empty": "No remarks have been added yet.",
    "admin": "Admin",
    "form": {
      "title": "New Remark",
      "date": "Date",
      "staff": "Staff",
      "staffHelper": "Automatically recorded from the logged-in account.",
      "medium": "Medium",
      "selectMedium": "Select medium",
      "memo": "Memo",
      "memoPlaceholder": "Enter conversation or follow-up details..."
    },
    "actions": {
      "saving": "Saving...",
      "save": "Save"
    },
    "mediums": {
      "Phone Call": "Phone Call",
      "Meeting": "Meeting",
      "WhatsApp": "WhatsApp",
      "Email": "Email",
      "Company Visit": "Company Visit",
      "LINE": "LINE",
      "Other": "Other"
    },
    "validation": {
      "dateRequired": "Date is required",
      "mediumRequired": "Medium is required",
      "memoRequired": "Memo is required",
      "memoMax": "Memo cannot exceed 5000 characters",
      "invalid": "Please check this field."
    },
    "messages": {
      "saveFailed": "Failed to save remark.",
      "loadFailed": "Failed to load remarks."
    },
    "showLess": "Show less",
    "showAll": "Show all {count} remarks",
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "Authenticated user ID was not found.",
      "authenticatedUserInformationIsMissing": "Authenticated user information is missing.",
      "authenticationRequired": "Authentication required",
      "clientIDIsRequired": "Client ID is required.",
      "clientNotFound": "Client not found.",
      "duplicateDataExists": "Duplicate data exists.",
      "failedToAddRemark": "Failed to add remark.",
      "failedToRetrieveRemarks": "Failed to retrieve remarks.",
      "internalServerError": "Internal Server Error",
      "invalidOrExpiredToken": "Invalid or expired token",
      "invalidRemarkDate": "Invalid remark date.",
      "invalidTokenFormat": "Invalid token format",
      "invalidUserRole": "Invalid user role",
      "mediumIsRequired": "Medium is required.",
      "remarkAddedSuccessfully": "Remark added successfully.",
      "remarkIsRequired": "Remark is required.",
      "serverError": "Server error",
      "tokenExpired": "Token expired",
      "tokenNotProvided": "Token not provided",
      "userAccountNoLongerExists": "User account no longer exists",
      "youAreNotAuthorizedToAccessThisClientSRemarks": "You are not authorized to access this client's remarks.",
      "youAreNotAuthorizedToAccessThisResource": "You are not authorized to access this resource",
      "youAreNotAuthorizedToAddRemarksToThisClient": "You are not authorized to add remarks to this client.",
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
    "title": "備考",
    "description": "この顧客との連絡およびフォローアップ履歴です。",
    "history": "備考履歴",
    "empty": "備考はまだ追加されていません。",
    "admin": "管理者",
    "form": {
      "title": "新規備考",
      "date": "日付",
      "staff": "スタッフ",
      "staffHelper": "ログイン中のアカウントから自動記録されます。",
      "medium": "連絡手段",
      "selectMedium": "連絡手段を選択",
      "memo": "メモ",
      "memoPlaceholder": "会話内容またはフォローアップ詳細を入力..."
    },
    "actions": {
      "saving": "保存中...",
      "save": "保存"
    },
    "mediums": {
      "Phone Call": "電話",
      "Meeting": "面談",
      "WhatsApp": "WhatsApp",
      "Email": "メール",
      "Company Visit": "会社訪問",
      "LINE": "LINE",
      "Other": "その他"
    },
    "validation": {
      "dateRequired": "日付は必須です",
      "mediumRequired": "連絡手段は必須です",
      "memoRequired": "メモは必須です",
      "memoMax": "メモは5000文字以内で入力してください",
      "invalid": "入力内容を確認してください。"
    },
    "messages": {
      "saveFailed": "備考を保存できませんでした。",
      "loadFailed": "備考を読み込めませんでした。"
    },
    "showLess": "表示を減らす",
    "showAll": "対応履歴をすべて表示（{count}件）",
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "認証済みユーザーのIDが見つかりません。",
      "authenticatedUserInformationIsMissing": "認証済みユーザーの情報がありません。",
      "authenticationRequired": "ログインが必要です。",
      "clientIDIsRequired": "顧客IDを指定してください。",
      "clientNotFound": "顧客が見つかりません。",
      "duplicateDataExists": "データが重複しています。",
      "failedToAddRemark": "備考を追加できませんでした。",
      "failedToRetrieveRemarks": "備考を取得できませんでした。",
      "internalServerError": "サーバー内部でエラーが発生しました。",
      "invalidOrExpiredToken": "認証トークンが無効か、期限切れです。",
      "invalidRemarkDate": "備考の日付が正しくありません。",
      "invalidTokenFormat": "認証トークンの形式が正しくありません。",
      "invalidUserRole": "ユーザー権限が正しくありません。",
      "mediumIsRequired": "連絡手段を入力してください。",
      "remarkAddedSuccessfully": "備考を追加しました。",
      "remarkIsRequired": "備考を入力してください。",
      "serverError": "サーバーエラーが発生しました。",
      "tokenExpired": "認証トークンの有効期限が切れています。",
      "tokenNotProvided": "認証トークンが指定されていません。",
      "userAccountNoLongerExists": "ユーザーアカウントが存在しません。",
      "youAreNotAuthorizedToAccessThisClientSRemarks": "この顧客の備考を閲覧する権限がありません。",
      "youAreNotAuthorizedToAccessThisResource": "この情報にアクセスする権限がありません。",
      "youAreNotAuthorizedToAddRemarksToThisClient": "この顧客に備考を追加する権限がありません。",
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
const BRAND_DEEP = "#0A5546";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const MUTED = "#6B7280";
const DANGER = "#DC2626";

// How many remarks show before "Show all"
const REMARKS_PREVIEW_COUNT = 4;

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
    "&.Mui-disabled": { color: "rgba(75, 85, 99, 0.72)" },
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

    "&.Mui-disabled": {
      bgcolor: "#F3F5F4",
      "& fieldset": { borderColor: HAIRLINE },
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,
    "&::placeholder": { color: INK_MUTED, opacity: 0.65 },
    "&.Mui-disabled": { WebkitTextFillColor: INK_MUTED },
  },

  "& .MuiSelect-select": { fontSize: 14 },

  "& .MuiFormHelperText-root": {
    mx: 0.5,
    mt: 0.5,
    color: INK_MUTED,
    fontSize: 11.5,
    "&.Mui-error": { color: DANGER },
  },
};

// =================================================
// HELPERS
// =================================================

const formatJapanDate = (value: string | undefined, locale: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getInitials = (name?: string) => {
  if (!name) {
    return "?";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// =================================================
// REMARKS
// =================================================

const Remarks = ({ clientId }: RemarksProps) => {
  const locale = useLocale();
  const t = useLocalTranslations();

  const {
    user,

    remarks,

    control,
    errors,
    handleSubmit,

    onSubmit,

    isRemarksLoading,

    isSubmitting,
    isCreatingRemark,

    serverError,
    loadError,
  } = useRemarksHook(clientId);

  const loading = isSubmitting || isCreatingRemark;

  const [showAllRemarks, setShowAllRemarks] = useState(false);

  const canCollapseRemarks = remarks.length > REMARKS_PREVIEW_COUNT;

  const visibleRemarks =
    showAllRemarks || !canCollapseRemarks
      ? remarks
      : remarks.slice(0, REMARKS_PREVIEW_COUNT);

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
        }}
      >
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

          {!isRemarksLoading && !loadError && remarks.length > 0 && (
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
              {remarks.length}
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

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.45fr) minmax(0, 1fr)",
          },
          gap: { xs: 2.5, lg: 3 },
          alignItems: "start",
        }}
      >
        {/* =================================================
            NEW REMARK FORM
            On mobile it comes first so the person can add a
            note without scrolling past a long history.
        ================================================= */}

        <Box
          sx={{
            order: { xs: 1, lg: 2 },
            p: { xs: 1.75, sm: 2.25 },
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 3,
            bgcolor: SURFACE_ALT,
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
            {t("form.title")}
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ ...errorAlertSx, mb: 1.5 }}>
              {translateServerMessage(serverError, locale, t, "saveFailed")}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            {/* DATE + MEDIUM */}

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
                name="remarkDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    required
                    fullWidth
                    size="small"
                    label={t("form.date")}
                    error={Boolean(errors.remarkDate)}
                    helperText={translateValidationError(errors.remarkDate?.message, t)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="medium"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    size="small"
                    label={t("form.medium")}
                    error={Boolean(errors.medium)}
                    helperText={translateValidationError(errors.medium?.message, t)}
                    sx={fieldSx}
                  >
                    <MenuItem value="">{t("form.selectMedium")}</MenuItem>

                    {REMARK_MEDIUMS.map((medium) => (
                      <MenuItem key={medium} value={medium}>
                        {t(`mediums.${medium}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            {/* STAFF / CREATOR */}

            <TextField
              fullWidth
              disabled
              size="small"
              label={t("form.staff")}
              value={
                user
                  ? user.role === "staff"
                    ? `${user.name} (${user.staffId})`
                    : user.name
                  : ""
              }
              helperText={t("form.staffHelper")}
              sx={fieldSx}
            />

            {/* MEMO */}

            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  multiline
                  minRows={4}
                  size="small"
                  label={t("form.memo")}
                  placeholder={t("form.memoPlaceholder")}
                  error={Boolean(errors.remarks)}
                  helperText={translateValidationError(errors.remarks?.message, t)}
                  sx={fieldSx}
                />
              )}
            />

            {/* SAVE */}

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveOutlinedIcon />
                )
              }
              sx={{
                alignSelf: { xs: "stretch", sm: "flex-end" },
                minHeight: 40,
                px: 2.5,
                bgcolor: BRAND,
                color: "#ffffff",
                borderRadius: 2,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: BRAND_HOVER },
                "&.Mui-disabled": {
                  bgcolor: "rgba(16, 122, 100, 0.45)",
                  color: "#ffffff",
                },
              }}
            >
              {loading ? t("actions.saving") : t("actions.save")}
            </Button>
          </Box>
        </Box>

        {/* =================================================
            REMARK HISTORY
        ================================================= */}

        <Box sx={{ order: { xs: 2, lg: 1 }, minWidth: 0 }}>
          <Typography
            component="h3"
            sx={{
              mb: 1.5,
              color: INK,
              fontSize: 14.5,
              fontWeight: 700,
            }}
          >
            {t("history")}
          </Typography>

          {isRemarksLoading && (
            <Box
              sx={{
                minHeight: 140,
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

          {loadError && (
            <Alert severity="error" sx={errorAlertSx}>
              {translateServerMessage(loadError, locale, t, "loadFailed")}
            </Alert>
          )}

          {!isRemarksLoading && !loadError && remarks.length === 0 && (
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
                <ChatBubbleOutlineRoundedIcon fontSize="small" />
              </Box>

              <Typography sx={{ color: INK_MUTED, fontSize: 13.5 }}>
                {t("empty")}
              </Typography>
            </Box>
          )}

          {!isRemarksLoading && remarks.length > 0 && (
            <Box>
              <Box
                sx={{
                  // Collapsed: only the first few remarks. Expanded: scrolls
                  // inside a fixed height so the section never keeps growing.
                  maxHeight: showAllRemarks ? { xs: 480, lg: 600 } : "none",
                  overflowY: showAllRemarks ? "auto" : "visible",
                  pr: showAllRemarks ? 1 : 0,
                  mr: showAllRemarks ? -1 : 0,
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(17,24,39,0.18) transparent",
                }}
              >
                {visibleRemarks.map((remark, index) => {
                  const isLast = index === visibleRemarks.length - 1;

                  return (
                    <Box
                      key={remark._id}
                      sx={{
                        position: "relative",
                        pl: { xs: 5, sm: 5.5 },
                        pb: isLast ? 0 : 2,

                        // Timeline rail
                        "&::before": isLast
                          ? undefined
                          : {
                              content: '""',
                              position: "absolute",
                              left: 15,
                              top: 34,
                              bottom: 2,
                              width: 2,
                              borderRadius: 1,
                              bgcolor: HAIRLINE,
                            },
                      }}
                    >
                      {/* AVATAR */}

                      <Box
                        aria-hidden
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 32,
                          height: 32,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          bgcolor: BRAND_SOFT,
                          color: BRAND_DEEP,
                          border: "2px solid #ffffff",
                          boxShadow: `0 0 0 1px ${HAIRLINE}`,
                          fontSize: 11.5,
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {getInitials(remark.staffName)}
                      </Box>

                      {/* HEADER */}

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          columnGap: 1,
                          rowGap: 0.25,
                          minHeight: 32,
                        }}
                      >
                        <Typography
                          sx={{
                            color: INK,
                            fontSize: 13.5,
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {remark.staffName}

                          <Box
                            component="span"
                            sx={{
                              ml: 0.5,
                              color: MUTED,
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {remark.staffId
                              ? `(${remark.staffId})`
                              : `(${t("admin")})`}
                          </Box>
                        </Typography>

                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1,
                            py: 0.3,
                            borderRadius: 999,
                            bgcolor: BRAND_SOFT,
                            color: BRAND,
                            fontSize: 11.5,
                            fontWeight: 600,
                            lineHeight: 1.3,
                          }}
                        >
                          {t(`mediums.${remark.medium}`)}
                        </Box>

                        <Typography
                          component="time"
                          sx={{
                            ml: { sm: "auto" },
                            flexBasis: { xs: "100%", sm: "auto" },
                            color: MUTED,
                            fontSize: 12,
                            fontWeight: 500,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {formatJapanDate(remark.remarkDate, locale)}
                        </Typography>
                      </Box>

                      {/* MEMO */}

                      <Box
                        sx={{
                          mt: 0.75,
                          px: 1.5,
                          py: 1.25,
                          border: `1px solid ${HAIRLINE}`,
                          borderRadius: 2.5,
                          borderTopLeftRadius: 4,
                          bgcolor: SURFACE_ALT,
                        }}
                      >
                        <Typography
                          sx={{
                            color: INK,
                            fontSize: 13.5,
                            lineHeight: 1.65,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {remark.remarks}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {canCollapseRemarks && (
                <Button
                  type="button"
                  size="small"
                  onClick={() => setShowAllRemarks((prev) => !prev)}
                  endIcon={
                    showAllRemarks ? (
                      <ExpandLessRoundedIcon />
                    ) : (
                      <ExpandMoreRoundedIcon />
                    )
                  }
                  sx={{
                    mt: 1.5,
                    ml: { xs: 5, sm: 5.5 },
                    color: BRAND,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: BRAND_SOFT },
                  }}
                >
                  {showAllRemarks
                    ? t("showLess")
                    : t("showAll", {count: remarks.length})}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Remarks;