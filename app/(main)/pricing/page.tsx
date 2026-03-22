import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing — PromptLens Image to Prompt Generator",
  description: "Start free with 5 prompts per day. Upgrade to Pro for 200 prompts. Unlock all 7 AI models with Ultra plan.",
  alternates: {
    canonical: "https://promptlens.ai/pricing",
  },
  openGraph: {
    title: "Pricing — PromptLens Image to Prompt Generator",
    description: "Start free with 5 prompts per day. Upgrade to Pro for 200 prompts. Unlock all 7 AI models with Ultra plan.",
    url: "https://promptlens.ai/pricing",
    siteName: "PromptLens",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — PromptLens Image to Prompt Generator",
    description: "Start free with 5 prompts per day. Upgrade to Pro for 200 prompts. Unlock all 7 AI models with Ultra plan.",
  },
};

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold font-syne text-[var(--text)] mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
          Start free. Upgrade when you need more prompts, models, or features.
        </p>
      </div>
      <PricingCards />
    </div>
  );
}
