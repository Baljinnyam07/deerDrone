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
    "DEER Drone - Монголын хамгийн том дрон, технологийн төрөлжсөн дэлгүүр. DJI брэндийн албан ёсны борлуулагч. Үйлдвэрийн болон сонирхогчийн дронууд, засвар үйлчилгээ.",
  keywords: ["drone", "dji", "mongolia", "deer drone", "дрон", "засвар", "лизинг"],
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
    title: "DEER Drone | Монголын хамгийн том дрон дэлгүүр",
    description:
      "DJI брэндийн албан ёсны борлуулагч. Үйлдвэрийн болон сонирхогчийн дронууд, дагалдах хэрэгсэл, засвар үйлчилгээ.",
    siteName: "DEER Drone",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/assets/brand/og-image.png`,
        width: 1200,
        height: 630,
        alt: "DEER Drone Mongolia",
      },
    ],
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "DEER Drone | Монголын хамгийн том дрон дэлгүүр",
    description:
      "DJI брэндийн албан ёсны борлуулагч. Үйлдвэрийн болон сонирхогчийн дронууд, засвар үйлчилгээ.",
    images: [`${siteUrl}/assets/brand/og-image.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="mn" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DEER Drone",
              "url": siteUrl,
              "logo": `${siteUrl}/assets/brand/deer-logo.svg`,
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+976-99977242",
                "contactType": "sales",
                "areaServed": "MN",
                "availableLanguage": ["Mongolian", "English"]
              },
              "sameAs": [
                "https://www.facebook.com/deerdrone.mn",
                "https://www.instagram.com/deerdrone.mn"
              ]
            })
          }}
        />
      </head>
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
