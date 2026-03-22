import { auth } from "@/lib/auth";
import { generateWithFallback } from "@/lib/aiProvider";
import { getSiteSettings } from "@/lib/settings";
import { trackServerEvent } from "@/lib/analytics";
import type { OutputLanguage } from "@/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const settings = await getSiteSettings();

    if (settings.maintenanceMode && (session?.user as { role?: string } | undefined)?.role !== "admin") {
      return Response.json({ error: "Service is under maintenance" }, { status: 503 });
    }

    const body = (await req.json()) as { base64Image: string; mimeType: string; language?: OutputLanguage };
    const { base64Image, mimeType, language = "en" } = body;

    if (!base64Image || !mimeType) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    const estimatedBytes = (base64Image.length * 3) / 4;
    if (estimatedBytes > MAX_IMAGE_SIZE) {
      return Response.json({ error: "Image too large. Maximum 5MB." }, { status: 413 });
    }

    const langSuffix = language !== "en" ? ` Respond in language code: ${language}.` : "";
    const systemPrompt = `You are an expert image analyst. Provide a detailed, accurate plain-language description of this image. Describe what you see: subjects, setting, colors, lighting, mood, style, and any notable details. Write in clear, flowing paragraphs, not bullet points.${langSuffix}`;

    const result = await generateWithFallback(base64Image, mimeType, systemPrompt, "Describe this image in detail.");
    const description = result.text;

    await trackServerEvent(
      { name: "describe_generated", params: { language } },
      session?.user?.id
    );

    return Response.json({ description });
  } catch (err) {
    console.error("[describe] Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
