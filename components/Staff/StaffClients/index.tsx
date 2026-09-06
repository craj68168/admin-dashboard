"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ReusableTable from "@/components/ReusableTable";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useUpdateClientField } from "@/components/Client/client.mutations";
import { useStaffClients } from "@/components/Client/staff-client.queries";
import { canEditClient, canUpdateClientStatus } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

export default function StaffClients() {
  return (
    <Suspense fallback={<StaffClientsFallback />}>
      <StaffClientsContent />
    </Suspense>
  );
}

function StaffClientsContent() {
 
  const params = useParams<{ staffId: string }>();
  const staffId = params.staffId;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useStaffClients(staffId);
  const staffs = data?.staffs ?? [];
  const clients = data?.clients ?? [];
  const selectedStaff = data?.selectedStaff ?? null;
  const updateClientField = useUpdateClientField();

  const handleUpdateClientField = (
    clientId: number,
    field: "coeStatus" | "visaStatus" | "clientStatus",
    value: string,
  ) => {
    const selectedClient = clients.find((client) => client.clientId === clientId);

    if (!selectedClient || !canUpdateClientStatus(user, selectedClient)) {
      return;
    }

    if (!selectedClient._id) return;

    updateClientField.mutate({
      recordId: selectedClient._id,
      field,
      value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Staff"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
        <Navbar title={`${selectedStaff?.name ?? "Staff"} Clients`} />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff" },
              {
                label: selectedStaff?.name ?? "Staff Clients",
                href: `/staff/${staffId}/clients`,
                current: true,
              },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            Loading assigned clients...
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Failed to load assigned clients.
          </div>
        ) : (
          <ReusableTable
            title={`${selectedStaff?.name ?? "Staff"} Clients`}
            variant="staff"
            clients={clients}
            staffs={staffs.map((staff) => ({
              id: staff._id ?? staff.id ?? staff.staffId ?? 0,
              name: staff.name,
              _id: staff._id,
            }))}
            canEditClient={(client) => canEditClient(user, client)}
            canUpdateClientStatus={clients.every((client) =>
              canUpdateClientStatus(user, client),
            )}
            onUpdateClientField={handleUpdateClientField}
          />
        )}
      </main>
    </div>
  );
}

function StaffClientsFallback() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-5 shadow-lg">Loading...</aside>
      <main className="flex-1 p-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}
