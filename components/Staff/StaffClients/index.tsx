"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import Breadcrumb from "@/components/Breadcrumb";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useAuthStore } from "@/store/auth-store";
import { formatCreatedAt } from "@/utils/format-date";

import { useStaffClients } from "./hook";

type DeleteDialogState = {
  open: boolean;
  clientId: string;
  clientName: string;
};

function StaffClientsContent() {
  const router = useRouter();

  const role = useAuthStore((state) => state.user?.role);

  const { data, isPending, deleteClient, isDeleting } = useStaffClients();

  // =================================================
  // DELETE CONFIRMATION DIALOG
  // =================================================

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    clientId: "",
    clientName: "",
  });

  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      clientId: "",
      clientName: "",
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog.clientId) return;

    deleteClient(deleteDialog.clientId, {
      onSuccess: () => {
        closeDeleteDialog();
      },
    });
  };

  // =================================================
  // COLUMNS
  // =================================================

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
      field: "actions",
      headerName: "Action",
      width: role === "superadmin" ? 160 : 110,
      resizable: false,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,

      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* VIEW CLIENT */}
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

            {/* EDIT CLIENT */}
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

            {/* DELETE CLIENT - SUPER ADMIN ONLY */}
            {role === "superadmin" && (
              <Tooltip title="Delete client">
                <span>
                  <IconButton
                    aria-label="Delete client"
                    disabled={isDeleting}
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        clientId: String(row.clientId),
                        clientName: row.fullName ?? "this client",
                      })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#f3f4f6",
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            px: 4,
            pb: 4,
          }}
        >
          {/* BREADCRUMB */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  href: "/admin/dashboard",
                },
                {
                  label: "Staff",
                  href: "/admin/staff",
                },
                {
                  label: "Clients",
                },
              ]}
            />
          </Box>

          {/* TABLE */}
          <DataGrid
            rows={data?.data || []}
            getRowId={(row) => row.clientId}
            columns={columns}
            disableColumnMenu
            pageSizeOptions={[5, 10]}
            slots={{
              noRowsOverlay: NoDataOverlay,
            }}
            loading={isPending}
            hideFooter
            autoHeight
          />
        </Box>
      </Box>

      {/* =================================================
          DELETE CLIENT CONFIRMATION
      ================================================= */}

      <ConfirmActionDialog
        open={deleteDialog.open}
        title="Delete Client"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.clientName}</strong>?
            <div style={{ marginTop: 12 }}>This action cannot be undone.</div>
          </>
        }
        confirmText="Yes, Delete"
        cancelText="No"
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteDialog}
      />
    </>
  );
}

export default StaffClientsContent;
