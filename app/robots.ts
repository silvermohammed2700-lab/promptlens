import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL ?? "https://promptlens.ai";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/saved"] },
      // Ensure new SEO pages are crawlable
      { userAgent: "*", allow: ["/describe-image", "/image-prompt-generator"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
