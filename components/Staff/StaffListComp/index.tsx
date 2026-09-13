"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/auth-store";
import { useStaffHook } from "./hook";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { formatCreatedAt } from "@/utils/format-date";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import { useState } from "react";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

export default function StaffPage() {
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);

  const { isLoading, staffData, updateStaffStatus, isUpdatingStatus } =
    useStaffHook();

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
      field: "actions",
      headerName: "Action",
      resizable: false,
      width: role === "superadmin" ? 230 : 100,
      disableColumnMenu: true,
      sortable: false,

      renderCell: (params) => {
        const isActive = params.row.isActive;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* VIEW STAFF CLIENTS */}
            <Tooltip title="View staff clients">
              <IconButton
                aria-label="View staff clients"
                onClick={() =>
                  router.push(`/admin/staff/${params.row.staffId}/clients`)
                }
              >
                <PersonSearchIcon />
              </IconButton>
            </Tooltip>

            {/* VIEW STAFF DETAILS */}
            <Tooltip title="View staff details">
              <IconButton
                aria-label="View staff details"
                onClick={() =>
                  router.push(`/admin/staff/${params.row.staffId}`)
                }
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>

            {role === "superadmin" && (
              <>
                {/* EDIT STAFF */}
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

                <Tooltip title={isActive ? "Disable staff" : "Activate staff"}>
                  <span>
                    <IconButton
                      aria-label={isActive ? "Disable staff" : "Activate staff"}
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        setStatusDialog({
                          open: true,
                          staffId: params.row.staffId,
                          name: params.row.name ?? "this staff member",
                          isActive,
                        })
                      }
                    >
                      {isActive ? (
                        <PersonOffOutlinedIcon />
                      ) : (
                        <PersonAddOutlinedIcon />
                      )}
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
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    staffId: string;
    name: string;
    isActive: boolean;
  }>({
    open: false,
    staffId: "",
    name: "",
    isActive: false,
  });
  const closeStatusDialog = () => {
    setStatusDialog({
      open: false,
      staffId: "",
      name: "",
      isActive: false,
    });
  };
  const handleConfirmStatusChange = () => {
    updateStaffStatus(
      {
        staffId: statusDialog.staffId,
        isActive: !statusDialog.isActive,
      },
      {
        onSuccess: () => {
          closeStatusDialog();
        },
      },
    );
  };
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
            rows={staffData?.data || []}
            getRowId={(row) => row.staffId}
            columns={columns}
            disableColumnMenu
            // initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            // slots={{ cell: renderRowHeaderCell }}
            slots={{ noRowsOverlay: NoDataOverlay }}
            loading={isLoading}
            hideFooter
            autoHeight
          />
        </Paper>
      </main>
      <ConfirmActionDialog
        open={statusDialog.open}
        title={statusDialog.isActive ? "Disable Staff" : "Activate Staff"}
        description={
          <>
            Are you sure you want to{" "}
            <strong>{statusDialog.isActive ? "disable" : "activate"}</strong>{" "}
            <strong>{statusDialog.name}</strong>?
            {statusDialog.isActive && (
              <div style={{ marginTop: 12 }}>
                This staff member will not be able to log in while the account
                is disabled.
              </div>
            )}
          </>
        }
        confirmText={statusDialog.isActive ? "Yes, Disable" : "Yes, Activate"}
        confirmColor={statusDialog.isActive ? "error" : "success"}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
        onClose={closeStatusDialog}
      />
    </div>
  );
}
