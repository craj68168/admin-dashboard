"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import ReusableTable from "@/components/ReusableTable";
import Sidebar from "@/components/Sidebar";
import { useClientListHook } from "./hook";

const ClientListPage = () => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    staffs,
    clients,
    isError,
    canCreateClient,
    canAssignClient,
    handleCreateClient,
    handleAssignClient,
  } = useClientListHook();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Clients"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <Navbar title="Clients" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client", current: true },
            ]}
          />
        </div>

        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load clients.
          </div>
        )}

        {canCreateClient && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleCreateClient}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span aria-hidden="true">+</span>
              Add Client
            </button>
          </div>
        )}

        <ReusableTable
          title="All Clients"
          variant="compact"
          clients={clients.map((client) => ({
            clientId: Number(client.clientId ?? 0),
            fullName: client.fullName,
            assignedStaffId: client.assignedStaffId,
            assignedStaffName: client.assignedStaffName,
          }))}
          staffs={staffs}
          canManageAssignments={canAssignClient}
          onAssignClient={handleAssignClient}
        />
      </main>
    </div>
  );
};

export default ClientListPage;
