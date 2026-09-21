"use client";

import { useState } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import { REMARK_MEDIUMS } from "./type";

import type { RemarksProps } from "./type";

import { useRemarksHook } from "./hook";

// =================================================
// DESIGN TOKENS
// Styling only, no business logic
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_DEEP = "#0A5546";
const BRAND_SOFT = "rgba(16, 122, 100, 0.09)";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#4B5563";
const MUTED = "#6B7280";
const DANGER = "#DC2626";

// How many remarks show before "Show all"
const REMARKS_PREVIEW_COUNT = 4;

const errorAlertSx = {
  borderRadius: 2.5,
  border: "1px solid rgba(220, 38, 38, 0.14)",
  bgcolor: "#FEF2F2",
  color: "#991B1B",
  "& .MuiAlert-icon": { color: DANGER },
};

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: INK_MUTED,
    fontSize: 14,
    "&.Mui-focused": { color: BRAND },
    "&.Mui-error": { color: DANGER },
    "&.Mui-disabled": { color: "rgba(75, 85, 99, 0.72)" },
  },

  "& .MuiOutlinedInput-root": {
    bgcolor: SURFACE,
    color: INK,
    borderRadius: 2,
    transition: "border-color 200ms ease",

    "& fieldset": { borderColor: HAIRLINE },
    "&:hover fieldset": { borderColor: "rgba(16, 122, 100, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: "1px" },
    "&.Mui-error fieldset": { borderColor: DANGER },

    "&.Mui-disabled": {
      bgcolor: "#F3F5F4",
      "& fieldset": { borderColor: HAIRLINE },
    },
  },

  "& .MuiInputBase-input": {
    fontSize: 14,
    "&::placeholder": { color: INK_MUTED, opacity: 0.65 },
    "&.Mui-disabled": { WebkitTextFillColor: INK_MUTED },
  },

  "& .MuiSelect-select": { fontSize: 14 },

  "& .MuiFormHelperText-root": {
    mx: 0.5,
    mt: 0.5,
    color: INK_MUTED,
    fontSize: 11.5,
    "&.Mui-error": { color: DANGER },
  },
};

// =================================================
// HELPERS
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

