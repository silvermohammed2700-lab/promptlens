import type { Metadata } from "next";
import { HomeTool } from "@/components/tool/HomeTool";

export const metadata: Metadata = {
  title: "Image Prompt Generator — AI Prompt from Image | PromptLens",
  description: "Turn any image into an AI-ready prompt instantly. The best image prompt generator for Midjourney, DALL-E 3, Stable Diffusion & Flux. Free, no login required.",
  keywords: ["image prompt generator", "ai prompt from image", "image to prompt generator", "midjourney prompt generator", "stable diffusion prompt generator", "flux prompt generator", "dall-e prompt generator"],
  alternates: {
    canonical: "https://promptlens.ai/image-prompt-generator",
  },
  openGraph: {
    title: "Image Prompt Generator — AI Prompt from Image | PromptLens",
    description: "Turn any image into an AI-ready prompt for Midjourney, DALL-E 3, Stable Diffusion & Flux. Free, no login required.",
    url: "https://promptlens.ai/image-prompt-generator",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Prompt Generator — AI Prompt from Image",
    description: "Turn any image into an AI-ready prompt for Midjourney, DALL-E 3, Flux & more.",
  },
};

const IPG_FAQ = [
  {
    q: "What is an image prompt generator?",
    a: "An image prompt generator is an AI tool that takes an image as input and outputs a text prompt you can use in AI image generators like Midjourney, DALL-E 3, Stable Diffusion, or Flux. It reverse-engineers the visual elements of an image — style, composition, colors, subjects — into a usable AI prompt.",
  },
  {
    q: "How do I generate an AI prompt from an image?",
    a: "Upload your image to PromptLens, choose your target AI model (Midjourney, DALL-E 3, Flux, etc.), and click Generate. Within seconds you'll have an optimized prompt ready to paste into your AI image generator.",
  },
  {
    q: "Which AI models does this image prompt generator support?",
    a: "PromptLens supports 7 AI models: Midjourney, DALL-E 3, Stable Diffusion, Flux, General AI, and more. Each model gets a prompt optimized for its specific syntax and style requirements.",
  },
  {
    q: "Can I generate prompts for Flux AI from an image?",
    a: "Yes! PromptLens includes a dedicated Flux prompt generator. Select 'Flux' as your model after uploading your image, and get a high-fidelity prompt optimized for Flux.1 dev and schnell models.",
  },
  {
    q: "Is this image prompt generator free to use?",
    a: "Yes. PromptLens offers a free tier with 5 prompt generations per day, no credit card or login required. Pro and Ultra plans are available for power users who need unlimited prompts and access to all 7 models.",
  },
];

const IPG_MODELS = [
  {
    emoji: "🎨",
    name: "Midjourney Prompt Generator",
    desc: "Generate cinematic, highly detailed Midjourney v6 prompts from any image. Includes aspect ratios, style weights, and quality parameters.",
    keyword: "midjourney",
  },
  {
    emoji: "🖼️",
    name: "DALL-E 3 Prompt Generator",
    desc: "Produce natural-language prompts optimized for DALL-E 3's instruction-following capabilities.",
    keyword: "dall-e",
  },
  {
    emoji: "⚡",
    name: "Stable Diffusion Prompt Generator",
    desc: "Generate detailed SD prompts with positive and negative prompt components and technical parameters.",
    keyword: "stable-diffusion",
  },
  {
    emoji: "🌊",
    name: "Flux Prompt Generator",
    desc: "Create high-fidelity prompts optimized for Flux.1 dev and schnell for photorealistic and artistic outputs.",
    keyword: "flux",
  },
];

const IPG_HOW_IT_WORKS = [
  { step: 1, title: "Upload Your Image", desc: "Drop, paste, or load from URL. Supports JPG, PNG, WEBP, HEIC, AVIF and 10+ formats up to 5MB." },
  { step: 2, title: "Select AI Model", desc: "Choose Midjourney, DALL-E 3, Stable Diffusion, Flux, or General AI as your target platform." },
  { step: 3, title: "Choose Detail Level", desc: "Pick from brief, standard, or detailed output depending on your use case." },
  { step: 4, title: "Generate Your Prompt", desc: "Click Generate and receive an optimized prompt in seconds." },
  { step: 5, title: "Copy & Create", desc: "One-click copy then paste directly into your AI image generator." },
];

export default function ImagePromptGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://promptlens.ai/image-prompt-generator",
        url: "https://promptlens.ai/image-prompt-generator",
        name: "Image Prompt Generator — AI Prompt from Image | PromptLens",
        description: "Turn any image into an AI-ready prompt for Midjourney, DALL-E 3, Stable Diffusion & Flux.",
        isPartOf: { "@id": "https://promptlens.ai/#website" },
      },
      {
        "@type": "FAQPage",
        mainEntity: IPG_FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "HowTo",
        name: "How to Generate an AI Prompt from an Image",
        description: "Use PromptLens image prompt generator to turn any image into an AI-ready prompt in seconds.",
        step: IPG_HOW_IT_WORKS.map((s) => ({
          "@type": "HowToStep",
          position: s.step,
          name: s.title,
          text: s.desc,
        })),
      },
    ],
  };

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
            Image Prompt{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
              Generator
            </span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            The best <strong>image prompt generator</strong> online. Upload any image and instantly get an
            AI-optimized prompt for Midjourney, DALL-E 3, Stable Diffusion, Flux, and more.
            Free — no login required.
          </p>
        </div>

        {/* Main Tool */}
        <HomeTool />

        {/* Model-specific sections */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            AI Prompt Generators by Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IPG_MODELS.map((m) => (
              <div key={m.name} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-2)] transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{m.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-1">{m.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            How to Generate a Prompt from an Image — Step by Step
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {IPG_HOW_IT_WORKS.map((s) => (
              <div key={s.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-bold font-syne text-lg">
                  {s.step}
                </div>
                <h3 className="font-semibold text-[var(--text)] text-sm">{s.title}</h3>
                <p className="text-xs text-[var(--muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">
            The Best Image Prompt Generator for Every AI Model
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            PromptLens is the most versatile <strong>image prompt generator</strong> available. Unlike single-model tools, PromptLens generates tailored prompts for each AI platform's unique syntax and requirements. A Midjourney prompt needs aspect ratio parameters and stylize values. A Stable Diffusion prompt needs weight notation and negative prompts. A Flux prompt needs photorealistic descriptors. PromptLens handles all of this automatically.
          </p>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            Whether you're a digital artist looking to recreate a style, a content creator seeking inspiration, or a developer building AI workflows, our <strong>AI prompt from image</strong> tool gives you a production-ready prompt in seconds. Simply upload your reference image and let the AI do the work.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            With support for Compare Mode, you can generate prompts for up to 4 AI models simultaneously — making PromptLens the ultimate <strong>image prompt generator</strong> for creators who work across multiple platforms. All of this is available free, with no login required to get started.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {IPG_FAQ.map((item) => (
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

        {/* Internal links */}
        <section className="mb-12 text-center">
          <p className="text-[var(--muted)] mb-4">Explore more PromptLens tools:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              ← Image to Prompt Generator
            </a>
            <a href="/describe-image" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Describe Image AI
            </a>
            <a href="/pricing" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Pricing
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
