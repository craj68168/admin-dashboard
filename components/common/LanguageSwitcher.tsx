"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

import {
  Locale,
  useLanguage,
} from "@/app/providers/language-provider";

// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  const handleLanguageChange = (language: Locale) => {
    changeLanguage(language);
  };

  return (
    <Box
      sx={{
        position: "relative",

        display: "grid",
        gridTemplateColumns: "1fr 1fr",

        width: 150,
        height: 42,

        p: "3px",

        bgcolor: "#ffffff",

        border: `1px solid ${HAIRLINE}`,

        borderRadius: 2.5,

        boxShadow:
          "0 1px 2px rgba(17,24,39,0.03), 0 6px 18px -14px rgba(17,24,39,0.35)",

        overflow: "hidden",
      }}
    >
      {/* =============================================
          ANIMATED ACTIVE BACKGROUND
      ============================================= */}

      <Box
        sx={{
          position: "absolute",

          top: 3,
          bottom: 3,
          left: 3,

          width: "calc(50% - 3px)",

          bgcolor: BRAND,

          borderRadius: 2,

          boxShadow:
            "0 4px 12px -6px rgba(16,122,100,0.65)",

          transform:
            locale === "ja"
              ? "translateX(100%)"
              : "translateX(0)",

          transition:
            "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms ease",

          pointerEvents: "none",
        }}
      />

      {/* =============================================
          ENGLISH
      ============================================= */}

      <ButtonBase
        aria-label="Switch language to English"
        aria-pressed={locale === "en"}
        onClick={() => handleLanguageChange("en")}
        sx={{
          position: "relative",

          zIndex: 1,

          height: "100%",

          borderRadius: 2,

          color: locale === "en" ? "#ffffff" : INK_MUTED,

          fontSize: 12.5,

          fontWeight: 600,

          letterSpacing: "0.01em",

          transition:
            "color 200ms ease, transform 200ms ease",

          "&:hover": {
            color:
              locale === "en"
                ? "#ffffff"
                : BRAND,

            transform: "translateY(-1px)",
          },

          "&:active": {
            transform: "scale(0.96)",
          },

          "&:focus-visible": {
            outline: `2px solid ${BRAND}`,
            outlineOffset: -2,
          },
        }}
      >
        EN
      </ButtonBase>

      {/* =============================================
          JAPANESE
      ============================================= */}

      <ButtonBase
        aria-label="Switch language to Japanese"
        aria-pressed={locale === "ja"}
        onClick={() => handleLanguageChange("ja")}
        sx={{
          position: "relative",

          zIndex: 1,

          height: "100%",

          borderRadius: 2,

          color: locale === "ja" ? "#ffffff" : INK_MUTED,

          fontSize: 12.5,

          fontWeight: 600,

          letterSpacing: "0.01em",

          transition:
            "color 200ms ease, transform 200ms ease",

          "&:hover": {
            color:
              locale === "ja"
                ? "#ffffff"
                : BRAND,

            transform: "translateY(-1px)",
          },

          "&:active": {
            transform: "scale(0.96)",
          },

          "&:focus-visible": {
            outline: `2px solid ${BRAND}`,
            outlineOffset: -2,
          },
        }}
      >
        日本語
      </ButtonBase>
    </Box>
  );
}