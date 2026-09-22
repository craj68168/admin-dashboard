"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import Breadcrumb from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/auth-store";
import { formatCreatedAt } from "@/utils/format-date";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";
import SearchFilter from "@/components/common/SearchFilter";
import type { FilterField } from "@/components/common/SearchFilter/types";
import Pagination from "@/components/common/Pagination";
import PaginationRowsLabel from "@/components/common/PaginationRowsLabel";

import { useStaffHook } from "./hook";
import type { StaffFilterValues, StaffRecord } from "./type";

// =================================================
// THEME TOKENS (matches Staff/Admin dashboards + Sidebar)
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_RING = "rgba(16, 122, 100, 0.55)";

const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG = "rgba(17, 24, 39, 0.14)";

const INK = "#111827";
const INK_MUTED = "#4B5563";
const INK_FAINT = "#6B7280";

const DANGER = "#DC2626";
const DANGER_SOFT = "#FEF2F2";

const SURFACE_TINT = "#FAFAF9";

// Table header (DataGrid column headers)
const HEADER_BG = "#6ec5c2";
const HEADER_INK = "#374151";

/**
 * Below this width the table becomes a stacked list.
 * "lg" keeps the DataGrid from scrolling sideways next to the sidebar.
 */
const GRID_BREAKPOINT = "lg" as const;

