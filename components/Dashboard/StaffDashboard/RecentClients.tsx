"use client";

import { useTranslations } from "next-intl";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import type { StaffRecentClient } from "./type";
import { BRAND, BRAND_DEEP, BRAND_SOFT, INK, INK_MUTED, card, headCellSx, bodyCellSx, edgePl, edgePr, rowSx, initials, SectionHeader } from "./shared";

type Props = {
  clients: StaffRecentClient[];
  onClientClick: (clientId: string) => void;
};

export default function RecentClients({ clients: recentClients, onClientClick: handleClientClick }: Props) {
  const t = useTranslations("staffDashboard");
  const visaT = useTranslations("createClient.options.currentVisaStatus");
  const visaLabel = (value?: string) => {
    if (!value) return "-";
    const key = value === "intra-companyTransferee" ? "intraCompanyTransferee" : value;
    return visaT.has(key) ? visaT(key) : value;
  };
  return (
    <Paper elevation={0} sx={{ ...card, mt: 2, overflow: "hidden" }}>
      <SectionHeader title={t("myRecentClients")} />
      <TableContainer>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, ...edgePl }}>{t("name")}</TableCell>
              <TableCell sx={headCellSx}>{t("client")}</TableCell>
              <TableCell sx={headCellSx}>{t("visaStatus")}</TableCell>
              <TableCell sx={headCellSx}>{t("currentStage")}</TableCell>
              <TableCell sx={{ ...headCellSx, ...edgePr, width: 40 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {recentClients.map((client) => (
              <TableRow
                key={client.clientId}
                hover={false}
                sx={{ ...rowSx, cursor: "pointer", "&:hover .row-arrow": { color: BRAND, transform: "translateX(2px)" } }}
                onClick={() => handleClientClick(client.clientId)}
              >
                <TableCell sx={{ ...bodyCellSx, ...edgePl }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: BRAND_SOFT,
                        color: BRAND,
                      }}
                    >
                      {initials(client.fullName)}
                    </Avatar>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: INK }}>
                      {client.fullName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, color: INK_MUTED, fontVariantNumeric: "tabular-nums" }}>
                  {client.clientId}
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, color: INK_MUTED }}>
                  {visaLabel(client.currentVisaStatus)}
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Chip
                    size="small"
                    label={client.currentStageName}
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 600,
                      fontSize: 12,
                      bgcolor: BRAND_SOFT,
                      color: BRAND_DEEP,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ ...bodyCellSx, ...edgePr }}>
                  <ChevronRightRoundedIcon
                    className="row-arrow"
                    fontSize="small"
                    sx={{ color: "rgba(15,23,42,0.25)", transition: "all 160ms ease", display: "block" }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {recentClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ ...bodyCellSx, py: 6, color: INK_MUTED, borderBottom: 0 }}>
                  {t("noAssignedClients")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
