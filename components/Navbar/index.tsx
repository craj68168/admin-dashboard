"use client";

import { useNavbar } from "./hook";
import type { NavbarProps } from "./type";

export default function Navbar({ title }: NavbarProps) {
  const { user, initials } = useNavbar();

  return (
    <div className="sticky top-0 z-10 mb-2 flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />

        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold text-slate-900">
              {user.name}
            </p>

            <p className="flex items-center gap-1.5 text-xs text-slate-500 sm:justify-end">
              <span className="rounded-full bg-navy-50 px-2 py-0.5 font-medium capitalize text-navy-700">
                {user.role}
              </span>

              {user.location && (
                <span className="text-slate-400">
                  · {user.location}
                </span>
              )}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-navy-950 text-sm font-semibold text-amber-400 shadow-sm ring-2 ring-amber-400/30">
            {initials}
          </div>
        </div>
      )}
    </div>
  );
}