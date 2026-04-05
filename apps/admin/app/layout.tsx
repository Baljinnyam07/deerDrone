import type { ReactNode } from "react";
import "./globals.css";
import { AdminShell } from "../components/admin-shell";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="mn">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
