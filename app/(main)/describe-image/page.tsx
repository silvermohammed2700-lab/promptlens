import type { Metadata } from "next";
import { HomeTool } from "@/components/tool/HomeTool";

export const metadata: Metadata = {
  title: "Describe Image AI — Free Image Description Generator | PromptLens",
  description: "Free AI image describer. Upload any image and get a detailed description instantly. Best free describe image AI tool online. No login required.",
  keywords: ["describe image ai", "image description generator", "ai image describer", "describe image free", "image to text ai", "image captioning ai"],
  alternates: {
    canonical: "https://promptlens.ai/describe-image",
  },
  openGraph: {
    title: "Describe Image AI — Free Image Description Generator | PromptLens",
    description: "Upload any image and get a detailed AI description instantly. Free, no login required.",
    url: "https://promptlens.ai/describe-image",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Describe Image AI — Free Image Description Generator",
    description: "Upload any image and get a detailed AI description instantly. Free, no login required.",
  },
};

const DESCRIBE_FAQ = [
  {
    q: "What is an AI image describer?",
    a: "An AI image describer is a tool that uses artificial intelligence to analyze an image and generate a detailed text description of its contents — including objects, colors, scenes, emotions, and context. PromptLens uses advanced vision AI to produce accurate, rich descriptions.",
  },
  {
    q: "How do I describe an image with AI for free?",
    a: "Simply upload your image to PromptLens, select the 'General' model, and click Generate. Our AI will analyze every element of your image and return a detailed description in seconds — completely free, no account needed.",
  },
  {
    q: "What can I use image descriptions for?",
    a: "AI image descriptions are useful for accessibility (alt text), content creation, SEO optimization, reverse-engineering AI prompts, archiving photo collections, and understanding visual content in research or journalism.",
  },
  {
    q: "What image formats does the describe image tool support?",
    a: "PromptLens supports over 10 image formats including JPG, PNG, WEBP, GIF, BMP, TIFF, AVIF, HEIC, SVG, and ICO. Non-native formats are automatically converted before processing.",
  },
  {
    q: "Is the describe image AI tool completely free?",
    a: "Yes! PromptLens offers free image description with no login required. You get 5 free descriptions per day on the free plan. Upgrade to Pro or Ultra for unlimited descriptions.",
  },
];

const DESCRIBE_HOW_IT_WORKS = [
  { step: 1, title: "Upload Any Image", desc: "Drop, paste, or load from a URL. Supports JPG, PNG, WEBP, HEIC, AVIF and 10+ more formats." },
  { step: 2, title: "AI Analyzes Your Image", desc: "Our vision AI detects objects, scenes, colors, composition, mood, and fine details." },
  { step: 3, title: "Get a Detailed Description", desc: "Receive a rich, human-readable description of everything in your image within seconds." },
  { step: 4, title: "Use It Anywhere", desc: "Copy the description for alt text, content writing, prompt engineering, or any other use case." },
];

const DESCRIBE_FEATURES = [
  { emoji: "🔍", title: "Deep Analysis", desc: "Detects objects, scenes, colors, emotions, and composition" },
  { emoji: "⚡", title: "Instant Results", desc: "Get detailed descriptions in under 5 seconds" },
  { emoji: "🆓", title: "Completely Free", desc: "No login required, no credit card needed" },
  { emoji: "🌍", title: "6 Languages", desc: "Get descriptions in English, Arabic, French, German, Spanish, Chinese" },
  { emoji: "🔒", title: "Private & Secure", desc: "Images are never stored on our servers" },
  { emoji: "📋", title: "Copy Instantly", desc: "One-click copy to clipboard" },
];

export default function DescribeImagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://promptlens.ai/describe-image",
        url: "https://promptlens.ai/describe-image",
        name: "Describe Image AI — Free Image Description Generator | PromptLens",
        description: "Free AI image describer. Upload any image and get a detailed description instantly.",
        isPartOf: { "@id": "https://promptlens.ai/#website" },
      },
      {
        "@type": "FAQPage",
        mainEntity: DESCRIBE_FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "HowTo",
        name: "How to Describe an Image with AI",
        description: "Use PromptLens free AI image describer to get a detailed description of any image in seconds.",
        step: DESCRIBE_HOW_IT_WORKS.map((s) => ({
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
            Describe Image{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
              AI
            </span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Upload any image and instantly get a detailed AI-generated description. Free, no login required.
            The best <strong>describe image AI</strong> tool online.
          </p>
        </div>

        {/* Main Tool */}
        <HomeTool />

        {/* Features */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            Why Use PromptLens Image Describer?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DESCRIBE_FEATURES.map((f) => (
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
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            How to Describe an Image with AI — Step by Step
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {DESCRIBE_HOW_IT_WORKS.map((s) => (
              <div key={s.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-bold font-syne text-lg">
                  {s.step}
                </div>
                <h3 className="font-semibold text-[var(--text)]">{s.title}</h3>
                <p className="text-sm text-[var(--muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">
            What is an AI Image Description Generator?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            An <strong>AI image description generator</strong> uses computer vision and large language models to analyze the visual content of an image and produce a detailed, human-readable description. This technology can identify objects, people, colors, textures, spatial relationships, artistic styles, and the overall mood of a scene.
          </p>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            PromptLens's <strong>describe image AI</strong> tool is built on the same advanced vision models used to power our prompt generator — meaning you get the same accuracy and richness of analysis, but instead of an AI prompt, you receive a natural language description of your image.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Common use cases include writing alt text for web accessibility, generating captions for social media, reverse-engineering the style of an image for prompt engineering, and creating descriptive metadata for photo libraries. Our tool works with any image — photos, artwork, screenshots, diagrams, and more.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-2xl font-bold font-syne text-center text-[var(--text)] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {DESCRIBE_FAQ.map((item) => (
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
          <p className="text-[var(--muted)] mb-4">Looking for more AI image tools?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              ← Image to Prompt Generator
            </a>
            <a href="/image-prompt-generator" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Image Prompt Generator
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
