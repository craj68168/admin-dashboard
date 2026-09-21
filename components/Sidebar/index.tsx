"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useSidebar } from "./hook";
import type { SidebarItem, SidebarNavItemProps, SidebarProps } from "./type";

// =================================================
// THEME TOKENS (matches Staff / Admin dashboards)
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG = "rgba(17, 24, 39, 0.12)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

const DANGER = "#DC2626";
const DANGER_SOFT = "#FEF2F2";

const DRAWER_WIDTH = 256;
const RAIL_WIDTH = 80;

const focusVisible = {
  "&.Mui-focusVisible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

const sidebarIcons: Record<SidebarItem, typeof DashboardRoundedIcon> = {
  Dashboard: DashboardRoundedIcon,
  Staff: GroupsRoundedIcon,
  Clients: PeopleAltRoundedIcon,
};

// =================================================
// SIDEBAR
//
// RESPONSIVE BEHAVIOUR
//  - md and up: a sticky column. `collapsed` = 80px icon rail, otherwise 256px.
//  - below md:  a temporary MUI Drawer. `collapsed` = closed, otherwise open.
//    It closes when an item is chosen, when the route changes, on backdrop
//    tap and on Escape. The Drawer also traps focus and locks page scroll.
// =================================================

export default function Sidebar({
  selected,
  collapsed,
  onToggle,
}: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { sidebarItems, goToDashboard, goToItem, logout } = useSidebar();

  const mobileOpen = isMobile && !collapsed;

  const closeMobile = () => {
    if (mobileOpen) onToggle();
  };

  // Close when the route changes (covers the browser back button and redirects,
  // not just taps inside the sidebar).
  const previousPathname = useRef(pathname);
  const closeMobileRef = useRef(closeMobile);

  useEffect(() => {
    closeMobileRef.current = closeMobile;
  });

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      closeMobileRef.current();
    }
  }, [pathname]);

  // Closing on click as well means tapping the page you are already on still
  // closes the drawer (the route doesn't change, so the effect above won't run).
  const handleSelectItem = (item: SidebarItem) => {
    goToItem(item);
    closeMobile();
  };

  const handleGoToDashboard = () => {
    goToDashboard();
    closeMobile();
  };

  return (
    <>
      {/* MOBILE / TABLET: temporary drawer */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiBackdrop-root": { bgcolor: "rgba(17, 24, 39, 0.45)" },
          "& .MuiDrawer-paper": {
            width: "min(280px, 86vw)",
            boxSizing: "border-box",
            border: "none",
            bgcolor: "#ffffff",
            color: INK,
            boxShadow: "12px 0 40px -12px rgba(17,24,39,0.35)",
          },
        }}
      >
        <SidebarContent
          rail={false}
          inDrawer
          selected={selected}
          sidebarItems={sidebarItems}
          onToggle={onToggle}
          onSelectItem={handleSelectItem}
          onGoToDashboard={handleGoToDashboard}
          onLogout={logout}
        />
      </Drawer>

      {/* DESKTOP: sticky column */}

      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          width: collapsed ? RAIL_WIDTH : DRAWER_WIDTH,
          height: "100vh",
          "@supports (height: 100dvh)": { height: "100dvh" },
          overflow: "hidden",
          borderRight: `1px solid ${HAIRLINE}`,
          bgcolor: "#ffffff",
          color: INK,
          boxShadow:
            "1px 0 2px rgba(17,24,39,0.03), 12px 0 32px -22px rgba(17,24,39,0.30)",
          transition: "width 300ms ease",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <SidebarContent
          rail={collapsed}
          inDrawer={false}
          selected={selected}
          sidebarItems={sidebarItems}
          onToggle={onToggle}
          onSelectItem={handleSelectItem}
          onGoToDashboard={handleGoToDashboard}
          onLogout={logout}
        />
      </Box>
    </>
  );
}

// =================================================
// CONTENT (shared by the drawer and the desktop column)
// =================================================

type SidebarContentProps = {
  rail: boolean;
  inDrawer: boolean;
  selected: SidebarProps["selected"];
  sidebarItems: readonly SidebarItem[];
  onToggle: () => void;
  onSelectItem: (item: SidebarItem) => void;
  onGoToDashboard: () => void;
  onLogout: () => void;
};

