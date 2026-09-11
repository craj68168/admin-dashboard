"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Box from "@mui/material/Box";
import { useClientListHook, useClientHook } from "./hook";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

const ClientListPage = () => {
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);
  const { canCreateClient, handleCreateClient } = useClientListHook();

  const { isClientLoading, clientData } = useClientHook();
  const columns: GridColDef[] = [
    {
      field: "clientId",
      headerName: "ID",
      flex: 0.65,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      flex: 1.2,
      minWidth: 170,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "assignedStaff",
      headerName: "Assign To",
      flex: 1,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) =>
        row.assignedStaffName ??
        (typeof row.assignedStaff === "object"
          ? row.assignedStaff?.name
          : row.assignedStaff) ??
        "Unassigned",
    },
    {
      field: "action",
      headerName: "Action",
      width: role === "superadmin" ? 130 : 78,
      resizable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="View client">
            <IconButton
              aria-label="View client"
              onClick={() =>
                router.push(
                  `/admin/client/clientDetailPage?clientId=${row.clientId}`,
                )
              }
            >
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>

          {role === "superadmin" && (
            <Tooltip title="Edit client">
              <IconButton
                aria-label="Edit client"
                onClick={() =>
                  router.push(`/admin/client/edit?clientId=${row.clientId}`)
                }
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client", current: true },
            ]}
          />
        </div>

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

        <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={clientData?.data || []}
            getRowId={(row) => row.clientId}
            columns={columns}
            disableColumnMenu
            // initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            // slots={{ cell: renderRowHeaderCell }}

            loading={isClientLoading}
            hideFooter
            autoHeight
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
};

export default ClientListPage;
