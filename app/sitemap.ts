import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL ?? "https://promptlens.ai";
  const now = new Date();

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/image-to-prompt`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/describe-image`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/ai-image-to-prompt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/free-image-to-prompt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/image-prompt-generator`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...blogEntries,
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
