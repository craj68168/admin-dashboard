"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useStaffHook } from "./hook";
import Link from "next/link";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function StaffPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const role = useAuthStore((state) => state.user?.role);


  const { isLoading, staffData } = useStaffHook();

  const columns: GridColDef[] = [
    { field: "staffId", headerName: "ID", width: 170 },
    { field: "name", headerName: "Full name", width: 170,
      renderCell: (params) => (
      <Link href={`/staff/${params.row.staffId}/clients`}>
        {params.row.name}
      </Link>
    ), },
    { field: "email", headerName: "Email", width: 170 },
    { field: "location", headerName: "Location", width: 170 },
    { field: "createdAt", headerName: "Created At", width: 170 },
    {
      field: "action",
      headerName: "Action",
      width: 170,
      renderCell: () => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="text" aria-label="View staff">
            <RemoveRedEyeIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Staff"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8 pt-2">
        <Navbar title="Staff" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff", current: true },
            ]}
          />
        </div>

        {role === "superadmin" && (
          <div className="mb-6 flex justify-end">
             <Button variant="contained" onClick={() => router.push("/staff/add")}>Add Staff</Button>
          </div>
        )}

        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={staffData?.data?.data || []}
            getRowId={(row) => row.staffId}
            columns={columns}
            disableColumnMenu
            // initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            // slots={{ cell: renderRowHeaderCell }}
            sx={{ border: 0 }}
            loading={isLoading}
            hideFooter
          />
        </Paper>
      </main>
    </div>
  );
}
