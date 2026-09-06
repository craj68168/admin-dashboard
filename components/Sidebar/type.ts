export type SidebarItem = "Dashboard" | "Staff" | "Clients";

export type SidebarProps = {
  selected: SidebarItem;
  collapsed: boolean;
  onToggle: () => void;
};

export type SidebarNavItemProps = {
  item: SidebarItem;
  active: boolean;
  collapsed: boolean;
  onSelect: () => void;
};

export const sidebarItems: SidebarItem[] = ["Dashboard", "Staff", "Clients"];

export const routeMap: Record<SidebarItem, string> = {
  Dashboard: "/admin/dashboard",
  Staff: "/staff",
  Clients: "/client",
};
