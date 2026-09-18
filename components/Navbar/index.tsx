"use client";

import Link from "next/link";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import { useNavbar } from "./hook";
import type { NavbarProps } from "./type";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

// =================================================
// DESIGN SYSTEM
// Styling only — no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

export default function Navbar({ title }: NavbarProps) {
  const { user, initials } = useNavbar();

  return (
    <Box
      sx={{
        ...softCard,

        position: "sticky",
        top: 0,
        zIndex: 10,

        mb: 2,

        px: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        py: 1.5,

        display: "flex",

        flexDirection: {
          xs: "column",
          sm: "row",
        },

        alignItems: {
          xs: "stretch",
          sm: "center",
        },

        justifyContent: "space-between",

        gap: {
          xs: 2,
          sm: 3,
        },

        bgcolor: "rgba(255, 255, 255, 0.94)",

        backdropFilter: "blur(14px)",

        WebkitBackdropFilter: "blur(14px)",

        transition:
          "background-color 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 4,
            height: 32,

            flexShrink: 0,

            borderRadius: 999,

            bgcolor: BRAND,
          }}
        />

        <Typography
          component="h2"
          sx={{
            minWidth: 0,

            color: INK,

            fontSize: {
              xs: 20,
              sm: 21,
              md: 22,
            },

            lineHeight: 1.3,

            fontWeight: 600,

            letterSpacing: "-0.02em",

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          alignSelf: {
            xs: "stretch",
            sm: "auto",
          },

          justifyContent: {
            xs: "space-between",
            sm: "flex-end",
          },

          gap: 1.5,

          minWidth: 0,
        }}
      >
        <LanguageSwitcher />

        {user && (
          <Box
            component={Link}
            href="/admin/profile"
            aria-label="Open profile"
            sx={{
              display: "flex",

              alignItems: "center",

              minWidth: 0,

              maxWidth: {
                xs: 290,
                sm: 330,
              },

              px: 1.25,

              py: 0.85,

              color: "inherit",

              textDecoration: "none",

              bgcolor: "#ffffff",

              border: `1px solid ${HAIRLINE}`,

              borderRadius: 3,

              boxShadow:
                "0 1px 2px rgba(17,24,39,0.03)",

              transition:
                "background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",

              "&:hover": {
                bgcolor: "rgba(16, 122, 100, 0.035)",

                borderColor: "rgba(16, 122, 100, 0.14)",

                boxShadow:
                  "0 6px 20px -14px rgba(17,24,39,0.35)",

                transform: "translateY(-1px)",
              },

              "&:active": {
                transform: "translateY(0)",
              },

              "&:focus-visible": {
                outline: `1px solid ${BRAND}`,

                outlineOffset: 2,
              },

              "&:hover .navbar-avatar": {
                transform: "scale(1.04)",

                boxShadow:
                  "0 6px 16px -7px rgba(16,122,100,0.75)",
              },

              "&:hover .navbar-expand-container": {
                bgcolor: BRAND_SOFT,

                borderColor: "rgba(16, 122, 100, 0.15)",
              },

              "&:hover .navbar-expand-icon": {
                color: BRAND,

                transform: "rotate(180deg)",
              },
            }}
          >
            {/* =================================================
                PROFILE CONTENT
            ================================================= */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.25,

                width: "100%",

                minWidth: 0,
              }}
            >
              {/* AVATAR */}

              <Box
                className="navbar-avatar"
                sx={{
                  position: "relative",

                  width: 42,

                  height: 42,

                  flexShrink: 0,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  borderRadius: "50%",

                  bgcolor: BRAND,

                  color: "#ffffff",

                  fontSize: 13,

                  fontWeight: 700,

                  letterSpacing: "0.03em",

                  boxShadow:
                    "0 4px 12px -6px rgba(16,122,100,0.65)",

                  transition:
                    "transform 200ms ease, box-shadow 200ms ease",

                  "&::after": {
                    content: '""',

                    position: "absolute",

                    right: 0,

                    bottom: 1,

                    width: 10,

                    height: 10,

                    borderRadius: "50%",

                    bgcolor: "#22C55E",

                    border: "2px solid #ffffff",

                    boxSizing: "border-box",
                  },
                }}
              >
                {initials}
              </Box>

              {/* USER INFO */}

              <Box
                sx={{
                  flex: 1,

                  minWidth: 0,
                }}
              >
                {/* NAME */}

                <Typography
                  sx={{
                    maxWidth: {
                      xs: 120,
                      sm: 160,
                    },

                    color: INK,

                    fontSize: 13.5,

                    lineHeight: 1.35,

                    fontWeight: 600,

                    overflow: "hidden",

                    textOverflow: "ellipsis",

                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name}
                </Typography>

                {/* ROLE + LOCATION */}

                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 0.75,

                    mt: 0.4,

                    minWidth: 0,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",

                      alignItems: "center",

                      px: 0.9,

                      py: 0.25,

                      borderRadius: 999,

                      bgcolor: BRAND_SOFT,

                      color: BRAND,

                      fontSize: 10.5,

                      lineHeight: 1.3,

                      fontWeight: 600,

                      textTransform: "capitalize",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.role}
                  </Box>

                  {user.location && (
                    <Typography
                      sx={{
                        minWidth: 0,

                        maxWidth: 90,

                        color: INK_MUTED,

                        fontSize: 11,

                        lineHeight: 1.3,

                        fontWeight: 500,

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.location}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* EXPAND ICON */}

              <Box
                className="navbar-expand-container"
                sx={{
                  width: 30,

                  height: 30,

                  flexShrink: 0,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  borderRadius: "50%",

                  bgcolor: "#F9FAFB",

                  border: `1px solid ${HAIRLINE}`,

                  transition:
                    "background-color 200ms ease, border-color 200ms ease",
                }}
              >
                <ExpandMoreRoundedIcon
                  className="navbar-expand-icon"
                  sx={{
                    color: INK_MUTED,

                    fontSize: 19,

                    transition:
                      "color 200ms ease, transform 250ms ease",
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}