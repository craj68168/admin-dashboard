"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import Breadcrumb from "@/components/Breadcrumb";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useStageHook } from "./hook";
import type { StageFilterValues, StageRecord } from "./type";

import SearchFilter from "@/components/common/SearchFilter";
import type { FilterField } from "@/components/common/SearchFilter/types";

import Pagination from "@/components/common/Pagination";
import PaginationRowsLabel from "@/components/common/PaginationRowsLabel";

import { useTranslations } from "next-intl";

import { useAuthStore } from "@/store/auth-store";

// =================================================
// THEME
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_GLOW = "rgba(16, 122, 100, 0.16)";
const BRAND_RING = "rgba(16, 122, 100, 0.55)";

const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG = "rgba(17, 24, 39, 0.14)";

const INK = "#111827";
const INK_MUTED = "#4B5563";
const HEADER_INK = "#374151";

const DANGER = "#DC2626";
const DANGER_SOFT = "#FEF2F2";

const SURFACE_TINT = "#FAFAF9";

const BUTTON_HEIGHT = 32;
const ROW_ICON_SIZE = 34;

// =================================================
// STYLES
// =================================================

const softCard = {
  borderRadius: 3.5,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.04), 0 20px 48px -24px rgba(17,24,39,0.35)",
};

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND_RING}`,
    outlineOffset: 2,
  },
};

const pillButtonSx = {
  minHeight: BUTTON_HEIGHT,
  borderRadius: 2.5,
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,

  "& .MuiButton-startIcon": {
    marginRight: 0.5,
  },

  "& .MuiButton-startIcon > *:nth-of-type(1)": {
    fontSize: "16px !important",
  },

  transition:
    "background-color 150ms ease, box-shadow 150ms ease, transform 100ms ease",

  "&:active": {
    transform: "scale(0.98)",
  },

  ...focusRing,
};

const rowIconButtonSx = {
  width: ROW_ICON_SIZE,
  height: ROW_ICON_SIZE,
  borderRadius: 2,
  color: INK_MUTED,

  "& .MuiSvgIcon-root": {
    fontSize: 19,
  },

  ...focusRing,
};

const statusPillSx = (isActive: boolean) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.625,
  height: 24,
  px: 1.1,
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "0.01em",

  border: "1px solid",

  borderColor: isActive
    ? "rgba(16, 122, 100, 0.22)"
    : "rgba(220, 38, 38, 0.20)",

  color: isActive ? BRAND_DARK : DANGER,

  bgcolor: isActive ? BRAND_SOFT : DANGER_SOFT,
});

const statusDotSx = (isActive: boolean) => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  bgcolor: isActive ? BRAND : DANGER,
  flexShrink: 0,
});

// =================================================
// HELPERS
// =================================================

const formatAmount = (amount: number) => {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return "-";
  }

  return value.toLocaleString();
};

// =================================================
// PAGE
// =================================================

export default function StagePage() {
  const t = useTranslations("stageList");

  const user = useAuthStore((state) => state.user);

  const isSuperAdmin = user?.role === "superadmin";
  const {
    stages,
    stageData,

    stageFilters,
    handleStageSearch,
    handleStageFilterReset,

    pagination,
    onPageChange,

    isLoading,
    isError,
    refetch,

    handleAddStage,
    handleViewStage,
    handleEditStage,

    stageToDelete,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    isDeleting,
  } = useStageHook();

  // =================================================
  // FILTER FIELDS
  // =================================================

  const stageFilterFields: FilterField<StageFilterValues>[] = [];

  // =================================================
  // COLUMNS
  // =================================================

  const baseColumn = {
    resizable: false,
    disableColumnMenu: true,
  } as const;

  const columns: GridColDef<StageRecord>[] = [
    {
      ...baseColumn,

      field: "stageId",
      headerName: t("columns.stageId"),

      flex: 0.8,
      minWidth: 150,

      renderCell: (params) => (
        <Typography
          noWrap
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: INK,
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      ...baseColumn,

      field: "name",
      headerName: t("columns.name"),

      flex: 1.5,
      minWidth: 220,

      renderCell: (params) => (
        <Typography
          noWrap
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: INK,
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      ...baseColumn,

      field: "amount",
      headerName: t("columns.amount"),

      flex: 0.8,
      minWidth: 150,

      align: "left",
      headerAlign: "left",

      renderCell: (params) => (
        <Typography
          noWrap
          sx={{
            width: "100%",
            textAlign: "left",
            fontSize: 14,
            fontWeight: 600,
            color: INK,
          }}
        >
          {formatAmount(Number(params.value))}
        </Typography>
      ),
    },

    {
      ...baseColumn,

      field: "isActive",
      headerName: t("columns.status"),

      flex: 0.7,
      minWidth: 130,

      sortable: false,

      renderCell: (params) => {
        const isActive = Boolean(params.value);

        return (
          <Box component="span" sx={statusPillSx(isActive)}>
            <Box component="span" sx={statusDotSx(isActive)} />

            {isActive ? t("status.active") : t("status.inactive")}
          </Box>
        );
      },
    },

    {
      ...baseColumn,

      field: "actions",
      headerName: t("columns.actions"),

      width: 150,

      sortable: false,
      filterable: false,

      align: "right",
      headerAlign: "right",

      renderCell: (params) => {
        const stage = params.row;

        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 0.25,
            }}
          >
            <Tooltip title={t("actions.view")}>
              <IconButton
                aria-label={t("aria.view", {
                  name: stage.name,
                })}
                onClick={() => handleViewStage(stage.stageId)}
                sx={{
                  ...rowIconButtonSx,
                  color: BRAND,

                  "&:hover": {
                    bgcolor: BRAND_SOFT,
                  },
                }}
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>

            {isSuperAdmin && (
              <>
                <Tooltip title={t("actions.edit")}>
                  <IconButton
                    aria-label={t("aria.edit", {
                      name: stage.name,
                    })}
                    onClick={() => handleEditStage(stage.stageId)}
                    sx={{
                      ...rowIconButtonSx,

                      "&:hover": {
                        bgcolor: BRAND_SOFT,
                        color: BRAND,
                      },
                    }}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t("actions.delete")}>
                  <IconButton
                    aria-label={t("aria.delete", {
                      name: stage.name,
                    })}
                    onClick={() => handleOpenDeleteDialog(stage)}
                    sx={{
                      ...rowIconButtonSx,
                      color: DANGER,

                      "&:hover": {
                        bgcolor: DANGER_SOFT,
                      },
                    }}
                  >
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  // =================================================
  // ERROR
  // =================================================

  const showError = isError && !isLoading && stages.length === 0;

  // =================================================
  // RENDER
  // =================================================

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",

        "@supports (height: 100dvh)": {
          height: "100dvh",
        },

        overflow: "hidden",
        bgcolor: "#F7F8F6",
      }}
    >
      <Box
        component="main"
        sx={{
          height: "100%",
          flex: 1,
          minWidth: 0,
          overflowY: "auto",

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          py: {
            xs: 2.5,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 1320,
            mx: "auto",
          }}
        >
          {/* BREADCRUMB */}

          <Box
            sx={{
              mb: {
                xs: 1.5,
                md: 2,
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
                  label: t("breadcrumbs.stages"),
                  href: "/admin/stages",
                  current: true,
                },
              ]}
            />
          </Box>

          {/* HEADER */}

          <Box
            sx={{
              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "stretch",
                sm: "flex-end",
              },

              justifyContent: "space-between",

              gap: 2,

              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: 24,
                    md: 30,
                  },

                  fontWeight: 600,
                  letterSpacing: -0.4,
                  lineHeight: 1.2,
                  color: INK,
                }}
              >
                {t("title")}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: 14,
                  color: INK_MUTED,
                  maxWidth: 620,
                }}
              >
                {t("description")}
              </Typography>
            </Box>

            {isSuperAdmin && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<AddRoundedIcon />}
                onClick={handleAddStage}
                sx={{
                  ...pillButtonSx,

                  flexShrink: 0,

                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  px: 2,

                  color: "#ffffff",

                  background: `linear-gradient(
                  135deg,
                  ${BRAND},
                  ${BRAND_DARK}
                )`,

                  boxShadow: `0 6px 16px -6px ${BRAND_GLOW}`,

                  "&:hover": {
                    background: `linear-gradient(
                    135deg,
                    ${BRAND_DARK},
                    ${BRAND_DARK}
                  )`,

                    boxShadow: "0 8px 20px -6px rgba(16, 122, 100, 0.45)",
                  },
                }}
              >
                {t("actions.addStage")}
              </Button>
            )}
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
            <SearchFilter<StageFilterValues>
              key={JSON.stringify(stageFilters)}
              searchField={{
                name: "keyword",
                label: t("filters.search.label"),
                placeholder: t("filters.search.placeholder"),
              }}
              fields={stageFilterFields}
              initialValues={stageFilters}
              onSearch={handleStageSearch}
              onReset={handleStageFilterReset}
              searchButtonText={t("filters.searchButton")}
              resetButtonText={t("filters.clearButton")}
              isLoading={isLoading}
            />
          </Box>

          {/* TABLE CARD */}

          <Paper
            elevation={0}
            sx={{
              ...softCard,
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

                bgcolor: SURFACE_TINT,
              }}
            >
              <PaginationRowsLabel
                count={pagination.total}
                from={pagination.from}
                to={pagination.to}
                itemLabel={t("pagination.itemLabel")}
              />

              <Pagination
                page={pagination.current_page}
                total={pagination.total}
                pageSize={pagination.per_page}
                disabled={isLoading}
                onPageChange={onPageChange}
              />
            </Box>

            {/* ERROR */}

            {showError ? (
              <Box
                role="alert"
                sx={{
                  minHeight: 280,

                  display: "flex",
                  flexDirection: "column",

                  alignItems: "center",
                  justifyContent: "center",

                  textAlign: "center",

                  px: 3,
                  py: 6,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: INK,
                  }}
                >
                  {t("error.title")}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,

                    fontSize: 14,
                    color: INK_MUTED,
                  }}
                >
                  {t("error.description")}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => void refetch()}
                  sx={{
                    ...pillButtonSx,

                    mt: 2,
                    px: 2,

                    color: INK,
                    borderColor: HAIRLINE_STRONG,

                    "&:hover": {
                      borderColor: BRAND,
                      bgcolor: BRAND_SOFT,
                      color: BRAND_DARK,
                    },
                  }}
                >
                  {t("error.retry")}
                </Button>
              </Box>
            ) : (
              <DataGrid<StageRecord>
                rows={stageData}
                columns={columns}
                getRowId={(row) => row.stageId}
                loading={isLoading}
                disableColumnMenu
                disableRowSelectionOnClick
                hideFooter
                slots={{
                  noRowsOverlay: NoDataOverlay,
                }}
                autoHeight
                rowHeight={58}
                columnHeaderHeight={44}
                sx={{
                  border: "none",

                  "--DataGrid-containerBackground": SURFACE_TINT,

                  "--DataGrid-rowBorderColor": HAIRLINE,

                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: SURFACE_TINT,

                    borderBottom: `1px solid ${HAIRLINE}`,
                  },

                  "& .MuiDataGrid-columnHeader": {
                    bgcolor: "#6ec5c2",

                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: HEADER_INK,
                  },

                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },

                  "& .MuiDataGrid-cell": {
                    display: "flex",
                    alignItems: "center",

                    borderBottomColor: HAIRLINE,

                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },

                  "& .MuiDataGrid-cell[data-field='stageId']": {
                    pl: 2.5,
                  },

                  "& .MuiDataGrid-columnHeader[data-field='stageId']": {
                    pl: 2.5,
                  },

                  "& .MuiDataGrid-cell[data-field='actions']": {
                    pr: 2,
                  },

                  "& .MuiDataGrid-columnHeader[data-field='actions']": {
                    pr: 2,
                  },

                  "& .MuiDataGrid-row": {
                    transition: "background-color 200ms ease",

                    "&:hover": {
                      bgcolor: BRAND_SOFT,
                    },
                  },

                  "& .MuiDataGrid-footerContainer": {
                    borderTop: `1px solid ${HAIRLINE}`,

                    bgcolor: SURFACE_TINT,
                  },
                }}
              />
            )}

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

                bgcolor: SURFACE_TINT,
              }}
            >
              <PaginationRowsLabel
                count={pagination.total}
                from={pagination.from}
                to={pagination.to}
                itemLabel={t("pagination.itemLabel")}
              />

              <Pagination
                page={pagination.current_page}
                total={pagination.total}
                pageSize={pagination.per_page}
                disabled={isLoading}
                onPageChange={onPageChange}
              />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* DELETE CONFIRMATION */}

      <ConfirmActionDialog
        open={Boolean(stageToDelete)}
        title={t("deleteDialog.title")}
        description={
          <>
            {t("deleteDialog.descriptionPrefix")}{" "}
            <strong>{stageToDelete?.name}</strong>?
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
        onClose={handleCloseDeleteDialog}
      />
    </Box>
  );
}
