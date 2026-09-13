"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { Controller } from "react-hook-form";

import type { PerformanceProps, PerformanceStatus } from "./type";

import { usePerformanceHook } from "./hook";

// =================================================
// AMOUNT
// =================================================

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

// =================================================
// STATUS COLOR
// =================================================

const getStatusColor = (
  status: PerformanceStatus,
): "default" | "info" | "warning" | "success" => {
  switch (status) {
    case "Not Started":
      return "default";

    case "In Progress":
      return "warning";

    case "Achieved":
      return "success";

    case "No Target":
    default:
      return "info";
  }
};

// =================================================
// SUMMARY CARD
// =================================================

type SummaryCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

const SummaryCard = ({ label, value, icon }: SummaryCardProps) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>

          <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            color: "text.secondary",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Box>
  );
};

// =================================================
// COMPONENT
// =================================================

const Performance = ({ staffId }: PerformanceProps) => {
  const {
    isAdmin,

    selectedMonth,
    handleMonthChange,

    target,
    performance,

    staff,

    control,
    errors,

    handleSubmit,
    onSubmit,

    isPerformanceLoading,
    isPerformanceFetching,

    isSubmitting,
    isCreatingTarget,
    isUpdatingTarget,

    serverError,
    successMessage,
    loadError,
  } = usePerformanceHook(staffId);

  const saving = isSubmitting || isCreatingTarget || isUpdatingTarget;

  const progressValue = Math.min(
    Math.max(performance.achievementPercentage, 0),
    100,
  );

  return (
    <Box>
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

          flexDirection: {
            xs: "column",
            md: "row",
          },

          gap: 2,

          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Collection Performance
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monthly payment collection performance for this staff member.
          </Typography>
        </Box>

        <TextField
          type="month"
          size="small"
          label="Month"
          value={selectedMonth}
          onChange={(event) => handleMonthChange(event.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={{
            width: {
              xs: "100%",
              sm: 200,
            },
          }}
        />
      </Box>

      {loadError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loadError}
        </Alert>
      )}

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {serverError}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {isPerformanceLoading ? (
        <Box
          sx={{
            minHeight: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      ) : (
        <>
          {/* STAFF / STATUS */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {staff?.name || staffId}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {staffId}
              </Typography>
            </Box>

            <Chip
              label={performance.status}
              color={getStatusColor(performance.status)}
            />
          </Box>

          {/* SUMMARY CARDS */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                xl: "repeat(4, 1fr)",
              },

              gap: 2,

              mb: 3,
            }}
          >
            <SummaryCard
              label="Target"
              value={`¥${formatAmount(performance.targetAmount)}`}
              icon={<TrackChangesOutlinedIcon />}
            />

            <SummaryCard
              label="Collected"
              value={`¥${formatAmount(performance.totalCollected)}`}
              icon={<PaymentsOutlinedIcon />}
            />

            <SummaryCard
              label="Remaining"
              value={`¥${formatAmount(performance.remainingAmount)}`}
              icon={<AccountBalanceWalletOutlinedIcon />}
            />

            <SummaryCard
              label="Achievement"
              value={`${performance.achievementPercentage}%`}
              icon={<PercentOutlinedIcon />}
            />
          </Box>

          {/* PROGRESS BAR */}

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Monthly Progress
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {performance.achievementPercentage}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 10,
                borderRadius: 10,
              }}
            />

            <Box
              sx={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                mt: 2,
              }}
            >
              <Typography variant="body2">
                <strong>Payments:</strong> {performance.paymentCount}
              </Typography>

              <Typography variant="body2">
                <strong>Clients:</strong> {performance.clientCount}
              </Typography>
            </Box>

            {isPerformanceFetching && !isPerformanceLoading && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 1,
                }}
              >
                Refreshing...
              </Typography>
            )}
          </Box>

          {/* ADMIN TARGET FORM */}

          {isAdmin && (
            <Box
              sx={{
                maxWidth: 550,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                {target ? "Update Target" : "Set Monthly Target"}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Target month: {selectedMonth}
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="targetAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      label="Target Amount"
                      placeholder="1000000"
                      error={Boolean(errors.targetAmount)}
                      helperText={errors.targetAmount?.message}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                        },
                      }}
                      sx={{
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
                      label="Note"
                      placeholder="Optional target note..."
                      error={Boolean(errors.note)}
                      helperText={errors.note?.message}
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
                    disabled={saving}
                    startIcon={
                      saving ? (
                        <CircularProgress size={17} color="inherit" />
                      ) : (
                        <SaveOutlinedIcon />
                      )
                    }
                  >
                    {saving
                      ? "Saving..."
                      : target
                        ? "Update Target"
                        : "Set Target"}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Performance;
