import { create } from "zustand";

type NotificationType = "success" | "error" | "warning" | "info";

type NotificationState = {
  open: boolean;
  message: string;
  type: NotificationType;

  showNotification: (message: string, type?: NotificationType) => void;

  closeNotification: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  message: "",
  type: "info",

  showNotification: (message, type = "info") =>
    set({
      open: true,
      message,
      type,
    }),

  closeNotification: () =>
    set({
      open: false,
    }),
}));
