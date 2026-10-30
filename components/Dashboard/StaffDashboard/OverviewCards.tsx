"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import type { StaffDashboardOverview } from "./type";
import { BRAND, BRAND_SOFT, INK, INK_MUTED, card, yen } from "./shared";

type Props = { overview: StaffDashboardOverview };

type SummaryCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
};

function SummaryCard({ label, value, subtitle, icon }: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...card,
        p: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "border-color 200ms ease, transform 200ms ease",
        "&:hover": {
          borderColor: "rgba(16,122,100,0.30)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: BRAND_SOFT,
            color: BRAND,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: INK_MUTED }}>
          {label}
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 26,
            fontWeight: 700,
            color: INK,
            letterSpacing: -0.6,
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.75, fontSize: 12, color: INK_MUTED }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default function OverviewCards({ overview }: Props) {
  const t = useTranslations("staffDashboard");

  return (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
      }}
    >
      <SummaryCard
        label={t("assignedClients")}
        value={String(overview.totalAssignedClients)}
        subtitle={t("currentlyAssigned")}
        icon={<GroupsOutlinedIcon fontSize="small" />}
      />
      <SummaryCard
        label={t("collectedThisMonth")}
        value={yen(overview.totalCollected)}
        subtitle={t("payingClients", { count: overview.payingClientCount })}
        icon={<PaymentsOutlinedIcon fontSize="small" />}
      />
      <SummaryCard
        label={t("completedPayments")}
        value={String(overview.paymentCount)}
        subtitle={t("completedAllTime", { count: overview.allTimePaymentCount })}
        icon={<ReceiptLongOutlinedIcon fontSize="small" />}
      />
      <SummaryCard
        label={t("monthlyTarget")}
        value={yen(overview.targetAmount)}
        subtitle={t("achieved", { percentage: overview.achievementPercentage })}
        icon={<TrackChangesOutlinedIcon fontSize="small" />}
      />
    </Box>
  );
}
