"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Breadcrumb from "@/components/Breadcrumb";
import ReusableTable from "@/components/ReusableTable/index";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { canEditClient, canUpdateClientStatus } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";
import { useStaffClients, useStaffClientsPage } from "./hook";
import type { ClientTableRow } from "@/components/ReusableTable/type";

export default function StaffClients() {
  return <StaffClientsContent />;
}

function StaffClientsContent() {
  const user = useAuthStore((state) => state.user);
  const {
    staffId,
    sidebarCollapsed,
    setSidebarCollapsed,
    staffs,
    clients,
    selectedStaff,
    isLoading,
    isError,
    handleUpdateClientField,
  } = useStaffClientsPage();
  const {data} = useStaffClients()
  const pageTitle = `${selectedStaff?.name ?? "Staff"} Clients`;
  console.log("Data",data)

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "#f3f4f6" }}>
      <Sidebar
        selected="Staff"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((previous) => !previous)}
      />

      <Box component="main" sx={{ flex: 1, height: "100vh", overflowY: "auto", px: 4, pb: 4 }}>
        <Navbar title={pageTitle} />

        <Box sx={{ mb: 3 }}>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff" },
              {
                label: selectedStaff?.name ?? "Staff Clients",
                href: `/staff/${staffId}/clients`,
                current: true,
              },
            ]}
          />
        </Box>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <Alert severity="error">Failed to load assigned clients.</Alert>
        ) : (
          <ReusableTable
            title={pageTitle}
            variant="staff"
            clients={clients}
            staffs={staffs}
            canEditClient={(client: ClientTableRow) => canEditClient(user, client)}
            canUpdateClientStatus={clients.every((client) =>
              canUpdateClientStatus(user, client),
            )}
            onUpdateClientField={handleUpdateClientField}
          />
        )}
      </Box>
    </Box>
  );
}

function LoadingState() {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        p: 3,
        color: "text.secondary",
      }}
    >
      <CircularProgress size={20} />
      Loading assigned clients...
    </Paper>
  );
}

