"use client";

import Link from "next/link";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useNavbar } from "./hook";
import type { NavbarProps } from "./type";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

// =================================================
// DESIGN SYSTEM
// Styling only — no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_DARK = "#0C5F4F";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";

export default function Navbar({ title }: NavbarProps) {
  const { user, initials } = useNavbar();

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,

        // One compact row at every width. The old phone layout stacked the
        // title above the controls and used ~130px of a small screen.
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 1.5, sm: 3 },

        minHeight: { xs: 56, sm: 64 },
        mb: { xs: 1.5, md: 2 },
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 0.75, sm: 1 },

        bgcolor: "rgba(255, 255, 255, 0.94)",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 3,
        boxShadow:
          "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* =================================================
          TITLE
          (a <p>, not a heading: each page already has its own <h1>)
      ================================================= */}

      <Typography
        component="p"
        noWrap
        sx={{
          flex: 1,
          minWidth: 0,
          m: 0,
          color: INK,
          fontSize: { xs: 17, sm: 19, md: 21 },
          lineHeight: 1.3,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </Typography>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        <LanguageSwitcher />

        {user && (
          <Box
            component={Link}
            href="/admin/profile"
            aria-label={`Open profile (${user.name})`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,

              // Phones: just the avatar (44px tap target). sm and up: avatar + name.
              p: { xs: 0.5, sm: "5px 14px 5px 5px" },

              color: "inherit",
              textDecoration: "none",
              bgcolor: "#ffffff",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 999,
              transition:
                "background-color 200ms ease, border-color 200ms ease",

              "&:hover": {
                bgcolor: "rgba(16, 122, 100, 0.05)",
                borderColor: "rgba(16, 122, 100, 0.22)",
              },

              "&:focus-visible": {
                outline: `2px solid ${BRAND}`,
                outlineOffset: 2,
              },
            }}
          >
            {/* AVATAR */}
            <Box
              aria-hidden
              sx={{
                width: { xs: 36, sm: 38 },
                height: { xs: 36, sm: 38 },
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: BRAND,
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.03em",
              }}
            >
              {initials}
            </Box>

            {/* USER INFO */}
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                minWidth: 0,
                maxWidth: { sm: 150, md: 240 },
              }}
            >
              <Typography
                noWrap
                sx={{
                  color: INK,
                  fontSize: 14,
                  lineHeight: 1.3,
                  fontWeight: 600,
                }}
              >
                {user.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mt: 0.25,
                  minWidth: 0,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    flexShrink: 0,
                    px: 0.9,
                    py: 0.125,
                    borderRadius: 999,
                    bgcolor: BRAND_SOFT,
                    color: BRAND_DARK,
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.role}
                </Box>

                {user.location && (
                  <Typography
                    noWrap
                    sx={{
                      display: { xs: "none", md: "block" },
                      minWidth: 0,
                      maxWidth: 110,
                      color: INK_MUTED,
                      fontSize: 12,
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    {user.location}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}