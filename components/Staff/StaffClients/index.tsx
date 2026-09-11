"use client";
import Box from "@mui/material/Box";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useStaffClients } from "./hook";

function StaffClientsContent() {
  const { data, isPending } = useStaffClients();
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
      headerName: "Full Name",
      width: 200,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Link
            href={`/admin/client/clientDetailPage?clientId=${params.row.clientId}`}
            className="text-blue-500 hover:underline"
          >
            {params.row.fullName}
          </Link>
        );
      },
    },
    {
      field: "clientStatus",
      headerName: "Status",
      width: 270,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 170,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "visaType",
      headerName: "Visa Type",
      width: 170,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 270,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "",
      headerName: "Action",
      resizable: false,
      width: 135,
      disableColumnMenu: true,
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
      <Box
        component="main"
        sx={{ flex: 1, height: "100vh", overflowY: "auto", px: 4, pb: 4 }}
      >
        <Box sx={{ mb: 3 }}>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff" },
            ]}
          />
        </Box>

        <DataGrid
          rows={data?.data || []}
          getRowId={(row) => row.clientId}
          columns={columns}
          disableColumnMenu
          // initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          // slots={{ cell: renderRowHeaderCell }}

          loading={isPending}
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
      </Box>
    </Box>
  );
}
export default StaffClientsContent;
