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
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK_MUTED = "#4B5563";

// =================================================
// RESPONSIVE RULES
//
// The switcher sits inside the navbar, so it answers to the navbar's width
// (the "navbar" container defined in Navbar.tsx), not the screen's. Outside the
// navbar there is no such container and it simply stays at its compact size.
//
//   navbar width   size
//   < 480          84 x 32, 11.5px text (matches the 32px avatar beside it)
//   480 - 559      100 x 36, 12px text
//   560 - 959      120 x 40, 12.5px text
//   >= 960         148 x 44, 13px text
//
// Heights are chosen to sit level with the profile chip beside it.
// =================================================

const atLeast = (width: number) =>
  `@container navbar (min-width: ${width}px)`;

const OPTIONS: { value: Locale; label: string; aria: string }[] = [
  { value: "en", label: "EN", aria: "Switch language to English" },
  { value: "ja", label: "日本語", aria: "Switch language to Japanese" },
];

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  const activeIndex = Math.max(
    OPTIONS.findIndex((option) => option.value === locale),
    0,
  );

  return (
    <Box
      role="group"
      aria-label="Language"
      sx={{
        position: "relative",
        flexShrink: 0,

        display: "grid",
        gridTemplateColumns: "1fr 1fr",

        // Sizes follow the navbar's width (see RESPONSIVE RULES).
        "--lang-font-size": "11.5px",
        width: 84,
        height: 32,
        [atLeast(480)]: {
          "--lang-font-size": "12px",
          width: 100,
          height: 36,
        },
        [atLeast(560)]: {
          "--lang-font-size": "12.5px",
          width: 120,
          height: 40,
        },
        [atLeast(960)]: {
          "--lang-font-size": "13px",
          width: 148,
          height: 44,
        },

        p: "3px",
        boxSizing: "border-box",

        bgcolor: "#ffffff",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      {/* Sliding highlight behind the active option */}

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 3,
          bottom: 3,
          left: 3,
          width: "calc(50% - 3px)",

          bgcolor: BRAND,
          borderRadius: 999,
          boxShadow: "0 6px 14px -8px rgba(16, 122, 100, 0.85)",

          transform: `translateX(${activeIndex * 100}%)`,
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },

          pointerEvents: "none",
        }}
      />

      {OPTIONS.map((option) => {
        const active = locale === option.value;

        return (
          <ButtonBase
            key={option.value}
            aria-label={option.aria}
            aria-pressed={active}
            onClick={() => changeLanguage(option.value)}
            sx={{
              position: "relative",
              zIndex: 1,
              minWidth: 0,
              height: "100%",
              borderRadius: 999,

              // Buttons do not inherit the page font on their own.
              fontFamily: "inherit",
              fontSize: "var(--lang-font-size)",
              fontWeight: 600,
              letterSpacing: "0.01em",
              lineHeight: 1,
              whiteSpace: "nowrap",

              color: active ? "#ffffff" : INK_MUTED,
              transition:
                "color 200ms ease, background-color 200ms ease",

              "&:hover": {
                color: active ? "#ffffff" : BRAND,
                bgcolor: active ? "transparent" : BRAND_SOFT,
              },

              "&:focus-visible": {
                outline: `2px solid ${BRAND}`,
                outlineOffset: -2,
              },
            }}
          >
            {option.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}