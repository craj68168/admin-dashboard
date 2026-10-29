"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";

import { useSidebar } from "./hook";
import type { SidebarItem, SidebarNavItemProps, SidebarProps } from "./type";

// =================================================
// DESIGN SYSTEM (shared with the dashboard + navbar)
// Styling only — no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.22)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";

const INK = "#0F172A";
const INK_MUTED = "#213146";
const INK_FAINT = "#5B6A7E";

const DANGER = "#BE183C";
const DANGER_SOFT = "rgba(190, 24, 60, 0.08)";

const RADIUS = 20;
const ITEM_RADIUS = RADIUS - 4;

const BRAND_NAME = "Fortune Link";

// IMPORTANT: the sidebar header (logo row) and the navbar must share this
// height so their bottom borders form one straight line across the page.
// Move this constant to a shared file (e.g. "@/lib/layout") and import it in
// the navbar too, so the two can never drift apart.
export const HEADER_HEIGHT = 72;

// Full-width sidebar: slimmer on md (small laptops / landscape tablets),
// full size from lg up.
const DRAWER_WIDTH_MD = 240;
const DRAWER_WIDTH = 272;
const RAIL_WIDTH = 84;

const focusVisible = {
  "&.Mui-focusVisible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

const tooltipSlotProps = {
  tooltip: {
    sx: {
      bgcolor: INK,
      color: "#ffffff",
      fontSize: 12,
      fontWeight: 500,
      px: 1.25,
      py: 0.75,
      borderRadius: "10px",
    },
  },
  arrow: { sx: { color: INK } },
};

const sidebarIcons: Record<SidebarItem, typeof DashboardRoundedIcon> = {
  Dashboard: DashboardRoundedIcon,
  Staff: GroupsRoundedIcon,
  Clients: PeopleAltRoundedIcon,
  Stages: AccountTreeRoundedIcon,
};

// =================================================
// SIDEBAR
//
// RESPONSIVE BEHAVIOUR
//  - md and up: a sticky, full-height panel pinned to the left edge.
//    `collapsed` = icon rail, otherwise full (240px on md, 272px on lg+).
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
  const t = useTranslations("sidebar");

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
          "& .MuiBackdrop-root": { bgcolor: "rgba(15, 23, 42, 0.45)" },
          "& .MuiDrawer-paper": {
            width: "min(220px, 82vw)",

            // Fit the visible area on phones whose browser bar collapses, so
            // the pinned Sign out button is never pushed off screen.
            height: "100vh",
            "@supports (height: 100dvh)": { height: "100dvh" },

            boxSizing: "border-box",
            border: "none",
            bgcolor: "#ffffff",
            color: INK,
            borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
            boxShadow: "12px 0 40px -12px rgba(15,23,42,0.35)",
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

      {/* DESKTOP: sticky full-height panel */}

      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "flex" },
          flexShrink: 0,
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          boxSizing: "border-box",
          width: collapsed
            ? RAIL_WIDTH
            : { md: DRAWER_WIDTH_MD, lg: DRAWER_WIDTH },
          height: "100vh",
          "@supports (height: 100dvh)": { height: "100dvh" },
          zIndex: 20,
          transition: "width 300ms ease",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },

          // The toggle is hidden until the pointer is over the sidebar or
          // keyboard focus is inside it. Touch devices (no hover) always see it.
          "@media (hover: hover)": {
            "& .sidebar-toggle": { opacity: 0, pointerEvents: "none" },
            "&:hover .sidebar-toggle, &:focus-within .sidebar-toggle": {
              opacity: 1,
              pointerEvents: "auto",
            },
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            bgcolor: "#ffffff",
            color: INK,
            border: `1px solid ${HAIRLINE}`,
            borderLeft: 0,
            borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
            boxShadow:
              "0 1px 2px rgba(15,23,42,0.03), 18px 0 40px -28px rgba(15,23,42,0.30)",
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

        {/* Arrow toggle, straddling the panel's right edge and centred on the
            header row so it lines up with the logo and the navbar */}

        <Tooltip
          title={collapsed ? t("toggleSidebar") : ""}
          placement="right"
          arrow
          disableInteractive
          slotProps={tooltipSlotProps}
        >
          <ButtonBase
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={t("toggleSidebar")}
            aria-expanded={!collapsed}
            sx={{
              position: "absolute",
              top: HEADER_HEIGHT / 2 - 16,
              right: -16,
              display: "grid",
              placeItems: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${HAIRLINE}`,
              bgcolor: "#ffffff",
              color: INK_MUTED,
              boxShadow:
                "0 1px 2px rgba(15,23,42,0.06), 0 8px 18px -10px rgba(15,23,42,0.35)",
              transition:
                "opacity 200ms ease, background-color 200ms ease, border-color 200ms ease, color 200ms ease",
              "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              "&:hover": {
                borderColor: BRAND,
                bgcolor: BRAND,
                color: "#ffffff",
              },
              ...focusVisible,
            }}
          >
            {collapsed ? (
              <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
            ) : (
              <ChevronLeftRoundedIcon sx={{ fontSize: 20 }} />
            )}
          </ButtonBase>
        </Tooltip>
      </Box>
    </>
  );
}

// =================================================
// CONTENT (shared by the drawer and the desktop panel)
//
// Three fixed zones: header (fixed height) / nav (scrolls) / footer.
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
        overflow: "hidden",
      }}
    >
      {/* =================================================
          HEADER: same height as the navbar
      ================================================= */}

      <Box
        sx={{
          flexShrink: 0,
          height: HEADER_HEIGHT,
          boxSizing: "border-box",
          px: 1.5,
          borderBottom: `1px solid ${HAIRLINE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: rail ? "center" : "space-between",
          gap: 1,
        }}
      >
        <ButtonBase
          onClick={onGoToDashboard}
          aria-label={t("goToDashboard")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            minWidth: 0,
            borderRadius: 2.5,
            p: 0.75,
            pr: rail ? 0.75 : 1.5,
            transition: "background-color 200ms ease",
            "&:hover": { bgcolor: BRAND_SOFT },
            ...focusVisible,
          }}
        >
          {/* Setting width AND height (auto) avoids Next's "only one dimension
              modified" warning when the flex container squeezes the image. */}
          <Image
            src="/logo.png"
            alt={t("logoAlt")}
            width={rail ? 44 : 48}
            height={rail ? 38 : 42}
            priority
            style={{ width: rail ? 44 : 48, height: "auto", flexShrink: 0 }}
          />

          {!rail && (
            <Typography
              component="span"
              noWrap
              sx={{
                minWidth: 0,
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: -0.4,
                color: INK,
                textAlign: "left",
              }}
            >
              {BRAND_NAME}
            </Typography>
          )}
        </ButtonBase>

        {inDrawer && (
          <ButtonBase
            onClick={onToggle}
            aria-label={t("toggleSidebar")}
            sx={{
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: `${ITEM_RADIUS - 2}px`,
              border: `1px solid ${HAIRLINE}`,
              bgcolor: "#ffffff",
              color: INK_MUTED,
              transition:
                "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
              "&:hover": {
                borderColor: BRAND_LINE,
                bgcolor: BRAND_SOFT,
                color: BRAND,
              },
              ...focusVisible,
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </ButtonBase>
        )}
      </Box>

      {/* =================================================
          NAV (scrolls if there are many items)
      ================================================= */}

      <Box
        component="nav"
        aria-label={t("workspace")}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 1.5,
          pt: 2,
          pb: 1.5,
          scrollbarWidth: "thin",
        }}
      >
        {/* Section label (full view) / thin divider (rail) */}

        {rail ? (
          <Box
            aria-hidden
            sx={{
              mx: "auto",
              mb: 1.5,
              width: 24,
              height: 2,
              borderRadius: 999,
              bgcolor: HAIRLINE,
            }}
          />
        ) : (
          <Typography
            component="span"
            sx={{
              display: "block",
              px: 1.75,
              mb: 1,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: INK_FAINT,
            }}
          >
            {t("workspace")}
          </Typography>
        )}

        <Box
          component="ul"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
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

      {/* =================================================
          SIGN OUT (pinned to the bottom)
      ================================================= */}

      <Box
        sx={{
          flexShrink: 0,
          px: 1.5,
          pt: 1.5,
          pb: "max(12px, env(safe-area-inset-bottom))",
          borderTop: `1px solid ${HAIRLINE}`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tooltip
          title={rail ? t("logout") : ""}
          placement="right"
          arrow
          disableInteractive
          slotProps={tooltipSlotProps}
        >
          <ButtonBase
            onClick={onLogout}
            aria-label={rail ? t("logout") : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: rail ? "center" : "flex-start",
              gap: 1.5,
              width: rail ? 48 : "100%",
              minHeight: 48,
              px: rail ? 0 : 1.75,
              borderRadius: `${ITEM_RADIUS}px`,
              color: INK_MUTED,
              transition: "background-color 200ms ease, color 200ms ease",
              "&:hover": { bgcolor: DANGER_SOFT, color: DANGER },
              ...focusVisible,
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 22, flexShrink: 0 }} />

            {!rail && (
              <Typography
                component="span"
                noWrap
                sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}
              >
                {t("signOut")}
              </Typography>
            )}
          </ButtonBase>
        </Tooltip>
      </Box>
    </Box>
  );
}

