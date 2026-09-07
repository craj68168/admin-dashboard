"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  DataGrid,
  GridCell,
  type GridCellProps,
  type GridColDef,
} from "@mui/x-data-grid";

import Breadcrumb from "@/components/Breadcrumb";
import { useAssignClient } from "@/components/Client/client.mutations";
import { useClientPageData } from "@/components/Client/client.queries";
import { canAssignClient, canCreateClient } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";
import { useClientListHook } from "./hook";
import Paper from "@mui/material/Paper";

const ClientListPage = () => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useClientPageData();
  const assignClient = useAssignClient();
  const staffs = data?.staffs ?? [];
  const clients = data?.clients ?? [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
  ];

  const { data: clientListData } = useClientListHook();

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

        {canCreateClient(user) && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() =>
                router.push("/client/clientDetailPage?mode=create")
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span aria-hidden="true">+</span>
              Add Client
            </button>
          </div>
        )}

        {/* <ReusableTable
          title="All Clients"
          variant="compact"
          clients={clients.map((client) => ({
            clientId: Number(client.clientId ?? 0),
            fullName: client.fullName,
            assignedStaffId: client.assignedStaffId,
            assignedStaffName: client.assignedStaffName,
          }))}
          canManageAssignments={canAssignClient(user)}
          onAssignClient={handleAssignClient}
        /> */}
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data?.data ?? []}
            columns={columns}
            // initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            // slots={{ cell: renderRowHeaderCell }}
            sx={{ border: 0 }}
          />
        </Paper>
      </main>
    </div>
  );
};

export default ClientListPage;
