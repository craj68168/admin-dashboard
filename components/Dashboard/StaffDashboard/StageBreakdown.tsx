"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { StaffStageBreakdown } from "./type";
import { BRAND, BRAND_LIGHT, INK_BODY, INK_MUTED, card, sectionTitleSx } from "./shared";

type Props = { stageBreakdown: StaffStageBreakdown[] };

export default function StageBreakdown({ stageBreakdown }: Props) {
  const t = useTranslations("staffDashboard");
  const stageMax = Math.max(1, ...stageBreakdown.map((s) => s.count));
  return (
    <Paper elevation={0} sx={{ ...card, p: { xs: 2.5, md: 3 } }}>
      <Typography sx={sectionTitleSx}>{t("myClientProgress")}</Typography>

      {stageBreakdown.length === 0 ? (
        <Typography sx={{ mt: 2, fontSize: 14, color: INK_MUTED }}>
          {t("noAssignedClients")}
        </Typography>
      ) : (
        <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 1.75 }}>
          {stageBreakdown.map((item) => (
            <Box key={item.stage || item.stageName}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, mb: 0.75 }}>
                <Typography sx={{ fontSize: 13, color: INK_BODY }}>{item.stageName}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: BRAND }}>
                  {item.count}
                </Typography>
              </Box>
              <Box sx={{ height: 6, borderRadius: 999, bgcolor: "rgba(15,23,42,0.06)", overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${(item.count / stageMax) * 100}%`,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${BRAND_LIGHT}, ${BRAND})`,
                    transition: "width 600ms ease",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
