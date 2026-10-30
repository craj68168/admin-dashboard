"use client";
import type { ReactNode } from "react";
import { createTranslator, useLocale } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import type { useAdminDashboard } from "./hook";
import type { DashboardPaymentStatus } from "./type";

const messages = {
  en: {
    legacyPayment: "Legacy Payment",
    payments: "Payments",
    client: "Client",
    stage: "Stage",
    amount: "Amount",
    method: "Method",
    status: "Status",
    staff: "Staff",
    date: "Date",
    emptyTitle: "No payments found",
    emptyBody: "Try another month or adjust the filters.",
    rowsPerPage: "Rows per page:",
    rowsPerPageAria: "Rows per page",
    paymentsFor: "Payments for {month}",
    count: "{count, plural, one {# payment} other {# payments}}",
    openClient: "Open client {hasName, select, true {{name}, } other {}}{id}",
    displayedRows: "{from}–{to} of {count}",
    knownCount: "{count, number}",
    unknownCount: "more than {to}",
    firstPage: "Go to first page",
    lastPage: "Go to last page",
    nextPage: "Go to next page",
    previousPage: "Go to previous page",
    cash: "Cash",
    bankTransfer: "Bank Transfer",
    onlinePayment: "Online Payment",
    cheque: "Cheque",
    other: "Other",
    completed: "Completed",
    cancelled: "Cancelled",
    refunded: "Refunded",
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
    payments: "入金一覧",
    client: "顧客",
    stage: "ステージ",
    amount: "金額",
    method: "支払方法",
    status: "ステータス",
    staff: "スタッフ",
    date: "日付",
    emptyTitle: "入金が見つかりません",
    emptyBody: "別の月を選択するか、絞り込み条件を変更してください。",
    rowsPerPage: "1ページの表示件数：",
    rowsPerPageAria: "1ページの表示件数",
    paymentsFor: "{month}の入金",
    count: "{count, number}件の入金",
    openClient: "顧客{hasName, select, true {{name}、} other {}}{id}の詳細を開く",
    displayedRows: "全{count}中 {from}–{to}件",
    knownCount: "{count, number}件",
    unknownCount: "{to}件以上",
    firstPage: "最初のページへ",
    lastPage: "最後のページへ",
    nextPage: "次のページへ",
    previousPage: "前のページへ",
    cash: "現金",
    bankTransfer: "銀行振込",
    onlinePayment: "オンライン決済",
    cheque: "小切手",
    other: "その他",
    completed: "完了",
    cancelled: "キャンセル",
    refunded: "返金済み",
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
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    | "selectedMonth"
    | "payments"
    | "paymentPagination"
    | "handlePaymentPageChange"
    | "handlePaymentLimitChange"
    | "handleClientClick"
  >;
};

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#0F172A";
const INK_BODY = "#334155";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;

const NUMERIC = { fontVariantNumeric: "tabular-nums" };

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
    borderRadius: "6px",
  },
};

const softCard = {
  p: { xs: 2, sm: 2.5, md: 3 },
  borderRadius: `${RADIUS}px`,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
};

// =================================================
// COPY (English / Japanese)
// =================================================

const amountFormatter = new Intl.NumberFormat("ja-JP");
const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));

type Copy = {
  payments: string;
  paymentsFor: (month: string) => string;
  count: (total: number) => string;
  client: string;
  stage: string;
  amount: string;
  method: string;
  status: string;
  staff: string;
  date: string;
  emptyTitle: string;
  emptyBody: string;
  methods: Record<string, string>;
  statuses: Record<string, string>;
  openClient: (name: string | undefined, id: string) => string;
  rowsPerPage: string;
  rowsPerPageAria: string;
  displayedRows: (info: { from: number; to: number; count: number }) => string;
  pageAria: (type: string) => string;
};

