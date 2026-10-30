"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { StaffDashboardOverview } from "./type";
import { BRAND, BRAND_SOFT, INK, INK_MUTED, card, sectionTitleSx, yen } from "./shared";

type Props = { overview: Pick<StaffDashboardOverview, "allTimeCollected" | "allTimePaymentCount" | "allTimePayingClientCount"> };

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Box
      sx={{
        flex: "1 1 140px",
        p: 2,
        borderRadius: 3,
        bgcolor: accent ? BRAND_SOFT : "#F8FAF9",
      }}
    >
      <Typography sx={{ fontSize: 12, color: INK_MUTED }}>{label}</Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 20,
          fontWeight: 700,
          color: accent ? BRAND : INK,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function CollectionSummary({ overview }: Props) {
  const t = useTranslations("staffDashboard");

  return (
    <Paper elevation={0} sx={{ ...card, p: { xs: 2.5, md: 3 } }}>
      <Typography sx={sectionTitleSx}>{t("collectionSummary")}</Typography>
      <Typography sx={{ mt: 0.5, fontSize: 12, color: INK_MUTED }}>{t("allTime")}</Typography>
      <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        <MiniStat label={t("allTimeCollected")} value={yen(overview.allTimeCollected)} accent />
        <MiniStat label={t("completedPayments")} value={String(overview.allTimePaymentCount)} />
        <MiniStat label={t("payingClientsLabel")} value={String(overview.allTimePayingClientCount)} />
      </Box>
    </Paper>
  );
}
