import type { ReactNode } from "react";
import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ChatbotWidget } from "../components/chatbot/chatbot-widget";
import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import { ToastProvider } from "../components/layout/toast-provider";
import { QueryProvider } from "../components/query-provider";

export const metadata: Metadata = {
  title: "DEER droneshop",
  description: "E-commerce homepage for DEER droneshop.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="mn">
      <body>
        <QueryProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <ChatbotWidget />
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
