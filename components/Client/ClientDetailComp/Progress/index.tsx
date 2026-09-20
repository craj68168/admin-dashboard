"use client";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import type { ProgressProps } from "./type";
import { useProgressHook } from "./hook";
// =================================================
// DESIGN
// =================================================
const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.08)";
const INK = "#111827";
const INK_MUTED = "#6B7280";
const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: 13.5,
    "&.Mui-focused": {
      color: BRAND,
    },
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#ffffff",
    "& fieldset": {
      borderColor: HAIRLINE,
    },
    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.35)",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: 13.5,
  },
  "& .MuiSelect-select": {
    fontSize: 13.5,
  },
};
// =================================================
// DATE
// =================================================
const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
// =================================================
// AMOUNT
// =================================================
const formatAmount = (amount?: number | null) => {
  return new Intl.NumberFormat("ja-JP").format(Number(amount ?? 0));
};
// =================================================
// PROGRESS
// =================================================
const Progress = ({ clientId }: ProgressProps) => {
  const {
    history,
    currentStage,
    currentStageName,
    currentStageAmount,
    stageOptions,
    selectedStageValue,
    selectedStageDetails,
    note,
    handleStageChange,
    handleNoteChange,
    handleUpdateStage,
    isHistoryLoading,
    isHistoryFetching,
    isStageLoading,
    isStageFetching,
    isUpdatingStage,
    historyLoadError,
    stageLoadError,
    formError,
    successMessage,
  } = useProgressHook(clientId);
  const loading = isHistoryLoading || isStageLoading;
  const refreshing = isHistoryFetching || isStageFetching;
  const sameStage =
    Boolean(currentStage) && selectedStageValue === currentStage;
  // =================================================
  // LABEL HELPER
  // =================================================
  const getStageName = (
    stageKey?: string | null,
    storedName?: string | null,
  ) => {
    if (storedName) {
      return storedName;
    }
    if (!stageKey) {
      return "-";
    }
    return (
      stageOptions.find((stage) => stage.key === stageKey)?.name || stageKey
    );
  };
  // =================================================
  // LOADING
  // =================================================
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 180,
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
    );
  }
  return (
    <Box>
      {/* =================================================
HEADER
================================================= */}
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TrendingUpRoundedIcon
              sx={{
                fontSize: 21,
                color: BRAND,
              }}
            />
            <Typography
              sx={{
                color: INK,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Progress
            </Typography>
          </Box>
          <Typography
            sx={{
              mt: 0.5,
              color: INK_MUTED,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {`Manage the client's current stage and review stage history.`}
          </Typography>
        </Box>
        {refreshing && !loading && (
          <CircularProgress
            size={18}
            sx={{
              color: BRAND,
            }}
          />
        )}
      </Box>
      {/* =================================================
ERRORS
================================================= */}
      {historyLoadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {historyLoadError}
        </Alert>
      )}
      {stageLoadError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {stageLoadError}
        </Alert>
      )}
      {formError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {formError}
        </Alert>
      )}
      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {successMessage}
        </Alert>
      )}
      {/* =================================================
CURRENT STAGE
================================================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 2,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 2,
            bgcolor: "#FAFBFA",
          }}
        >
          <Typography
            sx={{
              color: INK_MUTED,
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Current Stage
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={currentStageName}
              size="small"
              sx={{
                bgcolor: BRAND_SOFT,
                color: BRAND,
                fontWeight: 700,
              }}
            />
          </Box>
          <Typography
            sx={{
              mt: 1,
              color: INK_MUTED,
              fontSize: 12,
            }}
          >
            Key: {currentStage || "-"}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 2,
            bgcolor: "#FAFBFA",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <PaymentsOutlinedIcon
              sx={{
                fontSize: 18,
                color: BRAND,
              }}
            />
            <Typography
              sx={{
                color: INK_MUTED,
                fontSize: 11.5,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Configured Stage Amount
            </Typography>
          </Box>
          <Typography
            sx={{
              mt: 1,
              color: INK,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ¥{formatAmount(currentStageAmount)}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: INK_MUTED,
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            This is the current stage configuration. It does not automatically
            create a payment.
          </Typography>
        </Box>
      </Box>
      {/* =================================================
CHANGE STAGE
================================================= */}
      <Box
        sx={{
          p: {
            xs: 1.75,
            sm: 2.25,
          },
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 2,
          bgcolor: "#ffffff",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: 2,
          }}
        >
          <UpdateRoundedIcon
            sx={{
              fontSize: 19,
              color: BRAND,
            }}
          />
          <Typography
            sx={{
              color: INK,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Update Stage
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1fr) minmax(0, 1.5fr) auto",
            },
            gap: 1.5,
            alignItems: "start",
          }}
        >
          <TextField
            select
            size="small"
            fullWidth
            label="Stage"
            value={selectedStageValue}
            disabled={
              isStageLoading || isUpdatingStage || Boolean(stageLoadError)
            }
            onChange={(event) => {
              handleStageChange(event.target.value);
            }}
            sx={fieldSx}
          >
            {stageOptions.map((stage) => (
              <MenuItem key={stage._id} value={stage.key}>
                {stage.name} — ¥{formatAmount(stage.amount)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            label="Note"
            placeholder="Optional note about this stage change"
            value={note}
            disabled={isUpdatingStage}
            onChange={(event) => {
              handleNoteChange(event.target.value);
            }}
            sx={fieldSx}
          />
          <Button
            type="button"
            variant="contained"
            disableElevation
            disabled={
              isUpdatingStage ||
              sameStage ||
              !selectedStageValue ||
              Boolean(stageLoadError)
            }
            onClick={handleUpdateStage}
            startIcon={
              isUpdatingStage ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                <UpdateRoundedIcon />
              )
            }
            sx={{
              minHeight: 40,
              px: 2,
              borderRadius: 2,
              bgcolor: BRAND,
              fontSize: 13.5,
              fontWeight: 700,
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: BRAND_HOVER,
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(16, 122, 100, 0.35)",
                color: "#ffffff",
              },
            }}
          >
            {isUpdatingStage ? "Updating..." : "Update Stage"}
          </Button>
        </Box>
        {selectedStageDetails && selectedStageDetails.key !== currentStage && (
          <Box
            sx={{
              mt: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 1.5,
              bgcolor: BRAND_SOFT,
            }}
          >
            <Typography
              sx={{
                color: BRAND,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              Selected stage: {selectedStageDetails.name} — ¥
              {formatAmount(selectedStageDetails.amount)}
            </Typography>
            <Typography
              sx={{
                mt: 0.3,
                color: INK_MUTED,
                fontSize: 12,
              }}
            >
              The configured amount will be saved in stage history as a
              snapshot.
            </Typography>
          </Box>
        )}
      </Box>
      {/* =================================================
HISTORY
================================================= */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: 2,
          }}
        >
          <HistoryRoundedIcon
            sx={{
              fontSize: 19,
              color: BRAND,
            }}
          />
          <Typography
            sx={{
              color: INK,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Stage History
          </Typography>
        </Box>
        {history.length === 0 ? (
          <Box
            sx={{
              p: 3,
              border: `1px dashed ${HAIRLINE}`,
              borderRadius: 2,
              textAlign: "center",
              bgcolor: "#FAFBFA",
            }}
          >
            <Typography
              sx={{
                color: INK_MUTED,
                fontSize: 13.5,
              }}
            >
              No stage history found.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {history.map((item, index) => {
              const fromStageName = item.fromStage
                ? getStageName(item.fromStage, item.fromStageName)
                : "Initial";
              const toStageName = getStageName(item.toStage, item.toStageName);
              const stageAmount = item.toStageAmount ?? 0;
              return (
                <Box
                  key={item._id}
                  sx={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "26px minmax(0, 1fr)",
                      sm: "32px minmax(0, 1fr)",
                    },
                    columnGap: 1.5,
                    pb: index === history.length - 1 ? 0 : 2.5,
                  }}
                >
                  {/* TIMELINE */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 2,
                        width: 12,
                        height: 12,
                        mt: 0.75,
                        borderRadius: "50%",
                        bgcolor: index === 0 ? BRAND : "#D1D5DB",
                        border: "2px solid #ffffff",
                        boxShadow: `0 0 0 2px ${
                          index === 0
                            ? "rgba(16,122,100,0.20)"
                            : "rgba(107,114,128,0.15)"
                        }`,
                      }}
                    />
                    {index !== history.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 18,
                          bottom: -7,
                          width: "1px",
                          bgcolor: HAIRLINE,
                        }}
                      />
                    )}
                  </Box>
                  {/* HISTORY CARD */}
                  <Box
                    sx={{
                      p: {
                        xs: 1.5,
                        sm: 1.75,
                      },
                      border: `1px solid ${HAIRLINE}`,
                      borderRadius: 2,
                      bgcolor:
                        index === 0 ? "rgba(16,122,100,0.035)" : "#ffffff",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: {
                          xs: "flex-start",
                          sm: "center",
                        },
                        justifyContent: "space-between",
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          sx={{
                            color: INK_MUTED,
                            fontSize: 13,
                          }}
                        >
                          {fromStageName}
                        </Typography>
                        <Typography
                          sx={{
                            color: INK_MUTED,
                            fontSize: 13,
                          }}
                        >
                          →
                        </Typography>
                        <Typography
                          sx={{
                            color: BRAND,
                            fontSize: 13.5,
                            fontWeight: 700,
                          }}
                        >
                          {toStageName}
                        </Typography>
                        {index === 0 && (
                          <Chip
                            label="Latest"
                            size="small"
                            sx={{
                              height: 22,
                              bgcolor: BRAND_SOFT,
                              color: BRAND,
                              fontSize: 10.5,
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          color: INK_MUTED,
                          fontSize: 11.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDateTime(item.createdAt)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                        mt: 1.25,
                      }}
                    >
                      <Typography
                        sx={{
                          color: INK_MUTED,
                          fontSize: 12,
                        }}
                      >
                        Stage amount:{" "}
                        <Box
                          component="span"
                          sx={{
                            color: INK,
                            fontWeight: 600,
                          }}
                        >
                          ¥{formatAmount(stageAmount)}
                        </Box>
                      </Typography>
                      {item.changedByName && (
                        <Typography
                          sx={{
                            color: INK_MUTED,
                            fontSize: 12,
                          }}
                        >
                          Changed by:{" "}
                          <Box
                            component="span"
                            sx={{
                              color: INK,
                              fontWeight: 600,
                            }}
                          >
                            {item.changedByName}
                          </Box>
                        </Typography>
                      )}
                      {item.changedByRole && (
                        <Typography
                          sx={{
                            color: INK_MUTED,
                            fontSize: 12,
                            textTransform: "capitalize",
                          }}
                        >
                          Role:{" "}
                          <Box
                            component="span"
                            sx={{
                              color: INK,
                              fontWeight: 600,
                            }}
                          >
                            {item.changedByRole}
                          </Box>
                        </Typography>
                      )}
                    </Box>
                    {item.note && (
                      <Box
                        sx={{
                          mt: 1.25,
                          px: 1.25,
                          py: 1,
                          borderRadius: 1.5,
                          bgcolor: "#F9FAFB",
                        }}
                      >
                        <Typography
                          sx={{
                            color: INK_MUTED,
                            fontSize: 12.5,
                            lineHeight: 1.55,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.note}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default Progress;
