"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { createTranslator, useLocale } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MuiLink from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import type { UserRole } from "@/store/type";
import { LoginFormValues, loginSchema } from "./type";
import { useLoginHook } from "./hook";

type LoginComponentProps = {
  role?: UserRole;
};

type AppLocale = "en" | "ja";

// =================================================
// COPY (English / Japanese)
// =================================================

const messages = {
  en: {
    staffLogin: "Staff Login",
    adminLogin: "Admin Login",
    logoAlt: "Fortune Link logo",
    email: "Email",
    password: "Password",
    hidePassword: "Hide password",
    showPassword: "Show password",
    loggingIn: "Logging in...",
    login: "Login",
    forgotPassword: "Forgot password",
    emailRequired: "Email is required",
    invalidEmail: "Please enter a valid email address",
    passwordRequired: "Password is required",
    passwordTooShort: "Password must be at least 6 characters",
    signInAs: "Sign in as",
    tabAdmin: "Admin",
    tabStaff: "Staff",
    adminSubtitle: "Sign in to manage staff, clients and payments.",
    staffSubtitle: "Sign in to see your clients and this month's progress.",
    adminEyebrow: "Admin console",
    staffEyebrow: "Staff workspace",
    adminHeadline: "Everything your team collects, in one view.",
    staffHeadline: "Your clients and targets, ready every morning.",
    adminPanelText: "Review collections, staff targets and client progress.",
    staffPanelText: "Follow up with clients and see how your month is going.",
  },
  ja: {
    staffLogin: "スタッフログイン",
    adminLogin: "管理者ログイン",
    logoAlt: "Fortune Link ロゴ",
    email: "メールアドレス",
    password: "パスワード",
    hidePassword: "パスワードを非表示",
    showPassword: "パスワードを表示",
    loggingIn: "ログイン中...",
    login: "ログイン",
    forgotPassword: "パスワードをお忘れですか？",
    emailRequired: "メールアドレスを入力してください",
    invalidEmail: "有効なメールアドレスを入力してください",
    passwordRequired: "パスワードを入力してください",
    passwordTooShort: "パスワードは6文字以上で入力してください",
    signInAs: "ログインする役割",
    tabAdmin: "管理者",
    tabStaff: "スタッフ",
    adminSubtitle: "スタッフ・顧客・入金を管理するにはログインしてください。",
    staffSubtitle: "担当顧客と今月の進捗を見るにはログインしてください。",
    adminEyebrow: "管理コンソール",
    staffEyebrow: "スタッフワークスペース",
    adminHeadline: "チームの入金状況を、ひとつの画面で。",
    staffHeadline: "担当の顧客と目標を、毎朝すぐに確認。",
    adminPanelText: "入金、スタッフの目標、顧客の進捗を確認できます。",
    staffPanelText: "顧客のフォローと今月の進捗を確認できます。",
  },
};

const validationKeys = {
  "Email is required": "emailRequired",
  "Please enter a valid email address": "invalidEmail",
  "Password is required": "passwordRequired",
  "Password must be at least 6 characters": "passwordTooShort",
} as const;

// =================================================
// DESIGN
// =================================================

const BRAND = "#107A64";
const BRAND_DEEP = "#0B5546";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const PAGE_BG = "#F2F6F3";
const INK = "#0F172A";
const INK_MUTED = "#5B6A7E";
const DANGER = "#DC2626";

const ADMIN_ROLE: UserRole = "superadmin";
const STAFF_ROLE: UserRole = "staff";

const EASE = [0.22, 1, 0.36, 1] as const;

// Each login gets its own look. Admin is dark and formal, staff is light and
// friendly. Only colours live here; the layout is shared.
const THEMES = {
  admin: {
    panelBg: "#0A4A3D",
    text: "#FFFFFF",
    muted: "rgba(255, 255, 255, 0.74)",
    pillBg: "rgba(255, 255, 255, 0.12)",
    pillLine: "rgba(255, 255, 255, 0.22)",
    ring: "rgba(255, 255, 255, 0.10)",
  },
  staff: {
    panelBg: "#DCEEE7",
    text: INK,
    muted: "#3E5C54",
    pillBg: "rgba(16, 122, 100, 0.10)",
    pillLine: "rgba(16, 122, 100, 0.26)",
    ring: "rgba(16, 122, 100, 0.12)",
  },
} as const;

