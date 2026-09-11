"use client";

import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { useDashboardStats } from "./hook";
import type { DashboardStat } from "./dashboard.type";
import { formatCreatedAt } from "@/utils/format-date";

const iconMap = {
  staff: GroupsRoundedIcon,
  clients: PeopleAltRoundedIcon,
  active: PersonRoundedIcon,
  complete: CheckCircleRoundedIcon,
};

const toneMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", bar: "bg-violet-500" },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  amber: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
};

const dashboardSkeleton: DashboardStat[] = [
  {
    title: "Total staff",
    value: "...",
    detail: "Loading data",
    tone: "blue",
    icon: "staff",
  },
  {
    title: "Total clients",
    value: "...",
    detail: "Loading data",
    tone: "violet",
    icon: "clients",
  },
  {
    title: "Active staff",
    value: "...",
    detail: "Loading data",
    tone: "green",
    icon: "active",
  },
  {
    title: "Completed clients",
    value: "...",
    detail: "Loading data",
    tone: "amber",
    icon: "complete",
  },
];

export default function DashboardComponentnent() {
  const { data, isLoading, isError } = useDashboardStats();
  const stats = isLoading ? dashboardSkeleton : (data?.stats ?? []);
  const maxStatusCount = Math.max(
    ...(data?.statuses.map((status) => status.count) ?? [1]),
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <main className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Operations overview
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Good morning, admin.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Keep a clear view of your team, client pipeline, and today&apos;s
              progress.
            </p>
          </div>
          <Link
            href="/admin/client"
            className="inline-flex items-center gap-2 self-start rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 md:self-auto"
          >
            Open client records
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Link>
        </section>

        {isError && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            Unable to load the latest dashboard data. Please refresh and try
            again.
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon];
            const tone = toneMap[stat.tone];

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}
                  >
                    <Icon sx={{ fontSize: 23 }} />
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-400">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  Client pipeline
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Current distribution by client status
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <TrendingUpRoundedIcon />
              </div>
            </div>

            {data?.statuses.length ? (
              <div className="space-y-5">
                {data.statuses.map((status) => (
                  <div key={status.label}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-slate-700">
                        {status.label}
                      </span>
                      <span className="font-bold text-slate-900">
                        {status.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max((status.count / maxStatusCount) * 100, 8)}%`,
                          backgroundColor: status.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-40 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
                No client status data yet.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  Recent clients
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Latest records entering the pipeline
                </p>
              </div>
              <Link
                href="/admin/client"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            {data?.recentClients.length ? (
              <div className="divide-y divide-slate-100">
                {data.recentClients.map((client) => (
                  <Link
                    key={client.clientId}
                    href={`/admin/client/clientDetailPage?clientId=${client.clientId}`}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {client.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {client.createdAt
                          ? formatCreatedAt(client.createdAt)
                          : "Recently added"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {client.clientStatus}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-40 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
                No clients found.
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-900 p-6 text-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-bold">Keep the pipeline moving</p>
              <p className="mt-1 text-sm text-slate-300">
                Review assignments and update client statuses from the client
                workspace.
              </p>
            </div>
            <Link
              href="/admin/staff"
              className="inline-flex items-center gap-2 self-start rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-blue-50 sm:self-auto"
            >
              Manage staff
              <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
