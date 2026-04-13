import type { ReactNode } from "react";
import "./globals.css";
import { AdminShell } from "../components/admin-shell";
import { ThemeProvider } from "../components/theme-provider";
import { CommandMenu } from "../components/command-menu";
import { ToastProvider } from "../components/ui/toast";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AdminShell>{children}</AdminShell>
            <CommandMenu />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
