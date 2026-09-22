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

// =================================================
// THEME
// Same tokens as SearchFilter / ClientListPage so every
// admin screen reads as one consistent system.
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

const DANGER = "#DC2626";
const DANGER_SOFT = "#FEF2F2";

const SURFACE_TINT = "#FAFAF9";

// Buttons stay a touch smaller than the fields/rows — lighter, less heavy.
const BUTTON_HEIGHT = 32;
// Row-action icon buttons — same footprint used in the client list table.
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

// Shared base for every pill-shaped button so height/radius/typography
// never drift apart from SearchFilter's search/reset buttons.
const pillButtonSx = {
  minHeight: BUTTON_HEIGHT,
  borderRadius: 2.5,
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,
  "& .MuiButton-startIcon": { marginRight: 0.5 },
  "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: "16px !important" },
  transition:
    "background-color 150ms ease, box-shadow 150ms ease, transform 100ms ease",
  "&:active": { transform: "scale(0.98)" },
  ...focusRing,
};

// Row-action icon buttons (edit / delete) — same size and hover treatment
// as the view/edit/delete icons in the client list table.
const rowIconButtonSx = {
  width: ROW_ICON_SIZE,
  height: ROW_ICON_SIZE,
  borderRadius: 2,
  color: INK_MUTED,
  "& .MuiSvgIcon-root": { fontSize: 19 },
  ...focusRing,
};

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
  const {
    stages,
    stageData,

    // search / filters
    stageFilters,
    handleStageSearch,
    handleStageFilterReset,

    // pagination
    pagination,
    onPageChange,

    isLoading,
    isError,
    refetch,

    handleAddStage,
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

  const stageFilterFields: FilterField<StageFilterValues>[] = [
  ];

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
      headerName: "Stage ID",

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
      headerName: "Name",

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
      headerName: "Amount",

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

      field: "actions",
      headerName: "Actions",

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
            {/* EDIT */}

            <Tooltip title="Edit stage">
              <IconButton
                aria-label={`Edit ${stage.name}`}
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

            {/* DELETE */}

            <Tooltip title="Delete stage">
              <IconButton
                aria-label={`Delete ${stage.name}`}
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
          {/* ========================================
              BREADCRUMB
          ======================================== */}

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
                  label: "Dashboard",
                  href: "/admin/dashboard",
                },
                {
                  label: "Stages",
                  href: "/admin/stages",
                  current: true,
                },
              ]}
            />
          </Box>

          {/* ========================================
              HEADER
          ======================================== */}

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
                Stages
              </Typography>

              <Typography
                sx={{
                  mt: 1,

                  fontSize: 14,
                  color: INK_MUTED,

                  maxWidth: 620,
                }}
              >
                Manage client processing stages and the amount assigned to each
                stage.
              </Typography>
            </Box>

            {/* ADD STAGE */}

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
                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                boxShadow: `0 6px 16px -6px ${BRAND_GLOW}`,

                "&:hover": {
                  background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND_DARK})`,
                  boxShadow: "0 8px 20px -6px rgba(16, 122, 100, 0.45)",
                },
              }}
            >
              Add Stage
            </Button>
          </Box>

          {/* ========================================
    FILTERS
======================================== */}

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
                label: "What are you looking for?",
                placeholder: "Stage ID, stage name, stage key...",
              }}
              fields={stageFilterFields}
              initialValues={stageFilters}
              onSearch={handleStageSearch}
              onReset={handleStageFilterReset}
              searchButtonText="Search stages"
              resetButtonText="Clear"
              isLoading={isLoading}
            />
          </Box>

          {/* ========================================
              TABLE CARD
          ======================================== */}

          <Paper
            elevation={0}
            sx={{
              ...softCard,
              overflow: "hidden",
            }}
          >
            {/* TABLE HEADER */}

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
                itemLabel="stages"
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
                  Unable to load stages
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,

                    fontSize: 14,
                    color: INK_MUTED,
                  }}
                >
                  Something went wrong while loading the stage list.
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
                  Try Again
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

                  // HEADER

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
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: INK_MUTED,
                  },

                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },

                  // CELLS

                  "& .MuiDataGrid-cell": {
                    display: "flex",

                    alignItems: "center",

                    borderBottomColor: HAIRLINE,

                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },

                  // FIRST COLUMN

                  "& .MuiDataGrid-cell[data-field='stageId']": {
                    pl: 2.5,
                  },

                  "& .MuiDataGrid-columnHeader[data-field='stageId']": {
                    pl: 2.5,
                  },

                  // ACTION COLUMN

                  "& .MuiDataGrid-cell[data-field='actions']": {
                    pr: 2,
                  },

                  "& .MuiDataGrid-columnHeader[data-field='actions']": {
                    pr: 2,
                  },

                  // ROW

                  "& .MuiDataGrid-row": {
                    transition: "background-color 200ms ease",

                    "&:hover": {
                      bgcolor: BRAND_SOFT,
                    },
                  },

                  // FOOTER

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
                itemLabel="stages"
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

      {/* ============================================
          DELETE CONFIRMATION
      ============================================ */}

      <ConfirmActionDialog
        open={Boolean(stageToDelete)}
        title="Delete Stage"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{stageToDelete?.name}</strong>?
            <div
              style={{
                marginTop: 12,
              }}
            >
              This action cannot be undone.
            </div>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteDialog}
      />
    </Box>
  );
}
