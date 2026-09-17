"use client";

import { useLocale, useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type { PerformanceHistoryProps, PerformanceHistoryStatus } from "./type";

import { usePerformanceHistoryHook } from "./hook";

// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

// =================================================
// MONEY FORMAT
// =================================================

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount || 0));
};

// =================================================
// MONTH FORMAT
// 2026-09 -> September 2026
// =================================================

const formatMonth = (month: string, locale: string) => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return month;
  }

  const [year, monthNumber] = month.split("-");

  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(date);
};

// =================================================
// STATUS COLOR
// =================================================

const getStatusColor = (
  status: PerformanceHistoryStatus,
): "default" | "info" | "warning" | "success" => {
  switch (status) {
    case "Achieved":
      return "success";

    case "In Progress":
      return "warning";

    case "No Target":
      return "info";

    case "Not Started":
    default:
      return "default";
  }
};

// =================================================
// STATUS STYLE
// =================================================

const getStatusSx = (status: PerformanceHistoryStatus) => {
  switch (status) {
    case "Achieved":
      return {
        color: BRAND,
        bgcolor: BRAND_SOFT,
        borderColor: "rgba(16, 122, 100, 0.14)",
      };

    case "In Progress":
      return {
        color: "#B7791F",
        bgcolor: "#FFFBEB",
        borderColor: "rgba(183, 121, 31, 0.14)",
      };

    case "No Target":
      return {
        color: INK_MUTED,
        bgcolor: "#F3F4F6",
        borderColor: HAIRLINE,
      };

    case "Not Started":
    default:
      return {
        color: INK_MUTED,
        bgcolor: "#F9FAFB",
        borderColor: HAIRLINE,
      };
  }
};

// =================================================
// COMPONENT
// =================================================

