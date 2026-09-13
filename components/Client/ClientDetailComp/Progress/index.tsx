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

import { CLIENT_STAGES } from "./type";

import type { ProgressProps } from "./type";

import { useProgressHook } from "./hook";

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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Progress
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Client recruitment and visa progress history.
        </Typography>
      </Box>

      {loadError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loadError}
        </Alert>
      )}

      {isProgressLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              lg: "1.5fr 1fr",
            },

            gap: 4,
          }}
        >
          {/* HISTORY */}

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Stage History
            </Typography>

            {history.length === 0 ? (
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No stage changes recorded yet.
                </Typography>
              </Box>
            ) : (
              history.map((item, index) => (
                <Box key={item._id}>
                  <Box
                    sx={{
                      py: 2.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.toStage}
                    </Typography>

                    {item.fromStage && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {item.fromStage}
                        {" → "}
                        {item.toStage}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.75,
                      }}
                    >
                      {formatTokyoDateTime(item.createdAt)}
                      {" · "}
                      {item.changedByName}
                      {item.staffId ? ` (${item.staffId})` : " (Admin)"}
                    </Typography>

                    {item.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.25,

                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {item.note}
                      </Typography>
                    )}
                  </Box>

                  {index < history.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </Box>

          {/* CHANGE STAGE */}

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
              height: "fit-content",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Current Stage
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: 600, mt: 1, mb: 3 }}>
              {currentStage || "Registration Pending"}
            </Typography>

            {serverError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
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
                    label="Change Stage"
                    error={Boolean(errors.stage)}
                    helperText={errors.stage?.message}
                    sx={{
                      mb: 2.5,
                    }}
                  >
                    <MenuItem value="">Select stage</MenuItem>

                    {CLIENT_STAGES.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage}
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
                    label="Note"
                    placeholder="Optional progress note..."
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
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={17} color="inherit" />
                    ) : (
                      <UpdateOutlinedIcon />
                    )
                  }
                >
                  {loading ? "Updating..." : "Update Stage"}
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
