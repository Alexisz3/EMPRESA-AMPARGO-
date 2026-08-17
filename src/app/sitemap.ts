import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

const routes = ["", "/about", "/services", "/projects", "/contact", "/quote", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];
  return ["en", "es"].flatMap((locale) => routes.map((route) => ({
    url: new URL(`/${locale}${route}`, siteUrl).toString(),
    changeFrequency: route === "" ? "monthly" as const : "yearly" as const,
    priority: route === "" ? 1 : route === "/quote" || route === "/contact" ? 0.8 : 0.7,
  })));
}
