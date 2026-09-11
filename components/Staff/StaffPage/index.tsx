"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
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
  const role = useAuthStore((state) => state.user?.role);

  const { isLoading, staffData } = useStaffHook();

  const columns: GridColDef[] = [
    { field: "staffId", headerName: "ID", flex: 0.7, minWidth: 130 },
    {
      field: "name",
      headerName: "Full name",
      flex: 1.1,
      minWidth: 170,
      renderCell: (params) => (
        <Link href={`/staff/${params.row.staffId}/clients`}>
          {params.row.name}
        </Link>
      ),
    },
    { field: "email", headerName: "Email", flex: 1, minWidth: 170 },
    { field: "location", headerName: "Location", flex: 0.8, minWidth: 130 },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 170 },
    {
      field: "action",
      headerName: "Action",
      width: 110,
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
      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8 pt-2">
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
            <Button
              variant="contained"
              onClick={() => router.push("/staff/add")}
            >
              Add Staff
            </Button>
          </div>
        )}

        <Paper sx={{ width: "100%", overflowX: "auto" }}>
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
            autoHeight
          />
        </Paper>
      </main>
    </div>
  );
}
