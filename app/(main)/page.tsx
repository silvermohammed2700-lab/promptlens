import type { Metadata } from "next";
import { HomeTool } from "@/components/tool/HomeTool";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: "Image to Prompt Generator — Free AI Image to Prompt | PromptLens",
  description: "Free image to prompt generator. Convert any image to AI prompts for Midjourney, DALL-E 3, Stable Diffusion & Flux. No login required. Best free ai image to prompt tool online.",
  keywords: ["image to prompt", "image to prompt generator", "ai image to prompt", "free image to prompt generator", "images to prompt generator", "image to prompt ai", "image to prompt free", "convert image to prompt", "midjourney prompt from image", "stable diffusion prompt generator"],
  alternates: {
    canonical: "https://promptlens.ai",
    languages: {
      "en": "https://promptlens.ai",
      "ar": "https://promptlens.ai/ar",
      "fr": "https://promptlens.ai/fr",
    },
  },
  openGraph: {
    title: "Image to Prompt Generator — Free AI Tool | PromptLens",
    description: "Convert any image to AI prompts instantly. Free, no login required.",
    url: "https://promptlens.ai",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Prompt Generator — Free AI Tool",
    description: "Convert any image to AI prompts for Midjourney, DALL-E 3, Flux & more.",
  },
};

export default function HomePage() {
  return (
    <>
      <AdSlot placement="top_leaderboard" className="flex justify-center py-2 bg-[var(--surface)]" />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-syne text-[var(--text)] leading-tight mb-4">
            Convert Any Image to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
              AI Prompts
            </span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Upload any image and instantly get optimized prompts for Midjourney, DALL-E 3,
            Stable Diffusion, Flux, and more — in 6 languages.
          </p>
        </div>

        <AdSlot placement="below_hero" className="flex justify-center mb-8" />

        {/* Main Tool */}
        <HomeTool />

        {/* Features */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            Why PromptLens?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--border-2)] transition-colors">
                <div className="text-3xl mb-2">{f.emoji}</div>
                <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{f.title}</h3>
                <p className="text-xs text-[var(--muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-bold font-syne text-lg">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-[var(--text)]">{step.title}</h3>
                <p className="text-sm text-[var(--muted)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12" itemScope itemType="https://schema.org/FAQPage">
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

        {/* Keyword cloud */}
        <section className="mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {KEYWORDS.map((kw) => (
              <span key={kw} className="text-xs text-[var(--dim)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* SEO: What is an Image to Prompt Generator */}
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">
            What is an Image to Prompt Generator?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            An <strong>image to prompt generator</strong> is an AI-powered tool that analyzes any image and automatically produces a text prompt you can use in AI image generators like Midjourney, DALL-E 3, Stable Diffusion, or Flux. Instead of spending hours writing prompts from scratch, you simply upload a photo and let the AI reverse-engineer exactly what made that image look the way it does — capturing style, composition, lighting, color palette, and subject detail.
          </p>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            PromptLens is the best free <strong>ai image to prompt</strong> tool available online. Our engine supports 7 AI models and outputs prompts in 6 languages, making it the most versatile <strong>images to prompt generator</strong> for creators worldwide. Whether you need a Midjourney prompt, a Flux prompt, or a Stable Diffusion prompt, PromptLens generates optimized results in seconds.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Unlike other tools, PromptLens is completely free — no account needed to start. Just upload, select your model, and get a high-quality <strong>image to prompt</strong> result instantly. It's the fastest way to go from visual inspiration to AI-ready text prompts.
          </p>
        </section>

        {/* SEO: Supported AI Models */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            Supported AI Models
          </h2>
          <p className="text-center text-[var(--muted)] mb-6 max-w-2xl mx-auto">
            Our <strong>image to prompt ai</strong> tool generates optimized prompts for all major AI image platforms:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {AI_MODELS.map((m) => (
              <div key={m.name} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--border-2)] transition-colors">
                <div className="text-2xl mb-2">{m.emoji}</div>
                <h3 className="font-semibold text-[var(--text)] text-sm mb-1">{m.name}</h3>
                <p className="text-xs text-[var(--muted)]">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO: Free image to prompt generator — No Login Required */}
        <section className="mb-12 max-w-3xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-3">
            Free Image to Prompt Generator — No Login Required
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            PromptLens is a truly <strong>free image to prompt generator</strong> — no account, no credit card, no subscription needed to get started. Every day you get free generations across our top AI models. Our <strong>image to prompt free</strong> tier is the most generous in the industry: 5 prompts per day with access to Midjourney, DALL-E 3, and General models. Upgrade to Pro or Ultra only when you need unlimited power.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/image-to-prompt"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Try Free Image to Prompt Generator →
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-6 py-2.5 rounded-lg font-semibold text-sm hover:border-[var(--border-2)] transition-colors"
            >
              View Pricing
            </a>
          </div>
        </section>

      </div>
    </>
  );
}

