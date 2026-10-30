"use client";

import { createTranslator, useLocale } from "next-intl";
import Typography from "@mui/material/Typography";

const messages = {
  en: {
    clients: "clients",
    empty: "No {itemLabel} found",
    range: "Showing {from, number} to {to, number} of {count, number} {itemLabel}",
  },
  ja: {
    clients: "顧客",
    empty: "{itemLabel}が見つかりません",
    range: "{itemLabel}：全{count, number}（{from, number}〜{to, number}を表示）",
  },
};

type PaginationRowsLabelProps = {
  count: number;
  from: number | null;
  to: number | null;
  itemLabel?: string;
};

export default function PaginationRowsLabel({
  count,
  from,
  to,
  itemLabel,
}: PaginationRowsLabelProps) {
  const locale = useLocale();
  const t = createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
  const label = itemLabel ?? t("clients");

  if (count === 0 || from === null || to === null) {
    return (
      <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
        {t("empty", { itemLabel: label })}
      </Typography>
    );
  }

  return (
    <Typography variant="body2" sx={{ color: "#4B5563", fontWeight: 500 }}>
      {t("range", { from, to, count, itemLabel: label })}
    </Typography>
  );
}
