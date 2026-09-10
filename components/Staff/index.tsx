"use client";

import { useStaffList } from "./hook";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function StaffTable() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Full name", width: 130 },
    { field: "location", headerName: "Location", width: 130 },
  ];
  const { data: staffData = [], isLoading } = useStaffList();

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={staffData}
        getRowId={(row) => row.id}
        columns={columns}
        pageSizeOptions={[5, 10]}
        loading={isLoading}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
