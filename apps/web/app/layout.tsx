import type { ReactNode } from "react";
import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ChatbotWidget } from "../components/chatbot/chatbot-widget";
import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import { ToastProvider } from "../components/layout/toast-provider";
import { QueryProvider } from "../components/query-provider";
import { getSiteUrl } from "../lib/server-env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DEER Drone",
    template: "%s | DEER Drone",
  },
  description:
    "DEER Drone is a production-ready storefront for industrial drones, creator kits, service support, and delivery across Mongolia.",
  icons: {
    icon: [
      { url: "/assets/brand/deer-logo.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/assets/brand/deer-logo.svg" }
    ]
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DEER Drone",
    description:
      "Industrial drones, creator tools, accessories, and after-sales support from DEER.",
    siteName: "DEER Drone",
    type: "website",
    url: siteUrl,
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "DEER Drone",
    description:
      "Industrial drones, creator tools, accessories, and after-sales support from DEER.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="mn">
      <body style={{ fontFamily: "'TT Norms Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        <style dangerouslySetInnerHTML={{__html: `
          * {
            font-family: 'TT Norms Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
        `}} />
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
