"use client";

import Image from "next/image";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useSidebar } from "./hook";
import type { SidebarItem, SidebarNavItemProps, SidebarProps } from "./type";

const sidebarIcons: Record<SidebarItem, typeof DashboardRoundedIcon> = {
  Dashboard: DashboardRoundedIcon,
  Staff: GroupsRoundedIcon,
  Clients: PeopleAltRoundedIcon,
  Revenue: PaymentsRoundedIcon,
  Performance: TrendingUpRoundedIcon,
};

export default function Sidebar({
  selected,
  collapsed,
  onToggle,
}: SidebarProps) {
  const { sidebarItems, goToDashboard, goToItem, logout } = useSidebar();

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} sticky top-0 flex h-screen shrink-0 flex-col overflow-y-auto border-r border-slate-800/80 bg-slate-950 p-3 text-white shadow-xl transition-all duration-300`}
    >
      <div
        className={`mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <button
          type="button"
          onClick={goToDashboard}
          aria-label="Go to dashboard"
          className="flex items-center overflow-hidden rounded-xl p-1 transition-colors hover:bg-white/10"
        >
          <Image
            src="/company_logo.png"
            alt="Fortune Link logo"
            width={collapsed ? 32 : 80}
            height={collapsed ? 30 : 70}
            priority
            className="object-contain"
          />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className={`${collapsed ? "absolute left-17" : ""} flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-cyan-300/40 hover:bg-white/10 hover:text-cyan-300`}
        >
          {collapsed ? (
            <MenuRoundedIcon sx={{ fontSize: 20 }} />
          ) : (
            <MenuOpenRoundedIcon sx={{ fontSize: 20 }} />
          )}
        </button>
      </div>

      <nav className="flex-1">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
        )}
        <ul className="space-y-1.5">
          {sidebarItems.map((item) => (
            <SidebarNavItem
              key={item}
              item={item}
              active={selected === item}
              collapsed={collapsed}
              onSelect={() => goToItem(item)}
            />
          ))}
        </ul>
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300 ${collapsed ? "justify-center" : ""}`}
        >
          <LogoutRoundedIcon sx={{ fontSize: 19 }} />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  item,
  active,
  collapsed,
  onSelect,
}: SidebarNavItemProps) {
  const Icon = sidebarIcons[item];

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item : undefined}
        className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all ${
          active
            ? "bg-cyan-400/10 text-cyan-200 shadow-inner shadow-cyan-300/5"
            : "text-slate-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-300" />
        )}
        <Icon sx={{ fontSize: 20 }} />
        {!collapsed && <span className="font-semibold">{item}</span>}
      </button>
    </li>
  );
}
