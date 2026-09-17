"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { useSidebar } from "./hook";
import type { SidebarItem, SidebarNavItemProps, SidebarProps } from "./type";

// =================================================
// THEME TOKENS (matches Staff / Admin dashboards)
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

const DRAWER_WIDTH = 256;
const RAIL_WIDTH = 80;

const sidebarIcons: Record<SidebarItem, typeof DashboardRoundedIcon> = {
  Dashboard: DashboardRoundedIcon,
  Staff: GroupsRoundedIcon,
  Clients: PeopleAltRoundedIcon,
};

export default function Sidebar({
  selected,
  collapsed,
  onToggle,
}: SidebarProps) {
  const t = useTranslations("sidebar");

  const { sidebarItems, goToDashboard, goToItem, logout } = useSidebar();

  // NOTE ON RESPONSIVE BEHAVIOUR
  // `collapsed` now does double duty by screen size:
  //  - md and up: true = narrow 80px icon rail, false = full 256px sidebar (unchanged from before)
  //  - below md:  true = drawer hidden off-screen, false = drawer open as a full-width overlay
  // This reuses the existing collapsed/onToggle prop contract rather than adding new props,
  // but it does mean whatever sets the *initial* value of `collapsed` should probably default
  // to true on first mobile paint (drawer closed) — worth checking in the parent/hook.

  return (
    <>
      {/* MOBILE BACKDROP — only when the drawer is open on a small screen */}

      {!collapsed && (
        <Box
          onClick={onToggle}
          aria-hidden="true"
          sx={{
            display: { xs: "block", md: "none" },

            position: "fixed",

            inset: 0,

            bgcolor: "rgba(17, 24, 39, 0.45)",

            zIndex: 1200,
          }}
        />
      )}

      {/* MOBILE-ONLY FLOATING TRIGGER — visible when the drawer is closed on small screens,
          since the in-sidebar toggle button is off-screen along with everything else */}

      {collapsed && (
        <ButtonBase
          onClick={onToggle}
          aria-label={t("toggleSidebar")}
          sx={{
            display: { xs: "flex", md: "none" },

            position: "fixed",

            top: 16,

            left: 16,

            zIndex: 1250,

            width: 40,

            height: 40,

            alignItems: "center",

            justifyContent: "center",

            borderRadius: 2,

            bgcolor: "#ffffff",

            border: "1px solid",

            borderColor: "rgba(17, 24, 39, 0.08)",

            color: INK_MUTED,

            boxShadow:
              "0 1px 2px rgba(17,24,39,0.04), 0 8px 20px -8px rgba(17,24,39,0.25)",

            "&:hover": {
              borderColor: "rgba(16, 122, 100, 0.3)",

              color: BRAND,
            },
          }}
        >
          <MenuRoundedIcon sx={{ fontSize: 20 }} />
        </ButtonBase>
      )}

      <Box
        component="aside"
        sx={{
          // Desktop: normal sticky column, width toggles 80/256 via `collapsed`.
          // Mobile: fixed full-height overlay, always 256 wide, slid off-screen via transform.
          width: collapsed
            ? { xs: DRAWER_WIDTH, md: RAIL_WIDTH }
            : DRAWER_WIDTH,

          position: { xs: "fixed", md: "sticky" },

          top: 0,

          left: 0,

          zIndex: { xs: 1300, md: 1 },

          transform: {
            xs: collapsed ? "translateX(-100%)" : "translateX(0)",
            md: "none",
          },

          display: "flex",

          flexShrink: 0,

          flexDirection: "column",

          height: "100vh",

          overflowY: "auto",

          borderRight: `1px solid ${HAIRLINE}`,

          bgcolor: "#ffffff",

          color: INK,

          p: 1.5,

          boxShadow: {
            xs: "0 0 2px rgba(17,24,39,0.05), 12px 0 40px -12px rgba(17,24,39,0.35)",
            md: "1px 0 2px rgba(17,24,39,0.03), 12px 0 32px -22px rgba(17,24,39,0.30)",
          },

          transition: "width 300ms ease, transform 300ms ease",
        }}
      >
        {/* LOGO + TOGGLE */}

        <Box
          sx={{
            mb: 4,

            display: "flex",

            flexDirection: { xs: "row", md: collapsed ? "column" : "row" },

            alignItems: "center",

            justifyContent: {
              xs: "space-between",
              md: collapsed ? "center" : "space-between",
            },

            gap: { xs: 0, md: collapsed ? 1.5 : 0 },
          }}
        >
          <ButtonBase
            onClick={goToDashboard}
            aria-label={t("goToDashboard")}
            sx={{
              display: "flex",

              alignItems: "center",

              overflow: "hidden",

              borderRadius: 2.5,

              p: 0.5,

              transition: "background-color 200ms ease",

              "&:hover": {
                bgcolor: BRAND_SOFT,
              },
            }}
          >
            <Image
              src="/company_logo.png"
              alt={t("logoAlt")}
              width={collapsed ? 32 : 80}
              height={collapsed ? 30 : 70}
              priority
              style={{ objectFit: "contain" }}
            />
          </ButtonBase>

          <ButtonBase
            onClick={onToggle}
            aria-label={t("toggleSidebar")}
            sx={{
              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              width: 36,

              height: 36,

              borderRadius: 2,

              border: "1px solid",

              borderColor: "rgba(17, 24, 39, 0.08)",

              color: INK_MUTED,

              transition: "all 200ms ease",

              "&:hover": {
                borderColor: "rgba(16, 122, 100, 0.3)",

                bgcolor: BRAND_SOFT,

                color: BRAND,
              },
            }}
          >
            {collapsed ? (
              <MenuRoundedIcon sx={{ fontSize: 20 }} />
            ) : (
              <MenuOpenRoundedIcon sx={{ fontSize: 20 }} />
            )}
          </ButtonBase>
        </Box>

        {/* NAV */}

        <Box component="nav" sx={{ flex: 1 }}>
          <Typography
            sx={{
              display: {
                xs: "block",
                md: collapsed ? "none" : "block",
              },

              mb: 1.5,

              px: 1.5,

              fontSize: 10,

              fontWeight: 700,

              textTransform: "uppercase",

              letterSpacing: "0.18em",

              color: INK_MUTED,
            }}
          >
            {t("workspace")}
          </Typography>

          <Box
            component="ul"
            sx={{
              display: "flex",

              flexDirection: "column",

              gap: 0.75,

              listStyle: "none",

              m: 0,

              p: 0,
            }}
          >
            {sidebarItems.map((item) => (
              <SidebarNavItem
                key={item}
                item={item}
                label={t(`items.${item}`)}
                active={selected === item}
                collapsed={collapsed}
                onSelect={() => goToItem(item)}
              />
            ))}
          </Box>
        </Box>

        {/* SIGN OUT */}

        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${HAIRLINE}` }}>
          <ButtonBase
            onClick={logout}
            title={collapsed ? t("logout") : undefined}
            sx={{
              display: "flex",

              width: "100%",

              alignItems: "center",

              justifyContent: {
                xs: "flex-start",
                md: collapsed ? "center" : "flex-start",
              },

              gap: 1.5,

              borderRadius: 2.5,

              px: 1.5,

              py: 1.25,

              fontSize: 14,

              fontWeight: 600,

              color: INK_MUTED,

              transition: "all 200ms ease",

              "&:hover": {
                bgcolor: "#FEF2F2",

                color: "#DC2626",
              },
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 19 }} />

            <Box
              component="span"
              sx={{
                display: {
                  xs: "inline",
                  md: collapsed ? "none" : "inline",
                },
              }}
            >
              {t("signOut")}
            </Box>
          </ButtonBase>
        </Box>
      </Box>
    </>
  );
}

// =================================================
// NAV ITEM
// =================================================

function SidebarNavItem({
  item,
  label,
  active,
  collapsed,
  onSelect,
}: SidebarNavItemProps) {
  const Icon = sidebarIcons[item];

  return (
    <Box component="li" sx={{ listStyle: "none" }}>
      <ButtonBase
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        title={collapsed ? label : undefined}
        sx={{
          position: "relative",

          display: "flex",

          width: "100%",

          alignItems: "center",

          justifyContent: {
            xs: "flex-start",
            md: collapsed ? "center" : "flex-start",
          },

          gap: 1.5,

          borderRadius: 2.5,

          px: 1.5,

          py: 1.5,

          fontSize: 14,

          fontWeight: 500,

          textAlign: "left",

          color: active ? BRAND : INK_MUTED,

          bgcolor: active ? BRAND_SOFT : "transparent",

          transition: "all 200ms ease",

          "&:hover": {
            bgcolor: active ? BRAND_SOFT : "rgba(17, 24, 39, 0.04)",

            color: active ? BRAND : INK,
          },
        }}
      >
        {active && (
          <Box
            component="span"
            sx={{
              position: "absolute",

              left: 0,

              top: "50%",

              transform: "translateY(-50%)",

              width: 4,

              height: 24,

              borderRadius: "0 999px 999px 0",

              bgcolor: BRAND,
            }}
          />
        )}

        <Icon sx={{ fontSize: 20 }} />

        <Box
          component="span"
          sx={{
            display: {
              xs: "inline",
              md: collapsed ? "none" : "inline",
            },

            fontSize: 14,

            fontWeight: 600,
          }}
        >
          {label}
        </Box>
      </ButtonBase>
    </Box>
  );
}