function useCopy() {
  const lang = useLocale();
  const t = useLocalTranslations();
  const c: Copy = {
    payments: t("payments"),
    client: t("client"),
    stage: t("stage"),
    amount: t("amount"),
    method: t("method"),
    status: t("status"),
    staff: t("staff"),
    date: t("date"),
    emptyTitle: t("emptyTitle"),
    emptyBody: t("emptyBody"),
    rowsPerPage: t("rowsPerPage"),
    rowsPerPageAria: t("rowsPerPageAria"),
    paymentsFor: (month) => t("paymentsFor", {month: formatMonth(month, lang)}),
    count: (count) => t("count", {count}),
    methods: {Cash: t("cash"), "Bank Transfer": t("bankTransfer"), "Online Payment": t("onlinePayment"), Cheque: t("cheque"), Other: t("other")},
    statuses: {Completed: t("completed"), Cancelled: t("cancelled"), Refunded: t("refunded")},
    openClient: (name, id) => t("openClient", {hasName: String(Boolean(name)), name: name || "", id}),
    displayedRows: ({from, to, count}) => t("displayedRows", {
      from,
      to,
      count: count === -1 ? t("unknownCount", {to}) : t("knownCount", {count}),
    }),
    pageAria: (type) => t(type === "first" ? "firstPage" : type === "last" ? "lastPage" : type === "next" ? "nextPage" : "previousPage"),
  };
  return {lang, c, t};
}

const formatJapanDate = (value: string, lang: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const initialsOf = (name: string | undefined, fallbackId: string) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length > 0) {
    const first = Array.from(parts[0])[0] ?? "";
    const last =
      parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? "") : "";
    return `${first}${last}`.toUpperCase();
  }
  return fallbackId.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
};

// =================================================
// RESPONSIVE RULES
//
// The table answers to the width of its own card (a CSS container query), not
// the screen. That matters because collapsing the sidebar changes the card's
// width without changing the screen's.
//
//   card width   columns shown
//   >= 860       Client, Stage, Amount, Method, Status, Staff, Date
//   640 - 859    Client, Stage, Amount (+ method), Status, Date (+ staff)
//   420 - 639    Client (+ stage, method, date, staff), Amount, Status
//   < 420        Client (+ details), Amount (+ status underneath)
//
// Nothing scrolls sideways and there is nothing to tap to expand.
// =================================================

const BP = { status: 420, mid: 640, wide: 860 } as const;

const atLeast = (width: number) =>
  `@container payments (min-width: ${width}px)`;

// A table cell that only appears from `width` up.
const cellFrom = (width: number) => ({
  display: "none",
  [atLeast(width)]: { display: "table-cell" },
});

// Theme body1/body2 are weight 500, so every cell sets its own weight.
const headCellSx = {
  fontSize: 12,
  fontWeight: 600,
  color: INK_MUTED,
  bgcolor: "rgba(16, 122, 100, 0.04)",
  borderBottomColor: HAIRLINE,
  py: 1.5,
  px: 1.5,
  whiteSpace: "nowrap",
};

const bodyCellSx = {
  fontSize: 14,
  fontWeight: 400,
  color: INK_BODY,
  borderBottomColor: "rgba(17, 24, 39, 0.05)",
  py: 1.5,
  px: 1.5,
  verticalAlign: "middle",
};

const edgeLeft = { pl: { xs: 2, sm: 2.5, md: 3 } };
const edgeRight = { pr: { xs: 2, sm: 2.5, md: 3 } };

// The Amount column is the last one on very narrow cards and Status is the last
// one a little wider, so each takes the outer padding until something follows.
const amountEdge = { pr: 2, [atLeast(BP.status)]: { pr: 1.5 } };
const statusEdge = {
  ...cellFrom(BP.status),
  pr: 2,
  [atLeast(BP.mid)]: { pr: 1.5 },
};

const rowSx = {
  transition: "background-color 160ms ease",
  "&:hover": { bgcolor: "rgba(16, 122, 100, 0.045)" },
  "&:last-of-type td": { borderBottom: 0 },
};

// Small text lines that stand in for a hidden column.
const smallLine = {
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.3,
  color: INK_MUTED,
};

// Method under the amount: only while the Method column is hidden but there is room.
const methodUnderAmount = {
  ...smallLine,
  display: "none",
  mt: 0.25,
  [atLeast(BP.mid)]: { display: "block" },
  [atLeast(BP.wide)]: { display: "none" },
};

