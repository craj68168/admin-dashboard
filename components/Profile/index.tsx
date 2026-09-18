"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";

import { useAuthStore } from "@/store/auth-store";

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

export default function Profile() {
  const t = useTranslations("profile");
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F8F6",
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
        }}
      >
        <Box sx={{ ...softCard, maxWidth: 900, mx: "auto", p: 3 }}>
          <Typography sx={{ color: INK_MUTED, fontSize: 14 }}>
            {t("unavailable")}
          </Typography>
        </Box>
      </Box>
    );
  }

  const details = [
    {
      label: t("fields.fullName"),
      value: user.name,
      icon: PersonRoundedIcon,
    },
    {
      label: t("fields.emailAddress"),
      value: user.email,
      icon: EmailRoundedIcon,
    },
    {
      label: t("fields.role"),
      value: user.role,
      icon: WorkspacesRoundedIcon,
    },
    {
      label: t("fields.location"),
      value: user.location || t("notSpecified"),
      icon: LocationOnRoundedIcon,
    },
    {
      label: t("fields.userId"),
      value: String(user.id),
      icon: BadgeRoundedIcon,
    },
    ...(user.staffId
      ? [
          {
            label: t("fields.staffId"),
            value: String(user.staffId),
            icon: BadgeRoundedIcon,
          },
        ]
      : []),
  ];

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 72px)",
        bgcolor: "#F7F8F6",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
        <Box
          component={Link}
          href="/admin/dashboard"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            mb: 3,
            color: INK_MUTED,
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 200ms ease, transform 200ms ease",
            "&:hover": {
              color: BRAND,
              transform: "translateX(-2px)",
            },
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
          {t("backToDashboard")}
        </Box>

        <Box sx={{ ...softCard, width: "100%", overflow: "hidden" }}>
          <Box
            sx={{
              px: { xs: 2.5, sm: 3.5 },
              py: { xs: 2.5, sm: 3 },
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <Typography
              sx={{
                color: INK,
                fontSize: { xs: 18, sm: 20 },
                fontWeight: 600,
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}
            >
              {t("accountInformation")}
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: INK_MUTED,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {t("accountDescription")}
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 2.5, sm: 3.5 } }}>
            {details.map(({ label, value, icon: Icon }, index) => (
              <Box
                key={label}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "44px minmax(0, 1fr)",
                    sm: "44px 190px minmax(0, 1fr)",
                  },
                  alignItems: "center",
                  gap: { xs: 1.25, sm: 1.75 },
                  py: 2.25,
                  borderBottom:
                    index < details.length - 1
                      ? `1px solid ${HAIRLINE}`
                      : "none",
                  transition: "background-color 200ms ease",
                  "&:hover": {
                    bgcolor: "rgba(16, 122, 100, 0.025)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    bgcolor: BRAND_SOFT,
                    color: BRAND,
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 19 }} />
                </Box>

                <Typography
                  sx={{
                    color: INK_MUTED,
                    fontSize: 11.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    gridColumn: { xs: "2", sm: "auto" },
                  }}
                >
                  {label}
                </Typography>

                <Typography
                  sx={{
                    color: INK,
                    fontSize: 14,
                    lineHeight: 1.5,
                    fontWeight: 600,
                    wordBreak: "break-word",
                    gridColumn: { xs: "2", sm: "auto" },
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}