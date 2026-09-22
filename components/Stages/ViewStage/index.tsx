"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useViewStageHook } from "./hook";

import { useTranslations } from "next-intl";

// =================================================
// THEME
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";

const HAIRLINE = "rgba(17, 24, 39, 0.08)";

const INK = "#111827";
const INK_MUTED = "#6B7280";

const DANGER = "#DC2626";

// =================================================
// HELPERS
// =================================================

const formatAmount = (amount?: number) => {
  if (amount === undefined || amount === null) {
    return "-";
  }

  return Number(amount).toLocaleString();
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

// =================================================
// DETAIL ITEM
// =================================================

type DetailItemProps = {
  label: string;
  value: React.ReactNode;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <Box>
      <Typography
        sx={{
          mb: 0.75,
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: INK_MUTED,
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          minHeight: 24,
          fontSize: 14,
          fontWeight: 500,
          color: INK,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// =================================================
// PAGE
// =================================================

export default function ViewStagePage() {
  const t = useTranslations("viewStage");

  const {
    stageId,
    stage,

    isLoading,
    isError,
    refetch,

    handleBack,
    handleEdit,
  } = useViewStageHook();

  // =================================================
  // LOADING
  // =================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={32}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }

  // =================================================
  // ERROR
  // =================================================

  if (isError) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: INK,
          }}
        >
          {t("messages.loadFailed")}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => void refetch()}
          sx={{
            textTransform: "none",
            color: BRAND,
            borderColor: BRAND,

            "&:hover": {
              borderColor: BRAND_DARK,
              bgcolor: BRAND_SOFT,
            },
          }}
        >
          {t("actions.tryAgain")}
        </Button>
      </Box>
    );
  }

  // =================================================
  // NOT FOUND
  // =================================================

  if (!stage) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: INK,
          }}
        >
          {t("messages.notFound")}
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            color: INK_MUTED,
          }}
        >
          {t("messages.notFoundDescription", {
            stageId,
          })}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={handleBack}
          sx={{
            textTransform: "none",
          }}
        >
          {t("actions.backToStages")}
        </Button>
      </Box>
    );
  }

  // =================================================
  // UI
  // =================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F8F6",

        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        py: {
          xs: 2.5,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* BREADCRUMB */}

        <Box
          sx={{
            mb: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Breadcrumb
            items={[
              {
                label: t("breadcrumbs.dashboard"),
                href: "/admin/dashboard",
              },
              {
                label: t("breadcrumbs.stages"),
                href: "/admin/stages",
              },
              {
                label: stage.name,
                current: true,
              },
            ]}
          />
        </Box>

        {/* HEADER */}

        <Box
          sx={{
            mb: 3,

            display: "flex",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            alignItems: {
              xs: "stretch",
              sm: "center",
            },

            justifyContent: "space-between",

            gap: 2,
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: 24,
                  md: 30,
                },

                fontWeight: 600,
                color: INK,
              }}
            >
              {stage.name}
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                fontSize: 14,
                color: INK_MUTED,
              }}
            >
              {t("description")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handleBack}
              sx={{
                textTransform: "none",
                borderRadius: 2.5,
                color: INK,
                borderColor: HAIRLINE,
              }}
            >
              {t("actions.back")}
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                textTransform: "none",
                borderRadius: 2.5,
                bgcolor: BRAND,

                "&:hover": {
                  bgcolor: BRAND_DARK,
                },
              }}
            >
              {t("actions.editStage")}
            </Button>
          </Box>
        </Box>

        {/* CARD */}

        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 3,
            bgcolor: "#ffffff",
            overflow: "hidden",
          }}
        >
          {/* MAIN INFO */}

          <Box
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
          >
            <Typography
              sx={{
                mb: 2.5,
                fontSize: 16,
                fontWeight: 600,
                color: INK,
              }}
            >
              {t("sections.stageInformation")}
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },

                gap: {
                  xs: 2.5,
                  md: 3,
                },
              }}
            >
              <DetailItem
                label={t("fields.stageId")}
                value={stage.stageId}
              />

              <DetailItem
                label={t("fields.stageName")}
                value={stage.name}
              />

              <DetailItem
                label={t("fields.stageKey")}
                value={stage.key}
              />

              <DetailItem
                label={t("fields.amount")}
                value={formatAmount(stage.amount)}
              />

              <DetailItem
                label={t("fields.displayOrder")}
                value={stage.displayOrder}
              />

              <DetailItem
                label={t("fields.status")}
                value={
                  <Chip
                    size="small"
                    label={
                      stage.isActive
                        ? t("status.active")
                        : t("status.inactive")
                    }
                    sx={{
                      fontWeight: 600,

                      color: stage.isActive
                        ? BRAND_DARK
                        : DANGER,

                      bgcolor: stage.isActive
                        ? BRAND_SOFT
                        : "#FEF2F2",
                    }}
                  />
                }
              />

              <DetailItem
                label={t("fields.stageType")}
                value={
                  stage.isSystem
                    ? t("stageType.system")
                    : t("stageType.custom")
                }
              />
            </Box>
          </Box>

          <Divider />

          {/* AUDIT INFO */}

          <Box
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
          >
            <Typography
              sx={{
                mb: 2.5,
                fontSize: 16,
                fontWeight: 600,
                color: INK,
              }}
            >
              {t("sections.auditInformation")}
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },

                gap: {
                  xs: 2.5,
                  md: 3,
                },
              }}
            >
              <DetailItem
                label={t("fields.createdBy")}
                value={
                  stage.createdByName ||
                  stage.createdById ||
                  "-"
                }
              />

              <DetailItem
                label={t("fields.createdAt")}
                value={formatDate(stage.createdAt)}
              />

              <DetailItem
                label={t("fields.updatedBy")}
                value={
                  stage.updatedByName ||
                  stage.updatedById ||
                  "-"
                }
              />

              <DetailItem
                label={t("fields.updatedAt")}
                value={formatDate(stage.updatedAt)}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}