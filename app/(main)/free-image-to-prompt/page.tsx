import type { Metadata } from "next";
import { HomeTool } from "@/components/tool/HomeTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Image to Prompt Generator — No Login Required | PromptLens",
  description: "100% free image to prompt generator. No login, no credit card, no subscription. Convert any image to AI prompts for Midjourney, DALL-E 3, Flux & Stable Diffusion instantly.",
  keywords: ["free image to prompt generator", "image to prompt free", "free image to prompt", "image to prompt no login", "free ai image prompt generator"],
  alternates: {
    canonical: "https://promptlens.ai/free-image-to-prompt",
  },
  openGraph: {
    title: "Free Image to Prompt Generator — No Login Required | PromptLens",
    description: "100% free image to prompt generator. No login, no credit card. Works instantly.",
    url: "https://promptlens.ai/free-image-to-prompt",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to Prompt Generator — No Login Required",
    description: "100% free image to prompt generator. No login, no credit card. Convert any image to AI prompts instantly.",
  },
};

const FREE_FEATURES = [
  { emoji: "🆓", title: "Always Free to Start", desc: "5 prompt generations per day on the free plan — forever. No credit card ever required." },
  { emoji: "🔓", title: "No Login Required", desc: "Use the tool immediately without creating an account. Sign up only if you want to save your history." },
  { emoji: "🤖", title: "3 Free AI Models", desc: "Free users get access to Midjourney, DALL-E 3, and General AI models every day." },
  { emoji: "⚡", title: "Instant Results", desc: "No queue, no waiting. Your prompt is generated in seconds." },
  { emoji: "🔒", title: "Private & Secure", desc: "Images are processed securely and never stored on our servers." },
  { emoji: "📋", title: "One-Click Copy", desc: "Copy your generated prompt to clipboard with a single click." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://promptlens.ai/free-image-to-prompt",
      url: "https://promptlens.ai/free-image-to-prompt",
      name: "Free Image to Prompt Generator — No Login Required | PromptLens",
      description: "100% free image to prompt generator. No login, no credit card required.",
      isPartOf: { "@id": "https://promptlens.ai/#website" },
    },
    {
      "@type": "WebApplication",
      name: "PromptLens Free Image to Prompt Generator",
      url: "https://promptlens.ai/free-image-to-prompt",
      applicationCategory: "UtilitiesApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function FreeImageToPromptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            ✓ 100% Free — No Login Required
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-syne text-[var(--text)] leading-tight mb-4">
            Free Image to Prompt{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
              Generator
            </span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto mb-2">
            The most generous <strong>free image to prompt generator</strong> online. No login, no credit card,
            no subscription — just upload your image and get an AI-optimized prompt for Midjourney,
            DALL-E 3, Stable Diffusion, or Flux in seconds.
          </p>
          <p className="text-sm text-[var(--dim)]">5 free prompts per day · 3 AI models · No account needed</p>
        </div>

        {/* Main Tool */}
        <HomeTool />

        {/* Free features grid */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            What's Included in the Free Plan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {FREE_FEATURES.map((f) => (
              <div key={f.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--border-2)] transition-colors">
                <div className="text-3xl mb-2">{f.emoji}</div>
                <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{f.title}</h3>
                <p className="text-xs text-[var(--muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Free vs Paid */}
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">
            Free Image to Prompt — No Catch
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            PromptLens believes that the best <strong>free image to prompt generator</strong> should actually be free — not a watered-down trial. Our free plan gives you 5 full-quality prompt generations every day, with access to Midjourney, DALL-E 3, and General AI models. No watermarks, no degraded output, no time limits on individual sessions.
          </p>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            You don't need to create an account to use the tool. Just visit the page, upload your image, select a model, and generate. If you want to save your prompt history and access unlimited generations, you can upgrade to Pro ($9/month) or Ultra ($19/month) — but the <strong>free image to prompt</strong> experience is fully functional without ever paying.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            This makes PromptLens the best choice for casual users, students, and anyone who wants to try AI prompt generation without commitment. The <strong>image to prompt free</strong> tier resets every day at midnight, so you always have fresh generations available.
          </p>
        </section>

        {/* Upgrade CTA */}
        <section className="mb-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold font-syne text-[var(--text)] mb-2">Need More Than 5 per Day?</h2>
          <p className="text-sm text-[var(--muted)] mb-5 max-w-md mx-auto">
            Upgrade to Pro for 200 prompts/day across all 7 models, or Ultra for unlimited generations.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            View Pricing →
          </Link>
        </section>

        {/* Related tools */}
        <section className="mb-12 text-center">
          <p className="text-[var(--muted)] mb-4 text-sm">More PromptLens tools:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/image-to-prompt" className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              ← Image to Prompt Generator
            </Link>
            <Link href="/ai-image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              AI Image to Prompt
            </Link>
            <Link href="/describe-image" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Describe Image AI
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
