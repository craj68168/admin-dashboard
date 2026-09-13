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

import { REMARK_MEDIUMS } from "./type";

import type { RemarksProps } from "./type";

import { useRemarksHook } from "./hook";

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
        <Typography variant="h6" fontWeight={600}>
          Remarks
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Communication and follow-up history for this client.
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

          gap: 4,
        }}
      >
        {/* =================================================
            REMARK HISTORY
        ================================================= */}

        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Remark History
          </Typography>

          {isRemarksLoading && (
            <Box
              sx={{
                minHeight: 150,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}

          {loadError && <Alert severity="error">{loadError}</Alert>}

          {!isRemarksLoading && !loadError && remarks.length === 0 && (
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",

                borderRadius: 2,

                py: 5,

                px: 2,

                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No remarks have been added yet.
              </Typography>
            </Box>
          )}

          {!isRemarksLoading && remarks.length > 0 && (
            <Box>
              {remarks.map((remark, index) => (
                <Box key={remark._id}>
                  <Box
                    sx={{
                      py: 2.5,
                    }}
                  >
                    {/* DATE */}

                    <Typography variant="body2" fontWeight={600}>
                      {formatJapanDate(remark.remarkDate)}
                    </Typography>

                    {/* CREATOR */}

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                      }}
                    >
                      {remark.staffName}

                      {remark.staffId ? ` (${remark.staffId})` : " (Admin)"}
                    </Typography>

                    {/* MEDIUM */}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",

                        mt: 0.5,
                      }}
                    >
                      {remark.medium}
                    </Typography>

                    {/* MEMO */}

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1.5,

                        whiteSpace: "pre-wrap",

                        wordBreak: "break-word",
                      }}
                    >
                      {remark.remarks}
                    </Typography>
                  </Box>

                  {index < remarks.length - 1 && <Divider />}
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
            border: "1px solid",

            borderColor: "divider",

            borderRadius: 2,

            p: 3,

            height: "fit-content",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
            New Remark
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
                  label="Date"
                  error={Boolean(errors.remarkDate)}
                  helperText={errors.remarkDate?.message}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{
                    mb: 2.5,
                  }}
                />
              )}
            />

            {/* STAFF / CREATOR */}

            <TextField
              fullWidth
              disabled
              label="Staff"
              value={
                user
                  ? user.role === "staff"
                    ? `${user.name} (${user.staffId})`
                    : user.name
                  : ""
              }
              helperText="Automatically recorded from the logged-in account."
              sx={{
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
                  label="Medium"
                  error={Boolean(errors.medium)}
                  helperText={errors.medium?.message}
                  sx={{
                    mb: 2.5,
                  }}
                >
                  <MenuItem value="">Select medium</MenuItem>

                  {REMARK_MEDIUMS.map((medium) => (
                    <MenuItem key={medium} value={medium}>
                      {medium}
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
                  label="Memo"
                  placeholder="Enter conversation or follow-up details..."
                  error={Boolean(errors.remarks)}
                  helperText={errors.remarks?.message}
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
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={17} color="inherit" />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Remarks;
