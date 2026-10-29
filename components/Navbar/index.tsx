"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

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

const focusRing = {
  outline: `2px solid ${BRAND}`,
  outlineOffset: 2,
};

// On desktop this must equal HEADER_HEIGHT in Sidebar.tsx so the navbar's
// bottom border lines up with the border under the sidebar logo.
const DESKTOP_HEIGHT = 72;

// =================================================
// RESPONSIVE RULES
//
// The bar answers to its own width (a CSS container query), not the screen's.
// From md up the sidebar takes part of the screen, so the screen width says
// little about how much room the bar really has.
//
//   bar width   what changes
//   < 480       small and quiet: every control is about 32px tall, the avatar
//               has no outline, and spacing is tight but even
//   480 - 559   controls grow to 36px
//   560 - 959   the avatar gets its pill with name and role
//   >= 960      location, larger title, more side padding
//
// Height follows the screen: 56 / 64 / 72.
// =================================================

const atLeast = (width: number) =>
  `@container navbar (min-width: ${width}px)`;

const BP = { roomy: 480, name: 560, wide: 960 } as const;

type NavbarWithMenuProps = NavbarProps & {
  /** Opens the sidebar drawer. When provided, an arrow shows below `md`. */
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

        // Lets the children respond to this bar's width.
        containerType: "inline-size",
        containerName: "navbar",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        boxSizing: "border-box",
        height: { xs: 56, sm: 64, md: DESKTOP_HEIGHT },

        px: 1.5,
        gap: 1,
        [atLeast(BP.roomy)]: { px: 2.5, gap: 1.5 },
        [atLeast(BP.wide)]: { px: 4, gap: 3 },

        bgcolor: "rgba(255, 255, 255, 0.92)",
        borderBottom: `1px solid ${HAIRLINE}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",

        // Same behaviour as the sidebar arrow: with a mouse the arrow appears
        // when the pointer is over the bar (or keyboard focus is inside it).
        // Touch screens have no hover, so they always see it.
        "@media (hover: hover)": {
          "& .navbar-toggle": { opacity: 0, pointerEvents: "none" },
          "&:hover .navbar-toggle, &:focus-within .navbar-toggle": {
            opacity: 1,
            pointerEvents: "auto",
          },
        },
      }}
    >
      {/* =================================================
          ARROW TOGGLE (below md): opens the sidebar drawer.
          Points right because the drawer slides in from the left.
          Plain icon (no circle), pulled close to the left border.
      ================================================= */}

      {onMenuClick && (
        <ButtonBase
          className="navbar-toggle"
          onClick={onMenuClick}
          aria-label={tSidebar("toggleSidebar")}
          sx={{
            display: { xs: "grid", md: "none" },
            placeItems: "center",
            flexShrink: 0,
            width: 28,
            height: 28,
            ml: -1, // pulls the arrow close to the left border
            borderRadius: 1,
            color: INK_MUTED,
            transition: "opacity 200ms ease, color 200ms ease",
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
            "&:hover": { color: BRAND },
            "&.Mui-focusVisible": focusRing,
          }}
        >
          <ChevronRightRoundedIcon sx={{ fontSize: 22 }} />
        </ButtonBase>
      )}

      {/* =================================================
          TITLE
          (a <p>, not a heading: each page already has its own <h1>)
      ================================================= */}

      <Typography
        component="p"
        noWrap
        title={title}
        sx={{
          flex: 1,
          minWidth: 0,
          m: 0,
          color: INK,
          fontSize: 17,
          lineHeight: 1.25,
          fontWeight: 700,
          letterSpacing: -0.3,
          [atLeast(BP.name)]: { fontSize: 20, letterSpacing: -0.4 },
          [atLeast(BP.wide)]: { fontSize: 22 },
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
          gap: 1,
          [atLeast(BP.name)]: { gap: 1.5 },
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

              // Narrow: just the avatar, with no outline (the padding keeps a
              // comfortable tap area). Wider: a pill with name and role.
              p: 0.5,
              color: "inherit",
              textDecoration: "none",
              bgcolor: "transparent",
              border: "1px solid transparent",
              borderRadius: 999,
              transition:
                "background-color 200ms ease, border-color 200ms ease",

              [atLeast(BP.name)]: {
                p: "5px 16px 5px 5px",
                bgcolor: "#ffffff",
                borderColor: HAIRLINE,
              },

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
                width: 32,
                height: 32,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: BRAND,
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.4,
                [atLeast(BP.roomy)]: { width: 36, height: 36, fontSize: 13 },
                [atLeast(BP.name)]: {
                  width: 40,
                  height: 40,
                  boxShadow: `0 0 0 2px #ffffff, 0 0 0 3px ${BRAND_LINE}`,
                },
              }}
            >
              {initials}
            </Box>

            {/* USER INFO */}
            <Box
              sx={{
                display: "none",
                minWidth: 0,
                maxWidth: 130,
                ml: 0.25,
                [atLeast(BP.name)]: { display: "block" },
                [atLeast(720)]: { maxWidth: 180 },
                [atLeast(BP.wide)]: { maxWidth: 240 },
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
                      display: "none",
                      minWidth: 0,
                      maxWidth: 110,
                      color: INK_MUTED,
                      fontSize: 12,
                      lineHeight: 1.4,
                      fontWeight: 400,
                      [atLeast(BP.wide)]: { display: "block" },
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