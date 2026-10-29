"use client";

import { useTranslations } from "next-intl";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { StaffDashboardUser } from "./type";
import { BRAND, BRAND_SOFT, INK, INK_MUTED, initials } from "./shared";

type Props = {
  staff: StaffDashboardUser;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
};

export default function DashboardHeader({ staff, selectedMonth, onMonthChange: handleMonthChange }: Props) {
  const t = useTranslations("staffDashboard");

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 52,
            height: 52,
            bgcolor: BRAND,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {initials(staff.name)}
        </Avatar>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 22, md: 28 },
              fontWeight: 700,
              letterSpacing: -0.6,
              color: INK,
              lineHeight: 1.2,
            }}
          >
            {t("welcome", { name: staff.name })}
          </Typography>
          <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Chip
              size="small"
              label={staff.staffId}
              sx={{
                height: 22,
                fontSize: 12,
                fontWeight: 600,
                bgcolor: BRAND_SOFT,
                color: BRAND,
                borderRadius: 1.5,
              }}
            />
            <Typography sx={{ fontSize: 14, color: INK_MUTED }}>
              {t("description")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <TextField
        type="month"
        size="small"
        label={t("performanceMonth")}
        value={selectedMonth}
        onChange={(event) => handleMonthChange(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{
          width: { xs: "100%", sm: 220 },
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#ffffff",
            "& fieldset": { borderColor: "rgba(15, 23, 42, 0.12)" },
            "&:hover fieldset": { borderColor: "rgba(16, 122, 100, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 1 },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: BRAND },
        }}
      />
    </Box>
  );
}
