"use client";
import Box from "@mui/material/Box";
import Breadcrumb from "@/components/Breadcrumb";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useStaffClients } from "./hook";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatCreatedAt } from "@/utils/format-date";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import { canEditClient } from "@/lib/permissions";

function StaffClientsContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.user?.role);
  const { data, isPending, deleteClient, isDeleting } = useStaffClients();
  const columns: GridColDef[] = [
    {
      field: "clientId",
      headerName: "ID",
      flex: 0.7,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1.1,
      minWidth: 170,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "clientStatus",
      headerName: "Status",
      flex: 1.2,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.9,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "visaType",
      headerName: "Visa Type",
      flex: 0.9,
      minWidth: 150,
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
      width: role === "superadmin" ? 190 : 130,
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

          {canEditClient(user, row) && (
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

          {role === "superadmin" && (
            <Tooltip title="Delete client">
              <span>
                <IconButton
                  aria-label="Delete client"
                  disabled={isDeleting}
                  onClick={() => {
                    if (
                      window.confirm(`Delete ${row.fullName ?? "this client"}?`)
                    ) {
                      deleteClient(row.clientId);
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f3f4f6",
      }}
    >
      <Box
        component="main"
        sx={{ flex: 1, height: "100vh", overflowY: "auto", px: 4, pb: 4 }}
      >
        <Box sx={{ mb: 3 }}>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff" },
            ]}
          />
        </Box>

        <DataGrid
          rows={data?.data || []}
          getRowId={(row) => row.clientId}
          columns={columns}
          disableColumnMenu
          // initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          // slots={{ cell: renderRowHeaderCell }}
          slots={{ noRowsOverlay: NoDataOverlay }}
          loading={isPending}
          hideFooter
          autoHeight
        />
      </Box>
    </Box>
  );
}
export default StaffClientsContent;