// =================================================
// NAV ITEM
// Active = solid brand pill. It is the one bold element in the sidebar.
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
    <Box
      component="li"
      sx={{
        listStyle: "none",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Tooltip
        title={collapsed ? label : ""}
        placement="right"
        arrow
        disableInteractive
        slotProps={tooltipSlotProps}
      >
        <ButtonBase
          onClick={onSelect}
          aria-current={active ? "page" : undefined}
          aria-label={collapsed ? label : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 1.5,
            width: collapsed ? 48 : "100%",
            minHeight: 48,
            px: collapsed ? 0 : 1.75,
            borderRadius: `${ITEM_RADIUS}px`,
            textAlign: "left",
            color: active ? "#ffffff" : INK_MUTED,
            bgcolor: active ? BRAND : "transparent",
            boxShadow: active
              ? "0 10px 20px -12px rgba(16, 122, 100, 0.85)"
              : "none",
            transition:
              "background-color 200ms ease, color 200ms ease, box-shadow 200ms ease",
            "&:hover": {
              bgcolor: active ? BRAND_DEEP : "rgba(17, 24, 39, 0.045)",
              color: active ? "#ffffff" : INK,
            },
            ...focusVisible,
          }}
        >
          <Icon sx={{ fontSize: 22, flexShrink: 0 }} />

          {!collapsed && (
            <Typography
              component="span"
              noWrap
              sx={{
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>
          )}
        </ButtonBase>
      </Tooltip>
    </Box>
  );
}