const inputSx = {
  height: 48,
  borderRadius: "14px",
  bgcolor: "#ffffff",
  fontSize: 15,
  transition: "box-shadow 200ms ease",
  "& .MuiInputAdornment-root": { color: INK_MUTED, transition: "color 200ms ease" },
  "&.Mui-focused .MuiInputAdornment-root": { color: BRAND },
  "& fieldset": { borderColor: "rgba(17, 24, 39, 0.14)" },
  "&:hover fieldset": { borderColor: "rgba(16, 122, 100, 0.45)" },
  "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(16, 122, 100, 0.12)" },
  "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 1 },
  "&.Mui-error fieldset": { borderColor: DANGER },
  "&.Mui-error.Mui-focused": { boxShadow: "0 0 0 4px rgba(220, 38, 38, 0.12)" },
} as const;

const labelSx = {
  display: "block",
  mb: 0.75,
  fontSize: 13,
  fontWeight: 600,
  color: INK,
} as const;

const errorSx = {
  pt: 0.5,
  fontSize: 12,
  fontWeight: 400,
  color: DANGER,
} as const;

const linkSx = {
  fontSize: 13,
  fontWeight: 600,
  color: BRAND,
  textDecoration: "none",
  "&:hover": { color: BRAND_DEEP, textDecoration: "underline" },
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
    borderRadius: 0.5,
  },
} as const;

// =================================================
// SMALL PIECES
// =================================================

// A message that eases in and out instead of popping.
function FieldError({ message, reduce }: { message?: string; reduce: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key={message}
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
          style={{ overflow: "hidden" }}
        >
          <Typography role="alert" sx={errorSx}>
            {message}
          </Typography>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Two blocks stacked in the same spot; the inactive one fades and drops away.
// Used for the left panel, which changes with the selected login.
function Swap({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <Box
      aria-hidden={!active}
      sx={{
        gridArea: "1 / 1",
        minWidth: 0,
        opacity: active ? 1 : 0,
        visibility: active ? "visible" : "hidden",
        transform: active ? "none" : "translateY(14px)",
        transition: `opacity 450ms ease, transform 450ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear ${active ? "0s" : "450ms"}`,
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          transform: "none",
        },
      }}
    >
      {children}
    </Box>
  );
}

function AdminArt() {
  const bars = [70, 110, 92, 150, 128, 190, 172, 232];
  return (
    <svg
      viewBox="0 0 440 280"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
    >
      {[56, 112, 168, 224].map((y) => (
        <line key={y} x1="0" x2="440" y1={y} y2={y} stroke="rgba(255,255,255,0.10)" />
      ))}
      {bars.map((height, index) => (
        <rect
          key={index}
          x={12 + index * 52}
          y={252 - height}
          width="34"
          height={height}
          rx="9"
          fill={index === bars.length - 1 ? "#7BD3BA" : "rgba(255,255,255,0.14)"}
        />
      ))}
      <path
        d="M29 196 C 80 180, 110 190, 150 150 S 230 120, 270 96 S 360 60, 429 26"
        fill="none"
        stroke="#C9F2E5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="429" cy="26" r="6" fill="#ffffff" stroke="#7BD3BA" strokeWidth="3" />
    </svg>
  );
}

function StaffArt() {
  const circumference = 2 * Math.PI * 70;
  const rows = [
    { y: 84, width: 150 },
    { y: 140, width: 112 },
    { y: 196, width: 76 },
  ];
  return (
    <svg
      viewBox="0 0 440 280"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
    >
      <g transform="rotate(-90 110 140)">
        <circle cx="110" cy="140" r="70" fill="none" stroke="rgba(16,122,100,0.14)" strokeWidth="26" />
        <circle
          cx="110"
          cy="140"
          r="70"
          fill="none"
          stroke={BRAND}
          strokeWidth="26"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.58} ${circumference}`}
        />
        <circle
          cx="110"
          cy="140"
          r="70"
          fill="none"
          stroke="#D9922B"
          strokeWidth="26"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.14} ${circumference}`}
          strokeDashoffset={-circumference * 0.66}
        />
      </g>
      {rows.map((row) => (
        <g key={row.y}>
          <circle cx="238" cy={row.y} r="14" fill="rgba(16,122,100,0.18)" />
          <rect x="264" y={row.y - 7} width="166" height="14" rx="7" fill="rgba(16,122,100,0.12)" />
          <rect x="264" y={row.y - 7} width={row.width} height="14" rx="7" fill={BRAND} />
        </g>
      ))}
    </svg>
  );
}

