"use client";

import { useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import Breadcrumb from "@/components/Breadcrumb";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useClientHook } from "./hook";
import { useRouter } from "next/navigation";

type DeleteDialogState = {
  open: boolean;
  clientId: string;
  clientName: string;
};

const ClientListPage = () => {
  const router = useRouter();
  const {
    role,

    clientData,
    isClientLoading,

    deleteClient,
    isDeleting,

    handleCreateClient,
  } = useClientHook();

  // =================================================
  // DELETE DIALOG
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
    if (!deleteDialog.clientId) {
      return;
    }

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
      minWidth: 140,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1.2,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "visaType",
      headerName: "Visa Type",
      flex: 0.9,
      minWidth: 140,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "currentStage",
      headerName: "Progress",
      flex: 1.3,
      minWidth: 230,
      resizable: false,
      disableColumnMenu: true,

      valueGetter: (_value, row) => row.currentStage ?? "Registration Pending",
    },

    {
      field: "assignedStaff",
      headerName: "Assigned To",
      flex: 1.1,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,

      valueGetter: (_value, row) => {
        return row.assignedStaffDetails?.name || row.assignedStaff || "-";
      },
    },

    {
      field: "actions",
      headerName: "Action",
      width: role === "superadmin" ? 150 : 110,
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
            {/* VIEW */}
            <Tooltip title="View client">
              <IconButton
                aria-label="View client"
                onClick={() =>
                  router.push(
                    `/admin/client/${encodeURIComponent(row.clientId)}`,
                  )
                }
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>

            {/* EDIT
                Admin → any client
                Staff → own client
                Backend already protects this
            */}
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

            {/* DELETE
                Super Admin only
            */}
            {role === "superadmin" && (
              <Tooltip title="Delete client">
                <span>
                  <IconButton
                    aria-label="Delete client"
                    disabled={isDeleting}
                    onClick={() =>
                      setDeleteDialog({
                        open: true,

                        clientId: row.clientId,

                        clientName: row.fullName || "this client",
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
          minHeight: "100vh",
          bgcolor: "#f3f4f6",
          px: 4,
          pb: 4,
        }}
      >
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <Box sx={{ mb: 3 }}>
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                href: "/admin/dashboard",
              },
              {
                label: "Clients",
                current: true,
              },
            ]}
          />
        </Box>

        {/* =================================================
            ADD CLIENT
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClient}
          >
            Add Client
          </Button>
        </Box>

        {/* =================================================
            CLIENT TABLE
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={clientData?.data || []}
            columns={columns}
            getRowId={(row) => row.clientId}
            loading={isClientLoading}
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooter
            autoHeight
            slots={{
              noRowsOverlay: NoDataOverlay,
            }}
            sx={{
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "primary.main",
                color: "white",
              },

              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },

              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },

              "& .MuiDataGrid-row:nth-of-type(even)": {
                bgcolor: "grey.50",
              },
            }}
          />
        </Box>
      </Box>

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      <ConfirmActionDialog
        open={deleteDialog.open}
        title="Delete Client"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.clientName}</strong>?
            <div
              style={{
                marginTop: 12,
              }}
            >
              This action cannot be undone.
            </div>
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
};

export default ClientListPage;
