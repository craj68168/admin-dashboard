"use client";

import Image from "next/image";
import { useSidebar } from "./hook";
import type { SidebarNavItemProps, SidebarProps } from "./type";

export default function Sidebar({
  selected,
  collapsed,
  onToggle,
}: SidebarProps) {
  const { sidebarItems, goToDashboard, goToItem, logout } = useSidebar();

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} sticky top-0 flex h-screen shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-4 shadow-lg transition-all duration-300`}
    >
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={goToDashboard}
          aria-label="Go to dashboard"
          className="flex items-center overflow-hidden rounded-md p-1"
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
          className="rounded-md border border-gray-200 px-2 py-1 text-gray-500 transition-colors hover:border-amber-400/60 hover:bg-amber-50 hover:text-amber-600"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="flex-1">
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

      <div className="mt-4 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          {collapsed ? "⏻" : "Logout"}
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
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item : undefined}
        className={`relative flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
          active
            ? "bg-amber-50 text-slate-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-slate-900"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-amber-400" />
        )}
        <span className={active ? "ml-2 font-semibold" : ""}>
          {collapsed ? item.charAt(0) : item}
        </span>
      </button>
    </li>
  );
}