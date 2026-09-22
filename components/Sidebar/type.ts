export type SidebarItem =
  | "Dashboard"
  | "Staff"
  | "Clients"
  | "Stages";

export type SidebarProps = {
  selected: SidebarItem | "";
  collapsed: boolean;
  onToggle: () => void;
};

export type SidebarNavItemProps = {
  item: SidebarItem;
  label: string;
  active: boolean;
  collapsed: boolean;
  onSelect: () => void;
};

export const sidebarItems: SidebarItem[] = [
  "Dashboard",
  "Staff",
  "Clients",
  "Stages",
];

export const routeMap: Record<SidebarItem, string> = {
  Dashboard: "/admin/dashboard",
  Staff: "/admin/staff",
  Clients: "/admin/client",
  Stages: "/admin/stages",
};