"use client";

import { useEffect, useMemo } from "react";
import { createTranslator, useLocale } from "next-intl";
import { getApiErrorMessage } from "@/lib/api-message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useEditStaffHook } from "./hook";
import {
  STAFF_LOCATIONS,
  createStaffEditSchema,
  type StaffEditFormValues,
} from "./types";

const messages = {
  en: {
    backToStaff: "Back to Staff",
    title: "Edit Staff Member",
    description: "Update the staff member's account details.",
    loading: "Loading staff details...",
    notFound: "Staff member could not be found.",
    saveChanges: "Save changes",
    saving: "Saving...",
    updateError: "Unable to update staff member.",
    fields: {
      name: {
        label: "Name",
        placeholder: "Enter staff name"
      },
      phone: {
        label: "Phone",
        placeholder: "Enter phone number"
      },
      email: {
        label: "Email",
        placeholder: "yamada@example.com"
      },
      location: {
        label: "Location",
        placeholder: "Select location"
      }
    },
    locations: {
      USA: "USA",
      Japan: "Japan",
      Nepal: "Nepal",
      Other: "Other"
    },
    validation: {
      nameRequired: "Name is required",
      emailInvalid: "Please enter a valid email address",
      locationRequired: "Location is required",
      phoneRequired: "Phone is required",
      invalid: "Please check this field."
    },
    loadError: "Unable to load staff details. Please try again.",
    requestTimeout: "The request timed out. Please try again.",
    requestFailed: "Request failed with status code {status}.",
    errors: {
      staffNotFound: "Staff not found.",
      failedToGetStaff: "Failed to get staff.",
      failedToUpdateStaff: "Failed to update staff.",
      nameRequired: "Name cannot be empty.",
      phoneRequired: "Phone cannot be empty.",
      locationRequired: "Location cannot be empty.",
      emailRequired: "Email cannot be empty.",
      emailInUse: "Another staff member already uses this email.",
      adminEmailInUse: "This email is already used by an Admin account.",
      duplicateStaff: "Email or Staff ID already exists.",
      passwordMin: "Password must be at least 6 characters.",
      network: "Network Error",
      fetch: "Failed to fetch",
      aborted: "Request aborted",
      canceled: "canceled",
      authentication: "Authentication required",
      tokenFormat: "Invalid token format",
      missingToken: "Token not provided",
      invalidRole: "Invalid user role",
      accountRemoved: "User account no longer exists",
      accountDisabled: "Your account has been disabled",
      tokenExpired: "Token expired",
      invalidToken: "Invalid or expired token",
      forbidden: "You are not authorized to access this resource",
      internalServer: "Internal Server Error",
      server: "Server error"
    }
  },
  ja: {
    backToStaff: "スタッフ一覧へ戻る",
    title: "スタッフを編集",
    description: "スタッフのアカウント情報を更新します。",
    loading: "スタッフ詳細を読み込み中...",
    notFound: "スタッフが見つかりませんでした。",
    saveChanges: "変更を保存",
    saving: "保存中...",
    updateError: "スタッフを更新できませんでした。",
    fields: {
      name: {
        label: "氏名",
        placeholder: "スタッフ名を入力"
      },
      phone: {
        label: "電話番号",
        placeholder: "電話番号を入力"
      },
      email: {
        label: "メール",
        placeholder: "yamada@example.com"
      },
      location: {
        label: "所在地",
        placeholder: "所在地を選択"
      }
    },
    locations: {
      USA: "アメリカ",
      Japan: "日本",
      Nepal: "ネパール",
      Other: "その他"
    },
    validation: {
      nameRequired: "氏名は必須です",
      emailInvalid: "有効なメールアドレスを入力してください",
      locationRequired: "所在地は必須です",
      phoneRequired: "電話番号は必須です",
      invalid: "入力内容を確認してください。"
    },
    loadError: "スタッフ情報を読み込めませんでした。もう一度お試しください。",
    requestTimeout: "リクエストがタイムアウトしました。もう一度お試しください。",
    requestFailed: "リクエストに失敗しました（ステータスコード：{status}）。",
    errors: {
      staffNotFound: "スタッフが見つかりません。",
      failedToGetStaff: "スタッフ情報を取得できませんでした。",
      failedToUpdateStaff: "スタッフ情報を更新できませんでした。",
      nameRequired: "氏名を入力してください。",
      phoneRequired: "電話番号を入力してください。",
      locationRequired: "所在地を選択してください。",
      emailRequired: "メールアドレスを入力してください。",
      emailInUse: "このメールアドレスは別のスタッフが使用しています。",
      adminEmailInUse: "このメールアドレスは管理者アカウントで使用されています。",
      duplicateStaff: "メールアドレスまたはスタッフIDがすでに使用されています。",
      passwordMin: "パスワードは6文字以上で入力してください。",
      network: "ネットワークに接続できません。接続を確認してください。",
      fetch: "データを取得できませんでした。接続を確認してください。",
      aborted: "リクエストが中断されました。",
      canceled: "リクエストがキャンセルされました。",
      authentication: "ログインが必要です。",
      tokenFormat: "認証トークンの形式が正しくありません。",
      missingToken: "認証トークンが指定されていません。",
      invalidRole: "ユーザー権限が正しくありません。",
      accountRemoved: "ユーザーアカウントが存在しません。",
      accountDisabled: "アカウントは無効になっています。",
      tokenExpired: "認証トークンの有効期限が切れています。",
      invalidToken: "認証トークンが無効か、期限切れです。",
      forbidden: "この情報にアクセスする権限がありません。",
      internalServer: "サーバー内部でエラーが発生しました。",
      server: "サーバーエラーが発生しました。"
    }
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return useMemo(
    () => createTranslator({
      locale,
      messages: messages[locale === "ja" ? "ja" : "en"],
    }),
    [locale],
  );
}

// Store message keys so existing field errors follow language changes immediately.
const staffEditSchema = createStaffEditSchema({
  nameRequired: "validation.nameRequired",
  emailInvalid: "validation.emailInvalid",
  locationRequired: "validation.locationRequired",
  phoneRequired: "validation.phoneRequired",
});


// =================================================
// THEME TOKENS (matches Add Staff / dashboards / sidebar)
// =================================================

const BRAND = "#107A64";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  borderRadius: 3,

  border: "1px solid",

  borderColor: HAIRLINE,

  bgcolor: "#ffffff",

  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const fieldLabelSx = {
  display: "block",

  mb: 0.75,

  fontSize: 13,

  fontWeight: 600,

  color: INK,
};

const fieldInputSx = {
  height: 44,

  borderRadius: 2,

  bgcolor: "#ffffff",

  fontSize: 14,

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(17, 24, 39, 0.12)",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(16, 122, 100, 0.4)",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: BRAND,

    borderWidth: 1,
  },

  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#DC2626",
  },
};

