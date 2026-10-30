"use client";

import type { ReactNode } from "react";
import { createTranslator, useLocale } from "next-intl";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const messages = {
  en: { confirm: "Yes", cancel: "No", loading: "Please wait..." },
  ja: { confirm: "はい", cancel: "いいえ", loading: "しばらくお待ちください…" },
};

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
  confirmText,
  cancelText,
  confirmColor = "primary",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmActionDialogProps) {
  const locale = useLocale();
  const t = createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
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
          {cancelText ?? t("cancel")}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? t("loading") : confirmText ?? t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
