"use client";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { createStageSchema } from "./validation";
import type { CreateStageFormValues, CreateStageModalProps } from "./type";
const BRAND = "#107A64";
export default function CreateStageModal({
  open,
  isLoading,
  errorMessage,
  onClose,
  onSubmit,
}: CreateStageModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStageFormValues>({
    resolver: zodResolver(createStageSchema),
    defaultValues: {
      name: "",
      amount: "0",
    },
  });
  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        amount: "0",
      });
    }
  }, [open, reset]);
  const submit = async (values: CreateStageFormValues) => {
    await onSubmit(values);
  };
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Add Current Stage
      </DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
          >
            {errorMessage}
          </Alert>
        )}
        <form id="create-client-stage-form" onSubmit={handleSubmit(submit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label="Stage Name"
                placeholder="e.g. Document Collection"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                sx={{
                  mt: 1,
                  mb: 2,
                }}
              />
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type="number"
                label="Amount (¥)"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
                error={Boolean(errors.amount)}
                helperText={
                  errors.amount?.message ||
                  "Use 0 when this stage has no charge."
                }
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
        }}
      >
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-client-stage-form"
          variant="contained"
          disableElevation
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : undefined
          }
          sx={{
            bgcolor: BRAND,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {isLoading ? "Creating..." : "Create Stage"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