const fieldErrorSx = {
  mt: 0.5,

  fontSize: 12,

  color: "#DC2626",
};

const defaultValues: StaffEditFormValues = {
  name: "",
  phone: "",
  location: "",
  email: "",
};

export default function EditStaff() {
  const locale = useLocale();
  const t = useLocalTranslations();
  const { staff, isLoading, isError, errorMessage, updateStaff } =
    useEditStaffHook();


  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffEditFormValues>({
    resolver: zodResolver(staffEditSchema),
    defaultValues,
  });

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name ?? "",
        phone: staff.phone ?? "",
        location: staff.location ?? "",
        email: staff.email ?? "",
      });
    }
  }, [reset, staff]);

  const onSubmit = (values: StaffEditFormValues) => {
    updateStaff.mutate(values);
  };

  if (isLoading) {
    return <StatusScreen message={t("loading")} loading />;
  }

  if (isError || !staff) {
    return (
      <StatusScreen
        message={
          isError
            ? translateStaffError(errorMessage, locale, t, "loadError")
            : t("notFound")
        }
      />
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F8F6" }}>
      <Box
        component="main"
        sx={{
          maxWidth: 900,

          mx: "auto",

          px: { xs: 2, sm: 3, md: 4 },

          py: { xs: 3, md: 4 },
        }}
      >
        {/* BACK LINK */}

        <Box
          component="a"
          href="/admin/staff"
          sx={{
            display: "inline-flex",

            alignItems: "center",

            gap: 0.75,

            mb: 2.5,

            fontSize: 13,

            fontWeight: 600,

            color: INK_MUTED,

            textDecoration: "none",

            transition: "color 200ms ease",

            "&:hover": {
              color: BRAND,
            },
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
          {t("backToStaff")}
        </Box>

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 2,

            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "grid",

              placeItems: "center",

              flexShrink: 0,

              width: 48,

              height: 48,

              borderRadius: 2.5,

              bgcolor: "rgba(16, 122, 100, 0.08)",

              color: BRAND,
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 26 },
                fontWeight: 600,
                letterSpacing: -0.4,
                color: INK,
              }}
            >
              {t("title")}
            </Typography>

            <Typography sx={{ mt: 0.5, fontSize: 14, color: INK_MUTED }}>
              {t("description")}
            </Typography>
          </Box>
        </Box>

        {/* FORM CARD */}

        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ ...softCard, p: { xs: 2.5, sm: 4 } }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },

              gap: { xs: 2, sm: 2.5 },
            }}
          >
            <FormInput
              id="name"
              label={t("fields.name.label")}
              register={register("name")}
              error={translateValidationError(errors.name?.message, t)}
              placeholder={t("fields.name.placeholder")}
              autoFocus
            />

            <FormInput
              id="phone"
              label={t("fields.phone.label")}
              type="tel"
              register={register("phone")}
              error={translateValidationError(errors.phone?.message, t)}
              placeholder={t("fields.phone.placeholder")}
            />

            <FormInput
              id="email"
              label={t("fields.email.label")}
              type="email"
              register={register("email")}
              error={translateValidationError(errors.email?.message, t)}
              placeholder={t("fields.email.placeholder")}
            />

            {/* Location */}
            <Box>
              <FieldLabel htmlFor="location">
                {t("fields.location.label")}
              </FieldLabel>

              <Select
                {...register("location")}
                id="location"
                fullWidth
                displayEmpty
                error={Boolean(errors.location)}
                defaultValue=""
                sx={fieldInputSx}
              >
                <MenuItem value="" disabled>
                  {t("fields.location.placeholder")}
                </MenuItem>

                {STAFF_LOCATIONS.map((location) => (
                  <MenuItem key={location} value={location}>
                    {t(`locations.${location}`)}
                  </MenuItem>
                ))}
              </Select>

              <ErrorMessage message={translateValidationError(errors.location?.message, t)} />
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",

                justifyContent: "flex-end",

                gridColumn: { xs: "auto", md: "1 / -1" },

                mt: 1,

                pt: 2,

                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={updateStaff.isPending}
                sx={{
                  height: 44,

                  px: 3.5,

                  borderRadius: 2.5,

                  textTransform: "none",

                  fontWeight: 600,

                  fontSize: 14,

                  bgcolor: BRAND,

                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: "#0C5F4F",

                    boxShadow: "none",
                  },

                  "&.Mui-disabled": {
                    bgcolor: "rgba(16, 122, 100, 0.35)",

                    color: "#ffffff",
                  },
                }}
              >
                {updateStaff.isPending ? t("saving") : t("saveChanges")}
              </Button>
            </Box>
          </Box>

          {updateStaff.isError && (
            <Typography
              role="alert"
              sx={{ mt: 2, fontSize: 13, color: "#DC2626" }}
            >
              {translateStaffError(updateStaff.error, locale, t, "updateError")}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

// =================================================
// FIELD PRIMITIVES
// =================================================

type FormInputProps = {
  id: keyof StaffEditFormValues;
  label: string;
  type?: "text" | "tel" | "email" | "password";
  register: ReturnType<
    ReturnType<typeof useForm<StaffEditFormValues>>["register"]
  >;
  error?: string;
  placeholder: string;
  autoFocus?: boolean;
  autoComplete?: string;
};

function FormInput({
  id,
  label,
  type = "text",
  register,
  error,
  placeholder,
  autoFocus,
  autoComplete,
}: FormInputProps) {
  return (
    <Box>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <OutlinedInput
        {...register}
        id={id}
        type={type}
        fullWidth
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={Boolean(error)}
        aria-invalid={Boolean(error)}
        sx={fieldInputSx}
      />

      <ErrorMessage message={error} />
    </Box>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Typography component="label" htmlFor={htmlFor} sx={fieldLabelSx}>
      {children}
    </Typography>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  return message ? (
    <Typography role="alert" sx={fieldErrorSx}>
      {message}
    </Typography>
  ) : null;
}

// =================================================
// LOADING / ERROR STATE
// =================================================

function StatusScreen({
  message,
  loading,
}: {
  message: string;
  loading?: boolean;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#F7F8F6",

        display: "grid",

        placeItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        {loading && (
          <CircularProgress size={24} sx={{ color: BRAND, mb: 1.5 }} />
        )}

        <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

type StaffTranslator = ReturnType<typeof useLocalTranslations>;

function translateValidationError(message: string | undefined, t: StaffTranslator) {
  if (!message) return undefined;
  const key = (Object.keys(messages.en.validation) as Array<keyof typeof messages.en.validation>)
    .find((key) => `validation.${key}` === message);
  return t(key ? `validation.${key}` : "validation.invalid");
}

function translateStaffError(
  error: unknown,
  locale: string,
  t: StaffTranslator,
  fallback: "loadError" | "updateError",
) {
  const message = (typeof error === "string" ? error : getApiErrorMessage(error)).trim();
  if (!message || message === "Something went wrong") return t(fallback);

  const normalize = (value: string) => value.replace(/[.!]+$/, "").toLowerCase();
  const key = (Object.keys(messages.en.errors) as Array<keyof typeof messages.en.errors>)
    .find((key) => normalize(messages.en.errors[key]) === normalize(message));
  if (key) return t(`errors.${key}`);

  const status = /^Request failed with status code (\d+)\.?$/i.exec(message);
  if (status) return t("requestFailed", { status: status[1] });
  if (/^timeout of \d+ms exceeded$/i.test(message)) return t("requestTimeout");

  // Keep English diagnostics; unexpected errors still get a Japanese fallback.
  return locale === "ja" ? t(fallback) : message;
}
