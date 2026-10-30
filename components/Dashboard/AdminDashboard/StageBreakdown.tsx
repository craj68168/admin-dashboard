"use client";
import { createTranslator, useLocale } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import type { useAdminDashboard } from "./hook";

const messages = {
  en: {
    legacyPayment: "Legacy Payment",
    clientProgress: "Client Progress",
    noClientData: "No client data yet.",
    stageRegistrationPending: "Registration Pending",
    stageRegisteredVacancySearching: "Registered / Vacancy Searching",
    stageInterviewPreparation: "Interview Fixed / Preparation",
    stageInterviewFailed: "Interview Failed",
    stageJobOfferReceived: "Naitei / Job Offer Received",
    stageVisaDocumentsSubmitted: "Visa Documents Submitted",
    stageVisaResultWaiting: "Visa Applied / Result Waiting",
    stageVisaApproved: "Visa Approved",
    stageVisaRejected: "Visa Rejected",
    stageCompanyJoining: "Waiting for Nyusha / Company Joining",
    stageReturnToNepal: "Return to Nepal"
  },
  ja: {
    legacyPayment: "過去の入金",
    clientProgress: "顧客進捗",
    noClientData: "顧客データはまだありません。",
    stageRegistrationPending: "登録待ち",
    stageRegisteredVacancySearching: "登録済み / 求人検索中",
    stageInterviewPreparation: "面接確定 / 準備中",
    stageInterviewFailed: "面接不合格",
    stageJobOfferReceived: "内定 / オファー受領",
    stageVisaDocumentsSubmitted: "ビザ書類提出済み",
    stageVisaResultWaiting: "ビザ申請済み / 結果待ち",
    stageVisaApproved: "ビザ承認",
    stageVisaRejected: "ビザ却下",
    stageCompanyJoining: "入社待ち",
    stageReturnToNepal: "ネパールへ帰国"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
}

type Props = {
  data: Pick<ReturnType<typeof useAdminDashboard>, "stageBreakdown">;
};
const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.20)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#0F172A";
const INK_BODY = "#334155";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;
const NUMERIC = {
  fontVariantNumeric: "tabular-nums",
};
const softCard = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },
  borderRadius: `${RADIUS}px`,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
};
const cardLift = {
  transition:
    "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
  "@media (hover: hover)": {
    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: BRAND_LINE,
      boxShadow:
        "0 1px 2px rgba(15,23,42,0.04), 0 26px 52px -30px rgba(15,23,42,0.38)",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:hover": {
      transform: "none",
    },
  },
};
function StageRow({
  name,
  count,
  max,
}: {
  name: string;
  count: number;
  max: number;
}) {
  const width = max > 0 ? Math.max((count / max) * 100, 4) : 0;
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: HAIRLINE,
        bgcolor: "#FBFDFC",
        transition: "border-color 240ms ease, background-color 240ms ease",
        "&:hover": {
          borderColor: BRAND_LINE,
          bgcolor: "rgba(16, 122, 100, 0.04)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: INK_BODY,
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: BRAND,
            flexShrink: 0,
            ...NUMERIC,
          }}
        >
          {count}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 1.25,
          height: 6,
          borderRadius: 999,
          bgcolor: "rgba(17, 24, 39, 0.06)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${width}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, #7BC9B0, ${BRAND})`,
            transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none",
            },
          }}
        />
      </Box>
    </Box>
  );
}
export default function StageBreakdown({ data }: Props) {
  const { stageBreakdown } = data;
  const t = useLocalTranslations();
  const maxStageCount = stageBreakdown.reduce(
    (highest, item) => Math.max(highest, item.count || 0),
    0,
  );
  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        ...cardLift,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 34,
            height: 34,
            borderRadius: 2.5,
            bgcolor: BRAND_SOFT,
            color: BRAND,
          }}
        >
          <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>

        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: -0.2,
            color: INK,
          }}
        >
          {t("clientProgress")}
        </Typography>
      </Box>

      {stageBreakdown.length === 0 ? (
        <Typography
          sx={{
            mt: 2,
            fontSize: 14,
            color: INK_MUTED,
          }}
        >
          {t("noClientData")}
        </Typography>
      ) : (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 1.25,
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
            },
          }}
        >
          {stageBreakdown.map((item) => (
            <StageRow
              key={item.stage || item.stageName}
              name={translateStage(item.stageName, t)}
              count={item.count}
              max={maxStageCount}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}

function translateStage(name: string, t: ReturnType<typeof useLocalTranslations>) {
  // Stage masters can contain custom names; translate only recognized labels.
  const key = Object.entries(messages.en).find(([key, value]) =>
    (key.startsWith("stage") || key === "legacyPayment") && value === name,
  )?.[0];
  return key ? t(key as keyof typeof messages.en) : name;
}