const getInitials = (name?: string) => {
  if (!name) {
    return "?";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// =================================================
// REMARKS
// =================================================

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

  const [showAllRemarks, setShowAllRemarks] = useState(false);

  const canCollapseRemarks = remarks.length > REMARKS_PREVIEW_COUNT;

  const visibleRemarks =
    showAllRemarks || !canCollapseRemarks
      ? remarks
      : remarks.slice(0, REMARKS_PREVIEW_COUNT);

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
        }}
      >
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

          {!isRemarksLoading && !loadError && remarks.length > 0 && (
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
              {remarks.length}
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

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.45fr) minmax(0, 1fr)",
          },
          gap: { xs: 2.5, lg: 3 },
          alignItems: "start",
        }}
      >
        {/* =================================================
            NEW REMARK FORM
            On mobile it comes first so the person can add a
            note without scrolling past a long history.
        ================================================= */}

        <Box
          sx={{
            order: { xs: 1, lg: 2 },
            p: { xs: 1.75, sm: 2.25 },
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 3,
            bgcolor: SURFACE_ALT,
          }}
        >
          <Typography
            component="h3"
            sx={{
              mb: 1.75,
              color: INK,
              fontSize: 14.5,
              fontWeight: 700,
            }}
          >
            {t("form.title")}
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ ...errorAlertSx, mb: 1.5 }}>
              {serverError}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            {/* DATE + MEDIUM */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "minmax(0, 1fr)",
                  xl: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <Controller
                name="remarkDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    required
                    fullWidth
                    size="small"
                    label={t("form.date")}
                    error={Boolean(errors.remarkDate)}
                    helperText={errors.remarkDate?.message}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={fieldSx}
                  />
                )}
              />

              <Controller
                name="medium"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    size="small"
                    label={t("form.medium")}
                    error={Boolean(errors.medium)}
                    helperText={errors.medium?.message}
                    sx={fieldSx}
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
            </Box>

            {/* STAFF / CREATOR */}

            <TextField
              fullWidth
              disabled
              size="small"
              label={t("form.staff")}
              value={
                user
                  ? user.role === "staff"
                    ? `${user.name} (${user.staffId})`
                    : user.name
                  : ""
              }
              helperText={t("form.staffHelper")}
              sx={fieldSx}
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
                  minRows={4}
                  size="small"
                  label={t("form.memo")}
                  placeholder={t("form.memoPlaceholder")}
                  error={Boolean(errors.remarks)}
                  helperText={errors.remarks?.message}
                  sx={fieldSx}
                />
              )}
            />

            {/* SAVE */}

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveOutlinedIcon />
                )
              }
              sx={{
                alignSelf: { xs: "stretch", sm: "flex-end" },
                minHeight: 40,
                px: 2.5,
                bgcolor: BRAND,
                color: "#ffffff",
                borderRadius: 2,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: BRAND_HOVER },
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

        {/* =================================================
            REMARK HISTORY
        ================================================= */}

        <Box sx={{ order: { xs: 2, lg: 1 }, minWidth: 0 }}>
          <Typography
            component="h3"
            sx={{
              mb: 1.5,
              color: INK,
              fontSize: 14.5,
              fontWeight: 700,
            }}
          >
            {t("history")}
          </Typography>

          {isRemarksLoading && (
            <Box
              sx={{
                minHeight: 140,
                display: "grid",
                placeItems: "center",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 3,
                bgcolor: SURFACE_ALT,
              }}
            >
              <CircularProgress size={26} sx={{ color: BRAND }} />
            </Box>
          )}

          {loadError && (
            <Alert severity="error" sx={errorAlertSx}>
              {loadError}
            </Alert>
          )}

          {!isRemarksLoading && !loadError && remarks.length === 0 && (
            <Box
              sx={{
                py: 4,
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
                <ChatBubbleOutlineRoundedIcon fontSize="small" />
              </Box>

              <Typography sx={{ color: INK_MUTED, fontSize: 13.5 }}>
                {t("empty")}
              </Typography>
            </Box>
          )}

          {!isRemarksLoading && remarks.length > 0 && (
            <Box>
              <Box
                sx={{
                  // Collapsed: only the first few remarks. Expanded: scrolls
                  // inside a fixed height so the section never keeps growing.
                  maxHeight: showAllRemarks ? { xs: 480, lg: 600 } : "none",
                  overflowY: showAllRemarks ? "auto" : "visible",
                  pr: showAllRemarks ? 1 : 0,
                  mr: showAllRemarks ? -1 : 0,
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(17,24,39,0.18) transparent",
                }}
              >
                {visibleRemarks.map((remark, index) => {
                  const isLast = index === visibleRemarks.length - 1;

                  return (
                    <Box
                      key={remark._id}
                      sx={{
                        position: "relative",
                        pl: { xs: 5, sm: 5.5 },
                        pb: isLast ? 0 : 2,

                        // Timeline rail
                        "&::before": isLast
                          ? undefined
                          : {
                              content: '""',
                              position: "absolute",
                              left: 15,
                              top: 34,
                              bottom: 2,
                              width: 2,
                              borderRadius: 1,
                              bgcolor: HAIRLINE,
                            },
                      }}
                    >
                      {/* AVATAR */}

                      <Box
                        aria-hidden
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 32,
                          height: 32,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          bgcolor: BRAND_SOFT,
                          color: BRAND_DEEP,
                          border: "2px solid #ffffff",
                          boxShadow: `0 0 0 1px ${HAIRLINE}`,
                          fontSize: 11.5,
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {getInitials(remark.staffName)}
                      </Box>

                      {/* HEADER */}

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          columnGap: 1,
                          rowGap: 0.25,
                          minHeight: 32,
                        }}
                      >
                        <Typography
                          sx={{
                            color: INK,
                            fontSize: 13.5,
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {remark.staffName}

                          <Box
                            component="span"
                            sx={{
                              ml: 0.5,
                              color: MUTED,
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {remark.staffId
                              ? `(${remark.staffId})`
                              : `(${t("admin")})`}
                          </Box>
                        </Typography>

                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1,
                            py: 0.3,
                            borderRadius: 999,
                            bgcolor: BRAND_SOFT,
                            color: BRAND,
                            fontSize: 11.5,
                            fontWeight: 600,
                            lineHeight: 1.3,
                          }}
                        >
                          {t(`mediums.${remark.medium}`)}
                        </Box>

                        <Typography
                          component="time"
                          sx={{
                            ml: { sm: "auto" },
                            flexBasis: { xs: "100%", sm: "auto" },
                            color: MUTED,
                            fontSize: 12,
                            fontWeight: 500,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {formatJapanDate(remark.remarkDate)}
                        </Typography>
                      </Box>

                      {/* MEMO */}

                      <Box
                        sx={{
                          mt: 0.75,
                          px: 1.5,
                          py: 1.25,
                          border: `1px solid ${HAIRLINE}`,
                          borderRadius: 2.5,
                          borderTopLeftRadius: 4,
                          bgcolor: SURFACE_ALT,
                        }}
                      >
                        <Typography
                          sx={{
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
                    </Box>
                  );
                })}
              </Box>

              {canCollapseRemarks && (
                <Button
                  type="button"
                  size="small"
                  onClick={() => setShowAllRemarks((prev) => !prev)}
                  endIcon={
                    showAllRemarks ? (
                      <ExpandLessRoundedIcon />
                    ) : (
                      <ExpandMoreRoundedIcon />
                    )
                  }
                  sx={{
                    mt: 1.5,
                    ml: { xs: 5, sm: 5.5 },
                    color: BRAND,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: BRAND_SOFT },
                  }}
                >
                  {showAllRemarks
                    ? "Show less"
                    : `Show all ${remarks.length} remarks`}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Remarks;