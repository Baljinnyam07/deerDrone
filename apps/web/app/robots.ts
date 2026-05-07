import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/server-env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    host: siteUrl,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/cart",
          "/cart/",
          "/checkout",
          "/checkout/",
          "/login",
          "/login/",
          "/account",
          "/account/",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}