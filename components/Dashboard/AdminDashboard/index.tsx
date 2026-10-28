"use client";
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Breadcrumb from "@/components/Breadcrumb";
import { useAdminDashboard } from "./hook";
import DashboardHeader from "./DashboardHeader";
import DashboardFilters from "./DashboardFilters";
import OverviewCards from "./OverviewCards";
import MonthlyTarget from "./MonthlyTarget";
import StaffRanking from "./StaffRanking";
import StageBreakdown from "./StageBreakdown";
import PaymentsTable from "./PaymentsTable";
import CollectionTrend from "./charts/CollectionTrend";
import StaffPerformance from "./charts/StaffPerformance";
import PaymentMethods from "./charts/PaymentMethods";
import PaymentStatus from "./charts/PaymentStatus";
const BRAND = "#107A64";
const BRAND_BRIGHT = "#1E9A7C";
const CANVAS = "#F2F6F3";
const RADIUS = 20;

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.35,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
      style={{ minWidth: 0, display: "flow-root" }}
    >
      {children}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");
  const data = useAdminDashboard();
  const [showFilters, setShowFilters] = useState(false);
  const { overview, isLoading, isFetching, loadError, refetch } = data;
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          bgcolor: CANVAS,
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }
  if (!overview) {
    return (
      <Box sx={{ minHeight: "60vh", bgcolor: CANVAS, p: { xs: 2, md: 4 } }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              disabled={isFetching}
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          }
          sx={{ maxWidth: 1320, mx: "auto", borderRadius: `${RADIUS}px` }}
        >
          {loadError || "Dashboard data is unavailable. Please try again."}
        </Alert>
      </Box>
    );
  }
  const dashboardData = { ...data, overview };
  return (
    <Box
      sx={{
        bgcolor: CANVAS,
        minHeight: "100vh",
        px: {
          xs: 1.5,
          sm: 3,
          md: 4,
        },
        py: {
          xs: 2.5,
          md: 4,
        },
      }}
    >
      {isFetching && (
        <LinearProgress
          aria-label="Updating dashboard"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            zIndex: (theme) => theme.zIndex.appBar + 1,
            bgcolor: "transparent",
            "& .MuiLinearProgress-bar": {
              bgcolor: BRAND_BRIGHT,
            },
          }}
        />
      )}

      <Box
        sx={{
          maxWidth: 1320,
          mx: "auto",
        }}
      >
        {/* =================================================
        BREADCRUMB
        ================================================= */}

        <Box
          sx={{
            mb: 2,
          }}
        >
          <Breadcrumb
            items={[
              {
                label: t("dashboard"),
                current: true,
              },
            ]}
          />
        </Box>

        <AnimatedSection>
          <DashboardHeader data={dashboardData} />
        </AnimatedSection>

        {loadError && (
          <Alert
            severity="error"
            sx={{
              mt: 2.5,
              borderRadius: `${RADIUS}px`,
              border: "1px solid rgba(211,47,47,0.14)",
            }}
          >
            {loadError}
          </Alert>
        )}

        <AnimatedSection delay={0.04}>
          <DashboardFilters
            data={dashboardData}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((open) => !open)}
          />
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <OverviewCards data={dashboardData} />
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <MonthlyTarget data={dashboardData} />
        </AnimatedSection>

        {/* =================================================
        CHARTS
        ================================================= */}

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.6fr) minmax(0, 1fr)",
            },
          }}
        >
          <AnimatedSection>
            <CollectionTrend data={dashboardData} />
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <StaffPerformance data={dashboardData} />
          </AnimatedSection>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          <AnimatedSection>
            <PaymentMethods data={dashboardData} />
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <PaymentStatus data={dashboardData} />
          </AnimatedSection>
        </Box>

        <AnimatedSection>
          <StaffRanking data={dashboardData} />
        </AnimatedSection>

        <AnimatedSection>
          <StageBreakdown data={dashboardData} />
        </AnimatedSection>

        <AnimatedSection>
          <PaymentsTable data={dashboardData} />
        </AnimatedSection>
      </Box>
    </Box>
  );
}