const softCard = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND_RING}`,
    outlineOffset: 2,
  },
};

// =================================================
// TYPES + HELPERS
// =================================================

const AVATAR_TONES = [
  { bg: "#E3F2EE", fg: "#0C5F4F" },
  { bg: "#E6EEFB", fg: "#1D4ED8" },
  { bg: "#FDF1DC", fg: "#92580A" },
  { bg: "#EFE8FA", fg: "#6D3FC0" },
  { bg: "#FBE8EC", fg: "#B4234A" },
];

function toneFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

function getInitials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

// =================================================
// SMALL PIECES
// =================================================

function StaffAvatar({
  name,
  seed,
  size = 38,
}: {
  name?: string | null;
  seed: string;
  size?: number;
}) {
  const tone = toneFor(seed);
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: tone.bg,
        color: tone.fg,
        fontSize: size * 0.36,
        fontWeight: 600,
        letterSpacing: 0.2,
      }}
    >
      {getInitials(name)}
    </Box>
  );
}

function StatusPill({ active }: { active: boolean }) {
  const t = useTranslations("staffList");
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.375,
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        color: active ? BRAND_DARK : INK_MUTED,
        bgcolor: active ? BRAND_SOFT : "rgba(17, 24, 39, 0.06)",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: active ? BRAND : "#9CA3AF",
        }}
      />
      {active ? t("status.active") : t("status.inactive")}
    </Box>
  );
}

const iconActionSx = {
  color: INK_MUTED,
  transition: "background-color 200ms ease, color 200ms ease",
  "&:hover": { bgcolor: BRAND_SOFT, color: BRAND },
  ...focusRing,
};

type RowActionsProps = {
  row: StaffRecord;
  variant: "icons" | "labelled";
  canManage: boolean;
  busy: boolean;
  onViewClients: (staffId: string) => void;
  onViewDetails: (staffId: string) => void;
  onEdit: (staffId: string) => void;
  onToggleStatus: (row: StaffRecord) => void;
};

function RowActions({
  row,
  variant,
  canManage,
  busy,
  onViewClients,
  onViewDetails,
  onEdit,
  onToggleStatus,
}: RowActionsProps) {
  const t = useTranslations("staffList");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeMenu = () => setAnchorEl(null);

  const isActive = row.isActive;
  const menuId = `staff-actions-${row.staffId}`;
  const labelled = variant === "labelled";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: labelled ? "stretch" : "flex-end",
        gap: labelled ? 1 : 0.25,
        width: labelled ? "100%" : "auto",
        height: labelled ? "auto" : "100%",
      }}
    >
      {labelled ? (
        <>
          <Button
            variant="text"
            disableElevation
            onClick={() => onViewDetails(row.staffId)}
            sx={{
              flex: 1,
              minWidth: 0,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13.5,
              borderRadius: 2.5,
              py: 1,
              color: BRAND_DARK,
              bgcolor: BRAND_SOFT,
              "&:hover": { bgcolor: "rgba(16, 122, 100, 0.14)" },
              ...focusRing,
            }}
          >
            {t("actions.viewDetails")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => onViewClients(row.staffId)}
            sx={{
              flex: 1,
              minWidth: 0,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13.5,
              borderRadius: 2.5,
              py: 1,
              color: INK,
              borderColor: HAIRLINE_STRONG,
              "&:hover": {
                borderColor: BRAND,
                bgcolor: BRAND_SOFT,
                color: BRAND_DARK,
              },
              ...focusRing,
            }}
          >
            {t("actions.viewClients")}
          </Button>
        </>
      ) : (
        <>
          <Tooltip title={t("actions.viewClients")}>
            <IconButton
              aria-label={t("actions.viewClients")}
              size="small"
              sx={iconActionSx}
              onClick={() => onViewClients(row.staffId)}
            >
              <PersonSearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("actions.viewDetails")}>
            <IconButton
              aria-label={t("actions.viewDetails")}
              size="small"
              sx={iconActionSx}
              onClick={() => onViewDetails(row.staffId)}
            >
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}

      {canManage && (
        <>
          <Tooltip title={t("columns.action")}>
            <span>
              <IconButton
                aria-label={t("columns.action")}
                aria-haspopup="menu"
                aria-controls={anchorEl ? menuId : undefined}
                aria-expanded={anchorEl ? "true" : undefined}
                size={labelled ? "medium" : "small"}
                disabled={busy}
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{
                  ...iconActionSx,
                  ...(labelled && {
                    border: `1px solid ${HAIRLINE_STRONG}`,
                    borderRadius: 2.5,
                    width: 42,
                    height: 40,
                  }),
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 0.5,
                  minWidth: 200,
                  borderRadius: 2.5,
                  border: `1px solid ${HAIRLINE}`,
                  boxShadow: "0 16px 40px -16px rgba(17,24,39,0.30)",
                  "& .MuiMenuItem-root": {
                    gap: 0.5,
                    py: 1.1,
                    mx: 0.75,
                    borderRadius: 1.75,
                  },
                  "& .MuiListItemText-primary": {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 34,
                    color: "inherit",
                  },
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                closeMenu();
                onEdit(row.staffId);
              }}
              sx={{ color: INK }}
            >
              <ListItemIcon>
                <EditOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("actions.edit")}</ListItemText>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              disabled={busy}
              onClick={() => {
                closeMenu();
                onToggleStatus(row);
              }}
              sx={{
                color: isActive ? DANGER : BRAND_DARK,
                "&:hover": { bgcolor: isActive ? DANGER_SOFT : BRAND_SOFT },
              }}
            >
              <ListItemIcon>
                {isActive ? (
                  <PersonOffOutlinedIcon fontSize="small" />
                ) : (
                  <PersonAddOutlinedIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                {isActive ? t("actions.disable") : t("actions.activate")}
              </ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}

// =================================================
// LIST LAYOUT (below lg)
// =================================================

const listRowSx = {
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  p: { xs: 2, sm: 2.5 },
  borderBottom: `1px solid ${HAIRLINE}`,
  "&:last-of-type": { borderBottom: 0 },
};

function MetaItem({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <Box sx={{ minWidth: 0, gridColumn: span ? { xs: "1 / -1", sm: "auto" } : "auto" }}>
      <Typography
        component="dt"
        sx={{ fontSize: 12, fontWeight: 500, color: INK_FAINT, mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography
        component="dd"
        sx={{ m: 0, fontSize: 14, fontWeight: 500, color: INK, wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function StaffListItem({
  row,
  ...actions
}: { row: StaffRecord } & Omit<RowActionsProps, "row" | "variant">) {
  const t = useTranslations("staffList");

  return (
    <Box component="li" sx={listRowSx}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <StaffAvatar name={row.name} seed={row.staffId} size={44} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 15, fontWeight: 600, color: INK }}>
            {row.name || "-"}
          </Typography>
          <Typography noWrap sx={{ fontSize: 13, color: INK_MUTED }}>
            {row.email || "-"}
          </Typography>
        </Box>
        <StatusPill active={row.isActive} />
      </Box>

      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 1.75,
        }}
      >
        <MetaItem label={t("columns.id")} value={row.staffId} />
        <MetaItem label={t("columns.location")} value={row.location || "-"} />
        <MetaItem
          label={t("columns.createdAt")}
          value={String(formatCreatedAt(row.createdAt) ?? "-")}
          span
        />
      </Box>

      <RowActions row={row} variant="labelled" {...actions} />
    </Box>
  );
}

function StaffListSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} component="li" sx={listRowSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="55%" height={22} />
              <Skeleton width="75%" height={18} />
            </Box>
            <Skeleton variant="rounded" width={70} height={24} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
            <Skeleton width="60%" height={36} />
            <Skeleton width="60%" height={36} />
          </Box>
          <Skeleton variant="rounded" height={40} />
        </Box>
      ))}
    </>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("staffList");
  return (
    <Box
      role="alert"
      sx={{
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 0.75,
        px: 3,
        py: 6,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: INK }}>
        {t("error.title")}
      </Typography>
      <Typography sx={{ fontSize: 14, color: INK_MUTED, maxWidth: 360 }}>
        {t("error.description")}
      </Typography>
      <Button
        variant="outlined"
        onClick={onRetry}
        sx={{
          mt: 1.5,
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2.5,
          color: INK,
          borderColor: HAIRLINE_STRONG,
          "&:hover": {
            borderColor: BRAND,
            bgcolor: BRAND_SOFT,
            color: BRAND_DARK,
          },
          ...focusRing,
        }}
      >
        {t("error.retry")}
      </Button>
    </Box>
  );
}

// =================================================
// PAGE
// =================================================

export default function StaffPage() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations("staffList");
  const role = useAuthStore((state) => state.user?.role);
  const canManage = role === "superadmin";

  // Mobile-first: the list renders until the client confirms a wide viewport.
  const isGrid = useMediaQuery(theme.breakpoints.up(GRID_BREAKPOINT));
  const mainRef = useRef<HTMLElement | null>(null);

  const {
    isLoading,
    isError,
    refetch,
    staffData,
    pagination,
    staffFilters,
    staffOptions,
    onPageChange,
    handleStaffSearch,
    handleStaffFilterReset,
    updateStaffStatus,
    isUpdatingStatus,
  } = useStaffHook();

  const rows = staffData;

  const staffFilterFields: FilterField<StaffFilterValues>[] = [
    {
      type: "select",
      name: "staffId",
      label: t("filters.staffMember.label"),
      placeholder: t("filters.staffMember.placeholder"),
      options: staffOptions,
    },
    {
      type: "select",
      name: "location",
      label: t("filters.location.label"),
      placeholder: t("filters.location.placeholder"),
      options: ["USA", "Japan", "Nepal", "Other"].map((value) => ({
        label: t(`filters.location.options.${value}` as never),
        value,
      })),
    },
    {
      type: "select",
      name: "isActive",
      label: t("filters.accountStatus.label"),
      placeholder: t("filters.accountStatus.placeholder"),
      options: [
        { label: t("filters.accountStatus.options.active"), value: "true" },
        { label: t("filters.accountStatus.options.inactive"), value: "false" },
      ],
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

  const openStatusDialog = (row: StaffRecord) =>
    setStatusDialog({
      open: true,
      staffId: row.staffId,
      name: row.name ?? t("thisStaffMember"),
      isActive: row.isActive,
    });

  const handlePageChange: typeof onPageChange = (...args) => {
    onPageChange(...args);
    // On the stacked list the next page starts far below the fold.
    mainRef.current?.scrollTo({ top: 0 });
  };

  // Without this, a failed request would look like "no staff found".
  const showError = isError && !isLoading && rows.length === 0;

  const rowActionHandlers = {
    canManage,
    busy: isUpdatingStatus,
    onViewClients: (id: string) => router.push(`/admin/staff/${id}/clients`),
    onViewDetails: (id: string) => router.push(`/admin/staff/${id}`),
    onEdit: (id: string) => router.push(`/admin/staff/${id}/edit`),
    onToggleStatus: openStatusDialog,
  };

  // -----------------------------------------------
  // DataGrid columns (desktop)
  // -----------------------------------------------

  const baseColumn = { resizable: false, disableColumnMenu: true } as const;

  const columns: GridColDef[] = [
    {
      ...baseColumn,
      field: "name",
      headerName: t("columns.fullName"),
      flex: 1.6,
      minWidth: 240,
      renderCell: (params) => {
        const row = params.row as StaffRecord;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <StaffAvatar name={row.name} seed={row.staffId} />
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.35 }}>
                {row.name || "-"}
              </Typography>
              <Typography noWrap sx={{ fontSize: 13, color: INK_MUTED, lineHeight: 1.35 }}>
                {row.email || "-"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      ...baseColumn,
      field: "staffId",
      headerName: t("columns.id"),
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, color: INK }}>
          {params.value}
        </Typography>
      ),
    },
    {
      ...baseColumn,
      field: "location",
      headerName: t("columns.location"),
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Typography noWrap sx={{ fontSize: 14, color: INK_MUTED }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      ...baseColumn,
      field: "isActive",
      headerName: t("columns.status"),
      width: 120,
      renderCell: (params) => <StatusPill active={Boolean(params.value)} />,
    },
    {
      ...baseColumn,
      field: "createdAt",
      headerName: t("columns.createdAt"),
      flex: 0.9,
      minWidth: 150,
      valueGetter: (_value, row) => formatCreatedAt(row.createdAt),
      renderCell: (params) => (
        <Typography noWrap sx={{ fontSize: 14, color: INK_MUTED }}>
          {params.value}
        </Typography>
      ),
    },
    {
      ...baseColumn,
      field: "actions",
      headerName: t("columns.action"),
      width: canManage ? 128 : 92,
      align: "right",
      headerAlign: "right",
      sortable: false,
      renderCell: (params) => (
        <RowActions row={params.row as StaffRecord} variant="icons" {...rowActionHandlers} />
      ),
    },
  ];

  // -----------------------------------------------
  // Render
  // -----------------------------------------------

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        "@supports (height: 100dvh)": { height: "100dvh" },
        overflow: "hidden",
        bgcolor: "#F7F8F6",
      }}
    >
      <Box
        component="main"
        ref={mainRef}
        sx={{
          height: "100%",
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: 1320, mx: "auto" }}>
          {/* BREADCRUMB */}
          <Box sx={{ mb: { xs: 1.5, md: 2 }, overflowX: "auto" }}>
            <Breadcrumb
              items={[
                { label: t("breadcrumbs.dashboard"), href: "/admin/dashboard" },
                { label: t("breadcrumbs.staff"), href: "/admin/staff", current: true },
              ]}
            />
          </Box>

          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "flex-end" },
              justifyContent: "space-between",
              gap: { xs: 2, sm: 2.5 },
              mb: { xs: 2.5, md: 3 },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 24, md: 30 },
                  fontWeight: 600,
                  letterSpacing: -0.4,
                  lineHeight: 1.2,
                  color: INK,
                }}
              >
                {t("title")}
              </Typography>

              <Typography
                sx={{ mt: 1, fontSize: 14, color: INK_MUTED, maxWidth: 620 }}
              >
                {t("description")}
              </Typography>
            </Box>

            {canManage && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<PersonAddAlt1OutlinedIcon />}
                onClick={() => router.push("/admin/staff/add")}
                sx={{
                  flexShrink: 0,
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: BRAND,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  py: 1.1,
                  boxShadow: "none",
                  "&:hover": { bgcolor: BRAND_DARK, boxShadow: "none" },
                  ...focusRing,
                }}
              >
                {t("addStaff")}
              </Button>
            )}
          </Box>

          {/* FILTERS */}
          <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <SearchFilter<StaffFilterValues>
              key={JSON.stringify(staffFilters)}
              searchField={{
                name: "keyword",
                label: t("filters.search.label"),
                placeholder: t("filters.search.placeholder"),
              }}
              fields={staffFilterFields}
              initialValues={staffFilters}
              onSearch={handleStaffSearch}
              onReset={handleStaffFilterReset}
              searchButtonText={t("filters.searchButton")}
              resetButtonText={t("filters.clearButton")}
              isLoading={isLoading}
            />
          </Box>

          {/* TABLE / LIST */}
          <Paper elevation={0} sx={{ ...softCard, overflow: "hidden" }}>
            <Box
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1.5,
                borderBottom: `1px solid ${HAIRLINE}`,
                bgcolor: SURFACE_TINT,
              }}
            >
              <PaginationRowsLabel
                count={pagination?.total ?? 0}
                from={pagination?.from ?? null}
                to={pagination?.to ?? null}
                itemLabel="staff members"
              />
            </Box>

            {showError ? (
              <ErrorState onRetry={() => void refetch()} />
            ) : isGrid ? (
              <DataGrid
                rows={rows}
                getRowId={(row) => row.staffId}
                columns={columns}
                disableColumnMenu
                disableRowSelectionOnClick
                slots={{ noRowsOverlay: NoDataOverlay }}
                loading={isLoading}
                hideFooter
                autoHeight
                rowHeight={68}
                columnHeaderHeight={46}
                sx={{
                  border: "none",
                  "--DataGrid-containerBackground": HEADER_BG,
                  "--DataGrid-rowBorderColor": HAIRLINE,

                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: HEADER_BG,
                    borderBottom: `1px solid ${HAIRLINE}`,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    bgcolor: HEADER_BG,
                    "&:focus, &:focus-within": { outline: "none" },
                  },
                  "& .MuiDataGrid-columnHeader--sorted": {
                    bgcolor: HEADER_BG,
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 0.1,
                    color: HEADER_INK,
                  },
                  "& .MuiDataGrid-columnSeparator": { display: "none" },

                  "& .MuiDataGrid-cell": {
                    display: "flex",
                    alignItems: "center",
                    borderBottomColor: HAIRLINE,
                    "&:focus, &:focus-within": { outline: "none" },
                  },
                  "& .MuiDataGrid-cell[data-colindex='0'], & .MuiDataGrid-columnHeader[aria-colindex='1']":
                    { pl: 2.5 },
                  "& .MuiDataGrid-cell[data-field='actions'], & .MuiDataGrid-columnHeader[data-field='actions']":
                    { pr: 2 },

                  "& .MuiDataGrid-row": {
                    transition: "background-color 200ms ease",
                    "&:hover": { bgcolor: "rgba(16, 122, 100, 0.04)" },
                  },
                  "& .MuiDataGrid-row:last-of-type .MuiDataGrid-cell": {
                    borderBottom: 0,
                  },
                }}
              />
            ) : (
              <Box
                component="ul"
                aria-busy={isLoading}
                sx={{
                  m: 0,
                  p: 0,
                  opacity: isLoading && rows.length > 0 ? 0.55 : 1,
                  pointerEvents: isLoading && rows.length > 0 ? "none" : "auto",
                  transition: "opacity 150ms ease",
                }}
              >
                {isLoading && rows.length === 0 ? (
                  <StaffListSkeleton />
                ) : rows.length === 0 ? (
                  <Box
                    component="li"
                    sx={{
                      listStyle: "none",
                      position: "relative",
                      minHeight: 280,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NoDataOverlay />
                  </Box>
                ) : (
                  rows.map((row) => (
                    <StaffListItem
                      key={row.staffId}
                      row={row}
                      {...rowActionHandlers}
                    />
                  ))
                )}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                overflowX: "auto",
                px: { xs: 1.5, sm: 2.5 },
                py: 1.5,
                borderTop: `1px solid ${HAIRLINE}`,
                bgcolor: SURFACE_TINT,
              }}
            >
              <Pagination
                page={pagination?.current_page ?? 1}
                total={pagination?.total ?? 0}
                pageSize={pagination?.per_page ?? 10}
                disabled={isLoading}
                onPageChange={handlePageChange}
              />
            </Box>
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