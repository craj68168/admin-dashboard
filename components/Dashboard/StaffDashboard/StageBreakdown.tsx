"use client";

import { useTranslations } from "next-intl";
import { useStageLabel } from "./useStageLabel";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { StaffStageBreakdown } from "./type";
import { BRAND, BRAND_LIGHT, INK_BODY, INK_MUTED, card, sectionTitleSx } from "./shared";

type Props = { stageBreakdown: StaffStageBreakdown[] };

export default function StageBreakdown({ stageBreakdown }: Props) {
  const t = useTranslations("staffDashboard");
  const stageLabel = useStageLabel();

  const stageMax = Math.max(1, ...stageBreakdown.map((s) => s.count));

  return (
    <Paper elevation={0} sx={{ ...card, p: { xs: 2, md: 2.5 } }}>
      <Typography sx={sectionTitleSx}>{t("myClientProgress")}</Typography>

      {stageBreakdown.length === 0 ? (
        <Typography sx={{ mt: 1.5, fontSize: 13, color: INK_MUTED }}>
          {t("noAssignedClients")}
        </Typography>
      ) : (
        <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {stageBreakdown.map((item) => (
            <Box key={item.stage || item.stageName}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontSize: 12.5, color: INK_BODY }}>{stageLabel(item.stageName)}</Typography>

                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: BRAND }}>
                  {item.count}
                </Typography>
              </Box>

              <Box sx={{ height: 5, borderRadius: 999, bgcolor: "rgba(15,23,42,0.06)", overflow: "hidden" }}>
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
