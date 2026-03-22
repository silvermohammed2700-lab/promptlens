import Link from "next/link";

const FAQ = [
  {
    q: "What is the best way to get a prompt from an image for ComfyUI?",
    a: "The fastest way is to use an AI image-to-prompt tool like PromptLens. Upload your reference image, select 'Stable Diffusion' or 'General' as the target model, and copy the generated prompt directly into your ComfyUI CLIP Text Encode node. This approach takes under 30 seconds and produces prompts already formatted in the comma-separated keyword style ComfyUI handles best.",
  },
  {
    q: "Does ComfyUI have a built-in image to prompt feature?",
    a: "ComfyUI does not have a native image-to-prompt feature, but you can achieve this by installing the CLIP Interrogator custom node (WD14 Tagger or BLIP). These nodes analyze an image and generate a prompt. Alternatively, using an online tool like PromptLens is faster and requires no setup.",
  },
  {
    q: "What prompt format does ComfyUI use?",
    a: "ComfyUI (and Stable Diffusion workflows) work best with comma-separated keyword prompts that include subject descriptions, art style tags, quality boosters (like 'masterpiece, best quality'), lighting descriptors, and optional negative prompts. PromptLens generates prompts in this exact format when you select Stable Diffusion as your model.",
  },
  {
    q: "Can I use PromptLens prompts in ComfyUI without modification?",
    a: "Yes. When you generate a Stable Diffusion prompt with PromptLens, you can paste it directly into the CLIP Text Encode (Prompt) node in ComfyUI. The format is fully compatible. For best results, also add a negative prompt with common quality excluders like 'blurry, low quality, watermark, deformed'.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://promptlens.ai/blog/image-to-prompt-comfyui",
      headline: "Image to Prompt ComfyUI — Extract Prompts from Images",
      description: "Learn how to convert any image to a prompt for ComfyUI. Step-by-step guide to extracting prompts from images for ComfyUI workflows.",
      url: "https://promptlens.ai/blog/image-to-prompt-comfyui",
      author: { "@type": "Organization", name: "PromptLens", url: "https://promptlens.ai" },
      publisher: { "@type": "Organization", name: "PromptLens", url: "https://promptlens.ai" },
      datePublished: "2026-01-20",
      dateModified: "2026-01-20",
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

export default function ImageToPromptComfyUIContent() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="text-sm text-[var(--muted)] mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-[var(--text)] transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-[var(--text)]">Image to Prompt ComfyUI</span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] px-3 py-1.5 rounded-full mb-4">
            <span>⚙️</span> ComfyUI Guide · 7 min read
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-syne text-[var(--text)] leading-tight mb-4">
            How to Convert Image to Prompt for ComfyUI
          </h1>
          <p className="text-[var(--muted)] text-lg leading-relaxed">
            ComfyUI is the most powerful node-based interface for Stable Diffusion — but creating prompts from reference images can be challenging. This guide explains how to extract a high-quality <strong>image to prompt for ComfyUI</strong> using both native nodes and faster online tools like PromptLens.
          </p>
        </header>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">What is ComfyUI?</h2>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            ComfyUI is an open-source, node-based graphical interface for running Stable Diffusion and other AI image generation models locally. Unlike A1111 (Automatic1111), ComfyUI uses a visual workflow graph where you connect nodes representing different processing steps — from loading a model checkpoint to encoding prompts, sampling latents, and decoding the final image.
          </p>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            This node-based approach makes ComfyUI incredibly flexible. You can build complex workflows for img2img, inpainting, ControlNet, LoRA stacking, upscaling, and more. ComfyUI supports SDXL, SD 1.5, SD 3, and increasingly, Flux models — making it the go-to tool for power users who want full control over their AI image generation pipeline.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Because ComfyUI gives you so much control, having the right prompt is especially important. A high-quality <strong>image to prompt</strong> extraction ensures that your ComfyUI workflow starts with accurate, detailed text conditioning for the best possible output.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">How to Extract a Prompt from an Image for ComfyUI</h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            There are two main approaches to converting an image to a prompt for use in ComfyUI:
          </p>

          <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Method 1: Use PromptLens (Fastest)</h3>
          <ol className="space-y-3 mb-6">
            {[
              { n: 1, text: "Visit promptlens.ai and upload your reference image." },
              { n: 2, text: "Select 'Stable Diffusion' as your target model — this produces the comma-separated keyword format that ComfyUI handles best." },
              { n: 3, text: "Click Generate and wait a few seconds for the AI analysis." },
              { n: 4, text: "Copy the generated prompt and paste it into your ComfyUI CLIP Text Encode (Prompt) node." },
              { n: 5, text: "Optionally, copy the negative prompt section into your Negative CLIP Text Encode node." },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-bold text-sm">
                  {step.n}
                </div>
                <p className="text-[var(--muted)] pt-1">{step.text}</p>
              </li>
            ))}
          </ol>

          <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Method 2: CLIP Interrogator Node (Advanced)</h3>
          <p className="text-[var(--muted)] leading-relaxed mb-3">
            For users who want to stay entirely within ComfyUI, you can install the <strong>WD14 Tagger</strong> or <strong>BLIP Interrogator</strong> custom nodes via ComfyUI Manager. These nodes take an image as input and output a text prompt.
          </p>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-3">
            <p className="text-sm text-[var(--muted)]"><strong className="text-[var(--text)]">WD14 Tagger:</strong> Best for anime and illustrated styles. Outputs Danbooru-style tags with confidence scores. Great for SDXL anime models.</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--muted)]"><strong className="text-[var(--text)]">BLIP Interrogator:</strong> Better for photorealistic images. Uses BLIP captioning combined with CLIP to generate natural language prompts with artistic style keywords appended.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-4">Best ComfyUI Prompt Format</h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Understanding ComfyUI prompt format will help you get the most out of any image-to-prompt tool. Here's the recommended structure:
          </p>
          <div className="space-y-4">
            {[
              { label: "1. Quality boosters (front-load these)", example: "masterpiece, best quality, ultra-detailed, 8k,", desc: "These tokens heavily influence the model's attention and should come first." },
              { label: "2. Subject description", example: "1girl, long auburn hair, blue eyes, white dress,", desc: "Describe the main subject with specific attributes." },
              { label: "3. Setting and background", example: "standing in a sunlit garden, cherry blossoms falling,", desc: "Set the scene and environment." },
              { label: "4. Lighting and atmosphere", example: "golden hour lighting, soft shadows, warm tones,", desc: "Lighting dramatically affects output quality." },
              { label: "5. Style and medium", example: "oil painting style, impressionist, detailed brushwork", desc: "Specify artistic style at the end." },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <p className="text-sm font-semibold text-[var(--text)] mb-1">{item.label}</p>
                <code className="text-xs text-[var(--accent)] block mb-1">{item.example}</code>
                <p className="text-xs text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[var(--muted)] text-sm mt-4">
            PromptLens automatically structures Stable Diffusion prompts in this format when you choose it as your target model — no manual restructuring needed.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-10 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-3">
            Use PromptLens to Generate ComfyUI Prompts Instantly
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-6 max-w-xl mx-auto">
            Stop spending time manually writing prompts. Upload any reference image to PromptLens, select Stable Diffusion, and get a fully-formatted <strong>ComfyUI-ready prompt</strong> in seconds. It's completely free — no account needed.
          </p>
          <Link
            href="/image-to-prompt"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            ⚙️ Generate ComfyUI Prompt Free →
          </Link>
          <p className="text-xs text-[var(--muted)] mt-3">No login required · 5 free generations per day · Stable Diffusion format</p>
        </section>

        {/* FAQ */}
        <section className="mb-10" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-2xl font-bold font-syne text-[var(--text)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
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

        {/* Internal links */}
        <section className="border-t border-[var(--border)] pt-8">
          <p className="text-sm text-[var(--muted)] mb-4 font-medium">Related tools and guides:</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              ← Image to Prompt Generator
            </Link>
            <Link href="/image-prompt-generator" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Image Prompt Generator
            </Link>
            <Link href="/blog/flux-ai-image-to-prompt" className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-2)] text-[var(--text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Flux AI Prompt Guide →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