type RoleSwitchProps = {
  isStaff: boolean;
  disabled: boolean;
  reduce: boolean;
  label: string;
  adminLabel: string;
  staffLabel: string;
  onChange: (role: UserRole) => void;
};

// Admin | Staff, with a thumb that slides between them.
function RoleSwitch({
  isStaff,
  disabled,
  reduce,
  label,
  adminLabel,
  staffLabel,
  onChange,
}: RoleSwitchProps) {
  const options = [
    { role: ADMIN_ROLE, label: adminLabel, Icon: AdminPanelSettingsOutlinedIcon, active: !isStaff },
    { role: STAFF_ROLE, label: staffLabel, Icon: BadgeOutlinedIcon, active: isStaff },
  ];

  return (
    <Box
      role="group"
      aria-label={label}
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        p: 0.5,
        borderRadius: "16px",
        bgcolor: "rgba(17, 24, 39, 0.05)",
      }}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ x: isStaff ? "100%" : "0%" }}
        transition={
          reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }
        }
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 4,
          width: "calc(50% - 4px)",
          borderRadius: 12,
          background: "#ffffff",
          boxShadow:
            "0 1px 2px rgba(15,23,42,0.08), 0 8px 16px -10px rgba(15,23,42,0.35)",
        }}
      />

      {options.map(({ role, label: text, Icon, active }) => (
        <ButtonBase
          key={role}
          type="button"
          disabled={disabled}
          aria-pressed={active}
          onClick={() => onChange(role)}
          sx={{
            position: "relative",
            zIndex: 1,
            height: 44,
            gap: 1,
            borderRadius: "12px",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
            color: active ? BRAND : INK_MUTED,
            transition: "color 200ms ease",
            "&:hover": { color: active ? BRAND : INK },
            "&:focus-visible": { outline: `2px solid ${BRAND}`, outlineOffset: -2 },
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
          {text}
        </ButtonBase>
      ))}
    </Box>
  );
}

// =================================================
// PAGE
// =================================================

