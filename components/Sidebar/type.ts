export type SidebarItem =
  | "Dashboard"
  | "Staff"
  | "Clients"
  | "Revenue"
  | "Performance";

export type SidebarProps = {
  selected: SidebarItem | "";
  collapsed: boolean;
  onToggle: () => void;
};

export type SidebarNavItemProps = {
  item: SidebarItem;
  active: boolean;
  collapsed: boolean;
  onSelect: () => void;
};

export const sidebarItems: SidebarItem[] = [
  "Dashboard",
  "Staff",
  "Clients",
  "Revenue",
  "Performance",
];

export const routeMap: Record<SidebarItem, string> = {
  Dashboard: "/admin/dashboard",
  Staff: "/admin/staff",
  Clients: "/admin/client",
  Revenue: "/admin/revenue",
  Performance: "/admin/performance",
};
