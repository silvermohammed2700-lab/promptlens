export function JsonLd() {
  const base = process.env.NEXTAUTH_URL ?? "https://promptlens.ai";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${base}/#app`,
        name: "PromptLens Image to Prompt Generator",
        url: base,
        description: "Free AI-powered image to prompt generator. Convert any image to AI prompts for Midjourney, DALL-E 3, Stable Diffusion & Flux.",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        featureList: [
          "Convert image to Midjourney prompt",
          "Convert image to DALL-E 3 prompt",
          "Convert image to Stable Diffusion prompt",
          "Convert image to Flux prompt",
          "Free image to prompt generator",
          "No login required",
        ],
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
          { "@type": "Offer", name: "Pro", price: "9", priceCurrency: "USD", billingIncrement: "P1M" },
          { "@type": "Offer", name: "Ultra", price: "19", priceCurrency: "USD", billingIncrement: "P1M" },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Convert an Image to an AI Prompt",
        description: "Use PromptLens free image to prompt generator to convert any image into an AI-ready prompt in seconds.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Upload your image", text: "Drop, paste, or load your image from a URL. Supports JPG, PNG, WEBP, HEIC, AVIF and more." },
          { "@type": "HowToStep", position: 2, name: "Select your AI model", text: "Choose your target platform: Midjourney, DALL-E 3, Stable Diffusion, Flux, or General." },
          { "@type": "HowToStep", position: 3, name: "Choose detail level", text: "Select how detailed you want the generated prompt to be." },
          { "@type": "HowToStep", position: 4, name: "Click Generate Prompt", text: "Click Generate and get an optimized prompt in seconds." },
          { "@type": "HowToStep", position: 5, name: "Copy and use in your AI image generator", text: "Copy the prompt and paste it directly into your AI image generator." },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is an image to prompt generator?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "An image to prompt generator is an AI tool that analyzes any image and automatically creates a text prompt you can use in AI image generators like Midjourney, DALL-E 3, Stable Diffusion, or Flux. PromptLens is the best free image to prompt generator available online.",
            },
          },
          {
            "@type": "Question",
            name: "How do I convert an image to a Midjourney prompt?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload your image to PromptLens, select 'Midjourney' as your target model, and click Generate. PromptLens will analyze your image and produce an optimized Midjourney prompt in seconds — completely free.",
            },
          },
          {
            "@type": "Question",
            name: "Is this image to prompt generator free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! PromptLens is a free image to prompt generator. No login is required to get started. The free plan gives you 5 prompt generations per day across top AI models including Midjourney and DALL-E 3.",
            },
          },
          {
            "@type": "Question",
            name: "What AI models can I generate prompts for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PromptLens supports 7 AI models: Midjourney, DALL-E 3, Stable Diffusion, Flux, General AI, and more. You can also use Compare Mode to generate prompts for multiple models simultaneously.",
            },
          },
          {
            "@type": "Question",
            name: "How does the AI image to prompt tool work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PromptLens uses advanced vision AI to analyze your image — detecting style, composition, lighting, color palette, and subject details — then generates an optimized text prompt tailored to your chosen AI image generator.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use this as a free image to prompt generator without login?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely. PromptLens is a free image to prompt generator with no login required. Just visit the site, upload your image, and generate prompts instantly. Create a free account to save your prompt history.",
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "PromptLens",
        description: "Free AI image to prompt generator",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${base}/?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
