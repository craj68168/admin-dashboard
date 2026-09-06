"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ReusableTable from "@/components/ReusableTable";
import Breadcrumb from "@/components/Breadcrumb";
import { useAssignClient } from "@/components/Client/client.mutations";
import { useClientPageData } from "@/components/Client/client.queries";
import { canAssignClient, canCreateClient } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

export default function ClientPage() {
  return (
    <Suspense fallback={<ClientPageFallback />}>
      <ClientPageContent />
    </Suspense>
  );
}

function ClientPageContent() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useClientPageData();
  const assignClient = useAssignClient();
  const staffs = data?.staffs ?? [];
  const clients = data?.clients ?? [];

  const handleAssignClient = (clientId: number, staffId: number | string) => {
    if (!canAssignClient(user)) {
      return;
    }

    const selectedClient = clients.find(
      (client) => Number(client.clientId) === Number(clientId),
    );
    if (!selectedClient?._id) return;

    const selectedStaff = staffs.find(
      (staff) =>
        String(staff._id ?? staff.id ?? staff.staffId) === String(staffId),
    );

    if (!selectedStaff) return;

    assignClient.mutate({
      clientId: selectedClient._id,
      staffId: selectedStaff._id ?? selectedStaff.id,
    });
  };

  const handleAddClient = () => {
    router.push("/client/clientDetailPage?mode=create");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar
          selected="Clients"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            Loading clients...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Clients"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
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

        {canCreateClient(user) && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleAddClient}
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
          staffs={staffs.map((staff) => ({
            id: staff._id ?? staff.id ?? staff.staffId ?? 0,
            name: staff.name,
            _id: staff._id,
          }))}
          canManageAssignments={canAssignClient(user)}
          onAssignClient={handleAssignClient}
        />
      </main>
    </div>
  );
}

function ClientPageFallback() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-5">Loading...</aside>
      <main className="flex-1 p-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}
