"use client";

import Link from "next/link";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useNavbar } from "./hook";
import type { NavbarProps } from "./type";

export default function Navbar({ title }: NavbarProps) {
  const { user, initials } = useNavbar();

  return (
    <div className="sticky top-0 z-10 mb-2 flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1 rounded-full bg-linear-to-b from-amber-400 to-amber-600" />

        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>

      {user && (
        <Link
          href="/admin/profile"
          aria-label="Open profile"
          className="group flex items-center gap-3 self-start rounded-xl border border-slate-200/80 bg-white/80 px-2.5 py-2 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-md sm:self-auto"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-800 to-blue-950 text-sm font-bold text-amber-300 shadow-sm ring-1 ring-slate-700/10">
            {initials}
          </div>

          <div className="min-w-0 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Signed in as
            </p>
            <p className="max-w-36 truncate text-sm font-bold text-slate-900">
              {user.name}
            </p>
            <p className="text-xs font-medium capitalize text-blue-600">
              {user.role}
              {user.location ? ` · ${user.location}` : ""}
            </p>
          </div>

          <ExpandMoreRoundedIcon
            className="text-slate-400 transition-transform group-hover:text-blue-600 group-hover:rotate-180"
            sx={{ fontSize: 20 }}
          />
        </Link>
      )}
    </div>
  );
}
