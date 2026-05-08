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
    default: "DEER Drone Shop | DJI албан ёсны борлуулагч",
    template: "%s | DEER Drone Shop",
  },
  description:
    "DEER Drone - DJI брэндийн Монгол дахь албан ёсны борлуулагч. Дрон худалдаа, засвар үйлчилгээ болон мэргэжлийн зөвлөгөө.",
  keywords: [
    "drone", "dji", "mongolia", "deer drone", "дрон", "засвар", "лизинг",
    "dji mongolia", "дрон дэлгүүр", "mini 4 pro", "air 3", "mavic 3 pro",
    "хөдөө аж ахуйн дрон", "агри дрон", "t40", "t50", "дрон засвар"
  ],
  authors: [{ name: "DEER Drone" }],
  creator: "DEER Drone",
  publisher: "DEER Drone",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/brand/48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/assets/brand/36x36.png", sizes: "36x36", type: "image/png" },
      { url: "/assets/brand/deer-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/assets/brand/48x48.png", sizes: "48x48", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DEER Drone Shop | DJI албан ёсны борлуулагч",
    description:
      "DJI албан ёсны борлуулагч. Дрон худалдаа, засвар, сургалт, зөвлөгөө. Хамгийн сүүлийн үеийн DJI технологиудыг Монголд.",
    siteName: "DEER Drone",
    type: "website",
    locale: "mn_MN",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/assets/brand/og-image.png`,
        width: 1200,
        height: 630,
        alt: "DEER Drone Mongolia - Official DJI Dealer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEER Drone Shop | DJI албан ёсны борлуулагч",
    description: "DJI албан ёсны борлуулагч. Дрон худалдаа, засвар, сургалт.",
    images: [`${siteUrl}/assets/brand/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="mn" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "DEER Drone",
                "url": siteUrl,
                "logo": `${siteUrl}/assets/brand/deer-logo.svg`,
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+976-99977242",
                  "contactType": "customer service",
                  "areaServed": "MN",
                  "availableLanguage": ["Mongolian", "English"]
                },
                "sameAs": [
                  "https://www.facebook.com/Deerdroneshop2",
                  "https://www.instagram.com/deer_drone_shop/"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "DEER Drone Shop",
                "url": siteUrl,
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${siteUrl}/products?q={search_term_string}`,
                  "query-input": "required name=search_term_string"
                }
              }
            ])
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
