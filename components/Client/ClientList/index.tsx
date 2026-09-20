"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TableViewOutlinedIcon from "@mui/icons-material/TableViewOutlined";
import Breadcrumb from "@/components/Breadcrumb";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import Pagination from "@/components/common/Pagination";
import PaginationRowsLabel from "@/components/common/PaginationRowsLabel";
import SearchFilter from "@/components/common/SearchFilter";
import type { FilterField } from "@/components/common/SearchFilter/types";
import {
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  JAPANESE_LEVELS,
  NATIONALITIES,
} from "@/components/constant";
import { useClientHook } from "./hook";
import type { ClientFilterValues, ClientListItem } from "./type";
// =================================================
// DESIGN
// =================================================
const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const DANGER = "#DC2626";
const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};
// =================================================
// DELETE DIALOG
// =================================================
type DeleteDialogState = {
  open: boolean;
  clientId: string;
  clientName: string;
};
// =================================================
// CLIENT LIST
// =================================================
const ClientListPage = () => {
  const router = useRouter();
  const t = useTranslations("clientList");
  const createT = useTranslations("createClient");
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
    stageOptions,
    downloadClients,
    exportingFormat,
  } = useClientHook();
  // =================================================
  // DISPLAY HELPERS
  // =================================================
  const getCurrentVisaStatusLabel = (value: string) => {
    const option = CURRENT_VISA_STATUS_OPTIONS.find(
      (item) => item.value === value,
    );
    if (!option) {
      return value || "-";
    }
    return createT(`options.currentVisaStatus.${option.key}` as never);
  };
  const getPreferCategoryLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = PREFER_CATEGORY_OPTIONS.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return createT(`options.preferCategory.${option.key}` as never);
  };
  // =================================================
  // FILTER FIELDS
  // =================================================
  const clientFilterFields: FilterField<ClientFilterValues>[] = [
    {
      type: "select",
      name: "currentVisaStatus",
      label: "Current Visa Status",
      placeholder: "All visa statuses",
      options: CURRENT_VISA_STATUS_OPTIONS.map((option) => ({
        label: createT(`options.currentVisaStatus.${option.key}` as never),
        value: option.value,
      })),
    },
    {
      type: "select",
      name: "preferCategory",
      label: "Preferred Category",
      placeholder: "All categories",
      options: PREFER_CATEGORY_OPTIONS.map((option) => ({
        label: createT(`options.preferCategory.${option.key}` as never),
        value: option.value,
      })),
    },
    {
      type: "select",
      name: "currentStage",
      label: "Current Stage",
      placeholder: "All stages",
      options: stageOptions,
    },
    {
      type: "select",
      name: "japaneseLevel",
      label: "Japanese Level",
      placeholder: "All Japanese levels",
      options: JAPANESE_LEVELS.map((option) => ({
        label: createT(`options.japaneseLanguageLevel.${option.key}` as never),
        value: option.value,
      })),
    },
    {
      type: "select",
      name: "nationality",
      label: "Nationality",
      placeholder: "All nationalities",
      options: NATIONALITIES.map((option) => ({
        label: createT(`options.nationality.${option.key}` as never),
        value: option.value,
      })),
    },
    ...(role === "superadmin"
      ? [
          {
            type: "select" as const,
            name: "assignedStaff" as const,
            label: "Assigned Staff",
            placeholder: "All staff",
            options: staffOptions,
          },
        ]
      : []),
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
  const columns: GridColDef<ClientListItem>[] = [
    {
      field: "clientId",
      headerName: t("columns.id"),
      flex: 0.75,
      minWidth: 140,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "fullName",
      headerName: t("columns.fullName"),
      flex: 1.25,
      minWidth: 190,
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
      field: "currentVisaStatus",
      headerName: "Current Visa Status",
      flex: 1.15,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) =>
        getCurrentVisaStatusLabel(row.currentVisaStatus),
    },
    {
      field: "preferCategory",
      headerName: "Category",
      flex: 1.05,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) => getPreferCategoryLabel(row.preferCategory),
    },
    {
      field: "currentStage",
      headerName: t("columns.progress"),
      flex: 1.25,
      minWidth: 220,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) =>
        row.currentStageDetails?.name ||
        row.clientStatus ||
        row.currentStage ||
        "-",
    },
    {
      field: "assignedStaff",
      headerName: t("columns.assignedTo"),
      flex: 1.05,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) =>
        row.assignedStaffDetails?.name || row.assignedStaff || "-",
    },
    {
      field: "actions",
      headerName: t("columns.action"),
      width: role === "superadmin" ? 150 : 110,
      resizable: false,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            height: "100%",
          }}
        >
          <Tooltip title={t("actions.view")}>
            <IconButton
              aria-label={t("actions.view")}
              onClick={() =>
                router.push(`/admin/client/${encodeURIComponent(row.clientId)}`)
              }
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                color: BRAND,
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
          <Tooltip title={t("actions.edit")}>
            <IconButton
              aria-label={t("actions.edit")}
              onClick={() =>
                router.push(
                  `/admin/client/${encodeURIComponent(row.clientId)}/edit`,
                )
              }
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                color: INK_MUTED,
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
                      clientName: row.fullName || "this client",
                    })
                  }
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    color: DANGER,
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
      ),
    },
  ];
  // =================================================
  // EXPORT BUTTON STYLE
  // =================================================
  const exportButtonSx = {
    minHeight: 38,
    px: 1.5,
    borderRadius: 2,
    textTransform: "none",
    fontSize: 13,
    fontWeight: 700,
  } as const;
  // =================================================
  // UI
  // =================================================
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
            maxWidth: 1450,
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
                  label: t("breadcrumbs.clients"),
                  current: true,
                },
              ]}
            />
          </Box>
          {/* ADD CLIENT */}
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
                "&:hover": {
                  bgcolor: BRAND_HOVER,
                  boxShadow: "none",
                },
              }}
            >
              {t("addClient")}
            </Button>
          </Box>
          {/* FILTERS */}
          <Box
            sx={{
              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <SearchFilter<ClientFilterValues>
              key={JSON.stringify(clientFilters)}
              searchField={{
                name: "keyword",
                label: "What are you looking for?",
                placeholder: "Client ID, name, phone, email...",
              }}
              fields={clientFilterFields}
              initialValues={clientFilters}
              onSearch={handleClientSearch}
              onReset={handleClientFilterReset}
              searchButtonText="Search clients"
              resetButtonText="Clear"
              isLoading={isClientLoading}
              rightAction={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {/* CSV */}
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<DescriptionOutlinedIcon />}
                    disabled={exportingFormat !== null}
                    onClick={() => downloadClients("csv")}
                    sx={{
                      ...exportButtonSx,
                      borderColor: BRAND,
                      color: BRAND,
                      "&:hover": {
                        borderColor: BRAND_HOVER,
                        bgcolor: BRAND_SOFT,
                      },
                    }}
                  >
                    {exportingFormat === "csv" ? "Downloading..." : "CSV"}
                  </Button>
                  {/* PDF */}
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<PictureAsPdfOutlinedIcon />}
                    disabled={exportingFormat !== null}
                    onClick={() => downloadClients("pdf")}
                    sx={{
                      ...exportButtonSx,
                      borderColor: DANGER,
                      color: DANGER,
                      "&:hover": {
                        borderColor: "#B91C1C",
                        bgcolor: "#FEF2F2",
                      },
                    }}
                  >
                    {exportingFormat === "pdf" ? "Downloading..." : "PDF"}
                  </Button>
                  {/* EXCEL */}
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<TableViewOutlinedIcon />}
                    disabled={exportingFormat !== null}
                    onClick={() => downloadClients("xlsx")}
                    sx={{
                      ...exportButtonSx,
                      borderColor: BRAND,
                      color: BRAND,
                      "&:hover": {
                        borderColor: BRAND_HOVER,
                        bgcolor: BRAND_SOFT,
                      },
                    }}
                  >
                    {exportingFormat === "xlsx" ? "Downloading..." : "Excel"}
                  </Button>
                </Box>
              }
            />
          </Box>
          {/* TABLE */}
          <Box
            sx={{
              ...softCard,
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* TOP PAGINATION */}
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
                px: {
                  xs: 2,
                  sm: 2.5,
                },
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
            {/* DATA GRID */}
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
                '& .MuiDataGrid-cell[data-field="fullName"]': {
                  fontWeight: 600,
                },
                '& .MuiDataGrid-cell[data-field="clientId"], & .MuiDataGrid-cell[data-field="phone"], & .MuiDataGrid-cell[data-field="currentVisaStatus"]':
                  {
                    color: INK_MUTED,
                  },
                '& .MuiDataGrid-cell[data-field="currentStage"]': {
                  color: BRAND,
                  fontWeight: 600,
                },
                '& .MuiDataGrid-cell[data-field="actions"]': {
                  bgcolor: "#ffffff",
                },
                '& .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field="actions"]':
                  {
                    bgcolor: "#F3F8F6",
                  },
                "& .MuiDataGrid-overlay": {
                  bgcolor: "rgba(255, 255, 255, 0.88)",
                },
                "& .MuiCircularProgress-root": {
                  color: BRAND,
                },
              }}
            />
            {/* BOTTOM PAGINATION */}
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
                px: {
                  xs: 2,
                  sm: 2.5,
                },
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
      {/* DELETE CONFIRMATION */}
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
