import { auth } from "@/lib/auth";
import { generateWithFallback } from "@/lib/aiProvider";
import { checkIpLimit } from "@/lib/rateLimit";
import { getSiteSettings } from "@/lib/settings";
import { headers as nextHeaders } from "next/headers";
import type { TargetModel, OutputLanguage } from "@/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM_PROMPTS: Record<TargetModel, string> = {
  midjourney: `You are an expert Midjourney prompt engineer. Generate a highly detailed Midjourney v6 prompt. Include subject, style, lighting, composition, colors, mood. End with --ar 16:9 --v 6.1 --style raw. Output ONLY the prompt.`,
  "stable-diffusion": `You are an expert Stable Diffusion prompt engineer. Generate a detailed SD prompt with quality tags (masterpiece, best quality, highly detailed) and style descriptors. Output ONLY the prompt.`,
  flux: `You are an expert Flux prompt engineer. Write a detailed, atmospheric natural-language Flux prompt. Output ONLY the prompt.`,
  dalle3: `You are an expert DALL-E 3 prompt engineer. Write a vivid, detailed natural language description suitable for DALL-E 3. Output ONLY the prompt.`,
  "nano-banana-2": `You are a Nano Banana 2 prompt expert. Structure: subject / scene / lighting / colors / style / camera / quality. Output ONLY the prompt.`,
  "nano-banana-pro": `You are a Nano Banana Pro prompt expert. Write multi-layer expert prompt: subject, composition, professional lighting, color grading, camera specs, art direction. End with: Studio-quality render, 4K ultra HD. Output ONLY the prompt.`,
  general: `You are an expert prompt engineer. Write a universal prompt that works across all AI image generators. Output ONLY the prompt.`,
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    const settings = await getSiteSettings();

    if (settings.maintenanceMode && (session?.user as { role?: string } | undefined)?.role !== "admin") {
      return Response.json({ error: "Service is under maintenance" }, { status: 503 });
    }

    const ip = (await nextHeaders()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipCheck = checkIpLimit(ip + ":compare");
    if (!ipCheck.allowed) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = (await req.json()) as {
      base64Image: string; mimeType: string;
      models: TargetModel[]; language: OutputLanguage; detail: string;
    };
    const { base64Image, mimeType, models, language = "en", detail = "high" } = body;

    if (!base64Image || !models || models.length < 2) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    if ((base64Image.length * 3) / 4 > MAX_IMAGE_SIZE) {
      return Response.json({ error: "Image too large. Maximum 5MB." }, { status: 413 });
    }

    const langSuffix = language !== "en" ? ` Respond in language code: ${language}.` : "";

    const results = await Promise.all(
      models.map(async (model) => {
        try {
          const systemPrompt = (SYSTEM_PROMPTS[model] ?? SYSTEM_PROMPTS.general) + langSuffix;
          const result = await generateWithFallback(base64Image, mimeType, systemPrompt, `Generate a ${model} prompt. Detail level: ${detail}.`);
          const prompt = result.text;
          const wordCount = prompt.split(/\s+/).length;
          const qualityScore = Math.min(100, Math.max(10, wordCount * 2 + (prompt.includes("--") ? 15 : 0)));
          return { model, prompt, qualityScore, provider: result.provider };
        } catch {
          return { model, prompt: "", qualityScore: 0, error: "Failed to generate" };
        }
      })
    );

    return Response.json({ results });
  } catch (err) {
    console.error("[compare] Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
