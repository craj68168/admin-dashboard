"use client";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { useAdminDashboard } from "./hook";
type Props = {
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    "selectedMonth" | "handleMonthChange"
  >;
};
const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.20)";
const INK = "#0F172A";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: `${RADIUS - 4}px`,
    bgcolor: "#ffffff",
    "& fieldset": {
      borderColor: "rgba(17, 24, 39, 0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.40)",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: 1,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
};
export default function DashboardHeader({ data }: Props) {
  const { selectedMonth, handleMonthChange } = data;
  const t = useTranslations("adminDashboard");
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 2.5,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: BRAND_SOFT,
            border: "1px solid",
            borderColor: BRAND_LINE,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: BRAND,
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: BRAND_DEEP,
            }}
          >
            {selectedMonth}
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            mt: 1.25,
            fontSize: {
              xs: 24,
              sm: 28,
              md: 32,
            },
            fontWeight: 700,
            letterSpacing: -0.8,
            lineHeight: 1.2,
            color: INK,
          }}
        >
          {t("title")}
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            fontSize: 14,
            color: INK_MUTED,
            maxWidth: 620,
            lineHeight: 1.6,
          }}
        >
          {t("description")}
        </Typography>
      </Box>

      <TextField
        type="month"
        size="small"
        label={t("performanceMonth")}
        value={selectedMonth}
        onChange={(event) => handleMonthChange(event.target.value)}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{
          ...fieldSx,
          width: {
            xs: "100%",
            sm: 220,
          },
        }}
      />
    </Box>
  );
}
