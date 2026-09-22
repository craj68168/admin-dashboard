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

import { useTranslations } from "next-intl";

import { createStageSchema } from "./validation";

import type {
  CreateStageFormValues,
  CreateStageModalProps,
} from "./type";

const BRAND = "#107A64";

export default function CreateStageModal({
  open,
  isLoading,
  errorMessage,
  onClose,
  onSubmit,
}: CreateStageModalProps) {
  const t = useTranslations("createStageModal");

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

  const submit = async (
    values: CreateStageFormValues,
  ) => {
    await onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onClose={
        isLoading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      {/* TITLE */}

      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        {t("title")}
      </DialogTitle>

      {/* CONTENT */}

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

        <form
          id="create-client-stage-form"
          onSubmit={handleSubmit(submit)}
        >
          {/* STAGE NAME */}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label={t("fields.name.label")}
                placeholder={t(
                  "fields.name.placeholder",
                )}
                error={Boolean(
                  errors.name,
                )}
                helperText={
                  errors.name?.message
                }
                sx={{
                  mt: 1,
                  mb: 2,
                }}
              />
            )}
          />

          {/* AMOUNT */}

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type="number"
                label={t(
                  "fields.amount.label",
                )}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
                error={Boolean(
                  errors.amount,
                )}
                helperText={
                  errors.amount?.message ||
                  t(
                    "fields.amount.helper",
                  )
                }
              />
            )}
          />
        </form>
      </DialogContent>

      {/* ACTIONS */}

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={isLoading}
        >
          {t("actions.cancel")}
        </Button>

        <Button
          type="submit"
          form="create-client-stage-form"
          variant="contained"
          disableElevation
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress
                size={15}
                color="inherit"
              />
            ) : undefined
          }
          sx={{
            bgcolor: BRAND,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {isLoading
            ? t("actions.creating")
            : t("actions.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}