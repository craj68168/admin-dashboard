"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
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

// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

// =================================================
// STATUS STYLE
// =================================================

const getStatusStyle = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || "";

  if (
    normalizedStatus.includes("active") ||
    normalizedStatus.includes("approved") ||
    normalizedStatus.includes("complete") ||
    normalizedStatus.includes("success")
  ) {
    return {
      color: BRAND,
      bgcolor: BRAND_SOFT,
      borderColor: "rgba(16, 122, 100, 0.14)",
    };
  }

  if (
    normalizedStatus.includes("inactive") ||
    normalizedStatus.includes("rejected") ||
    normalizedStatus.includes("cancel") ||
    normalizedStatus.includes("delete")
  ) {
    return {
      color: "#DC2626",
      bgcolor: "#FEF2F2",
      borderColor: "rgba(220, 38, 38, 0.12)",
    };
  }

  if (
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("waiting") ||
    normalizedStatus.includes("progress") ||
    normalizedStatus.includes("outstanding")
  ) {
    return {
      color: "#B7791F",
      bgcolor: "#FFFBEB",
      borderColor: "rgba(183, 121, 31, 0.14)",
    };
  }

  return {
    color: INK_MUTED,
    bgcolor: "#F9FAFB",
    borderColor: HAIRLINE,
  };
};

type DeleteDialogState = {
  open: boolean;
  clientId: string;
  clientName: string;
};

