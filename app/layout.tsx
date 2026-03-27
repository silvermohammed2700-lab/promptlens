import type { Metadata, Viewport } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FreeBanner } from "@/components/layout/FreeBanner";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { JsonLd } from "@/components/analytics/JsonLd";
import { Providers } from "@/components/layout/Providers";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: { default: "Image to Prompt Generator — Free AI Image to Prompt | PromptLens", template: "%s | PromptLens" },
  description: "Free image to prompt generator. Convert any image to AI prompts for Midjourney, DALL-E 3, Stable Diffusion & Flux. No login required.",
  keywords: ["image to prompt", "image to prompt generator", "ai image to prompt", "free image to prompt generator", "convert image to prompt", "midjourney prompt from image", "stable diffusion prompt generator", "ai image prompt generator"],
  metadataBase: new URL("https://promptlens.ai"),
  verification: {
    google: "ZWZCE6pL8Doyfbs9Dy4tjKPWyk3sU8o-h_6a6m4upe0",
  },
  openGraph: {
    type: "website",
    siteName: "PromptLens",
    title: "Image to Prompt Generator — Free AI Tool | PromptLens",
    description: "Convert any image to AI prompts instantly. Free, no login required.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

import { getSiteSettings } from "@/lib/settings";

// ... (imports)

// ... (fonts)

// ... (viewport)

export const metadata: Metadata = {
  // ... (metadata)
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="bg-[var(--background)] text-[var(--text)] min-h-screen flex flex-col">
        <JsonLd />
        <AnalyticsScripts ga4Id={settings.googleAnalyticsId} />
        <Providers>
          <Header />
          <FreeBanner />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