function SidebarContent({
  rail,
  inDrawer,
  selected,
  sidebarItems,
  onToggle,
  onSelectItem,
  onGoToDashboard,
  onLogout,
}: SidebarContentProps) {
  const t = useTranslations("sidebar");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        p: 1.5,
        pb: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      {/* LOGO + TOGGLE */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: rail ? "column" : "row",
          alignItems: "center",
          justifyContent: rail ? "center" : "space-between",
          gap: rail ? 1.5 : 0,
        }}
      >
        <ButtonBase
          onClick={onGoToDashboard}
          aria-label={t("goToDashboard")}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 2.5,
            p: 0.5,
            transition: "background-color 200ms ease",
            "&:hover": { bgcolor: BRAND_SOFT },
            ...focusVisible,
          }}
        >
          {/* Setting width AND height (auto) avoids Next's "only one dimension
              modified" warning when the flex container squeezes the image. */}
          <Image
            src="/company_logo.png"
            alt={t("logoAlt")}
            width={rail ? 32 : 80}
            height={rail ? 30 : 70}
            priority
            style={{ width: rail ? 32 : 80, height: "auto" }}
          />
        </ButtonBase>

        <ButtonBase
          onClick={onToggle}
          aria-label={t("toggleSidebar")}
          aria-expanded={inDrawer ? undefined : !rail}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: 40, md: 36 },
            height: { xs: 40, md: 36 },
            borderRadius: 2,
            border: `1px solid ${HAIRLINE_STRONG}`,
            color: INK_MUTED,
            transition:
              "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
            "&:hover": {
              borderColor: "rgba(16, 122, 100, 0.3)",
              bgcolor: BRAND_SOFT,
              color: BRAND,
            },
            ...focusVisible,
          }}
        >
          {inDrawer ? (
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          ) : rail ? (
            <MenuRoundedIcon sx={{ fontSize: 20 }} />
          ) : (
            <MenuOpenRoundedIcon sx={{ fontSize: 20 }} />
          )}
        </ButtonBase>
      </Box>

      {/* NAV */}

      <Box component="nav" aria-label={t("workspace")} sx={{ flex: 1 }}>
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
              collapsed={rail}
              onSelect={() => onSelectItem(item)}
            />
          ))}
        </Box>
      </Box>

      {/* SIGN OUT */}

      <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${HAIRLINE}` }}>
        <Tooltip title={rail ? t("logout") : ""} placement="right" arrow>
          <ButtonBase
            onClick={onLogout}
            aria-label={rail ? t("logout") : undefined}
            sx={{
              display: "flex",
              width: "100%",
              minHeight: 44,
              alignItems: "center",
              justifyContent: rail ? "center" : "flex-start",
              gap: 1.5,
              borderRadius: 2.5,
              px: 1.5,
              fontSize: 14,
              fontWeight: 600,
              color: INK_MUTED,
              transition: "background-color 200ms ease, color 200ms ease",
              "&:hover": { bgcolor: DANGER_SOFT, color: DANGER },
              ...focusVisible,
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 21 }} />

            <Box component="span" sx={{ display: rail ? "none" : "inline" }}>
              {t("signOut")}
            </Box>
          </ButtonBase>
        </Tooltip>
      </Box>
    </Box>
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
      <Tooltip title={collapsed ? label : ""} placement="right" arrow>
        <ButtonBase
          onClick={onSelect}
          aria-current={active ? "page" : undefined}
          aria-label={collapsed ? label : undefined}
          sx={{
            position: "relative",
            display: "flex",
            width: "100%",
            minHeight: 44,
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 1.5,
            borderRadius: 2.5,
            px: 1.5,
            textAlign: "left",
            color: active ? BRAND : INK_MUTED,
            bgcolor: active ? BRAND_SOFT : "transparent",
            transition: "background-color 200ms ease, color 200ms ease",
            "&:hover": {
              bgcolor: active ? BRAND_SOFT : "rgba(17, 24, 39, 0.04)",
              color: active ? BRAND : INK,
            },
            ...focusVisible,
          }}
        >
          {active && (
            <Box
              component="span"
              aria-hidden
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

          <Icon sx={{ fontSize: 22 }} />

          <Box
            component="span"
            sx={{
              display: collapsed ? "none" : "inline",
              fontSize: 14,
              fontWeight: active ? 600 : 500,
            }}
          >
            {label}
          </Box>
        </ButtonBase>
      </Tooltip>
    </Box>
  );
}