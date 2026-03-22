import type { Metadata } from "next";
import { HomeTool } from "@/components/tool/HomeTool";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Image to Prompt Generator — Free AI Tool | PromptLens",
  description: "Free image to prompt generator. Upload any image and instantly get an AI-optimized prompt for Midjourney, DALL-E 3, Stable Diffusion & Flux. No login required.",
  keywords: ["image to prompt", "image to prompt generator", "ai image to prompt", "free image to prompt generator", "convert image to prompt", "midjourney prompt from image"],
  alternates: {
    canonical: "https://promptlens.ai/image-to-prompt",
  },
  openGraph: {
    title: "Image to Prompt Generator — Free AI Tool | PromptLens",
    description: "Upload any image and instantly get an AI-optimized prompt. Free, no login required.",
    url: "https://promptlens.ai/image-to-prompt",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Prompt Generator — Free AI Tool",
    description: "Upload any image and instantly get an AI-optimized prompt for Midjourney, DALL-E 3, Flux & more.",
  },
};

const FAQ = [
  {
    q: "What is an image to prompt generator?",
    a: "An image to prompt generator is an AI tool that analyzes any image and produces a text prompt you can use in AI image generators like Midjourney, DALL-E 3, Stable Diffusion, or Flux. PromptLens reverse-engineers style, composition, lighting, color palette, and subject detail from your image automatically.",
  },
  {
    q: "How do I convert an image to a prompt?",
    a: "Upload your image to PromptLens, select your target AI model (Midjourney, DALL-E 3, Flux, Stable Diffusion, etc.), choose a detail level, and click Generate. You'll receive an optimized prompt in seconds — ready to copy and paste.",
  },
  {
    q: "Is this image to prompt generator free?",
    a: "Yes. PromptLens is a free image to prompt generator — no login or credit card required. The free plan includes 5 generations per day across our top AI models. Pro and Ultra plans are available for unlimited access.",
  },
  {
    q: "Which AI models are supported?",
    a: "PromptLens supports 7 AI models: Midjourney, DALL-E 3, Stable Diffusion, Flux, General AI, and more. Use Compare Mode to generate prompts for multiple models side-by-side.",
  },
  {
    q: "What image formats are supported?",
    a: "PromptLens accepts JPG, PNG, WEBP, GIF, BMP, TIFF, AVIF, HEIC, SVG, and ICO. Images up to 5MB are supported. Non-native formats are automatically converted before processing.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "PromptLens Image to Prompt Generator",
      url: "https://promptlens.ai/image-to-prompt",
      description: "Free AI-powered image to prompt generator for Midjourney, DALL-E 3, Stable Diffusion & Flux.",
      applicationCategory: "UtilitiesApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Convert image to Midjourney prompt",
        "Convert image to DALL-E 3 prompt",
        "Convert image to Stable Diffusion prompt",
        "Convert image to Flux prompt",
        "Free image to prompt generator",
        "No login required",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function ImageToPromptPage() {
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
            Image to Prompt{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
              Generator
            </span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto mb-2">
            The fastest free <strong>image to prompt generator</strong> online. Upload any image and
            instantly get an AI-optimized prompt for Midjourney, DALL-E 3, Stable Diffusion, Flux, and more.
          </p>
          <p className="text-sm text-[var(--dim)]">No login required · 5 free generations per day · 7 AI models</p>
        </div>

        {/* Main Tool */}
        <HomeTool />

        {/* FAQ */}
        <section className="mt-16 mb-12" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
                itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
              >
                <h3 className="font-semibold text-[var(--text)] mb-2" itemProp="name">{item.q}</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm text-[var(--muted)] leading-relaxed" itemProp="text">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <section className="mb-12 text-center">
          <p className="text-[var(--muted)] mb-4 text-sm">Explore more PromptLens tools:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/describe-image" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Describe Image AI
            </Link>
            <Link href="/ai-image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              AI Image to Prompt
            </Link>
            <Link href="/free-image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Free Image to Prompt
            </Link>
            <Link href="/image-prompt-generator" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Image Prompt Generator
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