const LoginPanel = ({ role = ADMIN_ROLE }: LoginComponentProps) => {
  const locale = useLocale();
  const currentLocale: AppLocale = locale === "ja" ? "ja" : "en";
  const t = createTranslator({ locale, messages: messages[currentLocale] });
  const reduce = Boolean(useReducedMotion());

  const validationMessage = (message: string) => {
    const key = validationKeys[message as keyof typeof validationKeys];
    return key ? t(key) : message;
  };

  // Admin and staff share this one component, so switching is purely local
  // state: no navigation and no change to the address bar. (Rewriting the URL
  // with the History API can make a layout that keys on the pathname remount
  // the page, which snaps it back to the role it started with.)
  const [activeRole, setActiveRole] = useState<UserRole>(role);
  const isStaff = activeRole === STAFF_ROLE;
  const theme = isStaff ? THEMES.staff : THEMES.admin;

  // +1 slides content in from the right (admin to staff), -1 from the left.
  const [slideDirection, setSlideDirection] = useState(1);

  const [showPassword, setShowPassword] = useState(false);

  const { loginAsync, loading } = useLoginHook(activeRole);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginAsync(data);
  };

  const submitting = isSubmitting || loading;

  const switchRole = (next: UserRole) => {
    if (next === activeRole || submitting) {
      return;
    }

    setSlideDirection(next === STAFF_ROLE ? 1 : -1);
    setActiveRole(next);
    setShowPassword(false);
    reset();
  };

  const direction = reduce ? 0 : slideDirection;

  const panelTransition = "background-color 500ms ease, color 500ms ease";

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: "minmax(0, 1.05fr) minmax(0, 1fr)",
        },
        gridTemplateRows: { xs: "auto 1fr", md: "auto" },
        bgcolor: PAGE_BG,
      }}
    >
      {/* LANGUAGE TOGGLE */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 28 },
          zIndex: 3,
        }}
      >
        <LanguageSwitcher />
      </Box>

      {/* =================================================
          LEFT: the brand panel, recoloured for each login
      ================================================= */}

      <Box
        component="aside"
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 3,
          m: { xs: 0, md: 2 },
          p: { xs: "20px 20px 24px", md: 4, lg: 6 },
          borderRadius: { xs: "0 0 28px 28px", md: "28px" },
          bgcolor: theme.panelBg,
          color: theme.text,
          transition: panelTransition,
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        {/* Decorative rings */}
        <Box
          aria-hidden
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            top: -140,
            right: -140,
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: `1px solid ${theme.ring}`,
            boxShadow: `0 0 0 56px ${theme.ring}, 0 0 0 112px ${theme.ring}`,
            transition: "border-color 500ms ease, box-shadow 500ms ease",
            pointerEvents: "none",
          }}
        />

        {/* Brand row + role eyebrow */}
        <Box sx={{ position: "relative", display: "grid", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                height: 48,
                px: 1.5,
                borderRadius: "14px",
                bgcolor: "#ffffff",
                boxShadow: "0 8px 20px -12px rgba(0,0,0,0.45)",
              }}
            >
              <Image
                src="/company_logo.png"
                alt={t("logoAlt")}
                width={72}
                height={30}
                priority
                style={{ width: 72, height: "auto" }}
              />
            </Box>
          </Box>

          {/* <Box sx={{ display: "grid" }}>
            {[
              { active: !isStaff, label: t("adminEyebrow"), Icon: AdminPanelSettingsOutlinedIcon },
              { active: isStaff, label: t("staffEyebrow"), Icon: BadgeOutlinedIcon },
            ].map(({ active, label, Icon }) => (
              <Swap key={label} active={active}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.5,
                    py: 0.625,
                    borderRadius: 999,
                    bgcolor: theme.pillBg,
                    border: `1px solid ${theme.pillLine}`,
                    fontSize: 13,
                    fontWeight: 600,
                    transition: panelTransition,
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {label}
                </Box>
              </Swap>
            ))}
          </Box> */}
        </Box>

        {/* Headline (large screens only) */}
        <Box
          sx={{
            position: "relative",
            display: { xs: "none", md: "grid" },
            alignContent: "end",
          }}
        >
          {[
            { active: !isStaff, headline: t("adminHeadline"), text: t("adminPanelText") },
            { active: isStaff, headline: t("staffHeadline"), text: t("staffPanelText") },
          ].map(({ active, headline, text }) => (
            <Swap key={headline} active={active}>
              <Typography
                component="p"
                sx={{
                  maxWidth: 440,
                  fontSize: { md: 30, lg: 38 },
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: -1,
                  color: theme.text,
                  transition: panelTransition,
                }}
              >
                {headline}
              </Typography>
              <Typography
                sx={{
                  mt: 1.5,
                  maxWidth: 400,
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.55,
                  color: theme.muted,
                  transition: panelTransition,
                }}
              >
                {text}
              </Typography>
            </Swap>
          ))}
        </Box>

        {/* Illustration (large screens only) */}
        <Box
          aria-hidden
          sx={{
            position: "relative",
            display: { xs: "none", md: "grid" },
            height: { md: 220, lg: 280 },
          }}
        >
          <Swap active={!isStaff}>
            <Box sx={{ height: "100%" }}>
              <AdminArt />
            </Box>
          </Swap>
          <Swap active={isStaff}>
            <Box sx={{ height: "100%" }}>
              <StaffArt />
            </Box>
          </Swap>
        </Box>
      </Box>

      {/* =================================================
          RIGHT: the form
      ================================================= */}

      <Box
        component="main"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 4, md: 8 },
        }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <RoleSwitch
            isStaff={isStaff}
            disabled={submitting}
            reduce={reduce}
            label={t("signInAs")}
            adminLabel={t("tabAdmin")}
            staffLabel={t("tabStaff")}
            onChange={switchRole}
          />

          {/* Keyed by role: switching mounts a fresh copy that slides in from
              the side you moved towards. */}
          <motion.div
            key={activeRole}
            initial={reduce ? false : { opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: EASE }}
          >
            <>
              {/* HEADING */}
              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 48,
                    height: 48,
                    mb: 2,
                    borderRadius: "14px",
                    bgcolor: BRAND_SOFT,
                    color: BRAND,
                  }}
                >
                  {isStaff ? (
                    <BadgeOutlinedIcon sx={{ fontSize: 24 }} />
                  ) : (
                    <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 24 }} />
                  )}
                </Box>

                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 26, sm: 30 },
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: -0.9,
                    color: INK,
                  }}
                >
                  {t(isStaff ? "staffLogin" : "adminLogin")}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.55,
                    color: INK_MUTED,
                  }}
                >
                  {t(isStaff ? "staffSubtitle" : "adminSubtitle")}
                </Typography>
              </Box>

              {/* FORM */}
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 3.5, display: "flex", flexDirection: "column", gap: 2.25 }}
              >
                {/* EMAIL */}
                <Box>
                  <Typography component="label" htmlFor="email" sx={labelSx}>
                    {t("email")}
                  </Typography>

                  <OutlinedInput
                    {...register("email")}
                    id="email"
                    type="email"
                    fullWidth
                    autoComplete="email"
                    autoFocus
                    placeholder="yamada@example.com"
                    error={Boolean(errors.email)}
                    aria-invalid={Boolean(errors.email)}
                    sx={inputSx}
                    startAdornment={
                      <InputAdornment position="start">
                        <MailOutlineRoundedIcon fontSize="small" />
                      </InputAdornment>
                    }
                  />

                  <FieldError
                    reduce={reduce}
                    message={
                      errors.email?.message
                        ? validationMessage(errors.email.message)
                        : undefined
                    }
                  />
                </Box>

                {/* PASSWORD */}
                <Box>
                  <Typography component="label" htmlFor="password" sx={labelSx}>
                    {t("password")}
                  </Typography>

                  <OutlinedInput
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    autoComplete="current-password"
                    placeholder="**************"
                    error={Boolean(errors.password)}
                    aria-invalid={Boolean(errors.password)}
                    sx={inputSx}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          aria-label={t(showPassword ? "hidePassword" : "showPassword")}
                          onClick={() => setShowPassword((previous) => !previous)}
                          edge="end"
                          size="small"
                          sx={{
                            color: INK_MUTED,
                            "&:hover": { color: BRAND, bgcolor: BRAND_SOFT },
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />

                  <FieldError
                    reduce={reduce}
                    message={
                      errors.password?.message
                        ? validationMessage(errors.password.message)
                        : undefined
                    }
                  />

                  <Box sx={{ mt: 1.25, textAlign: "right" }}>
                    <MuiLink
                      component={NextLink}
                      href={isStaff ? "/staff/forgot-password" : "/forgot-password"}
                      sx={linkSx}
                    >
                      {t("forgotPassword")}
                    </MuiLink>
                  </Box>
                </Box>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disableElevation
                  disabled={submitting}
                  endIcon={
                    submitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <ArrowForwardRoundedIcon
                        sx={{ transition: "transform 200ms ease" }}
                      />
                    )
                  }
                  sx={{
                    mt: 0.5,
                    height: 50,
                    borderRadius: "14px",
                    bgcolor: BRAND,
                    fontSize: 15,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 12px 24px -14px rgba(16, 122, 100, 0.9)",
                    transition:
                      "background-color 200ms ease, transform 120ms ease, box-shadow 200ms ease",
                    "&:hover": {
                      bgcolor: BRAND_DEEP,
                      "& .MuiButton-endIcon svg": { transform: "translateX(3px)" },
                    },
                    "&:active": { transform: "scale(0.985)" },
                    "&.Mui-disabled": {
                      bgcolor: "rgba(16, 122, 100, 0.5)",
                      color: "#ffffff",
                      boxShadow: "none",
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "none",
                      "&:hover .MuiButton-endIcon svg": { transform: "none" },
                    },
                  }}
                >
                  {t(submitting ? "loggingIn" : "login")}
                </Button>
              </Box>
            </>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
};

export default function LoginComponent({ role = ADMIN_ROLE }: LoginComponentProps) {
  return <LoginPanel key={role} role={role} />;
}
