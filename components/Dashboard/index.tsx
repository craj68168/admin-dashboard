"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { recentActivities } from "./dashboard.type";
import { useDashboardStats } from "./hook";

export default function DashboardComponentnent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: dashboardStats = [], isLoading, isError } = useDashboardStats();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Dashboard"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <Navbar title="Dashboard" />

        {isError && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            Failed to load dashboard counts.
          </div>
        )}

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {(isLoading ? dashboardStatSkeleton : dashboardStats).map((stat) => (
            <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="mt-3 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-gray-900">Recent Activities</h3>

          <ul className="space-y-3 text-sm text-gray-700">
            {recentActivities.map((activity) => (
              <li key={activity.id}>{activity.text}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

const dashboardStatSkeleton = [
  { title: "Total Staff", value: "..." },
  { title: "Total Clients", value: "..." },
  { title: "Completed Clients", value: "..." },
];
