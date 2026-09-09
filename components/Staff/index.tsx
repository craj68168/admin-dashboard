"use client";

import { useRouter } from "next/navigation";
import ReusableTable from "@/components/ReusableTable";
import { useStaffList } from "./hook";
import type { StaffRowItem } from "./staff.type";
import {
  DataGrid,
  GridCell,
  type GridCellProps,
  type GridColDef,
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export default function StaffTable() {


 
  const columns: GridColDef[] = [
  { field: '_id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Full name', width: 130 },
  { field: 'location', headerName: 'Location', width: 130 },
  
];
  return (
    <>
     <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={staffData?.data || []}
        getRowId={(row) => row._id}
        columns={columns}
        // initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        // slots={{ cell: renderRowHeaderCell }}
        sx={{ border: 0 }}
      />
    </Paper>
    </>
  );
}
