"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StaffTable from "@/components/Staff";
import { useAuthStore } from "@/store/auth-store";
import { useStaffHook } from "./hook";
import Link from "next/link";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Box from "@mui/material/Box";

import {
  DataGrid,
  GridCell,
  type GridCellProps,
  type GridColDef,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { theme } from "@/app/providers/theme";

export default function StaffPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const role = useAuthStore((state) => state.user?.role);

  const { isLoading, staffData } = useStaffHook();

  const columns: GridColDef[] = [
    {
      field: "staffId",
      headerName: "ID",
      width: 170,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "name",
      headerName: "Full name",
      width: 270,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Link href={`/staff/${params.row.staffId}/clients`}>
          {params.row.name}
        </Link>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "location",
      headerName: "Location",
      width: 170,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 270,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "",
      headerName: "Action",
      resizable: false,
      width: 135,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant={"text"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/staff/${params.row.staffId}/clients`);
              }}
            >
              <RemoveRedEyeIcon />
            </Button>
          </Box>
        );
      },
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
            <Button
              variant="contained"
              onClick={() => router.push("/staff/add")}
            >
              Add Staff
            </Button>
          </div>
        )}

        <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={staffData?.data?.data || []}
            getRowId={(row) => row.staffId}
            columns={columns}
            disableColumnMenu
            // initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            // slots={{ cell: renderRowHeaderCell }}

            loading={isLoading}
            hideFooter
            sx={{
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },

              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "primary.main",
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },

              "& .action-column-cell": {
                backgroundColor: "#fff",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },

              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
        </Paper>
      </main>
    </div>
  );
}
