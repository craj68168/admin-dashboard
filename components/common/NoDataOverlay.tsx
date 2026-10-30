"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { createTranslator, useLocale } from "next-intl";

const messages = {
  en: {
    title: "No data found",
    description: "There are no records to display yet.",
    logoAlt: "Fortune Link logo",
  },
  ja: {
    title: "データが見つかりません",
    description: "表示するデータはまだありません。",
    logoAlt: "Fortune Linkのロゴ",
  },
};

export default function NoDataOverlay() {
  const locale = useLocale();
  const t = createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 150,
        gap: 1,
        px: 2,
        textAlign: "center",
      }}
    >
      <Image
        src="/company_logo.png"
        alt={t("logoAlt")}
        width={112}
        height={112}
        unoptimized
        style={{ objectFit: "contain", opacity: 0.7, display: "block" }}
      />
      <Typography sx={{ color: "#475569", fontSize: "14px", fontWeight: 600 }}>
        {t("title")}
      </Typography>
      <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>
        {t("description")}
      </Typography>
    </Box>
  );
}
