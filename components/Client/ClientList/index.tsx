"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Box from "@mui/material/Box";
import Sidebar from "@/components/Sidebar";
import { useClientListHook,useClientHook } from "./hook";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import Link from "next/link";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useState } from "react";
import {Staff} from "./type"

const ClientListPage = () => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    canCreateClient,
    handleCreateClient,
  } = useClientListHook();

 const {isClientLoading,clientData,staffData,staffAdd,isStaffAdding} =  useClientHook()
 const [selectedStaff, setSelectedStaff] = useState<
  Record<string, string>
>({});
console.log("staffData", staffData);
  const columns: GridColDef[] = [
     {
       field: "clientId",
       headerName: "ID",
       width: 170,
       resizable: false,
       disableColumnMenu: true,
     },
     {
       field: "fullName",
       headerName: "Full name",
       width: 270,
       resizable: false,
       disableColumnMenu: true,
       renderCell: ({ row }) => (
         <Link
           href={`/client/clientDetailPage?clientId=${row.clientId}`}
           className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
         >
           {row.fullName}
         </Link>
       ),
     },
     {
       field: "phone",
       headerName: "Phone",
       width: 150,
       resizable: false,
       disableColumnMenu: true,
     },
     
   
     {
       field: "",
       headerName: "Assign To",
       flex: 1,
  minWidth: 470,
       resizable: false,
       disableColumnMenu: true,
        renderCell: ({row}) => (
       <Box sx={{display:"flex",gap:"4px", alignItems:"center"}}>
         <Select
            id="staff"
            fullWidth
             value={ selectedStaff[row.clientId] || row?.assignedStaff || ""}
        displayEmpty
        onChange={(e) => {
          setSelectedStaff((prev) => ({
            ...prev,
            [row.clientId]: e.target.value,
          }));
        }}
            sx={{
              height: "40px",
              backgroundColor: {
                xs: "#EDEDED",
                sm: "#fff",
              },
            }}
          >
          {staffData?.data?.map((staff: Staff) => (
        <MenuItem key={staff.staffId} value={staff.staffId}>
          {staff.name}
        </MenuItem>
      ))}
          </Select>
          <Button disabled={isStaffAdding} onClick={() =>  staffAdd({
            clientId: row.clientId,
            staffId:
              selectedStaff[row.clientId] ||
              row?.assignedStaff ||
              "",
          })}>Add</Button>
       </Box>
       ),
     },

   ];
 


  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Clients"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <Navbar title="Clients" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client", current: true },
            ]}
          />
        </div>

 

        {canCreateClient && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleCreateClient}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span aria-hidden="true">+</span>
              Add Client
            </button>
          </div>
        )}

       <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={clientData?.data || []}
            getRowId={(row) => row.clientId}
            columns={columns}
            disableColumnMenu
            // initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            // slots={{ cell: renderRowHeaderCell }}

            loading={isClientLoading}
            hideFooter
            sx={{
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },

              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "primary.main",
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },

              "& .action-column-cell": {
                backgroundColor: "#fff",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },

              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
        </Paper>
      </main>
    </div>
  );
};

export default ClientListPage;
