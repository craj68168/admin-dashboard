"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useAuthStore } from "@/store/auth-store";

import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user.role === "superadmin") {
    return <AdminDashboard />;
  }

  if (user.role === "staff") {
    return <StaffDashboard />;
  }

  return (
    <Box
      sx={{
        minHeight: 400,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Typography color="error">
        This account cannot access the dashboard.
      </Typography>
    </Box>
  );
}
