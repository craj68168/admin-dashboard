"use client";

import { useMemo } from "react";
import NextLink from "next/link";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import {
  DataGrid,
  GridCell,
  type GridCellProps,
  type GridColDef,
  type GridRowClassNameParams,
} from "@mui/x-data-grid";

import { usePendingTableValue, usePendingRowStatuses } from "./hook";

import {
  AssignmentSelectProps,
  ClientTableProps,
  ClientTableRow,
  PlainSelectProps,
  StaffOption,
  StaffTableRow,
  coeStatusOptions,
  clientStatusOptions,
  visaStatusOptions,
} from "./type";

/* -------------------------------------------------------------------------- */
/*                                UI CONSTANTS                                */
/* -------------------------------------------------------------------------- */

const TABLE = {
  headerHeight: 48,
  rowHeight: 64,
  cellPaddingX: 2,
};

const COLORS = {
  border: "#E5E7EB",
  lightBorder: "#F1F5F9",
  header: "#F8FAFC",
  rowAlternate: "#FAFBFC",
  hover: "#F8FAFC",

  textPrimary: "#111827",
  textSecondary: "#6B7280",

  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#EFF6FF",
};

const STATUS_COLORS: Record<
  string,
  {
    bg: string;
    text: string;
    dot: string;
  }
