"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useState } from "react";

import { useStaffClientsHook } from "./hook";

export default function StaffClients() {
  return <StaffClientsContent />;
}

function StaffClientsContent() {
  const {
    isLoading,
    staffClientsData,
  } = useStaffClientsHook();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const clients = staffClientsData?.data ?? [];
  const selectedStaff = staffClientsData?.staff;


  const pageTitle = `${selectedStaff?.name ?? "Staff"} Clients`;

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
            field: "visaType",
            headerName: "Visa Type",
            width: 140,
            resizable: false,
            disableColumnMenu: true,
          },
          {
            field: "coeStatus",
            headerName: "COE Status",
            width: 160,
            resizable: false,
            disableColumnMenu: true,
          },
          {
            field: "visaStatus",
            headerName: "Visa Status",
            width: 160,
            resizable: false,
            disableColumnMenu: true,
            valueGetter: (_value, row) => row.visaStatus ?? "-",
          },
          {
            field: "clientStatus",
            headerName: "Client Status",
            width: 190,
            resizable: false,
            disableColumnMenu: true,
          },
          {
            field: "action",
            headerName: "Action",
            width: 120,
            resizable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => (
              <Button
                component={Link}
                href={`/client/edit?clientId=${row.clientId}`}
                variant="outlined"
                size="small"
                sx={{
                  height: "34px",
                  minWidth: "72px",
                  textTransform: "none",
                }}
              >
                Edit
              </Button>
            ),
          },
          ];

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f3f4f6",
      }}
    >
      <Sidebar
        selected="Staff"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((previous) => !previous)}
      />


      <Box
        component="main"
        sx={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          px: 4,
          pb: 4,
        }}
      >
        <Navbar title={pageTitle} />


        <Box sx={{ mb: 3 }}>
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                href: "/admin/dashboard",
              },
              {
                label: "Staff",
                href: "/staff",
              },
              {
                label: selectedStaff?.name ?? "Staff Clients",
                current: true,
              },
            ]}
          />
        </Box>

        <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={clients}
            getRowId={(row) => row.clientId}
            columns={columns}
            disableColumnMenu
            // initialState={{ pagination: { paginationModel } }}
            // pageSizeOptions={[5, 10]}
            // slots={{ cell: renderRowHeaderCell }}

            loading={isLoading}
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
      </Box>
    </Box>


  );
}
