import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap" 
});

const sora = Sora({ 
  subsets: ["latin"], 
  variable: "--font-sora",
  display: "swap" 
});

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ChatbotWidget } from "../components/chatbot/chatbot-widget";
import { NavProgress } from "../components/layout/nav-progress";
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
    <html lang="mn" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <QueryProvider>
          <NavProgress />
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
