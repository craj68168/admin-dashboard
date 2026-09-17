"use client";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import { REMARK_MEDIUMS } from "./type";

import type { RemarksProps } from "./type";

import { useRemarksHook } from "./hook";

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

    "&.Mui-disabled": {
      color: "rgba(75, 85, 99, 0.72)",
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

    "&.Mui-disabled": {
      bgcolor: "#F9FAFB",

      "& fieldset": {
        borderColor: HAIRLINE,
      },
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,

    "&::placeholder": {
      color: INK_MUTED,
      opacity: 0.65,
    },

    "&.Mui-disabled": {
      WebkitTextFillColor: INK_MUTED,
    },
  },

  "& .MuiSelect-select": {
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

// =================================================
// FORMAT JAPAN DATE
// =================================================

const formatJapanDate = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(date);
};

const Remarks = ({ clientId }: RemarksProps) => {
  const t = useTranslations("clientRemarks");

  const {
    user,

    remarks,

    control,
    errors,
    handleSubmit,

    onSubmit,

    isRemarksLoading,

    isSubmitting,
    isCreatingRemark,

    serverError,
    loadError,
  } = useRemarksHook(clientId);

  const loading = isSubmitting || isCreatingRemark;

  return (
    <Box>
      {/* =================================================
          TITLE
      ================================================= */}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: INK,
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.35,
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

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.5fr 1fr",
          },

          gap: {
            xs: 3,
            lg: 4,
          },
        }}
      >
        {/* =================================================
            REMARK HISTORY
        ================================================= */}

        <Box>
          <Typography
            sx={{
              mb: 2,

              color: INK,

              fontSize: 15,

              fontWeight: 600,
            }}
          >
            {t("history")}
          </Typography>

          {isRemarksLoading && (
            <Box
              sx={{
                ...softCard,

                minHeight: 150,

                display: "flex",

                alignItems: "center",

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

          {loadError && (
            <Alert
              severity="error"
              sx={{
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

          {!isRemarksLoading && !loadError && remarks.length === 0 && (
            <Box
              sx={{
                bgcolor: "#ffffff",

                border: "1px dashed rgba(16, 122, 100, 0.25)",

                borderRadius: 3,

                py: 5,

                px: 2,

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

          {!isRemarksLoading && remarks.length > 0 && (
            <Box
              sx={{
                ...softCard,

                overflow: "hidden",
              }}
            >
              {remarks.map((remark, index) => (
                <Box key={remark._id}>
                  <Box
                    sx={{
                      py: 2.5,

                      px: {
                        xs: 2,
                        sm: 2.5,
                      },

                      transition: "background-color 200ms ease",

                      "&:hover": {
                        bgcolor: "rgba(16, 122, 100, 0.025)",
                      },
                    }}
                  >
                    {/* DATE */}

                    <Typography
                      variant="body2"
                      sx={{
                        color: INK,

                        fontSize: 14,

                        fontWeight: 600,
                      }}
                    >
                      {formatJapanDate(remark.remarkDate)}
                    </Typography>

                    {/* CREATOR */}

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,

                        color: INK_MUTED,

                        fontSize: 13,
                      }}
                    >
                      {remark.staffName}

                      {remark.staffId
                        ? ` (${remark.staffId})`
                        : ` (${t("admin")})`}
                    </Typography>

                    {/* MEDIUM */}

                    <Box
                      sx={{
                        display: "inline-flex",

                        alignItems: "center",

                        mt: 1,

                        px: 1.1,

                        py: 0.4,

                        borderRadius: 999,

                        bgcolor: BRAND_SOFT,

                        color: BRAND,

                        fontSize: 11.5,

                        fontWeight: 600,
                      }}
                    >
                      {t(`mediums.${remark.medium}`)}
                    </Box>

                    {/* MEMO */}

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1.5,

                        color: INK,

                        fontSize: 13.5,

                        lineHeight: 1.65,

                        whiteSpace: "pre-wrap",

                        wordBreak: "break-word",
                      }}
                    >
                      {remark.remarks}
                    </Typography>
                  </Box>

                  {index < remarks.length - 1 && (
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

        {/* =================================================
            NEW REMARK FORM
        ================================================= */}

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
            {t("form.title")}
          </Typography>

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

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* DATE */}

            <Controller
              name="remarkDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  required
                  fullWidth
                  label={t("form.date")}
                  error={Boolean(errors.remarkDate)}
                  helperText={errors.remarkDate?.message}
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

            {/* STAFF / CREATOR */}

            <TextField
              fullWidth
              disabled
              label={t("form.staff")}
              value={
                user
                  ? user.role === "staff"
                    ? `${user.name} (${user.staffId})`
                    : user.name
                  : ""
              }
              helperText={t("form.staffHelper")}
              sx={{
                ...fieldSx,

                mb: 2.5,
              }}
            />

            {/* MEDIUM */}

            <Controller
              name="medium"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  label={t("form.medium")}
                  error={Boolean(errors.medium)}
                  helperText={errors.medium?.message}
                  sx={{
                    ...fieldSx,

                    mb: 2.5,
                  }}
                >
                  <MenuItem value="">{t("form.selectMedium")}</MenuItem>

                  {REMARK_MEDIUMS.map((medium) => (
                    <MenuItem key={medium} value={medium}>
                      {t(`mediums.${medium}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* MEMO */}

            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  multiline
                  minRows={5}
                  label={t("form.memo")}
                  placeholder={t("form.memoPlaceholder")}
                  error={Boolean(errors.remarks)}
                  helperText={errors.remarks?.message}
                  sx={fieldSx}
                />
              )}
            />

            {/* SAVE */}

            <Box
              sx={{
                display: "flex",

                justifyContent: "flex-end",

                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={17} color="inherit" />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  minHeight: 42,

                  px: 2.5,

                  bgcolor: BRAND,

                  color: "#ffffff",

                  borderRadius: 2.5,

                  fontSize: 14,

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
                {loading ? t("actions.saving") : t("actions.save")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Remarks;
