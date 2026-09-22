"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { usePaymentsHook } from "./hook";

import type { PaymentsProps } from "./type";

// =================================================
// DESIGN TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#6B7280";

// How many payments show before "Show all"
const PAYMENTS_PREVIEW_COUNT = 5;

// =================================================
// FORMATTERS
// =================================================

const formatAmount = (amount?: number | null) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount ?? 0));
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getStatusStyle = (status: string) => {
  if (status === "Completed") {
    return { bgcolor: BRAND_SOFT, color: BRAND };
  }

  if (status === "Refunded") {
    return { bgcolor: "#EFF6FF", color: "#1D4ED8" };
  }

  return { bgcolor: "#FEF2F2", color: "#DC2626" };
};

// =================================================
// SMALL PIECES
// =================================================

const StatusBadge = ({
  status,
  label,
}: {
  status: string;
  label: string;
}) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: 1.1,
      py: 0.3,
      borderRadius: 999,
      fontSize: 11.5,
      fontWeight: 700,
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      ...getStatusStyle(status),
    }}
  >
    {label}
  </Box>
);

const StatTile = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) => (
  <Box
    sx={{
      px: 2,
      py: 1.5,
      border: `1px solid ${HAIRLINE}`,
      borderRadius: 2.5,
      bgcolor: accent ? BRAND_SOFT : SURFACE_ALT,
    }}
  >
    <Typography sx={{ color: INK_MUTED, fontSize: 12, fontWeight: 500 }}>
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 0.25,
        color: accent ? BRAND : INK,
        fontSize: { xs: 22, sm: 24 },
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const Fact = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ color: INK_MUTED, fontSize: 11, lineHeight: 1.4 }}>
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 0.15,
        color: INK,
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.4,
        wordBreak: "break-word",
      }}
    >
      {value}
    </Typography>
  </Box>
);

// =================================================
// COMPONENT
// =================================================

