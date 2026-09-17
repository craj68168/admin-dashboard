"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";

import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import { CLIENT_STAGES } from "./type";

import type { ProgressProps } from "./type";

import { useProgressHook } from "./hook";

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

    "&::placeholder": {
      color: INK_MUTED,
      opacity: 0.65,
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
// TOKYO DATE/TIME
// =================================================

const formatTokyoDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",

    year: "numeric",
    month: "2-digit",
    day: "2-digit",

    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const Progress = ({ clientId }: ProgressProps) => {
  const t = useTranslations("clientProgress");

  const {
    currentStage,
    history,

    control,
    errors,
    handleSubmit,

    onSubmit,

    isProgressLoading,

    isSubmitting,
    isChangingStage,

    serverError,
    loadError,
  } = useProgressHook(clientId);

  const loading = isSubmitting || isChangingStage;

  return (
    <Box>
      {/* TITLE */}

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

      {loadError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,

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

      {isProgressLoading ? (
        <Box
          sx={{
            ...softCard,

            display: "flex",

            justifyContent: "center",

            py: 5,
          }}
        >
          <CircularProgress
            size={28}
            sx={{
              color: BRAND,
            }}
          />
        </Box>
      ) : (
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
          {/* HISTORY */}

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

            {history.length === 0 ? (
              <Box
                sx={{
                  bgcolor: "#ffffff",

                  border: "1px dashed rgba(16, 122, 100, 0.25)",

                  borderRadius: 3,

                  p: {
                    xs: 3.5,
                    sm: 4,
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
            ) : (
              <Box
                sx={{
                  ...softCard,

                  overflow: "hidden",
                }}
              >
                {history.map((item, index) => (
                  <Box key={item._id}>
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
                      <Typography
                        sx={{
                          color: INK,

                          fontSize: 14.5,

                          fontWeight: 600,

                          lineHeight: 1.4,
                        }}
                      >
                        {t(`stages.${item.toStage}`)}
                      </Typography>

                      {item.fromStage && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,

                            color: INK_MUTED,

                            fontSize: 13,
                          }}
                        >
                          {t(`stages.${item.fromStage}`)}
                          {" → "}
                          <Box
                            component="span"
                            sx={{
                              color: BRAND,

                              fontWeight: 600,
                            }}
                          >
                            {t(`stages.${item.toStage}`)}
                          </Box>
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",

                          mt: 0.8,

                          color: INK_MUTED,

                          fontSize: 11.5,

                          lineHeight: 1.5,
                        }}
                      >
                        {formatTokyoDateTime(item.createdAt)}
                        {" · "}
                        {item.changedByName}
                        {item.staffId
                          ? ` (${item.staffId})`
                          : ` (${t("admin")})`}
                      </Typography>

                      {item.note && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1.5,

                            p: 1.5,

                            bgcolor: "#F9FAFB",

                            border: `1px solid ${HAIRLINE}`,

                            borderRadius: 2,

                            color: INK_MUTED,

                            fontSize: 13.5,

                            lineHeight: 1.6,

                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {item.note}
                        </Typography>
                      )}
                    </Box>

                    {index < history.length - 1 && (
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

          {/* CHANGE STAGE */}

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
                color: INK,

                fontSize: 15,

                fontWeight: 600,

                lineHeight: 1.4,
              }}
            >
              {t("currentStage")}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",

                alignItems: "center",

                mt: 1,

                mb: 3,

                px: 1.4,

                py: 0.65,

                borderRadius: 999,

                bgcolor: BRAND_SOFT,

                color: BRAND,

                fontSize: 13,

                fontWeight: 600,
              }}
            >
              {currentStage
                ? t(`stages.${currentStage}`)
                : t("stages.Registration Pending")}
            </Box>

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
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    label={t("form.changeStage")}
                    error={Boolean(errors.stage)}
                    helperText={errors.stage?.message}
                    sx={{
                      ...fieldSx,

                      mb: 2.5,
                    }}
                  >
                    <MenuItem value="">{t("form.selectStage")}</MenuItem>

                    {CLIENT_STAGES.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {t(`stages.${stage}`)}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    placeholder={t("form.notePlaceholder")}
                    error={Boolean(errors.note)}
                    helperText={errors.note?.message}
                    sx={fieldSx}
                  />
                )}
              />

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
                      <UpdateOutlinedIcon />
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
                  {loading ? t("actions.updating") : t("actions.updateStage")}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Progress;
