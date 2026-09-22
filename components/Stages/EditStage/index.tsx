"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useEditStageHook } from "./hook";

// =================================================
// THEME
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT =
  "rgba(16, 122, 100, 0.08)";
const BRAND_RING =
  "rgba(16, 122, 100, 0.55)";

const HAIRLINE =
  "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG =
  "rgba(17, 24, 39, 0.14)";

const INK = "#111827";
const INK_MUTED = "#4B5563";

const SURFACE_TINT = "#FAFAF9";

// =================================================
// STYLE
// =================================================

const softCard = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",

  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND_RING}`,
    outlineOffset: 2,
  },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,

    "& fieldset": {
      borderColor:
        HAIRLINE_STRONG,
    },

    "&:hover fieldset": {
      borderColor:
        "rgba(17,24,39,0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
    },

    "&.Mui-focused": {
      boxShadow:
        "0 0 0 3px rgba(16,122,100,0.10)",
    },
  },
};

// =================================================
// PAGE
// =================================================

export default function EditStagePage() {
  const {
    stage,
    form,

    isLoading,
    isError,

    refetch,

    onSubmit,
    handleCancel,

    isSubmitting,
  } = useEditStageHook();

  const {
    register,

    formState: {
      errors,
      isDirty,
    },
  } = form;

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
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                void refetch()
              }
            >
              Retry
            </Button>
          }
        >
          Failed to load stage.
        </Alert>
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
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Alert severity="warning">
          Stage not found.
        </Alert>
      </Box>
    );
  }

  // =================================================
  // RENDER
  // =================================================

  return (
    <Box
      sx={{
        width: "100%",

        bgcolor: "#F7F8F6",

        minHeight: "100%",

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
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/* BREADCRUMB */}

        <Box
          sx={{
            mb: {
              xs: 1.5,
              md: 2,
            },
          }}
        >
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                href:
                  "/admin/dashboard",
              },
              {
                label: "Stages",
                href:
                  "/admin/stages",
              },
              {
                label: "Edit Stage",
                href: `/admin/stages/${stage.stageId}/edit`,
                current: true,
              },
            ]}
          />
        </Box>

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
            component="h1"
            sx={{
              fontSize: {
                xs: 24,
                md: 30,
              },

              fontWeight: 600,

              letterSpacing: -0.4,

              lineHeight: 1.2,

              color: INK,
            }}
          >
            Edit Stage
          </Typography>

          <Typography
            sx={{
              mt: 1,

              fontSize: 14,

              color: INK_MUTED,
            }}
          >
            Update the stage name,
            amount and display order.
          </Typography>
        </Box>

        {/* FORM */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            overflow: "hidden",
          }}
        >
          <Box
            component="form"
            onSubmit={onSubmit}
            noValidate
          >
            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },

                display: "flex",

                flexDirection:
                  "column",

                gap: 3,
              }}
            >
              {/* STAGE ID */}

              <Box>
                <Typography
                  sx={{
                    mb: 0.75,

                    fontSize: 13,

                    fontWeight: 600,

                    color: INK,
                  }}
                >
                  Stage ID
                </Typography>

                <TextField
                  fullWidth
                  value={
                    stage.stageId
                  }
                  disabled
                  sx={fieldSx}
                />
              </Box>

              {/* KEY */}

              <Box>
                <Typography
                  sx={{
                    mb: 0.75,

                    fontSize: 13,

                    fontWeight: 600,

                    color: INK,
                  }}
                >
                  Stage Key
                </Typography>

                <TextField
                  fullWidth
                  value={stage.key}
                  disabled
                  sx={fieldSx}
                />

                <Typography
                  sx={{
                    mt: 0.75,

                    fontSize: 12.5,

                    color: INK_MUTED,
                  }}
                >
                  The stage key cannot be
                  changed.
                </Typography>
              </Box>

              {/* NAME */}

              <Box>
                <Typography
                  component="label"
                  htmlFor="stage-name"
                  sx={{
                    display: "block",

                    mb: 0.75,

                    fontSize: 13,

                    fontWeight: 600,

                    color: INK,
                  }}
                >
                  Stage Name
                </Typography>

                <TextField
                  id="stage-name"

                  fullWidth

                  disabled={
                    isSubmitting
                  }

                  error={Boolean(
                    errors.name,
                  )}

                  helperText={
                    errors.name
                      ?.message
                  }

                  {...register("name")}

                  sx={fieldSx}
                />
              </Box>

              {/* AMOUNT */}

              <Box>
                <Typography
                  component="label"
                  htmlFor="stage-amount"
                  sx={{
                    display: "block",

                    mb: 0.75,

                    fontSize: 13,

                    fontWeight: 600,

                    color: INK,
                  }}
                >
                  Amount
                </Typography>

                <TextField
                  id="stage-amount"

                  fullWidth

                  type="number"

                  disabled={
                    isSubmitting
                  }

                  error={Boolean(
                    errors.amount,
                  )}

                  helperText={
                    errors.amount
                      ?.message
                  }

                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 1,
                    },
                  }}

                  {...register(
                    "amount",
                  )}

                  sx={fieldSx}
                />

                <Typography
                  sx={{
                    mt: 0.75,

                    fontSize: 12.5,

                    color: INK_MUTED,
                  }}
                >
                  Amount in Japanese yen.
                </Typography>
              </Box>

              {/* DISPLAY ORDER */}

              <Box>
                <Typography
                  component="label"
                  htmlFor="display-order"
                  sx={{
                    display: "block",

                    mb: 0.75,

                    fontSize: 13,

                    fontWeight: 600,

                    color: INK,
                  }}
                >
                  Display Order
                </Typography>

                <TextField
                  id="display-order"

                  fullWidth

                  type="number"

                  disabled={
                    isSubmitting
                  }

                  error={Boolean(
                    errors.displayOrder,
                  )}

                  helperText={
                    errors
                      .displayOrder
                      ?.message
                  }

                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                    },
                  }}

                  {...register(
                    "displayOrder",
                  )}

                  sx={fieldSx}
                />
              </Box>
            </Box>

            {/* ACTION BAR */}

            <Box
              sx={{
                px: {
                  xs: 2,
                  sm: 3,
                },

                py: 2,

                display: "flex",

                flexDirection: {
                  xs: "column-reverse",
                  sm: "row",
                },

                justifyContent:
                  "flex-end",

                gap: 1.25,

                borderTop: `1px solid ${HAIRLINE}`,

                bgcolor:
                  SURFACE_TINT,
              }}
            >
              <Button
                type="button"

                variant="outlined"

                startIcon={
                  <ArrowBackRoundedIcon />
                }

                onClick={
                  handleCancel
                }

                disabled={
                  isSubmitting
                }

                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  minWidth: 110,

                  borderRadius: 2.5,

                  textTransform: "none",

                  fontWeight: 600,

                  color: INK_MUTED,

                  borderColor:
                    HAIRLINE_STRONG,

                  "&:hover": {
                    borderColor:
                      BRAND,

                    bgcolor:
                      BRAND_SOFT,

                    color:
                      BRAND_DARK,
                  },

                  ...focusRing,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"

                variant="contained"

                disableElevation

                disabled={
                  isSubmitting ||
                  !isDirty
                }

                startIcon={
                  isSubmitting ? (
                    <CircularProgress
                      size={17}
                      color="inherit"
                    />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }

                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  minWidth: 135,

                  bgcolor: BRAND,

                  borderRadius: 2.5,

                  textTransform: "none",

                  fontWeight: 600,

                  px: 2.5,

                  boxShadow: "none",

                  "&:hover": {
                    bgcolor:
                      BRAND_DARK,

                    boxShadow:
                      "none",
                  },

                  "&.Mui-disabled": {
                    bgcolor:
                      "rgba(16,122,100,0.35)",

                    color:
                      "#ffffff",
                  },

                  ...focusRing,
                }}
              >
                {isSubmitting
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}