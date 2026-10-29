"use client";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import type { useAdminDashboard } from "./hook";
type Props = {
  data: Pick<ReturnType<typeof useAdminDashboard>, "overview"> & {
    overview: NonNullable<ReturnType<typeof useAdminDashboard>["overview"]>;
  };
};
const BRAND = "#107A64";
const BRAND_BRIGHT = "#1E9A7C";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.20)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#0F172A";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;
const NUMERIC = {
  fontVariantNumeric: "tabular-nums",
};
const softCard = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },
  borderRadius: `${RADIUS}px`,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
};
const cardLift = {
  transition:
    "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
  "@media (hover: hover)": {
    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: BRAND_LINE,
      boxShadow:
        "0 1px 2px rgba(15,23,42,0.04), 0 26px 52px -30px rgba(15,23,42,0.38)",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": {
      transform: "none",
    },
  },
};
const labelSx = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.3,
  color: INK_MUTED,
};
const valueSx = {
  mt: 0.75,
  fontSize: { xs: 24, md: 26 },
  fontWeight: 700,
  letterSpacing: -0.6,
  color: INK,
  lineHeight: 1.2,
  overflowWrap: "anywhere",
  ...NUMERIC,
};
const amountFormatter = new Intl.NumberFormat("ja-JP");
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));
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
        ...softCard,
        ...cardLift,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: "0 auto auto 0",
          width: "100%",
          height: 3,
          background: `linear-gradient(90deg, ${BRAND_BRIGHT}, rgba(16,122,100,0))`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={labelSx}>{label}</Typography>

          <Typography sx={valueSx}>{value}</Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.75,
                fontSize: 12,
                color: INK_MUTED,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            width: 44,
            height: 44,
            borderRadius: 3,
            bgcolor: BRAND_SOFT,
            border: "1px solid",
            borderColor: BRAND_LINE,
            color: BRAND,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}
export default function OverviewCards({ data }: Props) {
  const { overview } = data;
  const t = useTranslations("adminDashboard");
  return (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(4, minmax(0, 1fr))",
        },
      }}
    >
      <SummaryCard
        label={t("totalClients")}
        value={String(overview.totalClients)}
        subtitle={`${overview.monthlyClientCount} paying clients in selected month`}
        icon={<PeopleAltOutlinedIcon fontSize="small" />}
      />

      <SummaryCard
        label={t("activeStaff")}
        value={String(overview.activeStaff)}
        subtitle={`${overview.totalStaff} total staff`}
        icon={<BadgeOutlinedIcon fontSize="small" />}
      />

      <SummaryCard
        label="Collected This Month"
        value={`¥${formatAmount(overview.monthlyCollected)}`}
        subtitle={`${overview.monthlyPaymentCount} completed payments`}
        icon={<PaymentsOutlinedIcon fontSize="small" />}
      />

      <SummaryCard
        label="Total Collected"
        value={`¥${formatAmount(overview.totalCollectedAllTime)}`}
        subtitle={`${overview.totalCompletedPayments} completed payments · ${overview.totalPayingClients} clients`}
        icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
      />
    </Box>
  );
}