// Staff under the date: same idea.
const staffUnderDate = {
  ...smallLine,
  display: "none",
  mt: 0.25,
  [atLeast(BP.mid)]: { display: "block" },
  [atLeast(BP.wide)]: { display: "none" },
};

// Status pill under the amount on the narrowest cards.
const pillUnderAmount = {
  display: "block",
  mt: 0.75,
  [atLeast(BP.status)]: { display: "none" },
};

// Stage / method / date / staff as one tidy line under the client on narrow cards.
const detailsUnderClient = {
  ...smallLine,
  display: "flex",
  flexWrap: "wrap",
  columnGap: 1.25,
  rowGap: 0.25,
  mt: 0.75,
  [atLeast(BP.mid)]: { display: "none" },
};

const paginationSx = {
  borderTop: `1px solid ${HAIRLINE}`,
  "& .MuiTablePagination-toolbar": {
    flexWrap: "wrap",
    justifyContent: { xs: "center", sm: "flex-end" },
    px: { xs: 1, sm: 2 },
  },
  "& .MuiTablePagination-spacer": {
    display: { xs: "none", sm: "block" },
  },
  "& .MuiTablePagination-selectLabel": {
    display: { xs: "none", sm: "block" },
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
    {
      fontSize: 13,
      fontWeight: 400,
      color: INK_MUTED,
      ...NUMERIC,
    },
};

// =================================================
// SMALL PIECES
// =================================================

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const paymentTone = (status: DashboardPaymentStatus): Tone => {
  if (status === "Completed") {
    return "success";
  }
  if (status === "Refunded") {
    return "warning";
  }
  if (status === "Cancelled") {
    return "danger";
  }
  return "neutral";
};

const PILL_TONES: Record<Tone, { bg: string; fg: string; line: string }> = {
  success: {
    bg: "rgba(16, 122, 100, 0.10)",
    fg: BRAND_DEEP,
    line: "rgba(16, 122, 100, 0.24)",
  },
  warning: {
    bg: "rgba(217, 119, 6, 0.10)",
    fg: "#92400E",
    line: "rgba(217, 119, 6, 0.26)",
  },
  danger: {
    bg: "rgba(190, 24, 60, 0.08)",
    fg: "#9F1239",
    line: "rgba(190, 24, 60, 0.22)",
  },
  info: {
    bg: "rgba(37, 99, 235, 0.08)",
    fg: "#1D4ED8",
    line: "rgba(37, 99, 235, 0.20)",
  },
  neutral: {
    bg: "rgba(15, 23, 42, 0.05)",
    fg: INK_MUTED,
    line: "rgba(15, 23, 42, 0.10)",
  },
};

function Pill({ label, tone }: { label: string; tone: Tone }) {
  const { c } = useCopy();
  const palette = PILL_TONES[tone] ?? PILL_TONES.neutral;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        bgcolor: palette.bg,
        color: palette.fg,
        border: "1px solid",
        borderColor: palette.line,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "currentColor",
          flexShrink: 0,
        }}
      />
      {c.statuses[label] ?? label}
    </Box>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  aside?: ReactNode;
};

function SectionHeader({ title, subtitle, icon, aside }: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1.5,
        px: { xs: 2, sm: 2.5, md: 3 },
        py: 2,
        borderBottom: `1px solid ${HAIRLINE}`,
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
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, flex: "1 1 120px", overflowWrap: "anywhere" }}>
        <Typography
          sx={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2, color: INK }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ mt: 0.25, fontSize: 12, fontWeight: 400, color: INK_MUTED }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {aside}
    </Box>
  );
}

function EmptyState() {
  const { c } = useCopy();
  return (
    <Box
      sx={{
        display: "grid",
        justifyItems: "center",
        gap: 1.5,
        py: 6,
        px: 2,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: BRAND_SOFT,
          color: BRAND,
        }}
      >
        <ReceiptLongOutlinedIcon sx={{ fontSize: 26 }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: INK }}>
          {c.emptyTitle}
        </Typography>
        <Typography
          sx={{ mt: 0.5, fontSize: 13, fontWeight: 400, color: INK_MUTED }}
        >
          {c.emptyBody}
        </Typography>
      </Box>
    </Box>
  );
}