export default function PerformanceHistory({
  staffId,
}: PerformanceHistoryProps) {
  const t = useTranslations("staffPerformanceHistory");
  const locale = useLocale();

  const {
    history,

    isLoading,

    isFetching,

    loadError,
  } = usePerformanceHistoryHook(staffId);

  const performanceStatusLabel: Record<PerformanceHistoryStatus, string> = {
    "No Target": t("status.noTarget"),
    "Not Started": t("status.notStarted"),
    "In Progress": t("status.inProgress"),
    Achieved: t("status.achieved"),
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#F7F8F6",
        minHeight: "100%",
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1320,
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            mb: {
              xs: 2.5,
              md: 3,
            },
          }}
        >
          <Typography
            sx={{
              color: INK,
              fontSize: {
                xs: 22,
                sm: 24,
              },
              lineHeight: 1.3,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {t("title")}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.6,
              color: INK_MUTED,
              fontSize: {
                xs: 13.5,
                sm: 14,
              },
              lineHeight: 1.6,
            }}
          >
            {t("description")}
          </Typography>
        </Box>

        {/* ERROR */}

        {loadError && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              border: "1px solid rgba(220, 38, 38, 0.12)",
              bgcolor: "#FEF2F2",
              color: "#991B1B",
              boxShadow: "none",

              "& .MuiAlert-icon": {
                color: "#DC2626",
              },
            }}
          >
            {loadError}
          </Alert>
        )}

        {/* LOADING */}

        {isLoading ? (
          <Box
            sx={{
              ...softCard,

              minHeight: 220,

              display: "flex",

              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <CircularProgress
              size={30}
              thickness={4}
              sx={{
                color: BRAND,
              }}
            />
          </Box>
        ) : history.length === 0 ? (
          /* EMPTY */

          <Box
            sx={{
              bgcolor: "#ffffff",

              border: `1px dashed rgba(16, 122, 100, 0.25)`,

              borderRadius: 3,

              py: {
                xs: 5,
                sm: 6,
              },

              px: 2,

              textAlign: "center",

              boxShadow:
                "0 1px 2px rgba(17,24,39,0.02), 0 12px 32px -26px rgba(17,24,39,0.22)",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                mx: "auto",
                mb: 1.5,
                borderRadius: 2.5,
                bgcolor: BRAND_SOFT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: BRAND,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: INK_MUTED,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {t("empty")}
            </Typography>
          </Box>
        ) : (
          /* TABLE */

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              ...softCard,

              width: "100%",

              overflowX: "auto",

              overflowY: "hidden",

              WebkitOverflowScrolling: "touch",

              "&::-webkit-scrollbar": {
                height: 8,
              },

              "&::-webkit-scrollbar-track": {
                bgcolor: "transparent",
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(17, 24, 39, 0.12)",
                borderRadius: 999,
              },

              "&::-webkit-scrollbar-thumb:hover": {
                bgcolor: "rgba(17, 24, 39, 0.20)",
              },
            }}
          >
            <Table
              sx={{
                minWidth: 900,

                "& .MuiTableCell-root": {
                  borderColor: HAIRLINE,
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#F9FAFB",
                  }}
                >
                  <TableCell
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.month")}
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.target")}
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.collected")}
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.remaining")}
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.achievement")}
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.payments")}
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.clients")}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      py: 1.65,
                      px: 2.25,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: INK_MUTED,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t("columns.status")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {history.map((item) => (
                  <TableRow
                    key={item.month}
                    hover
                    sx={{
                      transition:
                        "background-color 200ms ease, box-shadow 200ms ease",

                      "&:last-of-type td": {
                        borderBottom: 0,
                      },

                      "&.MuiTableRow-hover:hover": {
                        bgcolor: BRAND_SOFT,
                      },
                    }}
                  >
                    {/* MONTH */}

                    <TableCell
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: INK,
                          fontSize: 14,
                          fontWeight: 600,
                          lineHeight: 1.45,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatMonth(item.month, locale)}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.25,
                          color: INK_MUTED,
                          fontSize: 11.5,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.month}
                      </Typography>
                    </TableCell>

                    {/* TARGET */}

                    <TableCell
                      align="right"
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        color: INK,
                        fontSize: 14,
                        fontVariantNumeric: "tabular-nums",
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ¥{formatAmount(item.targetAmount)}
                    </TableCell>

                    {/* COLLECTED */}

                    <TableCell
                      align="right"
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: BRAND,
                          fontSize: 14,
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ¥{formatAmount(item.totalCollected)}
                      </Typography>
                    </TableCell>

                    {/* REMAINING */}

                    <TableCell
                      align="right"
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        color: INK,
                        fontSize: 14,
                        fontVariantNumeric: "tabular-nums",
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ¥{formatAmount(item.remainingAmount)}
                    </TableCell>

                    {/* ACHIEVEMENT */}

                    <TableCell
                      align="right"
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        color: INK,
                        fontSize: 14,
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.achievementPercentage.toLocaleString()}%
                    </TableCell>

                    {/* PAYMENTS */}

                    <TableCell
                      align="center"
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        color: INK,
                        fontSize: 14,
                        fontVariantNumeric: "tabular-nums",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.paymentCount}
                    </TableCell>

                    {/* CLIENTS */}

                    <TableCell
                      align="center"
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        color: INK,
                        fontSize: 14,
                        fontVariantNumeric: "tabular-nums",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.clientCount}
                    </TableCell>

                    {/* STATUS */}

                    <TableCell
                      sx={{
                        py: 1.8,
                        px: 2.25,
                        verticalAlign: "middle",
                      }}
                    >
                      <Chip
                        size="small"
                        label={performanceStatusLabel[item.status]}
                        color={getStatusColor(item.status)}
                        variant="outlined"
                        sx={{
                          ...getStatusSx(item.status),

                          height: 26,

                          borderRadius: 999,

                          fontSize: 11.5,

                          fontWeight: 600,

                          transition:
                            "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

                          "& .MuiChip-label": {
                            px: 1.25,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* REFRESHING */}

        {isFetching && !isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 0.75,
              mt: 1.25,
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: BRAND,
              }}
            />

            <Typography
              variant="caption"
              sx={{
                color: INK_MUTED,
                fontSize: 11.5,
                fontWeight: 500,
              }}
            >
              {t("refreshing")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
