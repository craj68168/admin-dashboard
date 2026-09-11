"use client";

import { useStaffList } from "./hook";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import NoDataOverlay from "@/components/common/NoDataOverlay";

export default function StaffTable() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.7, minWidth: 90 },
    { field: "name", headerName: "Full name", flex: 1.2, minWidth: 150 },
    { field: "location", headerName: "Location", flex: 1, minWidth: 130 },
  ];
  const { data: staffData = [], isLoading } = useStaffList();

  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
        rows={staffData}
        getRowId={(row) => row.id}
        columns={columns}
        pageSizeOptions={[5, 10]}
        loading={isLoading}
        checkboxSelection
        autoHeight
        slots={{ noRowsOverlay: NoDataOverlay }}
      />
    </Paper>
  );
}
