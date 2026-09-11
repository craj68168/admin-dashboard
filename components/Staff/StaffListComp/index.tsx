"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/auth-store";
import { useStaffHook } from "./hook";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { formatCreatedAt } from "@/utils/format-date";

export default function StaffPage() {
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);

  const { isLoading, staffData, deleteStaff, isDeleting } = useStaffHook();

  const columns: GridColDef[] = [
    {
      field: "staffId",
      headerName: "ID",
      flex: 0.7,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "name",
      headerName: "Full name",
      flex: 1.2,
      minWidth: 170,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.1,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0.8,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) => formatCreatedAt(row.createdAt),
    },
    {
      field: "",
      headerName: "Action",
      resizable: false,
      width: role === "superadmin" ? 190 : 90,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="View staff clients">
              <IconButton
                aria-label="View staff clients"
                onClick={() =>
                  router.push(`/admin/staff/${params.row.staffId}/clients`)
                }
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>

            {role === "superadmin" && (
              <>
                <Tooltip title="Edit staff">
                  <IconButton
                    aria-label="Edit staff"
                    onClick={() =>
                      router.push(`/admin/staff/${params.row.staffId}/edit`)
                    }
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete staff">
                  <span>
                    <IconButton
                      aria-label="Delete staff"
                      disabled={isDeleting}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${params.row.name ?? "this staff member"}?`,
                          )
                        ) {
                          deleteStaff(params.row.staffId);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
          </Box>
        );
      },
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
              onClick={() => router.push("/admin/staff/add")}
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
            autoHeight
          />
        </Paper>
      </main>
    </div>
  );
}
