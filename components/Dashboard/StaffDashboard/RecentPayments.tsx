"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { StaffRecentPayment } from "./type";
import { BRAND, HAIRLINE, INK, INK_MUTED, card, headCellSx, bodyCellSx, edgePl, edgePr, rowSx, yen, SectionHeader } from "./shared";

type Props = {
  payments: StaffRecentPayment[];
  onClientClick: (clientId: string) => void;
};

const formatJapanDate = (value: string, locale: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function RecentPayments({ payments: recentPayments, onClientClick: handleClientClick }: Props) {
  const t = useTranslations("staffDashboard");
  const locale = useLocale();
  const paymentMethodLabel = (method: string) => {
    switch (method) {
      case "Cash": return t("paymentMethods.cash");
      case "Bank Transfer": return t("paymentMethods.bankTransfer");
      case "Online Payment": return t("paymentMethods.onlinePayment");
      case "Cheque": return t("paymentMethods.cheque");
      case "Other": return t("paymentMethods.other");
      default: return method;
    }
  };
  return (
    <Paper elevation={0} sx={{ ...card, mt: 2, overflow: "hidden" }}>
      <SectionHeader title={t("myRecentCollections")} aside={t("fullStagePaymentsCredited")} />
      <TableContainer>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, ...edgePl }}>{t("date")}</TableCell>
              <TableCell sx={headCellSx}>{t("client")}</TableCell>
              <TableCell sx={headCellSx}>{t("stage")}</TableCell>
              <TableCell sx={headCellSx}>{t("method")}</TableCell>
              <TableCell sx={{ ...headCellSx, ...edgePr }} align="right">
                {t("amount")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentPayments.map((payment) => (
              <TableRow key={payment._id} hover={false} sx={rowSx}>
                <TableCell sx={{ ...bodyCellSx, ...edgePl, color: INK_MUTED, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                  {formatJapanDate(payment.paymentDate, locale)}
                </TableCell>
                <TableCell sx={bodyCellSx}>
                  <Typography
                    component="span"
                    onClick={() => handleClientClick(payment.clientId)}
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: BRAND,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {payment.clientId}
                  </Typography>
                </TableCell>
                <TableCell sx={bodyCellSx}>{payment.stageName}</TableCell>
                <TableCell sx={bodyCellSx}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={paymentMethodLabel(payment.paymentMethod)}
                    sx={{ borderRadius: 1.5, fontSize: 12, color: INK_MUTED, borderColor: HAIRLINE }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ ...bodyCellSx, ...edgePr, fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums" }}
                >
                  {yen(payment.amountPaid)}
                </TableCell>
              </TableRow>
            ))}

            {recentPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ ...bodyCellSx, py: 6, color: INK_MUTED, borderBottom: 0 }}>
                  {t("noCollections")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
