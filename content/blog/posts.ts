// ============================================================
// BLOG POSTS — Single source of truth for all blog content
// ============================================================
//
// HOW TO ADD A NEW ARTICLE IN THE FUTURE:
// 1. Add a new object to the blogPosts array below
// 2. Create a new file: app/(main)/blog/content/your-slug.tsx
//    (export default a React component with the full article body)
// 3. That's it — the post will automatically appear in /blog
//    and get its own page at /blog/your-slug
// ============================================================

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;         // ISO format: "YYYY-MM-DD"
  readTime: string;
  category: string;
  emoji: string;
  keywords: string[];
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "flux-ai-image-to-prompt",
    title: "Flux AI Image to Prompt — How to Convert Images for Flux Models",
    description: "Learn how to convert any image into an optimized Flux AI prompt using PromptLens. Step-by-step guide with tips for better results using Flux.1 dev and schnell.",
    date: "2026-01-15",
    readTime: "6 min read",
    category: "Tutorial",
    emoji: "🌊",
    keywords: ["flux ai image to prompt", "flux prompt generator", "image to flux prompt"],
    featured: true,
  },
  {
    slug: "image-to-prompt-comfyui",
    title: "Image to Prompt ComfyUI — Extract Prompts from Images",
    description: "How to convert any image to a prompt for your ComfyUI workflow. Covers CLIP Interrogator nodes, WD14 Tagger, and using PromptLens for instant results.",
    date: "2026-01-20",
    readTime: "7 min read",
    category: "Tutorial",
    emoji: "⚙️",
    keywords: ["image to prompt comfyui", "comfyui prompt extractor", "comfyui prompt from image"],
    featured: true,
  },
];
