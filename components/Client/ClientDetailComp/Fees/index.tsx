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

import type { ClientFeesProps, PaymentProgressStatus } from "./type";

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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Client Fees
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Required fees, payments and outstanding balances.
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
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Total Expected
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ¥{formatAmount(totalExpected)}
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Total Paid
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ¥{formatAmount(totalPaid)}
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Outstanding
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ¥{formatAmount(totalOutstanding)}
          </Typography>
        </Box>
      </Box>

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
        {/* FEE LIST */}

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Fee Requirements
          </Typography>

          {isFeesLoading && (
            <Box
              sx={{
                py: 5,
                display: "flex",
                justifyContent: "center",
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
                No fee requirements have been created.
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {fee.feeName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                          }}
                        >
                          Due: {formatTokyoDate(fee.dueDate)}
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
                          label={fee.status}
                          color={
                            fee.status === "Active" ? "success" : "default"
                          }
                        />

                        <Chip
                          size="small"
                          variant="outlined"
                          label={fee.paymentProgressStatus}
                          color={getProgressColor(fee.paymentProgressStatus)}
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

                        mt: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Expected
                        </Typography>

                        <Typography sx={{ fontWeight: 600 }}>
                          ¥{formatAmount(fee.expectedAmount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Paid
                        </Typography>

                        <Typography sx={{ fontWeight: 600 }}>
                          ¥{formatAmount(fee.paidAmount)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Outstanding
                        </Typography>

                        <Typography sx={{ fontWeight: 600 }}>
                          ¥{formatAmount(fee.outstandingAmount)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Created By:</strong> {fee.createdByName}
                    </Typography>

                    {fee.note && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
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
                          gap: 1,
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

        {/* ADMIN FORM */}

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
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              {editingFeeId ? "Edit Fee" : "Add Fee"}
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
                    label="Fee Name"
                    error={Boolean(errors.feeName)}
                    helperText={errors.feeName?.message}
                    sx={{
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
                    label="Expected Amount"
                    error={Boolean(errors.expectedAmount)}
                    helperText={errors.expectedAmount?.message}
                    sx={{
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
                    label="Due Date"
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
                    error={Boolean(errors.note)}
                    helperText={errors.note?.message}
                  />
                )}
              />

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

      <ConfirmActionDialog
        open={Boolean(feeToCancel)}
        title="Cancel Fee"
        description={
          feeToCancel
            ? `Are you sure you want to cancel "${feeToCancel.feeName}"? The fee will remain in the financial history.`
            : ""
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