function InitialsAvatar({ text }: { text: string }) {
  return (
    <Box
      aria-hidden
      sx={{
        display: "grid",
        placeItems: "center",
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: "50%",
        bgcolor: BRAND_SOFT,
        color: BRAND_DEEP,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {text}
    </Box>
  );
}

type ClientLinkProps = {
  clientId: string;
  clientName?: string;
  onOpen: (clientId: string) => void;
  // Shown under the name on narrow cards, where other columns are hidden.
  below?: ReactNode;
};

// Name first (that is what people recognise), ID underneath. The name and ID
// are one button that opens the client.
function ClientLink({ clientId, clientName, onOpen, below }: ClientLinkProps) {
  const { c } = useCopy();
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
      <InitialsAvatar text={initialsOf(clientName, clientId)} />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box
          component="button"
          type="button"
          onClick={() => onOpen(clientId)}
          aria-label={c.openClient(clientName, clientId)}
          sx={{
            p: 0,
            border: 0,
            bgcolor: "transparent",
            font: "inherit",
            textAlign: "left",
            cursor: "pointer",
            minWidth: 0,
            maxWidth: "100%",
            "&:hover .client-primary": {
              color: BRAND,
              textDecoration: "underline",
            },
            ...focusRing,
          }}
        >
          <Typography
            className="client-primary"
            component="span"
            sx={{
              display: "block",
              overflowWrap: "anywhere",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.3,
              color: INK,
              transition: "color 160ms ease",
            }}
          >
            {clientName || clientId}
          </Typography>

          {clientName && (
            <Typography
              component="span"
              sx={{
                display: "block",
                overflowWrap: "anywhere",
                mt: 0.25,
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 1.3,
                color: INK_MUTED,
                ...NUMERIC,
              }}
            >
              {clientId}
            </Typography>
          )}
        </Box>

        {below}
      </Box>
    </Box>
  );
}

const amountSx = (status: DashboardPaymentStatus) => ({
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.3,
  color: status === "Cancelled" ? INK_MUTED : INK,
  textDecoration: status === "Cancelled" ? "line-through" : "none",
  textDecorationColor: "rgba(91, 106, 126, 0.6)",
  ...NUMERIC,
});

// =================================================
// MAIN
// =================================================

export default function PaymentsTable({ data }: Props) {
  const { lang, c, t } = useCopy();
  const {
    selectedMonth,
    payments,
    paymentPagination,
    handlePaymentPageChange,
    handlePaymentLimitChange,
    handleClientClick,
  } = data;

  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        mt: 2,
        p: 0,
        overflow: "hidden",
        // Lets the table respond to this card's width (see RESPONSIVE RULES).
        containerType: "inline-size",
        containerName: "payments",
      }}
    >
      <SectionHeader
        title={c.payments}
        subtitle={c.paymentsFor(selectedMonth)}
        icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />}
        aside={
          <Typography
            sx={{
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 600,
              color: INK_MUTED,
              ...NUMERIC,
            }}
          >
            {c.count(paymentPagination.total)}
          </Typography>
        }
      />

      <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
        <Table size="small" sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, ...edgeLeft }}>{c.client}</TableCell>

              <TableCell sx={{ ...headCellSx, ...cellFrom(BP.mid) }}>
                {c.stage}
              </TableCell>

              <TableCell
                align="right"
                sx={{ ...headCellSx, ...amountEdge }}
              >
                {c.amount}
              </TableCell>

              <TableCell sx={{ ...headCellSx, ...cellFrom(BP.wide) }}>
                {c.method}
              </TableCell>

              <TableCell sx={{ ...headCellSx, ...statusEdge }}>
                {c.status}
              </TableCell>

              <TableCell sx={{ ...headCellSx, ...cellFrom(BP.wide) }}>
                {c.staff}
              </TableCell>

              <TableCell
                sx={{ ...headCellSx, ...edgeRight, ...cellFrom(BP.mid) }}
              >
                {c.date}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.map((payment) => {
              const tone = paymentTone(payment.paymentStatus);
              const method =
                c.methods[payment.paymentMethod] ?? payment.paymentMethod;
              const date = formatJapanDate(payment.paymentDate, lang);

              return (
                <TableRow key={payment._id} hover={false} sx={rowSx}>
                  {/* CLIENT (carries the hidden columns on narrow cards) */}
                  <TableCell sx={{ ...bodyCellSx, ...edgeLeft }}>
                    <ClientLink
                      clientId={payment.clientId}
                      clientName={payment.clientName}
                      onOpen={handleClientClick}
                      below={
                        <Box sx={detailsUnderClient}>
                          <span>{translateStage(payment.stageName, t)}</span>
                          <span>{method}</span>
                          <span style={{ fontVariantNumeric: "tabular-nums" }}>
                            {date}
                          </span>
                          <span>{payment.creditedStaffName}</span>
                        </Box>
                      }
                    />
                  </TableCell>

                  {/* STAGE */}
                  <TableCell sx={{ ...bodyCellSx, ...cellFrom(BP.mid) }}>
                    {translateStage(payment.stageName, t)}
                  </TableCell>

                  {/* AMOUNT (method / status stack under it when needed) */}
                  <TableCell
                    align="right"
                    sx={{ ...bodyCellSx, ...amountEdge, whiteSpace: "nowrap" }}
                  >
                    <Typography
                      component="div"
                      sx={amountSx(payment.paymentStatus)}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </Typography>

                    <Box sx={methodUnderAmount}>{method}</Box>

                    <Box sx={pillUnderAmount}>
                      <Pill label={payment.paymentStatus} tone={tone} />
                    </Box>
                  </TableCell>

                  {/* METHOD */}
                  <TableCell sx={{ ...bodyCellSx, ...cellFrom(BP.wide) }}>
                    {method}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell sx={{ ...bodyCellSx, ...statusEdge }}>
                    <Pill label={payment.paymentStatus} tone={tone} />
                  </TableCell>

                  {/* STAFF */}
                  <TableCell sx={{ ...bodyCellSx, ...cellFrom(BP.wide) }}>
                    <Typography
                      component="span"
                      sx={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: INK_BODY,
                      }}
                    >
                      {payment.creditedStaffName}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{ ...smallLine, display: "block", mt: 0.25 }}
                    >
                      {payment.creditedStaff}
                    </Typography>
                  </TableCell>

                  {/* DATE (staff stacks under it when needed) */}
                  <TableCell
                    sx={{
                      ...bodyCellSx,
                      ...edgeRight,
                      ...NUMERIC,
                      ...cellFrom(BP.mid),
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Box component="div" sx={{ color: INK_MUTED }}>
                      {date}
                    </Box>

                    <Box sx={staffUnderDate}>{payment.creditedStaffName}</Box>
                  </TableCell>
                </TableRow>
              );
            })}

            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ borderBottom: 0, p: 0 }}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        labelRowsPerPage={c.rowsPerPage}
        labelDisplayedRows={c.displayedRows}
        getItemAriaLabel={c.pageAria}
        count={paymentPagination.total}
        page={Math.max(paymentPagination.currentPage - 1, 0)}
        rowsPerPage={paymentPagination.perPage}
        rowsPerPageOptions={[10, 25, 50]}
        slotProps={{
          select: { inputProps: { "aria-label": c.rowsPerPageAria } },
        }}
        onPageChange={(_, page) => handlePaymentPageChange(page + 1)}
        onRowsPerPageChange={(event) =>
          handlePaymentLimitChange(Number(event.target.value))
        }
        sx={paginationSx}
      />
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

function formatMonth(value: string, locale: string) {
  const date = new Date(`${value}-01T00:00:00+09:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(locale, {year: "numeric", month: "long", timeZone: "Asia/Tokyo"}).format(date);
}
