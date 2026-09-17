"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import Breadcrumb from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/auth-store";
import { formatCreatedAt } from "@/utils/format-date";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useStaffHook } from "./hook";

// =================================================
// THEME TOKENS (matches Staff/Admin dashboards + Sidebar)
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  borderRadius: 3,

  border: "1px solid",

  borderColor: HAIRLINE,

  bgcolor: "#ffffff",

  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

export default function StaffPage() {
  const router = useRouter();
  const t = useTranslations("staffList");
  const role = useAuthStore((state) => state.user?.role);

  const { isLoading, staffData, updateStaffStatus, isUpdatingStatus } =
    useStaffHook();

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

  const columns: GridColDef[] = [
    {
      field: "staffId",
      headerName: t("columns.id"),
      flex: 0.7,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: INK }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "name",
      headerName: t("columns.fullName"),
      flex: 1.2,
      minWidth: 170,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ fontSize: 14, color: INK }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: t("columns.email"),
      flex: 1.1,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: t("columns.location"),
      flex: 0.8,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
            {params.value || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: t("columns.createdAt"),
      flex: 1,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) => formatCreatedAt(row.createdAt),
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: t("columns.action"),
      resizable: false,
      width: role === "superadmin" ? 230 : 100,
      disableColumnMenu: true,
      sortable: false,

      renderCell: (params) => {
        const isActive = params.row.isActive;

        const actionIconSx = {
          color: INK_MUTED,

          transition: "all 200ms ease",

          "&:hover": {
            bgcolor: BRAND_SOFT,
            color: BRAND,
          },
        };

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            {/* VIEW STAFF CLIENTS */}
            <Tooltip title={t("actions.viewClients")}>
              <IconButton
                aria-label={t("actions.viewClients")}
                size="small"
                sx={actionIconSx}
                onClick={() =>
                  router.push(`/admin/staff/${params.row.staffId}/clients`)
                }
              >
                <PersonSearchIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* VIEW STAFF DETAILS */}
            <Tooltip title={t("actions.viewDetails")}>
              <IconButton
                aria-label={t("actions.viewDetails")}
                size="small"
                sx={actionIconSx}
                onClick={() =>
                  router.push(`/admin/staff/${params.row.staffId}`)
                }
              >
                <RemoveRedEyeIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {role === "superadmin" && (
              <>
                {/* EDIT STAFF */}
                <Tooltip title={t("actions.edit")}>
                  <IconButton
                    aria-label={t("actions.edit")}
                    size="small"
                    sx={actionIconSx}
                    onClick={() =>
                      router.push(`/admin/staff/${params.row.staffId}/edit`)
                    }
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* ACTIVATE / DISABLE */}
                <Tooltip
                  title={
                    isActive
                      ? t("actions.disable")
                      : t("actions.activate")
                  }
                >
                  <span>
                    <IconButton
                      aria-label={
                        isActive
                          ? t("actions.disable")
                          : t("actions.activate")
                      }
                      size="small"
                      disabled={isUpdatingStatus}
                      sx={{
                        color: isActive ? INK_MUTED : BRAND,

                        transition: "all 200ms ease",

                        "&:hover": {
                          bgcolor: isActive
                            ? "#FEF2F2"
                            : BRAND_SOFT,

                          color: isActive ? "#DC2626" : BRAND,
                        },
                      }}
                      onClick={() =>
                        setStatusDialog({
                          open: true,
                          staffId: params.row.staffId,
                          name: params.row.name ?? t("thisStaffMember"),
                          isActive,
                        })
                      }
                    >
                      {isActive ? (
                        <PersonOffOutlinedIcon fontSize="small" />
                      ) : (
                        <PersonAddOutlinedIcon fontSize="small" />
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

  return (
    <Box
      sx={{
        display: "flex",

        height: "100vh",

        overflow: "hidden",

        bgcolor: "#F7F8F6",
      }}
    >
      <Box
        component="main"
        sx={{
          height: "100vh",

          flex: 1,

          overflowY: "auto",

          px: { xs: 2, sm: 3, md: 4 },

          py: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: 1320, mx: "auto" }}>
          {/* BREADCRUMB */}

          <Box sx={{ mb: 2 }}>
            <Breadcrumb
              items={[
                { label: t("breadcrumbs.dashboard"), href: "/admin/dashboard" },
                { label: t("breadcrumbs.staff"), href: "/staff", current: true },
              ]}
            />
          </Box>

          {/* HEADER */}

          <Box
            sx={{
              display: "flex",

              flexWrap: "wrap",

              alignItems: "flex-end",

              justifyContent: "space-between",

              gap: 2.5,

              mb: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 24, md: 30 },
                  fontWeight: 600,
                  letterSpacing: -0.4,
                  color: INK,
                }}
              >
                {t("title")}
              </Typography>

              <Typography sx={{ mt: 1, fontSize: 14, color: INK_MUTED }}>
                {t("description")}
              </Typography>
            </Box>

            {role === "superadmin" && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<PersonAddAlt1OutlinedIcon />}
                onClick={() => router.push("/admin/staff/add")}
                sx={{
                  bgcolor: BRAND,

                  borderRadius: 2.5,

                  textTransform: "none",

                  fontWeight: 600,

                  px: 2.5,

                  py: 1,

                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: "#0C5F4F",

                    boxShadow: "none",
                  },
                }}
              >
                {t("addStaff")}
              </Button>
            )}
          </Box>

          {/* TABLE */}

          <Paper elevation={0} sx={{ ...softCard, overflow: "hidden" }}>
            <DataGrid
              rows={staffData?.data || []}
              getRowId={(row) => row.staffId}
              columns={columns}
              disableColumnMenu
              pageSizeOptions={[5, 10]}
              slots={{ noRowsOverlay: NoDataOverlay }}
              loading={isLoading}
              hideFooter
              autoHeight
              rowHeight={64}
              columnHeaderHeight={48}
              sx={{
                border: "none",

                "--DataGrid-containerBackground": "#FAFAF9",

                "--DataGrid-rowBorderColor": HAIRLINE,

                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "#FAFAF9",

                  borderBottom: `1px solid ${HAIRLINE}`,
                },

                "& .MuiDataGrid-columnHeader": {
                  bgcolor: "#FAFAF9",

                  "&:focus, &:focus-within": {
                    outline: "none",
                  },
                },

                "& .MuiDataGrid-columnHeader--sorted": {
                  bgcolor: "#FAFAF9",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontSize: 11,

                  fontWeight: 600,

                  letterSpacing: 0.6,

                  textTransform: "uppercase",

                  color: INK_MUTED,
                },

                "& .MuiDataGrid-cell": {
                  borderBottomColor: "rgba(17, 24, 39, 0.05)",

                  "&:focus, &:focus-within": {
                    outline: "none",
                  },
                },

                "& .MuiDataGrid-row": {
                  transition: "background-color 200ms ease",

                  "&:hover": {
                    bgcolor: "rgba(16, 122, 100, 0.04)",
                  },
                },

                "& .MuiDataGrid-row:last-of-type .MuiDataGrid-cell": {
                  borderBottom: 0,
                },

                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },
              }}
            />
          </Paper>
        </Box>
      </Box>

      <ConfirmActionDialog
        open={statusDialog.open}
        title={
          statusDialog.isActive
            ? t("confirmStatus.disableTitle")
            : t("confirmStatus.activateTitle")
        }
        description={
          <>
            {t("confirmStatus.descriptionPrefix")}{" "}
            <strong>
              {statusDialog.isActive
                ? t("confirmStatus.disableVerb")
                : t("confirmStatus.activateVerb")}
            </strong>{" "}
            <strong>{statusDialog.name}</strong>?
            {statusDialog.isActive && (
              <div style={{ marginTop: 12 }}>
                {t("confirmStatus.disableWarning")}
              </div>
            )}
          </>
        }
        confirmText={
          statusDialog.isActive
            ? t("confirmStatus.disableConfirm")
            : t("confirmStatus.activateConfirm")
        }
        cancelText={t("confirmStatus.cancel")}
        confirmColor={statusDialog.isActive ? "error" : "success"}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
        onClose={closeStatusDialog}
      />
    </Box>
  );
}
