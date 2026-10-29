"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { useNavbar } from "./hook";
import type { NavbarProps } from "./type";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { getPortalPaths } from "@/lib/portal-routes";

// =================================================
// DESIGN SYSTEM
// Styling only — no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.22)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#0F172A";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;

const focusRing = {
  outline: `2px solid ${BRAND}`,
  outlineOffset: 2,
};

type NavbarWithMenuProps = NavbarProps & {
  /** Opens the sidebar drawer. When provided, a menu button shows below `md`. */
  onMenuClick?: () => void;
};

export default function Navbar({ title, onMenuClick }: NavbarWithMenuProps) {
  const { user, initials } = useNavbar();
  const tSidebar = useTranslations("sidebar");
  const profilePath = getPortalPaths(user?.role).profile;

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,

        // One compact row at every width.
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 1.5, sm: 3 },

        minHeight: { xs: 60, sm: 68 },
        mb: { xs: 1.5, md: 2 },
        px: { xs: 1.5, sm: 2.5, md: 3 },
        py: { xs: 0.75, sm: 1 },

        bgcolor: "rgba(255, 255, 255, 0.92)",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: `${RADIUS}px`,
        boxShadow:
          "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* =================================================
          MENU BUTTON (below md, opens the sidebar drawer)
      ================================================= */}

      {onMenuClick && (
        <ButtonBase
          onClick={onMenuClick}
          aria-label={tSidebar("toggleSidebar")}
          sx={{
            display: { xs: "grid", md: "none" },
            placeItems: "center",
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: `${RADIUS - 4}px`,
            border: `1px solid ${HAIRLINE}`,
            color: INK_MUTED,
            bgcolor: "#ffffff",
            transition:
              "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
            "&:hover": {
              bgcolor: BRAND_SOFT,
              borderColor: BRAND_LINE,
              color: BRAND,
            },
            "&.Mui-focusVisible": focusRing,
          }}
        >
          <MenuRoundedIcon sx={{ fontSize: 22 }} />
        </ButtonBase>
      )}

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
          pl: { xs: 0.25, md: 0.5 },
          color: INK,
          fontSize: { xs: 18, sm: 20, md: 22 },
          lineHeight: 1.25,
          fontWeight: 700,
          letterSpacing: -0.4,
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
            href={profilePath}
            aria-label={`Open profile (${user.name})`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,

              // Phones: avatar only. sm and up: avatar + name + role.
              p: { xs: 0.5, sm: "5px 16px 5px 5px" },

              color: "inherit",
              textDecoration: "none",
              bgcolor: "#ffffff",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 999,
              transition:
                "background-color 200ms ease, border-color 200ms ease",

              "&:hover": {
                bgcolor: BRAND_SOFT,
                borderColor: BRAND_LINE,
              },

              "&:focus-visible": focusRing,
            }}
          >
            {/* AVATAR */}
            <Box
              aria-hidden
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: BRAND,
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.4,
                boxShadow: `0 0 0 2px #ffffff, 0 0 0 3px ${BRAND_LINE}`,
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
                ml: 0.25,
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
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.6,
                    color: BRAND_DEEP,
                    fontSize: 12,
                    lineHeight: 1.4,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: BRAND,
                    }}
                  />
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
                      lineHeight: 1.4,
                      fontWeight: 400,
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