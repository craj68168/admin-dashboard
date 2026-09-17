"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useClientFeesHook } from "./hook";

import type { ClientFeesProps, PaymentProgressStatus } from "./type";

// =================================================
// DESIGN SYSTEM
// Styling only — no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
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

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: INK_MUTED,
    fontSize: 14,

    "&.Mui-focused": {
      color: BRAND,
    },

    "&.Mui-error": {
      color: "#DC2626",
    },
  },

  "& .MuiOutlinedInput-root": {
    bgcolor: "#ffffff",
    color: INK,
    borderRadius: 2.5,

    transition:
      "border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease",

    "& fieldset": {
      borderColor: HAIRLINE,
      transition: "border-color 200ms ease",
    },

    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: "1px",
    },

    "&.Mui-error fieldset": {
      borderColor: "#DC2626",
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,
  },

  "& .MuiFormHelperText-root": {
    ml: 0.25,
    mt: 0.75,
    color: INK_MUTED,
    fontSize: 11.5,

    "&.Mui-error": {
      color: "#DC2626",
    },
  },
};

const chipSx = {
  height: 27,
  borderRadius: 999,
  fontSize: 11.5,
  fontWeight: 600,

  transition:
    "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

  "& .MuiChip-label": {
    px: 1.25,
  },

  "&.MuiChip-colorSuccess": {
    color: BRAND,
    bgcolor: BRAND_SOFT,
    borderColor: "rgba(16, 122, 100, 0.14)",
  },

  "&.MuiChip-colorWarning": {
    color: "#B7791F",
    bgcolor: "#FFFBEB",
    borderColor: "rgba(183, 121, 31, 0.14)",
  },

  "&.MuiChip-colorInfo": {
    color: INK_MUTED,
    bgcolor: "#F3F4F6",
    borderColor: HAIRLINE,
  },

  "&.MuiChip-colorDefault": {
    color: INK_MUTED,
    bgcolor: "#F9FAFB",
    borderColor: HAIRLINE,
  },
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

const formatTokyoDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getProgressColor = (
  status: PaymentProgressStatus,
): "default" | "warning" | "info" | "success" => {
  switch (status) {
    case "Partial":
      return "warning";

    case "Paid":
      return "success";

    case "Unpaid":
      return "info";

    default:
      return "default";
  }
};

const ClientFees = ({ clientId }: ClientFeesProps) => {
  const t = useTranslations("clientFees");

  const {
    isAdmin,

    fees,

    totalExpected,
    totalPaid,
    totalOutstanding,

    control,
    errors,

    handleSubmit,
    onSubmit,

    editingFeeId,

    handleEdit,
    handleCancelEdit,

    feeToCancel,

    handleOpenCancelFee,
    handleCloseCancelFee,
    handleConfirmCancelFee,

    isFeesLoading,

    isSubmitting,
    isCreatingFee,
    isUpdatingFee,
    isCancellingFee,

    serverError,
    successMessage,
    loadError,
  } = useClientFeesHook(clientId);

  const saving = isSubmitting || isCreatingFee || isUpdatingFee;

  return (
    <Box>
      {/* HEADER */}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: INK,
            fontSize: 17,
            lineHeight: 1.35,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {t("title")}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: INK_MUTED,
            fontSize: 13.5,
            lineHeight: 1.6,
          }}
        >
          {t("description")}
        </Typography>
      </Box>

      {/* SUMMARY */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },

          gap: 2,

          mb: 3,
        }}
      >
        <Box
          sx={{
            ...softCard,
            p: 2.25,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: INK_MUTED,
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            {t("summary.totalExpected")}
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              color: INK,
              fontSize: 20,
              lineHeight: 1.3,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ¥{formatAmount(totalExpected)}
          </Typography>
        </Box>

        <Box
          sx={{
            ...softCard,
            p: 2.25,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: INK_MUTED,
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            {t("summary.totalPaid")}
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              color: BRAND,
              fontSize: 20,
              lineHeight: 1.3,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ¥{formatAmount(totalPaid)}
          </Typography>
        </Box>

        <Box
          sx={{
            ...softCard,
            p: 2.25,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: INK_MUTED,
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            {t("summary.outstanding")}
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              color: "#B7791F",
              fontSize: 20,
              lineHeight: 1.3,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ¥{formatAmount(totalOutstanding)}
          </Typography>
        </Box>
      </Box>

      {/* ALERTS */}

      {serverError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,

            borderRadius: 2.5,

            border: "1px solid rgba(220, 38, 38, 0.12)",

            bgcolor: "#FEF2F2",

            color: "#991B1B",

            "& .MuiAlert-icon": {
              color: "#DC2626",
            },
          }}
        >
          {serverError}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 2,

            borderRadius: 2.5,

            border: "1px solid rgba(16, 122, 100, 0.12)",

            bgcolor: BRAND_SOFT,

            color: BRAND,

            "& .MuiAlert-icon": {
              color: BRAND,
            },
          }}
        >
          {successMessage}
        </Alert>
      )}

      {loadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,

            borderRadius: 2.5,

            border: "1px solid rgba(220, 38, 38, 0.12)",

            bgcolor: "#FEF2F2",

            color: "#991B1B",

            "& .MuiAlert-icon": {
              color: "#DC2626",
            },
          }}
        >
          {loadError}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: isAdmin ? "1.5fr 1fr" : "1fr",
          },

          gap: {
            xs: 3,
            lg: 4,
          },
        }}
      >
        {/* FEE LIST */}

        <Box>
          <Typography
            sx={{
              mb: 2,

              color: INK,

              fontSize: 15,

              fontWeight: 600,
            }}
          >
            {t("feeRequirements")}
          </Typography>

          {isFeesLoading && (
            <Box
              sx={{
                ...softCard,

                py: 5,

                display: "flex",

                justifyContent: "center",
              }}
            >
              <CircularProgress
                size={28}
                sx={{
                  color: BRAND,
                }}
              />
            </Box>
          )}

          {!isFeesLoading && !loadError && fees.length === 0 && (
            <Box
              sx={{
                bgcolor: "#ffffff",

                border: "1px dashed rgba(16, 122, 100, 0.25)",

                borderRadius: 3,

                p: {
                  xs: 4,
                  sm: 5,
                },

                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: INK_MUTED,
                  fontSize: 14,
                }}
              >
                {t("empty")}
              </Typography>
            </Box>
          )}

          {!isFeesLoading && !loadError && fees.length > 0 && (
            <Box
              sx={{
                ...softCard,

                overflow: "hidden",
              }}
            >
              {fees.map((fee, index) => (
                <Box key={fee._id}>
                  <Box
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },

                      transition: "background-color 200ms ease",

                      "&:hover": {
                        bgcolor: "rgba(16, 122, 100, 0.025)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },

                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },

                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: INK,

                            fontSize: 15,

                            fontWeight: 600,

                            lineHeight: 1.4,
                          }}
                        >
                          {fee.feeName}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,

                            color: INK_MUTED,

                            fontSize: 12.5,
                          }}
                        >
                          {t("due", { date: formatTokyoDate(fee.dueDate) })}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",

                          gap: 1,

                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          size="small"
                          label={t(`statuses.${fee.status}`)}
                          color={
                            fee.status === "Active" ? "success" : "default"
                          }
                          variant="outlined"
                          sx={chipSx}
                        />

                        <Chip
                          size="small"
                          variant="outlined"
                          label={t(`paymentStatuses.${fee.paymentProgressStatus}`)}
                          color={getProgressColor(fee.paymentProgressStatus)}
                          sx={chipSx}
                        />
                      </Box>
                    </Box>

                    {/* MONEY */}

                    <Box
                      sx={{
                        display: "grid",

                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(3, 1fr)",
                        },

                        gap: 2,

                        mt: 2.5,

                        p: 2,

                        borderRadius: 2.5,

                        bgcolor: "#F9FAFB",

                        border: `1px solid ${HAIRLINE}`,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: INK_MUTED,
                            fontSize: 11.5,
                          }}
                        >
                          {t("summary.expected")}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.35,

                            color: INK,

                            fontSize: 14,

                            fontWeight: 600,

                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          ¥{formatAmount(fee.expectedAmount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: INK_MUTED,
                            fontSize: 11.5,
                          }}
                        >
                          {t("summary.paid")}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.35,

                            color: BRAND,

                            fontSize: 14,

                            fontWeight: 600,

                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          ¥{formatAmount(fee.paidAmount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: INK_MUTED,
                            fontSize: 11.5,
                          }}
                        >
                          {t("summary.outstanding")}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.35,

                            color: INK,

                            fontSize: 14,

                            fontWeight: 600,

                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          ¥{formatAmount(fee.outstandingAmount)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 2,

                        color: INK_MUTED,

                        fontSize: 13,
                      }}
                    >
                      <Box
                        component="strong"
                        sx={{
                          color: INK,
                          fontWeight: 600,
                        }}
                      >
                        {t("createdBy")}:
                      </Box>{" "}
                      {fee.createdByName}
                    </Typography>

                    {fee.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,

                          color: INK_MUTED,

                          fontSize: 13.5,

                          lineHeight: 1.6,

                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {fee.note}
                      </Typography>
                    )}

                    {isAdmin && fee.status === "Active" && (
                      <Box
                        sx={{
                          display: "flex",

                          justifyContent: "flex-end",

                          flexWrap: "wrap",

                          gap: 1,

                          mt: 2.5,
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => handleEdit(fee)}
                          sx={{
                            minHeight: 36,

                            px: 1.75,

                            borderRadius: 2.5,

                            borderColor: HAIRLINE,

                            color: INK_MUTED,

                            bgcolor: "#ffffff",

                            fontSize: 12.5,

                            fontWeight: 600,

                            textTransform: "none",

                            transition:
                              "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

                            "&:hover": {
                              bgcolor: BRAND_SOFT,

                              color: BRAND,

                              borderColor: "rgba(16, 122, 100, 0.30)",
                            },
                          }}
                        >
                          {t("actions.edit")}
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<CancelOutlinedIcon />}
                          onClick={() => handleOpenCancelFee(fee)}
                          sx={{
                            minHeight: 36,

                            px: 1.75,

                            borderRadius: 2.5,

                            borderColor: "rgba(220, 38, 38, 0.18)",

                            color: "#DC2626",

                            bgcolor: "#ffffff",

                            fontSize: 12.5,

                            fontWeight: 600,

                            textTransform: "none",

                            transition:
                              "background-color 200ms ease, border-color 200ms ease",

                            "&:hover": {
                              bgcolor: "#FEF2F2",

                              borderColor: "rgba(220, 38, 38, 0.35)",
                            },
                          }}
                        >
                          {t("actions.cancel")}
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {index < fees.length - 1 && (
                    <Divider
                      sx={{
                        borderColor: HAIRLINE,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ADMIN FORM */}

        {isAdmin && (
          <Box
            sx={{
              ...softCard,

              p: {
                xs: 2,
                sm: 3,
              },

              height: "fit-content",
            }}
          >
            <Typography
              sx={{
                mb: 3,

                color: INK,

                fontSize: 17,

                fontWeight: 600,

                lineHeight: 1.35,
              }}
            >
              {editingFeeId ? t("form.editTitle") : t("form.addTitle")}
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="feeName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label={t("form.feeName")}
                    error={Boolean(errors.feeName)}
                    helperText={errors.feeName?.message}
                    sx={{
                      ...fieldSx,
                      mb: 2.5,
                    }}
                  />
                )}
              />

              <Controller
                name="expectedAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label={t("form.expectedAmount")}
                    error={Boolean(errors.expectedAmount)}
                    helperText={errors.expectedAmount?.message}
                    sx={{
                      ...fieldSx,
                      mb: 2.5,
                    }}
                  />
                )}
              />

              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label={t("form.dueDate")}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    sx={{
                      ...fieldSx,
                      mb: 2.5,
                    }}
                  />
                )}
              />

              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={4}
                    label={t("form.note")}
                    error={Boolean(errors.note)}
                    helperText={errors.note?.message}
                    sx={fieldSx}
                  />
                )}
              />

              <Box
                sx={{
                  display: "flex",

                  flexDirection: {
                    xs: "column-reverse",
                    sm: "row",
                  },

                  justifyContent: "flex-end",

                  gap: 1,

                  mt: 3,
                }}
              >
                {editingFeeId && (
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={saving}
                    onClick={handleCancelEdit}
                    sx={{
                      minHeight: 40,

                      px: 2,

                      borderRadius: 2.5,

                      borderColor: HAIRLINE,

                      color: INK_MUTED,

                      bgcolor: "#ffffff",

                      fontSize: 13,

                      fontWeight: 600,

                      textTransform: "none",

                      transition:
                        "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

                      "&:hover": {
                        bgcolor: BRAND_SOFT,

                        borderColor: "rgba(16, 122, 100, 0.30)",

                        color: BRAND,
                      },
                    }}
                  >
                    {t("actions.cancelEdit")}
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={saving}
                  startIcon={
                    saving ? (
                      <CircularProgress size={17} color="inherit" />
                    ) : (
                      <AddCardOutlinedIcon />
                    )
                  }
                  sx={{
                    minHeight: 40,

                    px: 2,

                    bgcolor: BRAND,

                    color: "#ffffff",

                    borderRadius: 2.5,

                    fontSize: 13,

                    fontWeight: 600,

                    textTransform: "none",

                    boxShadow: "none",

                    transition: "background-color 200ms ease",

                    "&:hover": {
                      bgcolor: BRAND_HOVER,

                      boxShadow: "none",
                    },

                    "&.Mui-disabled": {
                      bgcolor: "rgba(16, 122, 100, 0.45)",

                      color: "#ffffff",
                    },
                  }}
                >
                  {saving
                    ? t("actions.saving")
                    : editingFeeId
                      ? t("actions.updateFee")
                      : t("actions.addFee")}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <ConfirmActionDialog
        open={Boolean(feeToCancel)}
        title={t("dialog.title")}
        description={
          feeToCancel
            ? t("dialog.description", { feeName: feeToCancel.feeName })
            : ""
        }
        confirmText={t("dialog.confirm")}
        cancelText={t("dialog.keep")}
        confirmColor="error"
        isLoading={isCancellingFee}
        onConfirm={handleConfirmCancelFee}
        onClose={handleCloseCancelFee}
      />
    </Box>
  );
};

export default ClientFees;
