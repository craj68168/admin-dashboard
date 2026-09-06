"use client";

import { ReactNode, useState } from "react";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
  DefaultOptions,
} from "@tanstack/react-query";

import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-message";

import { useNotificationStore } from "@/store/notification-store";

type QueryProviderProps = {
  children: ReactNode;
  config?: DefaultOptions;
};

export const QueryProvider = ({ children, config }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: config,

        // GET / fetch errors
        queryCache: new QueryCache({
          onError: (error) => {
            const message = getApiErrorMessage(error);

            useNotificationStore.getState().showNotification(message, "error");
          },
        }),

        // POST / PUT / PATCH / DELETE
        mutationCache: new MutationCache({
          onError: (error) => {
            const message = getApiErrorMessage(error);

            useNotificationStore.getState().showNotification(message, "error");
          },

          onSuccess: (data) => {
            const message = getApiSuccessMessage(data);

            if (message) {
              useNotificationStore
                .getState()
                .showNotification(message, "success");
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
