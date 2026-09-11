"use client";

import Link from "next/link";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import { useAuthStore } from "@/store/auth-store";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!user) {
    return (
      <div className="p-8 text-sm text-slate-500">Profile is unavailable.</div>
    );
  }

  const details = [
    { label: "Full name", value: user.name, icon: PersonRoundedIcon },
    { label: "Email address", value: user.email, icon: EmailRoundedIcon },
    { label: "Role", value: user.role, icon: WorkspacesRoundedIcon },
    {
      label: "Location",
      value: user.location || "Not specified",
      icon: LocationOnRoundedIcon,
    },
    { label: "User ID", value: String(user.id), icon: BadgeRoundedIcon },
    ...(user.staffId
      ? [
          {
            label: "Staff ID",
            value: String(user.staffId),
            icon: BadgeRoundedIcon,
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
          Back to dashboard
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <div className="relative bg-slate-900 px-6 py-8 sm:px-10 sm:py-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-cyan-500 text-2xl font-bold text-white shadow-lg ring-4 ring-white/10">
                {initials}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Account profile
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  {user.name}
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                  Your authenticated account details and access information.
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold capitalize text-cyan-200 sm:ml-auto">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Icon sx={{ fontSize: 21 }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold capitalize text-slate-800">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