function StaffClientsContent() {
  const router = useRouter();
  const t = useTranslations("staffClients");

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
      headerName: t("columns.id"),
      flex: 0.7,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "fullName",
      headerName: t("columns.fullName"),
      flex: 1.1,
      minWidth: 170,
      resizable: false,
      disableColumnMenu: true,

      renderCell: ({ value }) => (
        <Box
          component="span"
          sx={{
            color: INK,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {value}
        </Box>
      ),
    },

    {
      field: "clientStatus",
      headerName: t("columns.status"),
      flex: 1.2,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,

      renderCell: ({ value }) => {
        const status = String(value || "");

        return (
          <Chip
            size="small"
            label={status}
            variant="outlined"
            sx={{
              ...getStatusStyle(status),

              height: 27,

              borderRadius: 999,

              fontSize: 11.5,

              fontWeight: 600,

              transition:
                "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

              "& .MuiChip-label": {
                px: 1.35,
              },
            }}
          />
        );
      },
    },

    {
      field: "phone",
      headerName: t("columns.phone"),
      flex: 0.9,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "visaType",
      headerName: t("columns.visaType"),
      flex: 0.9,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "createdAt",
      headerName: t("columns.createdAt"),
      flex: 1,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,

      valueGetter: (_value, row) => formatCreatedAt(row.createdAt),
    },

    {
      field: "actions",
      headerName: t("columns.action"),
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
              gap: 0.25,
              height: "100%",
            }}
          >
            {/* VIEW CLIENT */}

            <Tooltip title={t("actions.view")}>
              <IconButton
                aria-label={t("actions.view")}
                onClick={() => router.push(`/admin/client/${row.clientId}`)}
                sx={{
                  width: 34,
                  height: 34,
                  color: BRAND,
                  borderRadius: 2,

                  transition:
                    "background-color 200ms ease, color 200ms ease, transform 200ms ease",

                  "&:hover": {
                    bgcolor: BRAND_SOFT,
                  },

                  "& .MuiSvgIcon-root": {
                    fontSize: 19,
                  },
                }}
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>

            {/* EDIT CLIENT */}

            <Tooltip title={t("actions.edit")}>
              <IconButton
                aria-label={t("actions.edit")}
                onClick={() =>
                  router.push(`/admin/client/edit?clientId=${row.clientId}`)
                }
                sx={{
                  width: 34,
                  height: 34,
                  color: INK_MUTED,
                  borderRadius: 2,

                  transition:
                    "background-color 200ms ease, color 200ms ease",

                  "&:hover": {
                    bgcolor: BRAND_SOFT,
                    color: BRAND,
                  },

                  "& .MuiSvgIcon-root": {
                    fontSize: 19,
                  },
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>

            {/* DELETE CLIENT - SUPER ADMIN ONLY */}

            {role === "superadmin" && (
              <Tooltip title={t("actions.delete")}>
                <span>
                  <IconButton
                    aria-label={t("actions.delete")}
                    disabled={isDeleting}
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        clientId: String(row.clientId),
                        clientName: row.fullName ?? t("thisClient"),
                      })
                    }
                    sx={{
                      width: 34,
                      height: 34,
                      color: "#DC2626",
                      borderRadius: 2,

                      transition:
                        "background-color 200ms ease, color 200ms ease",

                      "&:hover": {
                        bgcolor: "#FEF2F2",
                      },

                      "&.Mui-disabled": {
                        color: "rgba(220, 38, 38, 0.35)",
                      },

                      "& .MuiSvgIcon-root": {
                        fontSize: 19,
                      },
                    }}
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
          bgcolor: "#F7F8F6",
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,

            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            pb: {
              xs: 3,
              md: 4,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1320,
              mx: "auto",
            }}
          >
            {/* BREADCRUMB */}

            <Box
              sx={{
                mb: {
                  xs: 2.5,
                  md: 3,
                },
              }}
            >
              <Breadcrumb
                items={[
                  {
                    label: t("breadcrumbs.dashboard"),
                    href: "/admin/dashboard",
                  },
                  {
                    label: t("breadcrumbs.staff"),
                    href: "/admin/staff",
                  },
                  {
                    label: t("breadcrumbs.clients"),
                  },
                ]}
              />
            </Box>

            {/* TABLE */}

            <Box
              sx={{
                ...softCard,
                overflow: "hidden",
              }}
            >
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
                sx={{
                  border: 0,

                  bgcolor: "#ffffff",

                  color: INK,

                  fontSize: 14,

                  // =============================================
                  // COLUMN HEADERS
                  // =============================================

                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#F9FAFB",
                    borderBottom: `1px solid ${HAIRLINE}`,
                  },

                  "& .MuiDataGrid-columnHeader": {
                    bgcolor: "#F9FAFB",
                    borderRight: 0,

                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: INK_MUTED,
                    fontSize: 11,
                    lineHeight: 1.2,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  },

                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },

                  // =============================================
                  // ROWS
                  // =============================================

                  "& .MuiDataGrid-row": {
                    minHeight: "58px !important",
                    maxHeight: "58px !important",

                    borderBottom: `1px solid ${HAIRLINE}`,

                    transition: "background-color 200ms ease",

                    "&:last-of-type": {
                      borderBottom: 0,
                    },

                    "&:hover": {
                      bgcolor: `${BRAND_SOFT} !important`,
                    },

                    "&.Mui-selected": {
                      bgcolor: `${BRAND_SOFT} !important`,

                      "&:hover": {
                        bgcolor: `${BRAND_SOFT} !important`,
                      },
                    },
                  },

                  // =============================================
                  // CELLS
                  // =============================================

                  "& .MuiDataGrid-cell": {
                    color: INK,
                    borderBottom: "none",

                    display: "flex",
                    alignItems: "center",

                    py: 0,

                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },

                  // =============================================
                  // ACTION COLUMN
                  // =============================================

                  '& .MuiDataGrid-cell[data-field="actions"]': {
                    bgcolor: "#ffffff",

                    transition: "background-color 200ms ease",
                  },

                  '& .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field="actions"]':
                    {
                      bgcolor: "#F3F8F6",
                    },

                  // =============================================
                  // LOADING OVERLAY
                  // =============================================

                  "& .MuiDataGrid-overlay": {
                    bgcolor: "rgba(255, 255, 255, 0.88)",
                  },

                  "& .MuiCircularProgress-root": {
                    color: BRAND,
                  },

                  // =============================================
                  // SCROLLBAR
                  // =============================================

                  "& .MuiDataGrid-virtualScroller": {
                    "&::-webkit-scrollbar": {
                      width: 8,
                      height: 8,
                    },

                    "&::-webkit-scrollbar-track": {
                      bgcolor: "transparent",
                    },

                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "rgba(17, 24, 39, 0.12)",
                      borderRadius: 999,
                    },

                    "&::-webkit-scrollbar-thumb:hover": {
                      bgcolor: "rgba(17, 24, 39, 0.20)",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =================================================
          DELETE CLIENT CONFIRMATION
      ================================================= */}

      <ConfirmActionDialog
        open={deleteDialog.open}
        title={t("deleteDialog.title")}
        description={
          <>
            {t("deleteDialog.descriptionPrefix")}{" "}
            <strong>{deleteDialog.clientName}</strong>?
            <div style={{ marginTop: 12 }}>
              {t("deleteDialog.warning")}
            </div>
          </>
        }
        confirmText={t("deleteDialog.confirm")}
        cancelText={t("deleteDialog.cancel")}
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteDialog}
      />
    </>
  );
}

export default StaffClientsContent;
