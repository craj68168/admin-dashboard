"use client";

import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumb from "@/components/Breadcrumb";
import { useStaffDashboard } from "./hook";
import { BRAND, PAGE_BG } from "./shared";
import DashboardHeader from "./DashboardHeader";
import MonthlyPerformance from "./MonthlyPerformance";
import OverviewCards from "./OverviewCards";
import StageBreakdown from "./StageBreakdown";
import CollectionSummary from "./CollectionSummary";
import RecentClients from "./RecentClients";
import RecentPayments from "./RecentPayments";

export default function StaffDashboard() {
  const t = useTranslations("staffDashboard");
  const {
    selectedMonth,
    handleMonthChange,
    staff,
    overview,
    stageBreakdown,
    recentClients,
    recentPayments,
    isLoading,
    isFetching,
    loadError,
    handleClientClick,
  } = useStaffDashboard();

  if (isLoading || !staff || !overview) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center", bgcolor: PAGE_BG }}>
        <CircularProgress aria-label={t("loading")} size={28} sx={{ color: BRAND }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: PAGE_BG,
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto" }}>
        <Box sx={{ mb: 2 }}>
          <Breadcrumb items={[{ label: t("dashboard"), current: true }]} />
        </Box>

        <DashboardHeader staff={staff} selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />

        {loadError && (
          <Alert severity="error" sx={{ mt: 2.5, borderRadius: 3 }}>
            {t("loadFailed")}
          </Alert>
        )}

        <MonthlyPerformance overview={overview} selectedMonth={selectedMonth} isFetching={isFetching} />
        <OverviewCards overview={overview} />

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            alignItems: "stretch",
          }}
        >
          <StageBreakdown stageBreakdown={stageBreakdown} />
          <CollectionSummary overview={overview} />
        </Box>

        <RecentClients clients={recentClients} onClientClick={handleClientClick} />
        <RecentPayments payments={recentPayments} onClientClick={handleClientClick} />
      </Box>
    </Box>
  );
}
