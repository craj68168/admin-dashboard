"use client";

import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatNpr } from "@/data/sales-demo";
import { usePerformanceData } from "./hook";

export default function PerformancePage() {
  const { data, isLoading } = usePerformanceData();
  const totalTarget = data?.totalTarget ?? 0;
  const totalCollected = data?.totalCollected ?? 0;
  const overallProgress = data?.overallProgress ?? 0;

  return (
    <Box
      component="main"
      sx={{
        minHeight: "calc(100vh - 72px)",
        bgcolor: "#F8FAFC",
        px: { xs: 2, sm: 3, lg: 4 },
        py: 3,
      }}
    >
      <Box sx={{ maxWidth: 1500, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 4,
            justifyContent: "space-between",
            alignItems: { sm: "flex-end" },
          }}
        >
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#2563EB",
              }}
            >
              Performance workspace
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 28, sm: 36 },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#0F172A",
              }}
            >
              Staff collection targets
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 14, color: "#64748B" }}>
              Measure collected revenue against each staff member&apos;s monthly
              target.
            </Typography>
          </Box>
          <Chip
            label="September 2026"
            sx={{ bgcolor: "#ECFDF5", color: "#047857", fontWeight: 700 }}
          />
        </Stack>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            overflow: "hidden",
            borderRadius: 2,
            bgcolor: "#0F172A",
            color: "#FFF",
            p: { xs: 3, sm: 4 },
            boxShadow: "0 12px 32px rgba(15,23,42,0.14)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{
              justifyContent: "space-between",
              alignItems: { sm: "center" },
            }}
          >
            <Box>
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: "#CBD5E1" }}
              >
                Team collection progress
              </Typography>
              <Typography sx={{ mt: 1, fontSize: 40, fontWeight: 700 }}>
                {isLoading ? "..." : `${overallProgress}%`}
              </Typography>
              <Typography sx={{ mt: 1, fontSize: 14, color: "#CBD5E1" }}>
                {formatNpr(totalCollected)} collected of{" "}
                {formatNpr(totalTarget)} target
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 96,
                height: 96,
                border: "8px solid rgba(96,165,250,0.3)",
                borderTopColor: "#60A5FA",
                borderRadius: "50%",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {overallProgress}%
            </Box>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(overallProgress, 100)}
            sx={{
              mt: 3.5,
              height: 10,
              borderRadius: 5,
              bgcolor: "rgba(255,255,255,0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                bgcolor: "#60A5FA",
              },
            }}
          />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            borderRadius: 2,
            boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
          }}
        >
          <Stack
            direction="row"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderBottom: "1px solid #F1F5F9",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                component="h2"
                sx={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}
              >
                Monthly leaderboard
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 14, color: "#64748B" }}>
                Attributed revenue is based on actual collections.
              </Typography>
            </Box>
            <EmojiEventsRoundedIcon sx={{ color: "#F59E0B" }} />
          </Stack>
          <Stack divider={<Box sx={{ borderBottom: "1px solid #F1F5F9" }} />}>
            {(data?.staff ?? []).map((staff, index) => {
              const progress = Math.round(
                (staff.collected / staff.target) * 100,
              );
              const remaining = Math.max(staff.target - staff.collected, 0);
              return (
                <Box key={staff.staffId} sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2.5}
                    sx={{ alignItems: { sm: "center" } }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{
                        width: { sm: 224 },
                        flexShrink: 0,
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: 1.5,
                          bgcolor: "#F1F5F9",
                          color: "#64748B",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#1E293B" }}>
                          {staff.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>
                          {staff.staffId}
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ flex: 1, width: "100%" }}>
                      <Stack
                        direction="row"
                        sx={{ mb: 1, justifyContent: "space-between" }}
                      >
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          {formatNpr(staff.collected)} collected
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: progress >= 100 ? "#059669" : "#2563EB",
                          }}
                        >
                          {progress}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(progress, 100)}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "#F1F5F9",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            bgcolor: progress >= 100 ? "#10B981" : "#3B82F6",
                          },
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: { sm: 150 },
                        textAlign: { xs: "left", sm: "right" },
                        flexShrink: 0,
                      }}
                    >
                      <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>
                        Target {formatNpr(staff.target)}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#475569",
                        }}
                      >
                        {remaining
                          ? `${formatNpr(remaining)} remaining`
                          : "Target exceeded"}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Paper>

        <Link href="/admin/revenue">
          <Typography
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mt: 3,
              fontSize: 14,
              fontWeight: 600,
              color: "#2563EB",
              "&:hover": { color: "#1D4ED8" },
            }}
          >
            Review billing and collections{" "}
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
