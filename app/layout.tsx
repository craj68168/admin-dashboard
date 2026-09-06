import type { Metadata } from "next";
import "./globals.css";
import GlobalSnackbar from "@/components/common/GlobalSnackbar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import AuthProvider from "../components/auth/AuthProvider";
import { QueryProvider } from "./providers/query-provider";
import { MuiThemeProvider } from "./providers/theme-provider";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the staff and their clients",
};

const queryConfig = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: true,
  },
  mutations: {
    retry: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <MuiThemeProvider>
            <QueryProvider config={queryConfig}>
              <AuthProvider>{children}</AuthProvider>
              <GlobalSnackbar />
            </QueryProvider>
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
