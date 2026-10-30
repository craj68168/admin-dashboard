"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { createTranslator, useLocale } from "next-intl";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { useAdminDashboard } from "./hook";

const messages = {
  en: {
    title: "Admin Dashboard",
    description: "Recruitment, collections and staff performance overview.",
    performanceMonth: "Performance Month"
  },
  ja: {
    title: "管理者ダッシュボード",
    description: "採用、入金、スタッフ実績の概要を確認できます。",
    performanceMonth: "実績対象月"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
}

type Props = {
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    "selectedMonth" | "handleMonthChange"
  >;
};

const BRAND = "#107A64";
const BRAND_RING = "rgba(16, 122, 100, 0.20)";
const HAIRLINE = "#E5E7EB";
const FIELD_BORDER = "#CBD1D9";
const FIELD_BORDER_HOVER = "#9AA3AF";
const INK = "#0F172A";
const INK_MUTED = "#5B6472";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Entrance runs once on mount. The container only sequences its children, so
 * the divider underneath stays still; the text block and the month picker
 * rise 8px and fade in 50ms apart. Data changes never replay it.
 */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const fieldSx = {
  width: { xs: "100%", sm: "auto" },
  minWidth: { sm: 180 },
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "#ffffff",
    fontSize: 13,
    fontWeight: 500,
    color: INK,
    fontVariantNumeric: "tabular-nums",
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
    transition: "box-shadow 150ms ease",
    "& fieldset": {
      borderColor: FIELD_BORDER,
      transition: "border-color 150ms ease",
    },
    "&:hover fieldset": {
      borderColor: FIELD_BORDER_HOVER,
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 3px ${BRAND_RING}, 0 1px 2px rgba(16, 24, 40, 0.05)`,
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: 1,
    },
  },
  // Keep a comfortable touch target on phones and a compact desktop field.
  "& .MuiOutlinedInput-input": {
    py: { xs: "12px", sm: "8px" },
  },
  // the calendar affordance is the one clickable hint inside the field
  "& input::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
    opacity: 0.55,
    transition: "opacity 120ms ease",
  },
  "& input::-webkit-calendar-picker-indicator:hover": {
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    fontSize: 13,
    color: INK_MUTED,
    maxWidth: "calc(100% - 28px)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
  "@media (prefers-reduced-motion: reduce)": {
    "& .MuiOutlinedInput-root, & .MuiOutlinedInput-root fieldset, & input::-webkit-calendar-picker-indicator":
      {
        transition: "none",
      },
  },
};

export default function DashboardHeader({ data }: Props) {
  const { selectedMonth, handleMonthChange } = data;
  const t = useLocalTranslations();
  const reduceMotion = useReducedMotion();

  return (
    <Box
      component={motion.header}
      variants={containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-end" },
        justifyContent: "space-between",
        gap: { xs: 1.5, sm: 2 },
        pb: 2,
        borderBottom: "1px solid",
        borderColor: HAIRLINE,
      }}
    >
      <Box
        component={motion.div}
        variants={itemVariants}
        sx={{ minWidth: 0, flex: 1 }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 22, sm: 24, md: 28 },
            fontWeight: 700,
            letterSpacing: { xs: -0.5, md: -0.7 },
            lineHeight: 1.15,
            color: INK,
            overflowWrap: "anywhere",
          }}
        >
          {t("title")}
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            maxWidth: "62ch",
            fontSize: 13,
            lineHeight: 1.45,
            color: INK_MUTED,
          }}
        >
          {t("description")}
        </Typography>
      </Box>

      <Box
        component={motion.div}
        variants={itemVariants}
        sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}
      >
        <TextField
          type="month"
          size="small"
          label={t("performanceMonth")}
          value={selectedMonth}
          onChange={(event) => handleMonthChange(event.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={fieldSx}
        />
      </Box>
    </Box>
  );
}
