"use client";

import { useAuthStore } from "@/store/auth-store";

type NavbarProps = {
  title: string;
};

export default function Navbar({ title }: NavbarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="sticky top-0 z-10 mb-8 flex flex-col gap-3 border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>

      {user && (
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs capitalize text-slate-500">
            {user.role}
            {user.location ? ` · ${user.location}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
