import { auth } from "@/lib/auth";
import { generateWithFallback } from "@/lib/aiProvider";
import { checkIpLimit, checkUserLimit } from "@/lib/rateLimit";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { trackServerEvent } from "@/lib/analytics";
import type { GenerateRequest, GenerateResponse, TargetModel } from "@/types";
import { headers as nextHeaders } from "next/headers";

export const dynamic = "force-dynamic";

const PLAN_DAILY_LIMITS: Record<string, number> = {
  free: 5,
  pro: 200,
  ultra: Infinity,
};

const SYSTEM_PROMPTS: Record<TargetModel, string> = {
  midjourney: `You are an expert Midjourney prompt engineer. Analyze the image and generate a highly detailed Midjourney v6 prompt. Include: subject description, art style, lighting, composition, color palette, camera angle, mood/atmosphere. End with quality parameters like --ar 16:9 --style raw --q 2. Output ONLY the prompt, no explanation.`,
  "stable-diffusion": `You are an expert Stable Diffusion prompt engineer. Generate a detailed SD prompt with positive descriptors. Include: subject, style, artist references, lighting, quality boosters (masterpiece, best quality, highly detailed). Output ONLY the prompt.`,
  flux: `You are an expert Flux image generation prompt engineer. Analyze this image and write a detailed, natural-language Flux prompt that captures the scene, style, lighting, and mood. Output ONLY the prompt.`,
  dalle3: `You are an expert DALL-E 3 prompt engineer. Write a detailed, natural language description of this image suitable for DALL-E 3. Be specific about style, composition, lighting, and mood. Output ONLY the prompt.`,
  "nano-banana-2": `You are an expert prompt engineer for Nano Banana 2. Analyze this image and generate an optimized prompt. Output ONLY the prompt.`,
  "nano-banana-pro": `You are an expert prompt engineer for Nano Banana Pro. Analyze this image and generate a professional-grade prompt. Output ONLY the prompt.`,
  general: `You are an expert image analyst. Describe this image in detail to recreate it with any AI image generator. Include subject, style, lighting, composition, colors, and mood. Output ONLY the prompt.`,
};

const QUALITY_INDICATORS = [
  "detailed", "lighting", "composition", "style", "color", "mood", "atmosphere",
  "texture", "shadow", "perspective", "--ar", "masterpiece", "cinematic",
];

function scorePrompt(prompt: string): number {
  const lower = prompt.toLowerCase();
  const wordCount = prompt.split(/\s+/).length;
  const indicatorCount = QUALITY_INDICATORS.filter((i) => lower.includes(i)).length;
  const score = Math.min(
    100,
    Math.round((wordCount / 2) + (indicatorCount * 8))
  );
  return Math.max(10, score);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const settings = await getSiteSettings();

    if (settings.maintenanceMode && (!session?.user || (session.user as { role?: string }).role !== "admin")) {
      return Response.json({ error: "Service is under maintenance" }, { status: 503 });
    }

    const ip = (await nextHeaders()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipCheck = checkIpLimit(ip);
    if (!ipCheck.allowed) {
      return Response.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }

    const body = (await req.json()) as GenerateRequest;
    const { base64Image, mimeType, targetModel, language, detail = "high" } = body;

    if (!base64Image || !mimeType || !targetModel) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    let userId: string | undefined;
    let userPlan = "free";

    if (session?.user?.id) {
      userId = session.user.id;
      userPlan = (session.user as { plan?: string }).plan ?? "free";

      if (!settings.freeMode) {
        const userCheck = checkUserLimit(userId);
        if (!userCheck.allowed) {
          return Response.json({ error: "Rate limit exceeded for your account" }, { status: 429 });
        }

        const dailyLimit = PLAN_DAILY_LIMITS[userPlan] ?? 5;
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { promptsToday: true } });
        if (user && user.promptsToday >= dailyLimit) {
          return Response.json({ error: "Daily prompt limit reached. Upgrade your plan for more." }, { status: 429 });
        }
      }
    } else if (!settings.freeMode) {
      const anonLimit = PLAN_DAILY_LIMITS["free"] ?? 5;
      const ipLimitEntry = checkIpLimit(ip + ":anon");
      if (!ipLimitEntry.allowed || ipLimitEntry.remaining < (anonLimit - 3)) {
        return Response.json({ error: "Sign up for more free prompts" }, { status: 429 });
      }
    }

    const langSuffix = language !== "en" ? ` Respond in language code: ${language}.` : "";
    const systemPrompt = (SYSTEM_PROMPTS[targetModel] ?? SYSTEM_PROMPTS.general) + langSuffix;
    const userMessage = `Analyze this image and generate an optimized ${targetModel} prompt. Detail level: ${detail}.`;

    const aiResult = await generateWithFallback(
      base64Image,
      mimeType,
      systemPrompt,
      userMessage
    );

    const promptText = aiResult.text;

    if (!promptText) {
      return Response.json({ error: "Failed to generate prompt" }, { status: 500 });
    }

    const qualityScore = scorePrompt(promptText);
    console.log(`[generate] Provider: ${aiResult.provider} | Model: ${aiResult.model}`);

    // Update user stats
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { promptsToday: { increment: 1 }, promptsTotal: { increment: 1 } },
      });
    }

    // Track analytics
    await trackServerEvent(
      {
        name: "prompt_generated",
        params: { model: targetModel, detail, language, quality_score: qualityScore, provider: aiResult.provider, ai_model: aiResult.model },
      },
      userId
    );

    const response: GenerateResponse = {
      prompt: promptText,
      qualityScore,
      model: aiResult.model,
      targetModel,
    };

    return Response.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[generate] Error:", message);
    return Response.json({ error: message || "Internal server error" }, { status: 500 });
  }
}