const FEATURES = [
  { emoji: "🎨", title: "7 AI Models", desc: "Midjourney, DALL-E 3, SD, Flux & more" },
  { emoji: "🖼️", title: "10+ Formats", desc: "JPG, PNG, WEBP, HEIC, AVIF, SVG & more" },
  { emoji: "🌍", title: "6 Languages", desc: "English, Arabic, French, German, Spanish, Chinese" },
  { emoji: "⚡", title: "Model Compare", desc: "Generate prompts from multiple models at once" },
  { emoji: "📊", title: "Quality Score", desc: "0–100 prompt quality rating for every result" },
  { emoji: "🔒", title: "Private & Secure", desc: "Images never stored on our servers" },
  { emoji: "🕐", title: "Prompt History", desc: "Access your last 20 generated prompts" },
  { emoji: "🆓", title: "Free to Use", desc: "No signup required to get started" },
];

const HOW_IT_WORKS = [
  { title: "Upload Image", desc: "Drop, paste, or load from URL. Supports 10+ formats up to 5MB." },
  { title: "Choose Model", desc: "Select your target AI platform and output language." },
  { title: "Generate Prompt", desc: "Our AI analyzes the image and crafts an optimized prompt." },
  { title: "Copy & Create", desc: "Copy the prompt and paste it into your AI image generator." },
];

const FAQ = [
  { q: "What is PromptLens?", a: "PromptLens is a free AI-powered tool that converts any image into optimized text prompts for AI image generators like Midjourney, DALL-E 3, Stable Diffusion, and Flux." },
  { q: "Is PromptLens free to use?", a: "Yes! The free plan gives you 5 prompt generations per day with access to 3 AI models (Midjourney, DALL-E 3, and General). Upgrade to Pro or Ultra for more." },
  { q: "What image formats are supported?", a: "PromptLens supports JPG, PNG, WEBP, GIF, BMP, TIFF, AVIF, HEIC, SVG, and ICO — over 10 formats. Non-native formats are automatically converted before processing." },
  { q: "How does the prompt quality score work?", a: "The quality score (0–100) measures prompt richness based on factors like descriptive detail, technical parameters, word count, and model-specific elements." },
  { q: "Can I generate prompts in other languages?", a: "Yes! PromptLens supports 6 languages: English, Arabic, French, German, Spanish, and Chinese. Select your preferred language before generating." },
  { q: "What is the Model Compare feature?", a: "Model Compare lets you generate prompts for 2–4 different AI models simultaneously, so you can choose the best one for your needs." },
  { q: "Are my images stored or used for training?", a: "No. Your images are processed in real-time and never stored on our servers. They are sent directly to the AI model for analysis and immediately discarded." },
  { q: "What is the difference between Pro and Ultra plans?", a: "Pro gives you 200 prompts/day across 5 models with batch upload and save/share features. Ultra gives unlimited prompts, all 7 models, batch up to 20 images, and Text-to-Prompt functionality." },
];

const AI_MODELS = [
  { emoji: "🎨", name: "Midjourney", desc: "Cinematic, artistic, highly detailed prompts optimized for Midjourney v6." },
  { emoji: "🖼️", name: "DALL-E 3", desc: "Natural language prompts for OpenAI DALL-E 3 image generation." },
  { emoji: "⚡", name: "Stable Diffusion", desc: "Technical prompts with weights and negative prompts for SD." },
  { emoji: "🌊", name: "Flux", desc: "High-fidelity prompts for Flux.1 dev and schnell models." },
  { emoji: "🤖", name: "General AI", desc: "Universal prompts that work across any AI image generator." },
  { emoji: "🔮", name: "Compare Mode", desc: "Generate prompts for 2–4 models simultaneously and compare." },
];

const KEYWORDS = [
  "image to prompt", "photo to prompt", "convert image to prompt", "midjourney prompt generator",
  "dall-e prompt from image", "stable diffusion prompt", "flux prompt generator", "ai image prompt",
  "picture to ai prompt", "reverse image prompt", "image description ai", "prompt engineering tool",
];
