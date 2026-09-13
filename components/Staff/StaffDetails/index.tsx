"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { formatCreatedAt } from "@/utils/format-date";
import { useStaffDetails } from "./hook";
import Performance from "./Performance";
import { Divider } from "@mui/material";

export default function StaffDetails() {
  const router = useRouter();
  const { staff, isLoading, isError } = useStaffDetails();

  if (isLoading) {
    return <StatusMessage message="Loading staff details..." />;
  }

  if (isError || !staff) {
    return <StatusMessage message="Staff member could not be found." />;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6", px: 4, py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Staff", href: "/admin/staff" },
            { label: "Staff Details", current: true },
          ]}
        />
      </Box>

      <Paper sx={{ maxWidth: 900, p: { xs: 3, sm: 5 }, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
              {staff.name ?? "Staff member"}
            </Typography>
            <Typography color="text.secondary">
              Staff ID: {staff.staffId ?? "N/A"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/admin/staff")}
          >
            Back to staff
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          <Detail label="Email" value={staff.email} />
          <Detail label="Phone" value={staff.phone} />
          <Detail label="Location" value={staff.location} />
          <Detail label="Role" value={staff.role} />
          <Detail
            label="Status"
            value={staff.isActive === false ? "Inactive" : "Active"}
          />
          <Detail label="Assigned clients" value={staff.totalClients} />
          <Detail label="Created at" value={formatCreatedAt(staff.createdAt)} />
        </Box>
        <Divider sx={{ my: 4 }} />

        <Performance staffId={staff.staffId} />
      </Paper>
    </Box>
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ mt: 0.5, fontWeight: 500 }}>
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

function StatusMessage({ message }: { message: string }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
