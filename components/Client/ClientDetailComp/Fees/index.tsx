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

import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useClientFeesHook } from "./hook";

import type { ClientFeesProps } from "./type";

// =================================================
// AMOUNT FORMAT
// =================================================

const formatAmount = (value: number) => {
  return new Intl.NumberFormat("ja-JP").format(Number(value || 0));
};

// =================================================
// TOKYO DATE
// =================================================

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

// =================================================
// COMPONENT
// =================================================

const ClientFees = ({ clientId }: ClientFeesProps) => {
  const {
    isAdmin,

    fees,
    totalExpected,

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

          gap: 2,

          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Client Fees
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Required fees and expected payment amounts for this client.
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid",

            borderColor: "divider",

            borderRadius: 2,

            px: 2.5,

            py: 1.5,

            minWidth: 190,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Total Expected
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            ¥{formatAmount(totalExpected)}
          </Typography>
        </Box>
      </Box>

      {/* =================================================
          GLOBAL MESSAGES
      ================================================= */}

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            lg: isAdmin ? "1.5fr 1fr" : "1fr",
          },

          gap: 4,
        }}
      >
        {/* =================================================
            FEE LIST
        ================================================= */}

        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Fee Requirements
          </Typography>

          {isFeesLoading && (
            <Box
              sx={{
                minHeight: 160,

                display: "flex",

                justifyContent: "center",

                alignItems: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}

          {!isFeesLoading && !loadError && fees.length === 0 && (
            <Box
              sx={{
                border: "1px dashed",

                borderColor: "divider",

                borderRadius: 2,

                p: 5,

                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No fee requirements have been created yet.
              </Typography>
            </Box>
          )}

          {!isFeesLoading && !loadError && fees.length > 0 && (
            <Box
              sx={{
                border: "1px solid",

                borderColor: "divider",

                borderRadius: 2,

                overflow: "hidden",
              }}
            >
              {fees.map((fee, index) => (
                <Box key={fee._id}>
                  <Box
                    sx={{
                      p: 2.5,
                    }}
                  >
                    {/* NAME + STATUS */}

                    <Box
                      sx={{
                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "flex-start",

                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {fee.feeName}
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            mt: 0.5,
                          }}
                        >
                          ¥{formatAmount(fee.expectedAmount)}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={fee.status}
                        color={fee.status === "Active" ? "success" : "default"}
                      />
                    </Box>

                    {/* DETAILS */}

                    <Box
                      sx={{
                        mt: 2,

                        display: "grid",

                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                        },

                        gap: 1,
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Due Date:</strong>{" "}
                        {formatTokyoDate(fee.dueDate)}
                      </Typography>

                      <Typography variant="body2">
                        <strong>Created By:</strong> {fee.createdByName}
                      </Typography>
                    </Box>

                    {/* NOTE */}

                    {fee.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,

                          whiteSpace: "pre-wrap",

                          wordBreak: "break-word",
                        }}
                      >
                        {fee.note}
                      </Typography>
                    )}

                    {/* CANCEL INFO */}

                    {fee.status === "Cancelled" && fee.cancelledByName && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mt: 1.5,
                        }}
                      >
                        Cancelled by {fee.cancelledByName}
                        {fee.cancelledAt
                          ? ` on ${formatTokyoDate(fee.cancelledAt)}`
                          : ""}
                      </Typography>
                    )}

                    {/* ADMIN ACTIONS */}

                    {isAdmin && fee.status === "Active" && (
                      <Box
                        sx={{
                          display: "flex",

                          gap: 1,

                          justifyContent: "flex-end",

                          mt: 2,
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => handleEdit(fee)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<CancelOutlinedIcon />}
                          onClick={() => handleOpenCancelFee(fee)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {index < fees.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* =================================================
            ADMIN CREATE / EDIT FORM
        ================================================= */}

        {isAdmin && (
          <Box
            sx={{
              border: "1px solid",

              borderColor: "divider",

              borderRadius: 2,

              p: 3,

              height: "fit-content",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                mb: 3,
              }}
            >
              {editingFeeId ? "Edit Fee" : "Add Fee"}
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* FEE NAME */}

              <Controller
                name="feeName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Fee Name"
                    placeholder="e.g. Registration Fee"
                    error={Boolean(errors.feeName)}
                    helperText={errors.feeName?.message}
                    sx={{
                      mb: 2.5,
                    }}
                  />
                )}
              />

              {/* EXPECTED AMOUNT */}

              <Controller
                name="expectedAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="number"
                    label="Expected Amount"
                    placeholder="300000"
                    error={Boolean(errors.expectedAmount)}
                    helperText={errors.expectedAmount?.message}
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

              {/* DUE DATE */}

              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Due Date"
                    error={Boolean(errors.dueDate)}
                    helperText={errors.dueDate?.message}
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

              {/* NOTE */}

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
                    placeholder="Optional fee note..."
                    error={Boolean(errors.note)}
                    helperText={errors.note?.message}
                  />
                )}
              />

              {/* BUTTONS */}

              <Box
                sx={{
                  display: "flex",

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
                  >
                    Cancel Edit
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={
                    saving ? (
                      <CircularProgress size={17} color="inherit" />
                    ) : (
                      <AddCardOutlinedIcon />
                    )
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingFeeId
                      ? "Update Fee"
                      : "Add Fee"}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* =================================================
          CANCEL CONFIRMATION
      ================================================= */}

      <ConfirmActionDialog
        open={Boolean(feeToCancel)}
        title="Cancel Fee"
        description={
          feeToCancel ? (
            <>
              Are you sure you want to cancel{" "}
              <strong>{feeToCancel.feeName}</strong>
              ?
              <br />
              <br />
              This fee will remain in the client's financial history.
            </>
          ) : (
            ""
          )
        }
        confirmText="Cancel Fee"
        cancelText="Keep Fee"
        confirmColor="error"
        isLoading={isCancellingFee}
        onConfirm={handleConfirmCancelFee}
        onClose={handleCloseCancelFee}
      />
    </Box>
  );
};

export default ClientFees;
