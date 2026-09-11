export type DashboardStat = {
  title: string;
  value: string;
  detail: string;
  tone: "blue" | "green" | "amber" | "violet";
  icon: "staff" | "clients" | "active" | "complete";
};

export type DashboardStatus = {
  label: string;
  count: number;
  color: string;
};

export type RecentClient = {
  clientId: number | string;
  fullName: string;
  clientStatus: string;
  createdAt?: string;
};

export type DashboardData = {
  stats: DashboardStat[];
  statuses: DashboardStatus[];
  recentClients: RecentClient[];
};