const Payments = ({ clientId }: PaymentsProps) => {
  const t = useTranslations("clientPayments");

  const { payments, summary, isLoading, isFetching, isError, errorMessage } =
    usePaymentsHook(clientId);

  // Hooks must run before the early return below
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={26} sx={{ color: BRAND }} />
      </Box>
    );
  }

  const canCollapse = payments.length > PAYMENTS_PREVIEW_COUNT;

  const visiblePayments =
    showAll || !canCollapse
      ? payments
      : payments.slice(0, PAYMENTS_PREVIEW_COUNT);

  const getPaymentStatusLabel = (status?: string | null) => {
    if (!status) {
      return "-";
    }

    return t(`statuses.${status}` as never);
  };

  const getPaymentMethodLabel = (method?: string | null) => {
    if (!method) {
      return "-";
    }

    return t(`methods.${method}` as never);
  };

  return (
    <Box>
      {/* =================================================
      TITLE
      ================================================= */}

      <Box
        sx={{
          pb: 1.75,
          mb: 2,
          borderBottom: `1px solid ${HAIRLINE}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              component="h2"
              sx={{
                color: INK,
                fontSize: { xs: 16, md: 17 },
                fontWeight: 700,
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
              }}
            >
              {t("title")}
            </Typography>

            {payments.length > 0 && (
              <Box
                component="span"
                sx={{
                  minWidth: 22,
                  height: 22,
                  px: 0.75,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  bgcolor: BRAND_SOFT,
                  color: BRAND,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {payments.length}
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              mt: 0.5,
              color: INK_MUTED,
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            {t("description")}
          </Typography>
        </Box>

        {isFetching && !isLoading && (
          <CircularProgress size={18} sx={{ mt: 0.5, color: BRAND }} />
        )}
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* =================================================
      SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.5,
          mb: 2,
        }}
      >
        <StatTile
          accent
          label={t("summary.totalCollected")}
          value={`¥${formatAmount(summary.totalCollected)}`}
        />

        <StatTile
          label={t("summary.completedPayments")}
          value={summary.completedCount}
        />
      </Box>

      {/* =================================================
      HISTORY
      ================================================= */}

      {payments.length === 0 ? (
        <Box
          sx={{
            py: 3.5,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            border: "1px dashed rgba(16, 122, 100, 0.3)",
            borderRadius: 3,
            bgcolor: SURFACE_ALT,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: BRAND_SOFT,
              color: BRAND,
            }}
          >
            <ReceiptLongOutlinedIcon fontSize="small" />
          </Box>

          <Typography sx={{ color: INK_MUTED, fontSize: 13.5 }}>
            {t("empty")}
          </Typography>
        </Box>
      ) : (
        <>
          {/* -------------------------------------------------
          DESKTOP TABLE
          ------------------------------------------------- */}

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              overflow: "auto",
              // Expanded lists scroll inside a fixed height
              maxHeight: showAll ? 460 : "none",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 2.5,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(17,24,39,0.18) transparent",
            }}
          >
            <Box
              component="table"
              sx={{
                width: "100%",
                minWidth: 760,
                borderCollapse: "separate",
                borderSpacing: 0,

                "& th": {
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  px: 1.75,
                  py: 1.1,
                  bgcolor: SURFACE_ALT,
                  borderBottom: `1px solid ${HAIRLINE}`,
                  color: INK_MUTED,
                  textAlign: "left",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                },

                "& td": {
                  px: 1.75,
                  py: 1.25,
                  borderBottom: `1px solid ${HAIRLINE}`,
                  color: INK,
                  fontSize: 13,
                  verticalAlign: "middle",
                },

                "& tbody tr:last-of-type td": { borderBottom: 0 },
                "& tbody tr:hover td": { bgcolor: "rgba(16,122,100,0.03)" },
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  <Box component="th">{t("fields.date")}</Box>
                  <Box component="th">{t("fields.stage")}</Box>
                  <Box component="th" sx={{ textAlign: "right !important" }}>
                    {t("fields.amount")}
                  </Box>
                  <Box component="th">{t("fields.method")}</Box>
                  <Box component="th">{t("fields.status")}</Box>
                  <Box component="th">{t("fields.reference")}</Box>
                  <Box component="th">{t("fields.staff")}</Box>
                </Box>
              </Box>

              <Box component="tbody">
                {visiblePayments.map((payment) => (
                  <Box component="tr" key={payment._id}>
                    <Box
                      component="td"
                      sx={{
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(payment.paymentDate)}
                    </Box>

                    <Box component="td" sx={{ fontWeight: 600 }}>
                      {payment.stageName || "-"}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        textAlign: "right",
                        color: BRAND,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </Box>

                    <Box component="td">
                      {getPaymentMethodLabel(payment.paymentMethod)}
                    </Box>

                    <Box component="td">
                      <StatusBadge
                        status={payment.paymentStatus}
                        label={getPaymentStatusLabel(payment.paymentStatus)}
                      />
                    </Box>

                    <Box component="td" sx={{ wordBreak: "break-word" }}>
                      {payment.referenceNumber || payment.receiptNumber || "-"}
                    </Box>

                    <Box component="td">
                      <Typography
                        sx={{ fontSize: 13, fontWeight: 600, color: INK }}
                      >
                        {payment.creditedStaffName ||
                          payment.creditedStaff ||
                          "-"}
                      </Typography>

                      {payment.collectedByName && (
                        <Typography
                          sx={{ mt: 0.15, fontSize: 11.5, color: INK_MUTED }}
                        >
                          {t("fields.recordedBy")} {payment.collectedByName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* -------------------------------------------------
          MOBILE / TABLET CARDS
          ------------------------------------------------- */}

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              gap: 1.25,
              maxHeight: showAll ? 480 : "none",
              overflowY: showAll ? "auto" : "visible",
              pr: showAll ? 0.5 : 0,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(17,24,39,0.18) transparent",
            }}
          >
            {visiblePayments.map((payment) => (
              <Box
                key={payment._id}
                sx={{
                  p: 1.75,
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 2.5,
                  bgcolor: SURFACE,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: INK,
                        fontSize: 14,
                        fontWeight: 700,
                        wordBreak: "break-word",
                      }}
                    >
                      {payment.stageName || "-"}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,
                        color: INK_MUTED,
                        fontSize: 12,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(payment.paymentDate)}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      flexShrink: 0,
                      color: BRAND,
                      fontSize: 16,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    ¥{formatAmount(payment.amountPaid)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 1.25,
                    pt: 1.25,
                    borderTop: `1px solid ${HAIRLINE}`,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 1.25,
                  }}
                >
                  <Fact
                    label={t("fields.method")}
                    value={getPaymentMethodLabel(payment.paymentMethod)}
                  />

                  <Box>
                    <Typography
                      sx={{ color: INK_MUTED, fontSize: 11, lineHeight: 1.4 }}
                    >
                      {t("fields.status")}
                    </Typography>

                    <Box sx={{ mt: 0.3 }}>
                      <StatusBadge
                        status={payment.paymentStatus}
                        label={getPaymentStatusLabel(payment.paymentStatus)}
                      />
                    </Box>
                  </Box>

                  <Fact
                    label={t("fields.reference")}
                    value={
                      payment.referenceNumber || payment.receiptNumber || "-"
                    }
                  />

                  <Fact
                    label={t("fields.staff")}
                    value={
                      payment.creditedStaffName || payment.creditedStaff || "-"
                    }
                  />
                </Box>

                {payment.collectedByName && (
                  <Typography sx={{ mt: 1.25, color: INK_MUTED, fontSize: 11.5 }}>
                    {t("fields.recordedBy")} {payment.collectedByName}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* -------------------------------------------------
          SHOW ALL / LESS
          ------------------------------------------------- */}

          {canCollapse && (
            <Box sx={{ mt: 1.25, display: "flex", justifyContent: "center" }}>
              <Button
                type="button"
                size="small"
                onClick={() => setShowAll((prev) => !prev)}
                endIcon={
                  showAll ? (
                    <ExpandLessRoundedIcon />
                  ) : (
                    <ExpandMoreRoundedIcon />
                  )
                }
                sx={{
                  color: BRAND,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: BRAND_SOFT },
                }}
              >
                {showAll
                  ? t("actions.showLess")
                  : t("actions.showAll", { count: payments.length })}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Payments;