> = {
  "Not Applied": { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
  Applied: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  Processing: { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  Received: { bg: "#ECFDF5", text: "#047857", dot: "#10B981" },
  Approved: { bg: "#ECFDF5", text: "#047857", dot: "#10B981" },
  Rejected: { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444" },
  New: { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
  "Document Collection": { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "COE Applied": { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  "COE Received": { bg: "#ECFDF5", text: "#047857", dot: "#10B981" },
  "Visa Applied": { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B" },
  "Visa Approved": { bg: "#ECFDF5", text: "#047857", dot: "#10B981" },
  "Visa Rejected": { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444" },
  Departed: { bg: "#EEF2FF", text: "#4338CA", dot: "#6366F1" },
  "Arrived in Japan": { bg: "#ECFDF5", text: "#047857", dot: "#10B981" },
};

const AVATAR_PALETTE = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#059669",
  "#D97706",
  "#0891B2",
];

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const getStatusColor = (value: string) =>
  STATUS_COLORS[value] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" };

const getAvatarColor = (name: string) => {
  const sum = [...name].reduce((acc, character) => acc + character.charCodeAt(0), 0);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const getDefaultStatus = (field: "coeStatus" | "visaStatus" | "clientStatus") => {
  if (field === "clientStatus") {
    return "New";
  }
  return "Not Applied";
};

const formatDate = (value?: string) => {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const getStaffOptionValue = (staff: StaffOption) =>
  String(staff._id ?? staff.id ?? staff.staffId ?? "");

const isSameStaff = (staff: StaffOption, value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return false;
  }

  return [staff._id, staff.id, staff.staffId].some(
    (staffValue) => staffValue !== undefined && String(staffValue) === String(value),
  );
};

/* -------------------------------------------------------------------------- */
/*                                MAIN TABLE                                  */
/* -------------------------------------------------------------------------- */

export default function ClientTable({
  title,
  clients = [],
  staffRows = [],
  variant = "compact",

  staffs = [],

  canManageAssignments = false,
  canEditClients = true,
  canEditClient,
  canUpdateClientStatus = true,

  onAssignClient,
  onViewStaffClients,
  onUpdateClientField,
}: ClientTableProps) {
  const isStaffVariant = variant === "staff";
  const isStaffListVariant = variant === "staff-list";

  const rows = isStaffListVariant
    ? staffRows.map((staff) => ({
        ...staff,
        id: staff.recordId ?? staff.id,
      }))
    : clients.map((client) => ({
        ...client,
        id: client.id ?? client.clientId,
      }));

  const columns = isStaffListVariant
    ? buildStaffColumns({ onViewStaffClients })
    : buildClientColumns({
        isStaffVariant,
        staffs,
        canManageAssignments,
        canEditClients,
        canEditClient,
        canUpdateClientStatus,
        onAssignClient,
        onUpdateClientField,
      });
  const totalRows = isStaffListVariant ? staffRows.length : clients.length;

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: TABLE.headerHeight + TABLE.rowHeight + 64,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "#FFFFFF",
        border: `1px solid ${COLORS.border}`,
        borderRadius: "12px",
        boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.05)",
      }}
    >
      {/* Table header */}

      <Box
        sx={{
          minHeight: "64px",
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexShrink: 0,
          borderBottom: `1px solid ${COLORS.border}`,
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1.3,
              color: COLORS.textPrimary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: "12px",
              color: COLORS.textSecondary,
            }}
          >
            {isStaffListVariant
              ? "Manage staff members and assigned clients"
              : "Manage client records and information"}
          </Typography>
        </Box>

        <Chip
          label={`${totalRows} ${
            isStaffListVariant
              ? totalRows === 1
                ? "staff"
                : "staff"
              : totalRows === 1
                ? "client"
                : "clients"
          }`}
          size="small"
          sx={{
            height: "28px",
            px: 0.5,
            flexShrink: 0,
            bgcolor: COLORS.primaryLight,
            color: COLORS.primaryDark,
            fontSize: "12px",
            fontWeight: 700,
            border: "1px solid #DBEAFE",
            borderRadius: "8px",
          }}
        />
      </Box>

      {/* Data grid */}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            sorting: {
              sortModel: [{ field: "clientId", sort: "asc" }],
            },
          }}
          disableColumnFilter
          disableRowSelectionOnClick
          hideFooterPagination
          hideFooterSelectedRowCount
          rowHeight={TABLE.rowHeight}
          columnHeaderHeight={TABLE.headerHeight}
          getRowClassName={(params: GridRowClassNameParams) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "row-even" : "row-odd"
          }
          slots={{ cell: renderRowHeaderCell }}
          sx={{
            width: "100%",
            height: "auto",
            minHeight: TABLE.headerHeight + TABLE.rowHeight,
            maxWidth: "100%",
            border: 0,
            color: COLORS.textPrimary,

            /* Header */

            "& .MuiDataGrid-columnHeaders": {
              minHeight: `${TABLE.headerHeight}px !important`,
              maxHeight: `${TABLE.headerHeight}px !important`,
              bgcolor: COLORS.header,
              borderBottom: `1px solid ${COLORS.border}`,
            },

            "& .MuiDataGrid-columnHeader": {
              px: TABLE.cellPaddingX,
              bgcolor: COLORS.header,
              outline: "none",
              "&:focus": { outline: "none" },
              "&:focus-within": { outline: "none" },
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: "#475569",
              overflow: "visible",
              whiteSpace: "nowrap",
            },

            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },

            /* Cells */

            "& .MuiDataGrid-cell": {
              px: TABLE.cellPaddingX,
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${COLORS.lightBorder}`,
              fontSize: "13.5px",
              color: "#374151",
              outline: "none",
              overflow: "hidden",
              "&:focus": { outline: "none" },
              "&:focus-within": { outline: "none" },
            },

            /* Rows */

            "& .MuiDataGrid-row": {
              minHeight: `${TABLE.rowHeight}px !important`,
              maxHeight: `${TABLE.rowHeight}px !important`,
            },

            "& .row-even": { bgcolor: "#FFFFFF" },
            "& .row-odd": { bgcolor: COLORS.rowAlternate },

            "& .MuiDataGrid-row:hover": {
              bgcolor: `${COLORS.hover} !important`,
            },

            "& .MuiDataGrid-row.Mui-selected": {
              bgcolor: "transparent",
            },

            /* scrollbar */

            "& .MuiDataGrid-virtualScroller": {
              scrollbarWidth: "thin",
            },

            "& .MuiDataGrid-scrollbar": {
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#CBD5E1",
                borderRadius: "8px",
              },
            },

            "& .MuiDataGrid-footerContainer": {
              display: "none",
            },
          }}
        />
      </Box>
    </Paper>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ACCESSIBLE CELL                               */
/* -------------------------------------------------------------------------- */

function renderRowHeaderCell(props: GridCellProps) {
  return (
    <GridCell {...props} role={props.column.field === "fullName" ? "rowheader" : "gridcell"} />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  COLUMNS                                   */
/* -------------------------------------------------------------------------- */

function buildStaffColumns({
  onViewStaffClients,
}: {
  onViewStaffClients?: ClientTableProps["onViewStaffClients"];
}): GridColDef<StaffTableRow>[] {
  return [
    {
      field: "id",
      headerName: "Staff ID",
      width: 128,
      minWidth: 128,
      maxWidth: 128,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            height: "26px",
            px: 1,
            borderRadius: "6px",
            bgcolor: "#F1F5F9",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: 1,
              color: "#64748B",
              fontFamily: "monospace",
            }}
          >
            #{row.id}
          </Typography>
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 210,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
          <Avatar
            sx={{
              width: "34px",
              height: "34px",
              flexShrink: 0,
              bgcolor: getAvatarColor(row.name),
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {getInitials(row.name)}
          </Avatar>
          <Button
            type="button"
            variant="text"
            onClick={() => onViewStaffClients?.(row)}
            sx={{
              minWidth: 0,
              p: 0,
              color: COLORS.textPrimary,
              fontSize: "13.5px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "transparent",
                color: COLORS.primaryDark,
                textDecoration: "underline",
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "13.5px",
                fontWeight: 600,
              }}
            >
              {row.name}
            </Typography>
          </Button>
        </Box>
      ),
    },
    { field: "phone", headerName: "Phone", flex: 0.8, minWidth: 140 },
    { field: "location", headerName: "Location", flex: 0.8, minWidth: 140 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 220 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.6,
      minWidth: 110,
      renderCell: ({ row }) => (
        <Chip
          label={row.role}
          size="small"
          sx={{
            height: "28px",
            textTransform: "capitalize",
            bgcolor: "#F5F3FF",
            color: "#6D28D9",
            fontSize: "12px",
            fontWeight: 600,
            border: "1px solid #EDE9FE",
          }}
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.65,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Chip
          label={row.isActive ? "Active" : "Inactive"}
          size="small"
          sx={{
            height: "28px",
            bgcolor: row.isActive ? "#ECFDF5" : "#F3F4F6",
            color: row.isActive ? "#047857" : "#6B7280",
            fontSize: "12px",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 0.8,
      minWidth: 140,
      valueGetter: (_value, row) => formatDate(row.createdAt),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      filterable: false,
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      renderCell: ({ row }) => (
        <Button
          type="button"
          variant="contained"
          size="small"
          startIcon={<VisibilityOutlinedIcon />}
          onClick={() => onViewStaffClients?.(row)}
          sx={{
            height: "34px",
            minWidth: "124px",
            px: 1.5,
            borderRadius: "7px",
            bgcolor: COLORS.primary,
            fontSize: "12.5px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            "& .MuiButton-startIcon": {
              mr: 0.75,
              "& svg": { fontSize: "16px" },
            },
            "&:hover": {
              bgcolor: COLORS.primaryDark,
              boxShadow: "none",
            },
          }}
        >
          View Clients
        </Button>
      ),
    },
  ];
}

function buildClientColumns({
  isStaffVariant,
  staffs = [],
  canManageAssignments,
  canEditClients,
  canEditClient,
  canUpdateClientStatus,
  onAssignClient,
  onUpdateClientField,
}: Omit<ClientTableProps, "title" | "clients" | "variant"> & {
  isStaffVariant: boolean;
}): GridColDef<ClientTableRow>[] {
  const columns: GridColDef<ClientTableRow>[] = [
    {
      field: "clientId",
      headerName: "Client ID",
      width: 112,
      minWidth: 112,
      maxWidth: 112,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            height: "26px",
            px: 1,
            borderRadius: "6px",
            bgcolor: "#F1F5F9",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: 1,
              color: "#64748B",
              fontFamily: "monospace",
            }}
          >
            #{row.clientId}
          </Typography>
        </Box>
      ),
    },
    {
      field: "fullName",
      headerName: "Client Name",
      flex: isStaffVariant ? 1.1 : 1,
      minWidth: isStaffVariant ? 120 : 160,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            minWidth: 0,
            width: "100%",
          }}
        >
          <Avatar
            sx={{
              width: "34px",
              height: "34px",
              flexShrink: 0,
              bgcolor: getAvatarColor(row.fullName),
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {getInitials(row.fullName)}
          </Avatar>

          <Button
            component={NextLink}
            href={`/client/clientDetailPage?clientId=${row.clientId}`}
            variant="text"
            sx={{
              minWidth: 0,
              maxWidth: "100%",
              p: 0,
              justifyContent: "flex-start",
              overflow: "hidden",
              color: COLORS.textPrimary,
              fontSize: "13.5px",
              fontWeight: 600,
              textTransform: "none",
              "& .MuiButton-startIcon": { m: 0 },
              "&:hover": {
                bgcolor: "transparent",
                color: COLORS.primaryDark,
                textDecoration: "underline",
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "13.5px",
                fontWeight: 600,
              }}
            >
              {row.fullName}
            </Typography>
          </Button>
        </Box>
      ),
    },
  ];

  if (isStaffVariant) {
    columns.push(
      {
        field: "phone",
        headerName: "Phone",
        flex: 0.7,
        minWidth: 110,
        valueGetter: (_value, row) => row.phone ?? "-",
      },
      {
        field: "visaType",
        headerName: "Visa Type",
        flex: 0.65,
        minWidth: 110,
        renderCell: ({ row }) => (
          <Chip
            label={row.visaType ?? "-"}
            size="small"
            sx={{
              height: "28px",
              maxWidth: "120px",
              bgcolor: "#F5F3FF",
              color: "#6D28D9",
              fontSize: "12px",
              fontWeight: 600,
              border: "1px solid #EDE9FE",
              "& .MuiChip-label": {
                px: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        ),
      },
      {
        field: "statuses",
        headerName: "Status",
        sortable: false,
        filterable: false,
        flex: 2.3,
        minWidth: 500,
        renderCell: ({ row }) => (
          <StatusGroupCell
            row={row}
            canUpdateClientStatus={canUpdateClientStatus}
            onUpdateClientField={onUpdateClientField}
          />
        ),
      },
    );
  }

  columns.push({
    field: "action",
    headerName: isStaffVariant ? "Action" : "Assign To",
    sortable: false,
    filterable: false,
    width: isStaffVariant ? 118 : undefined,
    minWidth: isStaffVariant ? 118 : 320,
    maxWidth: isStaffVariant ? 118 : undefined,
    flex: isStaffVariant ? undefined : 0.9,
    renderCell: ({ row }) => {
      if (isStaffVariant) {
        const clientCanEdit = canEditClient?.(row) ?? canEditClients;

        return (
          <Button
            component={NextLink}
            href={
              clientCanEdit
                ? `/client/edit?clientId=${row.clientId}`
                : `/client/clientDetailPage?clientId=${row.clientId}`
            }
            variant="outlined"
            size="small"
            startIcon={clientCanEdit ? <EditOutlinedIcon /> : <VisibilityOutlinedIcon />}
            sx={{
              height: "34px",
              minWidth: "84px",
              px: 1.5,
              borderRadius: "7px",
              borderColor: "#CBD5E1",
              color: "#475569",
              fontSize: "12.5px",
              fontWeight: 600,
              textTransform: "none",
              "& .MuiButton-startIcon": {
                mr: 0.75,
                "& svg": { fontSize: "16px" },
              },
              "&:hover": {
                borderColor: COLORS.primary,
                bgcolor: COLORS.primaryLight,
                color: COLORS.primaryDark,
              },
            }}
          >
            {clientCanEdit ? "Edit" : "View"}
          </Button>
        );
      }

      const assignedStaff = staffs.find(
        (staff) => isSameStaff(staff, row.assignedStaffId),
      );

      if (canManageAssignments) {
        return (
          <AssignmentSelect
            value={assignedStaff ? getStaffOptionValue(assignedStaff) : ""}
            staffs={staffs}
            onSave={(staffId) => onAssignClient?.(row.clientId, staffId)}
          />
        );
      }

      return (
        <Chip
          label={assignedStaff?.name ?? row.assignedStaffName ?? "Unassigned"}
          size="small"
          variant="outlined"
          sx={{
            height: "30px",
            maxWidth: "220px",
            borderColor: "#BFDBFE",
            color: COLORS.primaryDark,
            bgcolor: "#F8FAFF",
            fontWeight: 600,
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        />
      );
    },
  });

  return columns;
}

/* -------------------------------------------------------------------------- */
/*                              STATUS GROUP CELL                             */
/* -------------------------------------------------------------------------- */

function StatusGroupCell({
  row,
  canUpdateClientStatus = true,
  onUpdateClientField,
}: {
  row: ClientTableRow;
  canUpdateClientStatus?: boolean;
  onUpdateClientField?: ClientTableProps["onUpdateClientField"];
}) {
  const initial = useMemo(
    () => ({
      coeStatus: row.coeStatus ?? getDefaultStatus("coeStatus"),
      visaStatus: row.visaStatus ?? getDefaultStatus("visaStatus"),
      clientStatus: row.clientStatus ?? getDefaultStatus("clientStatus"),
    }),
    [row.coeStatus, row.visaStatus, row.clientStatus],
  );

  const { pending, setField, hasChanged, changedFields } = usePendingRowStatuses(initial);

  const handleSaveAll = () => {
    changedFields.forEach((field) => {
      onUpdateClientField?.(row.clientId, field, pending[field]);
    });
  };

  if (!canUpdateClientStatus) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflow: "hidden",
        }}
      >
        <StatusChip value={pending.coeStatus} />
        <StatusChip value={pending.visaStatus} />
        <StatusChip value={pending.clientStatus} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        whiteSpace: "nowrap",
      }}
    >
      <StatusSelect
        value={pending.coeStatus}
        options={coeStatusOptions}
        minWidth={98}
        onChange={(value) => setField("coeStatus", value)}
      />

      <StatusSelect
        value={pending.visaStatus}
        options={visaStatusOptions}
        minWidth={98}
        onChange={(value) => setField("visaStatus", value)}
      />

      <StatusSelect
        value={pending.clientStatus}
        options={clientStatusOptions}
        minWidth={98}
        onChange={(value) => setField("clientStatus", value)}
      />

      <Button
        variant="contained"
        size="small"
        disabled={!hasChanged}
        onClick={handleSaveAll}
        startIcon={<SaveOutlinedIcon />}
        sx={{
          height: "34px",
          minWidth: "78px",
          px: 1.5,
          flexShrink: 0,
          borderRadius: "7px",
          bgcolor: COLORS.primary,
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "& .MuiButton-startIcon": {
            mr: 0.5,
            "& svg": { fontSize: "15px" },
          },
          "&:hover": {
            bgcolor: COLORS.primaryDark,
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            bgcolor: "#F1F5F9",
            color: "#94A3B8",
          },
        }}
      >
        Save
      </Button>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*                                STATUS CHIP                                 */
/* -------------------------------------------------------------------------- */

function StatusChip({ value }: { value: string }) {
  const { bg, text } = getStatusColor(value);

  return (
    <Chip
      label={value}
      size="small"
      sx={{
        height: "28px",
        maxWidth: "150px",
        bgcolor: bg,
        color: text,
        fontWeight: 600,
        fontSize: "11.5px",
        "& .MuiChip-label": {
          px: 1.25,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                               STATUS SELECT                                */
/* -------------------------------------------------------------------------- */

function StatusSelect({ value, options, minWidth, onChange }: PlainSelectProps) {
  const { dot } = getStatusColor(value);

  return (
    <FormControl size="small" sx={{ minWidth, flexShrink: 0 }}>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        renderValue={(selected) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "7px",
                height: "7px",
                flexShrink: 0,
                borderRadius: "50%",
                bgcolor: dot,
              }}
            />

            <Typography
              component="span"
              sx={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "12px",
              }}
            >
              {selected}
            </Typography>
          </Box>
        )}
        sx={{
          height: "34px",
          bgcolor: "#FFFFFF",
          borderRadius: "7px",
          fontSize: "12px",
          "& .MuiSelect-select": {
            height: "34px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            px: 1.25,
            py: 0,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DDE3EA",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94A3B8",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.primary,
            borderWidth: "1px",
          },
        }}
      >
        {options.map((option) => {
          const { dot: optionDot } = getStatusColor(option);

          return (
            <MenuItem
              key={option}
              value={option}
              sx={{
                minHeight: "38px",
                fontSize: "13px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    bgcolor: optionDot,
                  }}
                />
                {option || "Unassigned"}
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

/* -------------------------------------------------------------------------- */
/*                            ASSIGNMENT SELECT                               */
/* -------------------------------------------------------------------------- */

function AssignmentSelect({ value, staffs, onSave }: AssignmentSelectProps) {
  const { pending, hasChanged, setPending, save } = usePendingTableValue(value, onSave);

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: "180px", flex: 1 }}>
        <Select
          value={pending}
          onChange={(event) => setPending(event.target.value)}
          displayEmpty
          sx={{
            height: "34px",
            bgcolor: "#FFFFFF",
            borderRadius: "7px",
            fontSize: "12.5px",
            "& .MuiSelect-select": {
              height: "34px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              px: 1.25,
              py: 0,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#DDE3EA",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#94A3B8",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.primary,
              borderWidth: "1px",
            },
          }}
        >
          <MenuItem value="">Unassigned</MenuItem>

          {staffs.map((staff) => {
            const staffId = getStaffOptionValue(staff);

            return (
              <MenuItem key={staffId} value={staffId} sx={{ fontSize: "13px" }}>
                {staff.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        size="small"
        disabled={!hasChanged}
        onClick={save}
        sx={{
          height: "34px",
          minWidth: "70px",
          flexShrink: 0,
          borderRadius: "7px",
          bgcolor: COLORS.primary,
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            bgcolor: COLORS.primaryDark,
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            bgcolor: "#F1F5F9",
            color: "#94A3B8",
          },
        }}
      >
        Save
      </Button>
    </Box>
  );
}
