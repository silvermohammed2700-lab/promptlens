import type { Metadata } from "next";
import { HomeTool } from "@/components/tool/HomeTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Image to Prompt — Convert Any Photo to AI Prompt | PromptLens",
  description: "Convert any photo or image to an AI prompt instantly using advanced AI vision. Best ai image to prompt tool for Midjourney, DALL-E 3, Flux & Stable Diffusion. Free, no login.",
  keywords: ["ai image to prompt", "image to prompt ai", "ai image prompt generator", "photo to ai prompt", "ai image to text prompt"],
  alternates: {
    canonical: "https://promptlens.ai/ai-image-to-prompt",
  },
  openGraph: {
    title: "AI Image to Prompt — Convert Any Photo to AI Prompt | PromptLens",
    description: "Convert any photo to an AI prompt instantly. Free AI vision tool, no login required.",
    url: "https://promptlens.ai/ai-image-to-prompt",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image to Prompt — Convert Any Photo to AI Prompt",
    description: "Convert any photo to an AI prompt for Midjourney, DALL-E 3, Flux & more. Free, no login.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://promptlens.ai/ai-image-to-prompt",
  url: "https://promptlens.ai/ai-image-to-prompt",
  name: "AI Image to Prompt — Convert Any Photo to AI Prompt | PromptLens",
  description: "Convert any photo or image to an AI prompt instantly using advanced AI vision.",
  isPartOf: { "@id": "https://promptlens.ai/#website" },
};

export default function AiImageToPromptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-syne text-[var(--text)] leading-tight mb-4">
            AI Image to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
              Prompt
            </span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto mb-2">
            Our advanced <strong>AI image to prompt</strong> tool analyzes every visual element of your photo —
            style, composition, lighting, colors, and subjects — and transforms it into a precise AI prompt
            ready for Midjourney, DALL-E 3, Stable Diffusion, Flux, and more.
          </p>
          <p className="text-sm text-[var(--dim)]">Powered by state-of-the-art vision AI · Free · No login required</p>
        </div>

        {/* Main Tool */}
        <HomeTool />

        {/* How AI works */}
        <section className="mt-16 mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">
            How AI Image to Prompt Works
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            PromptLens uses advanced multimodal AI vision models to analyze your image at a deep level. Unlike simple caption generators, our <strong>AI image to prompt</strong> engine identifies not just what's in an image, but <em>how</em> it was created — the artistic style, photographic technique, color grading, compositional choices, and fine details that define its look.
          </p>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            This analysis is then translated into a structured prompt optimized for your chosen AI image generator. Each model gets a different format: Midjourney receives parameter-rich prompts with style weights; Flux gets flowing natural language; Stable Diffusion gets comma-separated token lists with negative prompts. The <strong>image to prompt AI</strong> handles all of this automatically.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            The result is a production-ready prompt that captures the essence of your reference image — one you can use immediately in your AI image generator to recreate the style, recreate the scene, or use as a creative starting point.
          </p>
        </section>

        {/* Related tools */}
        <section className="mb-12 text-center">
          <p className="text-[var(--muted)] mb-4 text-sm">More PromptLens tools:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/image-to-prompt" className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              ← Image to Prompt Generator
            </Link>
            <Link href="/free-image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Free Image to Prompt
            </Link>
            <Link href="/describe-image" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Describe Image AI
            </Link>
            <Link href="/pricing" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Pricing
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
