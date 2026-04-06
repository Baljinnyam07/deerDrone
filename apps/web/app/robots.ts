import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/server-env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    host: siteUrl,
    rules: [
      {
        allow: "/",
        userAgent: "*",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
