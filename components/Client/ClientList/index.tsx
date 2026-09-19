"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import SearchFilter from "@/components/common/SearchFilter";
import type { FilterField } from "@/components/common/SearchFilter/types";
import type { ClientFilterValues } from "./type";
import { useClientHook } from "./hook";
import { useRouter } from "next/navigation";
import Pagination from "@/components/common/Pagination";
import PaginationRowsLabel from "@/components/common/PaginationRowsLabel";

// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
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

type DeleteDialogState = {
  open: boolean;
  clientId: string;
  clientName: string;
};

const ClientListPage = () => {
  const router = useRouter();
  const t = useTranslations("clientList");
  const {
    role,
    clientData,
    clientFilters,
    isClientLoading,
    deleteClient,
    isDeleting,
    handleCreateClient,
    handleClientSearch,
    handleClientFilterReset,
    pagination,
    onPageChange,
    staffOptions,
  } = useClientHook();

  // =================================================
  // CLIENT SEARCH / FILTER FIELDS
  // =================================================

  const clientFilterFields: FilterField<ClientFilterValues>[] = [
    {
      type: "select",
      name: "visaType",
      label: "Visa Type",
      placeholder: "All visa types",
      options: [
        {
          label: "Student",
          value: "Student",
        },
        {
          label: "Working",
          value: "Working",
        },
        {
          label: "Dependent",
          value: "Dependent",
        },
      ],
    },

    {
      type: "select",
      name: "coeStatus",
      label: "COE Status",
      placeholder: "All COE statuses",
      options: [
        {
          label: "Not Applied",
          value: "Not Applied",
        },
        {
          label: "Applied",
          value: "Applied",
        },
        {
          label: "Processing",
          value: "Processing",
        },
        {
          label: "Received",
          value: "Received",
        },
        {
          label: "Rejected",
          value: "Rejected",
        },
      ],
    },

    {
      type: "select",
      name: "clientStatus",
      label: "Client Status",
      placeholder: "All client statuses",
      options: [
        {
          label: "New",
          value: "New",
        },
        {
          label: "Document Collection",
          value: "Document Collection",
        },
        {
          label: "Processing",
          value: "Processing",
        },
        {
          label: "COE Applied",
          value: "COE Applied",
        },
        {
          label: "COE Received",
          value: "COE Received",
        },
        {
          label: "Visa Applied",
          value: "Visa Applied",
        },
        {
          label: "Visa Approved",
          value: "Visa Approved",
        },
        {
          label: "Visa Rejected",
          value: "Visa Rejected",
        },
        {
          label: "Departed",
          value: "Departed",
        },
        {
          label: "Arrived in Japan",
          value: "Arrived in Japan",
        },
      ],
    },

    {
      type: "select",
      name: "assignedStaff",
      label: "Assigned Staff",
      placeholder: "All staff",
      options: staffOptions,
      disabled: role !== "superadmin",
    },
  ];
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
      headerName: t("columns.id"),
      flex: 0.7,
      minWidth: 140,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "fullName",
      headerName: t("columns.fullName"),
      flex: 1.2,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "phone",
      headerName: t("columns.phone"),
      flex: 1,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "visaType",
      headerName: t("columns.visaType"),
      flex: 0.9,
      minWidth: 140,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "currentStage",
      headerName: t("columns.progress"),
      flex: 1.3,
      minWidth: 230,
      resizable: false,
      disableColumnMenu: true,

      valueGetter: (_value, row) =>
        row.currentStage ?? t("registrationPending"),
    },

    {
      field: "assignedStaff",
      headerName: t("columns.assignedTo"),
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
      headerName: t("columns.action"),
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
              gap: 0.25,
              height: "100%",
            }}
          >
            {/* VIEW */}

            <Tooltip title={t("actions.view")}>
              <IconButton
                aria-label={t("actions.view")}
                onClick={() =>
                  router.push(
                    `/admin/client/${encodeURIComponent(row.clientId)}`,
                  )
                }
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  color: BRAND,

                  transition: "background-color 200ms ease, color 200ms ease",

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

            {/* EDIT
                Admin → any client
                Staff → own client
                Backend already protects this
            */}

            <Tooltip title={t("actions.edit")}>
              <IconButton
                aria-label={t("actions.edit")}
                onClick={() =>
                  router.push(`/admin/client/edit?clientId=${row.clientId}`)
                }
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  color: INK_MUTED,

                  transition: "background-color 200ms ease, color 200ms ease",

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

            {/* DELETE
                Super Admin only
            */}

            {role === "superadmin" && (
              <Tooltip title={t("actions.delete")}>
                <span>
                  <IconButton
                    aria-label={t("actions.delete")}
                    disabled={isDeleting}
                    onClick={() =>
                      setDeleteDialog({
                        open: true,

                        clientId: row.clientId,

                        clientName: row.fullName || t("thisClient"),
                      })
                    }
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 2,
                      color: "#DC2626",

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
          minHeight: "100vh",
          bgcolor: "#F7F8F6",
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
          {/* =================================================
              BREADCRUMB
          ================================================= */}
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
                  label: t("breadcrumbs.clients"),
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

              justifyContent: {
                xs: "stretch",
                sm: "flex-end",
              },

              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={handleCreateClient}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                minHeight: 42,
                px: 2.25,
                bgcolor: BRAND,
                color: "#ffffff",
                borderRadius: 2.5,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                transition:
                  "background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
                "&:hover": {
                  bgcolor: BRAND_HOVER,
                  boxShadow: "none",
                },
                "&:focus-visible": {
                  outline: `3px solid ${BRAND_SOFT}`,
                  outlineOffset: 2,
                },
                "& .MuiButton-startIcon": {
                  "& .MuiSvgIcon-root": {
                    fontSize: 19,
                  },
                },
              }}
            >
              {t("addClient")}
            </Button>
          </Box>

          {/* =================================================
    SEARCH / FILTER
================================================= */}
          <Box
            sx={{
              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <SearchFilter<ClientFilterValues>
              searchField={{
                name: "keyword",
                label: "What are you looking for?",
                placeholder: "Client ID, name, or phone",
              }}
              fields={clientFilterFields}
              initialValues={clientFilters}
              onSearch={handleClientSearch}
              onReset={handleClientFilterReset}
              searchButtonText="Search clients"
              resetButtonText="Clear"
              isLoading={isClientLoading}
            />
          </Box>

          {/* =================================================
              CLIENT TABLE
          ================================================= */}

          <Box
            sx={{
              ...softCard,

              width: "100%",

              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                px: { xs: 2, sm: 2.5 },
                py: 1.75,
                borderBottom: `1px solid ${HAIRLINE}`,
                bgcolor: "#FAFAFA",
              }}
            >
              <PaginationRowsLabel
                count={pagination?.total ?? 0}
                from={pagination?.from ?? null}
                to={pagination?.to ?? null}
              />
              <Pagination
                page={pagination?.current_page ?? 1}
                total={pagination?.total ?? 0}
                pageSize={pagination?.per_page ?? 10}
                disabled={isClientLoading}
                onPageChange={onPageChange}
              />
            </Box>

            <DataGrid
              rows={clientData}
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

                  bgcolor: "#ffffff",

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
                  display: "flex",

                  alignItems: "center",

                  color: INK,

                  borderBottom: 0,

                  py: 0,

                  "&:focus, &:focus-within": {
                    outline: "none",
                  },
                },

                // Make name slightly stronger without changing data
                '& .MuiDataGrid-cell[data-field="fullName"]': {
                  fontWeight: 600,
                },

                // Muted secondary/supporting columns
                '& .MuiDataGrid-cell[data-field="clientId"], & .MuiDataGrid-cell[data-field="phone"], & .MuiDataGrid-cell[data-field="visaType"]':
                  {
                    color: INK_MUTED,
                  },

                // Progress gets subtle brand emphasis
                '& .MuiDataGrid-cell[data-field="currentStage"]': {
                  color: BRAND,

                  fontWeight: 600,
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
                // LOADING
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

                // =============================================
                // CHECKBOX / FOCUS / SELECTION CLEANUP
                // =============================================

                "& .MuiDataGrid-cellCheckbox": {
                  color: BRAND,
                },

                "& .MuiDataGrid-columnHeaderCheckbox": {
                  color: BRAND,
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                px: { xs: 2, sm: 2.5 },
                py: 1.75,
                borderTop: `1px solid ${HAIRLINE}`,
                bgcolor: "#FAFAFA",
              }}
            >
              <PaginationRowsLabel
                count={pagination?.total ?? 0}
                from={pagination?.from ?? null}
                to={pagination?.to ?? null}
              />
              <Pagination
                page={pagination?.current_page ?? 1}
                total={pagination?.total ?? 0}
                pageSize={pagination?.per_page ?? 10}
                disabled={isClientLoading}
                onPageChange={onPageChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      <ConfirmActionDialog
        open={deleteDialog.open}
        title={t("deleteDialog.title")}
        description={
          <>
            {t("deleteDialog.descriptionPrefix")}{" "}
            <strong>{deleteDialog.clientName}</strong>?
            <div
              style={{
                marginTop: 12,
              }}
            >
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
};

export default ClientListPage;
