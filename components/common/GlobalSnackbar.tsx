"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useNotificationStore } from "@/store/notification-store";

export default function GlobalSnackbar() {
  const open = useNotificationStore((state) => state.open);
  const message = useNotificationStore((state) => state.message);
  const type = useNotificationStore((state) => state.type);
  const closeNotification = useNotificationStore(
    (state) => state.closeNotification,
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={closeNotification}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={closeNotification}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
