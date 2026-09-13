"use client";

import type { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type ConfirmColor =
  | "primary"
  | "error"
  | "warning"
  | "success"
  | "info"
  | "secondary";

type ConfirmActionDialogProps = {
  open: boolean;

  title: string;

  description: ReactNode;

  confirmText?: string;
  cancelText?: string;

  confirmColor?: ConfirmColor;

  isLoading?: boolean;

  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmActionDialog({
  open,
  title,
  description,
  confirmText = "Yes",
  cancelText = "No",
  confirmColor = "primary",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmActionDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText component="div">{description}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
