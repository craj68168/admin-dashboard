"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const BRAND = "#107A64";

export const BRAND_DEEP = "#0B5546";

export const BRAND_LIGHT = "#7FD1B5";

export const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";

export const PAGE_BG = "#F4F6F3";

export const HAIRLINE = "rgba(17, 24, 39, 0.07)";

export const INK = "#0F172A";

export const INK_BODY = "#1F2937";

export const INK_MUTED = "#64748B";

export const card = {
  borderRadius: 4,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
};

export const sectionTitleSx = {
  fontSize: 16,
  fontWeight: 700,
  color: INK,
  letterSpacing: -0.2,
};

export const headCellSx = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.7,
  textTransform: "uppercase",
  color: INK_MUTED,
  bgcolor: "#FAFBFA",
  borderBottomColor: HAIRLINE,
  py: 1.25,
  whiteSpace: "nowrap",
};

export const bodyCellSx = {
  fontSize: 14,
  color: INK_BODY,
  borderBottomColor: "rgba(15, 23, 42, 0.05)",
  py: 1.5,
};

export const edgePl = { pl: { xs: 2.5, md: 3 } };

export const edgePr = { pr: { xs: 2.5, md: 3 } };

export const rowSx = {
  transition: "background-color 160ms ease",
  "&:hover": { bgcolor: "rgba(16, 122, 100, 0.035)" },
  "&:last-of-type td": { borderBottom: 0 },
};

export const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

export const yen = (value: number) => `¥${formatAmount(value)}`;

export const initials = (name?: string) =>
  (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function SectionHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <Box
      sx={{
        px: { xs: 2.5, md: 3 },
        py: 2,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <Typography sx={sectionTitleSx}>{title}</Typography>
      {aside && (
        <Typography sx={{ fontSize: 12, color: INK_MUTED }}>{aside}</Typography>
      )}
    </Box>
  );
}
