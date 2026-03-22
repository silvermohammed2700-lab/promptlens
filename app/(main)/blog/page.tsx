import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/content/blog/posts";

export const metadata: Metadata = {
  title: "Blog — AI Prompt Tips and Guides | PromptLens",
  description: "Learn how to create better AI prompts. Guides for Midjourney, DALL-E 3, Stable Diffusion, Flux, and ComfyUI. Tips, tutorials, and keyword strategies from the PromptLens team.",
  alternates: {
    canonical: "https://promptlens.ai/blog",
  },
  openGraph: {
    title: "Blog — AI Prompt Tips and Guides | PromptLens",
    description: "Guides for Midjourney, DALL-E 3, Stable Diffusion, Flux, and ComfyUI prompt engineering.",
    url: "https://promptlens.ai/blog",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — AI Prompt Tips and Guides | PromptLens",
    description: "Guides for Midjourney, DALL-E 3, Stable Diffusion, Flux, and ComfyUI prompt engineering.",
  },
};

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://promptlens.ai/blog",
    url: "https://promptlens.ai/blog",
    name: "PromptLens Blog — AI Prompt Tips and Guides",
    description: "Guides for Midjourney, DALL-E 3, Stable Diffusion, Flux, and ComfyUI prompt engineering.",
    publisher: { "@type": "Organization", name: "PromptLens", url: "https://promptlens.ai" },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://promptlens.ai/blog/${post.slug}`,
      description: post.description,
      datePublished: post.date,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold font-syne text-[var(--text)] mb-4">
            PromptLens Blog
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            AI prompt tips, model guides, and tutorials to help you get better results from Midjourney, DALL-E 3, Stable Diffusion, Flux, and ComfyUI.
          </p>
        </div>

        {/* Posts — auto-generated from content/blog/posts.ts */}
        <div className="space-y-6 mb-14">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] rounded-2xl p-6 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{post.emoji}</span>
                <span className="text-xs text-[var(--muted)] bg-[var(--background)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-[var(--dim)] ml-auto">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold font-syne text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{post.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-[var(--accent)] font-medium">
                  Read article <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
                <time className="text-xs text-[var(--dim)]" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold font-syne text-[var(--text)] mb-2">
            Try the Free Image to Prompt Generator
          </h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            Convert any image to an AI prompt in seconds. No login required.
          </p>
          <Link
            href="/image-to-prompt"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            ← Back to Tool
          </Link>
        </div>
      </div>
    </>
  );
}
