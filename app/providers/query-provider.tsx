"use client";

import {
  QueryClient,
  QueryClientProvider,
  DefaultOptions,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

type QueryProviderProps = {
  children: ReactNode;
  config?: DefaultOptions;
};

const defaultConfig: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 1,
  },
};

export function QueryProvider({ children, config }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          ...defaultConfig,
          ...config,
        },
      }),
  );

  const showDevtools = process.env.NODE_ENV === "development";

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
